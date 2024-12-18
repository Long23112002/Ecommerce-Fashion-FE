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
import { addProductToOrderDetail, createOrderPendingAtStore, deleteOrderDetail, getAllOrderPendingAtStore, getOrderDetailByIdOrder, updateOrderAtStore, updateOrderSuccess, updateProductToOrderDetail } from "../../../api/StoreApi";
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
    const [isOpenModalUpdateQuantity, setIsOpenModalUpdateQuantity] = useState(false);
    const [isOpenModalChooseGuest, setIsOpenModalChooseGuest] = useState(false);

    const [orderDraftList, setOrderDraftList] = useState<Order[]>([]);
    const [loadingOrderDraftList, setLoaingOrderDraftList] = useState(true);

    const [order, setOrder] = useState<Order | null>(null);
    const [isOrderSuccess, setIsOrderSuccess] = useState(false);

    const [orderDetailList, setOrderDetailList] = useState<OrderDetail[]>([]);
    const [loadingOrderDetailList, setLoaingOrderDetailList] = useState(false);
    const [newOrderDetail, setOrderDetail] = useState<OrderDetail | null>(null);

    const [currentProductDetailId, setCurrentProductDetailId] = useState<number | null>(null);
    const [currentOrderDetailId, setCurrentOrderDetailId] = useState<number | null>(null);
    const [currentGuestId, setCurrentGuestId] = useState<number | null>(null);
    const [currentDiscountId, setCurrentDiscountId] = useState<number | null>(null);
    const [isUpdateGuestDiscount, setIsUpdateGuestDiscount] = useState(false);

    useEffect(() => {
        if (order != null) {
            formOrder.setFieldsValue({
                ...order,
                totalMoney: order.totalMoney ? formatCurrency(order.totalMoney) : "0",
                payAmount: order.payAmount ? formatCurrency(order.payAmount) : "0",
                code: order.code,
                createdAt: order.createdAt
                    ? new Date(order.createdAt).toLocaleDateString()
                    : "",
            });
        }{
            formOrder.resetFields()
        }
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
                fetchListOrderDetail(null)

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
                setOrder({ ...res })
                toast.success("Xóa sản phẩm thành công");
                refreshOrderDetails();
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
        setIsOpenModalChooseGuest(false)
        handleUpdateOrder(idGuest);
    }

    const handleUpdateOrder = async (idGuest: number) => {
        try {
            if (order) {
                const res = await updateOrderAtStore(order.id, { idGuest });
                setOrder({ ...res })
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
        fetchListOrderDetail(order)
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
        fetchListOrderDetail(order)
        fetchVouchersDebounced()
    }

    const fetchListOrderDetail = async (order: Order | null) => {
        if (order) {
            setLoaingOrderDetailList(true)
            const res = await getOrderDetailByIdOrder(order.id, { sortBy: 'id' });
            setOrderDetailList([...res.data])
            setLoaingOrderDetailList(false)
        } else {
            setOrderDetailList([]);
        }
    }

    useEffect(() => {
        fetchListOrderDraft()
        // fetchUsers()

    }, [loadingOrderDraftList, isUpdateGuestDiscount])

    const addProductToOrder = async (idProductDetail: number) => {
        const idOrder = order?.id;
        if (idOrder == null) {
            toast.error("Vui lòng chọn hóa đơn cần thanh toán trước")
        } else {
            try {
                const quantity = 1;
                const token = Cookies.get("accessToken");
                if (token) {
                    setLoaingOrderDetailList(true)
                    await addProductToOrderDetail({ idOrder, idProductDetail, quantity });

                    const response = await getOrderById(idOrder);
                    setOrder(response)
                    toast.success('Thêm sản phẩm Thành Công');

                    await refreshOrderDetails();

                    // formOrder.setFieldsValue(order)
                } else {
                    toast.error("Authorization failed");
                }
            } catch (error: any) {
                toast.error(getErrorMessage(error))
            }
            finally {
                setLoaingOrderDetailList(false)
            }
        }
    }

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
                        orderDetailList={orderDetailList}
                        order={order}
                        setOrder={setOrder}
                        refreshOrderDetails={refreshOrderDetails}
                        loadingOrderDetailList={loadingOrderDetailList}
                        handleDelete={handleDeleteOrderDetail}
                    />

                    <ListProduct
                        form={form}
                        // products={products}
                        loading={loadingProducts}
                        addProductToOrder={addProductToOrder}
                        isOrderSuccess={isOrderSuccess} />
                </Col>

                <Col flex={1}>
                    <OrderInformation
                        order={order}
                        form={formOrder}
                        setOrder={setOrder}
                        setLoaingOrderDetailList={setLoaingOrderDetailList}
                        // users={users}
                        handleCancel={handleDeleteOrder}
                        showModalUser={showModalChooseGuest}
                        handlePay={handlePay}
                        fetchListOrderDetail={fetchListOrderDetail}

                    />
                </Col>
            </Row>
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