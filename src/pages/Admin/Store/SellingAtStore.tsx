import { Button, Col, Form, Row } from "antd";
import OrderInformation from "../../../components/Store/OrderInformation"
import { useCallback, useEffect, useState } from "react";
import { debounce, truncate } from "lodash";
import ListProduct from "../../../components/Store/ListProduct";
import ListOrderDetail from "../../../components/Store/ListOrderDetail";
import ListOrderDraft from "../../../components/Store/ListOrderDraft";
import Product from "../../../types/Product";
import { getAllProductDetails } from "../../../api/ProductDetailApi";
import { PageableRequest } from "../../../api/AxiosInstance";
import ProductDetail from "../../../types/ProductDetail";
import AddQuantityModal from "../../../components/Store/AddQuantityModal";
import Order from "../../../types/Order";
import { addProductToOrderDetail, createOrderPendingAtStore, deleteOrderDetail, exportOrder, getAllOrderPendingAtStore, getOrderDetailByIdOrder, updateOrderAtStore, updateOrderSuccess } from "../../../api/StoreApi";
import Cookies from 'js-cookie';
import { toast } from "react-toastify";
import { getErrorMessage } from "../../Error/getErrorMessage";
import OrderDetail from "../../../types/OrderDetail";
import { deleteOrder, downloadOrderPdf, getOrderById } from "../../../api/OrderApi";
import { getAllUsers, UserParam } from "../../../api/UserApi";
import ModalChooseGuest from "../../../components/Store/ModalChooseGuest";
import { PaginationState } from "../../../config/paginationConfig";
import { makeSlug } from "../../../utils/slug";
import { QrReader } from 'react-qr-reader';


