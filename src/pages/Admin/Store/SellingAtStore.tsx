import { Button, Col, Form, Row } from "antd";
import OrderInformation from "../../../components/Store/OrderInformation"
import { fetchAllVouchers } from "../../../api/VoucherApi";
import { useCallback, useEffect, useState } from "react";
import { debounce } from "lodash";
import { Voucher } from "../../../types/voucher";
import { User } from "../../../types/User";
import ListProduct from "../../../components/Store/ListProduct";
import ListOrderDetail from "../../../components/Store/ListOrderDetail";
import ListOrderDraft from "../../../components/Store/ListOrderDraft";
import Product from "../../../types/Product";
import { getAllProductDetails } from "../../../api/ProductDetailApi";
import { PageableRequest } from "../../../api/AxiosInstance";
import ProductDetail from "../../../types/ProductDetail";
import AddQuantityModal from "../../../components/Store/AddQuantityModal";
import Order from "../../../types/Order";
import { addProductToOrderDetail, createOrderPendingAtStore, deleteOrderDetail, getAllOrderPendingAtStore, getOrderDetailByIdOrder, updateOrderAtStore, updateOrderSuccess } from "../../../api/StoreApi";
import Cookies from 'js-cookie';
import { toast } from "react-toastify";
import { getErrorMessage } from "../../Error/getErrorMessage";
import OrderDetail from "../../../types/OrderDetail";
import { deleteOrder, getOrderById } from "../../../api/OrderApi";
import { getAllUsers, UserParam } from "../../../api/UserApi";
import ModalChooseGuest from "../../../components/Store/ModalChooseGuest";
import { PaginationState } from "../../../config/paginationConfig";
import { makeSlug } from "../../../utils/slug";
import { QrReader } from 'react-qr-reader';


const SellingAtStore = () => {
    const [formAddQuantity] = Form.useForm();
    const [formOrder] = Form.useForm();
    const [form] = Form.useForm();


    const [vouchers, setVouchers] = useState<Voucher[]>([]); // State for voucher details
    const [loadingVouchers, setLoadingVouchers] = useState(true);

    const [users, setUsers] = useState<User[]>([]);
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

    const [orderDetailList, setOrderDetailList] = useState<OrderDetail[]>([]);
    const [loadingOrderDetailList, setLoaingOrderDetailList] = useState(true);
    const [newOrderDetail, setOrderDetail] = useState<OrderDetail | null>(null);

    const [currentProductDetailId, setCurrentProductDetailId] = useState<number | null>(null);
    const [currentGuestId, setCurrentGuestId] = useState<number | null>(null);
    const [currentDiscountId, setCurrentDiscountId] = useState<number | null>(null);
    const [isUpdateGuestDiscount, setIsUpdateGuestDiscount] = useState(false);

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


    const fetchVouchersDebounced = useCallback(
        debounce(async () => {
            setLoadingVouchers(true);
            try {
                const response = await fetchAllVouchers();
                setVouchers(response.data);
            } catch (error) {
                console.error("Error fetching vouchers:", error);
            } finally {
                setLoadingVouchers(false);
            }
        }, 500), []);

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

                    const response = await getOrderById(order?.id, token); // API lấy hóa đơn mới
                    setOrder(response);

                    setIsOrderDetailChange(false)
                    toast.success('Thêm sản phẩm Thành Công');
                    handleAddQuantityCancel()
                    formOrder.setFieldsValue({
                        totalMoney: response.totalMoney ? formatCurrency(response.totalMoney) : "0",
                        code: response.code,
                        createdAt: response.createdAt
                            ? new Date(response.createdAt).toLocaleDateString()
                            : "",

                    });

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
                createdAt: order.createdAt,
                code: order.code,
                idVoucher: order.discountId,
                totalMoney: order.totalMoney
            })
        } else {
            formOrder.setFieldsValue({
                createdAt: "",
                code: "",
                idVoucher: "",
                totalMoney: "",
                fullName: ""
            })
        }
    }

    const handleDeleteOrder = async (order: Order | null) => {
        try {
            const token = Cookies.get("accessToken");
            if (token && order) {
                await deleteOrder(order.id, token);
                toast.success("Xóa hóa đơn thành công");

                formInfor(null)
                fetchListOrderDraft()
                setVouchers([]);
                // fetchListOrderDetail(null)
                setOrder(null)
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
                await deleteOrderDetail(orderDetailId, token);
                toast.success("Xóa sản phẩm thành công");

                // Lấy thông tin hóa đơn mới từ API
                const updatedOrder = await getOrderById(order?.id, token); // API lấy hóa đơn mới

                // Cập nhật trạng thái hóa đơn và làm mới form
                setOrder(updatedOrder);
                formOrder.setFieldsValue({
                    totalMoney: updatedOrder.totalMoney, // Cập nhật tổng tiền
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

                setOrder(null);
                formOrder.resetFields();

                fetchListOrderDraft();
                setOrderDetailList([])
                setIsOrderSuccess(true);
            } else {
                toast.error("Bạn chưa chọn hóa đơn cần thanh toán");
            }
        } catch (error) {
            toast.error(getErrorMessage(error))
        }

    }

    const chooseThisGuest = (idGuest: number) => {
        setCurrentGuestId(idGuest);
        console.log(currentGuestId);
        setIsOpenModalChooseGuest(false)
        handleUpdateOrder(idGuest);
    }

    const handleUpdateOrder = async (idGuest: number) => {
        try {
            const idDiscount = 34;

            if (order) {
                console.log("Guest ID:", idGuest);
                const updatedOrder = await updateOrderAtStore(order.id, { idGuest, idDiscount });
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
        formOrder.setFieldsValue(order)
        // fetchListOrderDetail(order)
        fetchVouchersDebounced()
        setIsOrderDetailChange(true)
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
        const updatedList = orderDetailList.map((item) =>
            item.id === id && item.quantity > 1
                ? { ...item, quantity: item.quantity - 1 }
                : item
        );
        setOrderDetailList(updatedList);
    };


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
            <Row>
                <Col flex={1}>
                    <ListOrderDraft
                        orderPendingList={orderDraftList}
                        handleOrder={handleOrder}
                    />
                    <ListOrderDetail
                        // orderDetailList={orderDetailList}
                        handleDelete={handleDeleteOrderDetail}
                        order={order}
                        isOrderDetailChange={isOrderDetailChange}
                    />

                    <ListProduct
                        form={form}
                        // products={products}
                        loading={loadingProducts}
                        showModalAddQuantity={showAddQuantityModal}
                        isOrderSuccess={isOrderSuccess} />
                </Col>

                <Col flex={1}>
                    <OrderInformation
                        order={order}
                        form={formOrder}
                        vouchers={vouchers}
                        // users={users}
                        handleCancel={handleDeleteOrder}
                        showModalUser={showModalChooseGuest}
                        handlePay={handlePay}
                        // fetchListOrderDetail={fetchListOrderDetail}
                        isUpdateGuestDiscount={isUpdateGuestDiscount}
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