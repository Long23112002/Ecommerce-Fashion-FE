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
import { addProductToOrderDetail, createOrderPendingAtStore, deleteOrderDetail, getAllOrderPendingAtStore, getOrderDetailByIdOrder, updateOrderSuccess } from "../../../api/StoreApi";
import Cookies from 'js-cookie';
import { toast } from "react-toastify";
import { getErrorMessage } from "../../Error/getErrorMessage";
import OrderDetail from "../../../types/OrderDetail";
import { deleteOrder, getOrderById } from "../../../api/OrderApi";
import { getAllUsers, UserParam } from "../../../api/UserApi";
import ModalChooseGuest from "../../../components/Store/ModalChooseGuest";
import { PaginationState } from "../../../config/paginationConfig";
import { makeSlug } from "../../../utils/slug";

const SellingAtStore = () => {
    const [formAddQuantity] = Form.useForm();
    const [formOrder] = Form.useForm();
    const [form] = Form.useForm();

    const [vouchers, setVouchers] = useState<Voucher[]>([]); // State for voucher details
    const [loadingVouchers, setLoadingVouchers] = useState(true);

    const [users, setUsers] = useState<User[]>([]);
    const [loadingUsers, setLoadingUsers] = useState(true);
    const [filterParams, setFilterParams] = useState<UserParam>({
        page: 0,
        size: 5,
        phone: '',
        email: '',
        fullName: '',
        gender: '',
    });

    const [pagination, setPagination] = useState<PaginationState>({
        current: 0,
        pageSize: 5,
        total: 20,
        totalPage: 4,
    });

    const [products, setProducts] = useState<ProductDetail[]>([]);
    const [loadingProducts, setLoadingProducts] = useState<boolean>(true);

    const [isOpenModalAddQuantity, setIsOpenModalAddQuantity] = useState(false);
    const [isOpenModalChooseGuest, setIsOpenModalChooseGuest] = useState(false);

    const [orderDraftList, setOrderDraftList] = useState<Order[]>([]);
    const [loadingOrderDraftList, setLoaingOrderDraftList] = useState(true);

    const [order, setOrder] = useState<Order | null>(null);

    const [orderDetailList, setOrderDetailList] = useState<OrderDetail[]>([]);
    const [loadingOrderDetailList, setLoaingOrderDetailList] = useState(true);
    const [newOrderDetail, setOrderDetail] = useState<OrderDetail | null>(null);

    const [currentProductDetailId, setCurrentProductDetailId] = useState<number | null>(null);

    const formatCurrency = (value: number | null | undefined): string => {
        if (!value) return "0";
        return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" })
            .format(value); 
    };

    const fetchUsers = async (params = filterParams) => {
        setLoadingUsers(true);
        try {
            const response = await getAllUsers({
                ...params,
                page: params.page - 1,
            });
            setUsers(response.data);
            setPagination({
                current: response.metaData.page + 1,
                pageSize: response.metaData.size,
                total: response.metaData.total,
                totalPage: response.metaData.totalPage,
            });
        } catch (error) {
            console.error("Failed to fetch users:", error);
        } finally {
            setLoadingUsers(false);
        }
    };

    const handleFilterChange = (changedValues: any) => {
        setFilterParams(prevParams => ({
            ...prevParams,
            ...changedValues,
            email: changedValues.email !== undefined ? makeSlug(changedValues.email || '') : prevParams.email,
            phone: changedValues.phone !== undefined ? makeSlug(changedValues.phone || '') : prevParams.phone,
            fullName: changedValues.fullName !== undefined ? makeSlug(changedValues.fullName || '') : prevParams.fullName,
            page: 1
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

                    const response = await getOrderById(idOrder);
                    setOrder(response)
                    toast.success('Thêm sản phẩm Thành Công');
                    handleAddQuantityCancel()

                    await refreshOrderDetails();
                    // Cập nhật giá trị của form bằng dữ liệu mới từ order
                    formOrder.setFieldsValue({
                        totalMoney: response.totalMoney ? formatCurrency(response.totalMoney) : "0", // Cập nhật totalMoney
                        code: response.code,
                        createdAt: response.createdAt
                            ? new Date(response.createdAt).toLocaleDateString()
                            : "",
                            
                    });

                    // formOrder.setFieldsValue(order)
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
                await deleteOrderDetail(orderDetailId, token);
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

                // Đặt lại tất cả các giá trị của form về initialValues.
                setOrder(null);
                formOrder.resetFields();

                fetchListOrderDraft();
                fetchListProduct();
                setOrderDetailList([])

            } else {
                toast.error("Bạn chưa chọn hóa đơn cần thanh toán");
            }
        } catch (error) {
            toast.error(getErrorMessage(error))
        }

    }
    const handleCancel = () => {
        setIsOpenModalChooseGuest(false)
    }
    const showModalChooseGuest = () => {
        setIsOpenModalChooseGuest(true);
        // fetchUsers()
    };

    const fetchListProduct = async () => {
        setLoadingProducts(true)
        const pageable: PageableRequest = { page: 0, size: 15, sort: 'DESC', sortBy: 'id' }
        const res = await getAllProductDetails({ pageable: pageable })
        setProducts([...res.data])
        setLoadingProducts(false)
    }
    const refreshOrderDetails = () => {
        fetchListOrderDetail(order)
    };

    const fetchListOrderDraft = async () => {
        setLoaingOrderDraftList(true)
        const res = await getAllOrderPendingAtStore()
        setOrderDraftList([...res.data])
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
        fetchListOrderDetail(order)
        fetchVouchersDebounced()
    }

    const fetchListOrderDetail = async (order: Order | null) => {
        if (order) {
            setLoaingOrderDetailList(true)
            const res = await getOrderDetailByIdOrder(order.id);
            setOrderDetailList([...res.data])
            setLoaingOrderDetailList(false)
        } else {
            setOrderDetailList([]);
        }
    }

    useEffect(() => {
        fetchListProduct()
        fetchListOrderDraft()
        fetchUsers()

    }, [loadingOrderDraftList, filterParams])

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
                <Col flex={4}>
                    <ListOrderDraft
                        orderPendingList={orderDraftList}
                        handleOrder={handleOrder}
                    />
                    <ListOrderDetail
                        orderDetailList={orderDetailList}
                        handleDelete={handleDeleteOrderDetail}
                    />

                    <ListProduct
                        form={form}
                        products={products}
                        loading={loadingProducts}
                        showModalAddQuantity={showAddQuantityModal} />
                </Col>

                <Col flex={1}>
                    <OrderInformation
                        order={order}
                        form={formOrder}
                        vouchers={vouchers}
                        users={users}
                        handleCancel={handleDeleteOrder}
                        showModalUser={showModalChooseGuest}
                        handlePay={handlePay}
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
                // chooseThisGuest={}
                handleCancel={handleCancel}
                users={users}
                loading={loadingUsers}
                handleFilterChange={handleFilterChange}
            />
        </div >
    )

}

export default SellingAtStore