const SellingAtStore = () => {
    const [formAddQuantity] = Form.useForm();
    const [formOrder] = Form.useForm();
    const [form] = Form.useForm();

    const [loadingUsers, setLoadingUsers] = useState(false);
    const [filterParams, setFilterParams] = useState<UserParam>({
        page: 0,
        size: 5,
        phone: '',
        email: '',
        fullName: '',
        gender: '',
    });
    const [loadingProducts, setLoadingProducts] = useState<boolean>(false);

    const [isOpenModalAddQuantity, setIsOpenModalAddQuantity] = useState(false);
    const [isOpenModalChooseGuest, setIsOpenModalChooseGuest] = useState(false);

    const [orderDraftList, setOrderDraftList] = useState<Order[]>([]);
    const [loadingOrderDraftList, setLoaingOrderDraftList] = useState(true);

    const [order, setOrder] = useState<Order | null>(null);
    const [isOrderSuccess, setIsOrderSuccess] = useState(false);
    const [isOrderDetailChange, setIsOrderDetailChange] = useState(false);
    const [isPay, setIsPay] = useState(false);
    const [isAddQroductSuccess, setIsAddQroductSuccess] = useState(false);

    const [orderDetailList, setOrderDetailList] = useState<OrderDetail[]>([]);
    const [currentProductDetailId, setCurrentProductDetailId] = useState<number | null>(null);
    const [currentGuestId, setCurrentGuestId] = useState<number | null>(null);
    const [isUpdateGuestDiscount, setIsUpdateGuestDiscount] = useState(false);
    const [showModalDiscount, setShowModalDiscount] = useState(false);

    useEffect(() => {
        formOrder.setFieldsValue({
            ...order
        })
    }, [order])

    const formatCurrency = (value: number | null | undefined): string => {
        if (!value) return "0";
        return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" })
            .format(value);
    };

    const handleFilterChange = (changedValues: any) => {
        setFilterParams(prevParams => ({
            ...prevParams,
            ...changedValues,
            phone: changedValues.phone || '', // Cập nhật giá trị phone
            page: 1,
        }));
    };

    const showAddQuantityModal = (idProductDetail: number) => {
        formAddQuantity.resetFields();
        setCurrentProductDetailId(idProductDetail);
        setIsOpenModalAddQuantity(true);
    }
    const handleAddQuantityCancel = () => {
        setIsOpenModalAddQuantity(false);
    };
    const handleAddQuantityOk = async () => {
        const idOrder = order?.id;
        if (idOrder == null) {
            toast.error("Vui lòng chọn hóa đơn cần thanh toán trước")
        } else {
            try {
                const values = await formAddQuantity.validateFields();
                const { quantity } = values;
                const token = Cookies.get("accessToken");
                if (token) {
                    await addProductToOrderDetail({ idOrder, idProductDetail: currentProductDetailId, quantity });

                    const response = await getOrderById(order?.id); // API lấy hóa đơn mới
                    setOrder(response);

                    // setIsOrderDetailChange(true)
                    toast.success('Thêm sản phẩm Thành Công');
                    handleAddQuantityCancel()
                    formOrder.setFieldsValue({
                        totalMoney: response.totalMoney ? formatCurrency(response.totalMoney) : "0",
                        payAmount: response.payAmount ? formatCurrency(response.payAmount) : formatCurrency(response.totalMoney),
                        createdAt: order?.createdAt
                            ? new Date(order.createdAt).toLocaleDateString()
                            : "",
                    });
                    setIsAddQroductSuccess(true)
                    // setIsPay(false)

                } else {
                    toast.error("Authorization failed");
                }
            } catch (error: any) {
                toast.error(getErrorMessage(error))
            }
        }

    };

    const formInfor = (order: Order | null) => {
        if (order) {
            formOrder.setFieldsValue({
                createdAt: order?.createdAt
                    ? new Date(order.createdAt).toLocaleDateString()
                    : "",
                code: order.code,
                // idVoucher: order.discountId,
                totalMoney: order.totalMoney
            })
        } else {
            formOrder.setFieldsValue({
                createdAt: "",
                code: "",
                // idVoucher: "",
                totalMoney: "",
                fullName: "",
                payAmount: ""
            })
        }
    }

    const handleDeleteOrder = async (order: Order | null) => {
        try {
            const token = Cookies.get("accessToken");
            if (token && order) {
                await deleteOrder(order.id, token);
                setIsPay(true)

                toast.success("Xóa hóa đơn thành công");
                setOrder(null)
                formInfor(null)
                fetchListOrderDraft()
            } else {
                toast.error("Xác thực thất bại");
            }
        } catch (error) {
            toast.error(getErrorMessage(error))
        }
    }

    const handleDeleteOrderDetail = async (orderDetailId: number) => {
        try {
            const token = Cookies.get("accessToken");
            if (token) {
                const res = await deleteOrderDetail(orderDetailId, token);
                toast.success("Xóa sản phẩm thành công");

                setOrder(res);
                formOrder.setFieldsValue({
                    totalMoney: res?.totalMoney ? formatCurrency(res.totalMoney) : "0",
                    payAmount: res?.totalMoney ? formatCurrency(res.totalMoney) : "0",
                });
                setIsOrderDetailChange(false)
            } else {
                toast.error("Xác thực thất bại");
            }
        } catch (error) {
            toast.error(getErrorMessage(error))
        }
    }
    const handlePay = async (order: Order) => {
        try {
            const token = Cookies.get("accessToken");
            if (token && order) {
                await updateOrderSuccess(order.id);
                toast.success("Thanh toán hóa đơn thành công");

                formOrder.resetFields();
                formOrder.setFieldsValue({
                    totalMoney: "0 " + "đ",
                    fullName: "Khách lẻ",
                    payAmount: "0 " + "đ",
                    creatAt: ""
                });

                fetchListOrderDraft();
                setIsPay(true);
                setIsOrderSuccess(true);
                downloadOrderPdf(order.id);
                setOrder(null)
            } else {
                toast.error("Bạn chưa chọn hóa đơn cần thanh toán");
            }
        } catch (error) {
            toast.error(getErrorMessage(error))
        }
    }

    const onChangeQuantity = async (value: number, record: any) => {
        console.log(value);
        console.log(record.price * value);
        console.log(record.productDetail.id);
        // const idOrder = order?.id;
        // const idProductDetail = record.productDetail.id;
        // const quantity = value;
        // try {
        //     if (order) {
        //         await addProductToOrderDetail({ idOrder, idProductDetail, quantity });
        //         const response = await getOrderById(order?.id);
        //         setOrder(response);
        //         setIsOrderDetailChange(true)
        //         handleAddQuantityCancel()
        //         formOrder.setFieldsValue({
        //             totalMoney: response.totalMoney ? formatCurrency(response.totalMoney) : "0",
        //             code: response.code,
        //             createdAt: response.createdAt
        //                 ? new Date(response.createdAt).toLocaleDateString()
        //                 : "",
        //         });
        //     }
        // } catch (error: any) {
        //     toast.error(getErrorMessage(error))
        // }
    };

    const chooseThisGuest = (idGuest: number) => {
        setCurrentGuestId(idGuest);
        console.log(currentGuestId);
        setIsOpenModalChooseGuest(false)
        handleUpdateOrder(idGuest);
    }

    const handleUpdateOrder = async (idGuest: number) => {
        try {
            if (order) {
                console.log("Guest ID:", idGuest);
                const updatedOrder = await updateOrderAtStore(order.id, { idGuest });
                setOrder({ ...order, fullName: updatedOrder.fullName });

                handleCancel();
                setIsUpdateGuestDiscount(true);
            } else {
                toast.error("Authorization failed");
            }
        } catch (error: any) {
            toast.error(getErrorMessage(error))
        }
    };


    const handleCancel = () => {
        setIsOpenModalChooseGuest(false)
    }
    const showModalChooseGuest = () => {
        setIsOpenModalChooseGuest(true);
    };

    const refreshOrderDetails = () => {
        setOrder(order)
        // fetchListOrderDetail(order)
        setIsOrderDetailChange(true)
    };

    const fetchListOrderDraft = async () => {
        setLoaingOrderDraftList(true)
        const res = await getAllOrderPendingAtStore()
        setOrderDraftList([...res])
        // setOrderDetailList([])
    }

    const handleCreateOrderDraft = async () => {
        try {
            const token = Cookies.get("accessToken");
            if (token) {
                setLoaingOrderDraftList(true)
                const res = await createOrderPendingAtStore()

                // setOrderDraftList([...res])
                toast.success('Tạo Hóa Đơn Thành Công');
                setLoaingOrderDraftList(false)
            } else {
                toast.error("Authorization failed");
            }
        } catch (error) {
            toast.error(getErrorMessage(error))
        }
    }


    const handleOrder = async (order: Order) => {
        // setOrderDetailList([])
        await new Promise((resolve) => {
            setOrder(order);
            resolve(true);
        });
        // formOrder.setFieldsValue(order)
        // fetchListOrderDetail(order)
        setIsOrderDetailChange(true)
        formInfor(order)
    }
    const showModalChooseDiscount = () => {
        setShowModalDiscount(true);
    };
    const onSelectDiscount = () => {
        setShowModalDiscount(true);
    }

    const handleQuantityChange = (value: number | null, id: number) => {
        if (value && value > 0) {
            const updatedList = orderDetailList.map((item) =>
                item.id === id ? { ...item, quantity: value } : item
            );
            setOrderDetailList(updatedList); // Cập nhật danh sách với số lượng mới
        }
    };

    const handleIncreaseQuantity = (id: number) => {
        const updatedList = orderDetailList.map((item) =>
            item.id === id ? { ...item, quantity: item.quantity + 1 } : item
        );
        setOrderDetailList(updatedList);
    };

    const handleDecreaseQuantity = (id: number) => {
        // const updatedList = orderDetailList.map((item) =>
        //     item.id === id && item.quantity > 1
        //         ? { ...item, quantity: item.quantity - 1 }
        //         : item
        // );
        // setOrderDetailList(updatedList);
        console.log('handleDecreaseQuantity');

    };

    const fetchListOrderDetail = async (order: Order | null) => {
        if (order) {
            const response = await getOrderById(order?.id);
            setOrder(response);

        } else {
            setOrder(null)
            setOrderDetailList([])
            setIsAddQroductSuccess(true)
        }
    }

    useEffect(() => {
        fetchListOrderDraft()
        if (order) {
            formOrder.setFieldsValue({
                fullName: order.fullName,
            });
        }

    }, [loadingOrderDraftList, isUpdateGuestDiscount])

    return (
        <div
            style={{
                padding: 15
            }}
        >
            <Button
                className="mt-3 mb-3"
                style={{ display: "flex", backgroundColor: "black", color: "white" }}
                type="default"
                onClick={handleCreateOrderDraft}
            >
                <i className="fa-solid fa-circle-plus"></i>
                Tạo hóa đơn
            </Button>
            <Row style={{ height: "100%", display: "flex" }}>
                <Col style={{
                    flex: 1,
                    marginRight: "20px",
                    overflow: "auto",
                }}>
                    <ListOrderDraft
                        orderPendingList={orderDraftList}
                        handleOrder={handleOrder}
                    />
                    <ListOrderDetail
                        handleDelete={handleDeleteOrderDetail}
                        order={order}
                        isOrderDetailChange={isOrderDetailChange}
                        onChange={onChangeQuantity}
                        isPay={isPay}
                        isAddQroductSuccess={isAddQroductSuccess}
                    />

                    <ListProduct
                        form={form}
                        // products={products}
                        loading={loadingProducts}
                        showModalAddQuantity={showAddQuantityModal}
                        isOrderSuccess={isOrderSuccess} />
                </Col>

                <Col
                    style={{
                        width: 320
                    }}
                >
                    <OrderInformation
                        order={order}
                        setOrder={setOrder}
                        form={formOrder}
                        handleCancel={handleDeleteOrder}
                        showModalUser={showModalChooseGuest}
                        handlePay={handlePay}
                        fetchListOrderDetail={fetchListOrderDetail}
                        isUpdateGuestDiscount={isUpdateGuestDiscount}
                        showModalDiscount={showModalChooseDiscount}
                    />
                </Col>
            </Row>

            <AddQuantityModal
                isModalOpen={isOpenModalAddQuantity}
                form={formAddQuantity}
                handleCancel={handleAddQuantityCancel}
                handleOk={handleAddQuantityOk}
            />
            <ModalChooseGuest
                isModalOpen={isOpenModalChooseGuest}
                chooseThisGuest={chooseThisGuest}
                handleCancel={handleCancel}
                loading={loadingUsers}
                handleFilterChange={handleFilterChange}
                filterParams={filterParams}
                setFilterParams={setFilterParams}
            />

        </div>
    )

}

export default SellingAtStore