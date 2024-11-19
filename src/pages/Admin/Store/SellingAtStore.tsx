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
import { addProductToOrderDetail, createOrderPendingAtStore, deleteOrderDetail, getAllOrderPendingAtStore, getOrderDetailByIdOrder } from "../../../api/StoreApi";
import Cookies from 'js-cookie';
import { toast } from "react-toastify";
import { getErrorMessage } from "../../Error/getErrorMessage";
import OrderDetail from "../../../types/OrderDetail";
import { deleteOrder } from "../../../api/OrderApi";

const SellingAtStore = () => {
    const [form] = Form.useForm();

    const [vouchers, setVouchers] = useState<Voucher[]>([]); // State for voucher details
    const [loadingVouchers, setLoadingVouchers] = useState(true);

    const [users, setUsers] = useState<User[]>([]);
    const [loadingUsers, setLoadingUsers] = useState(true);

    const [products, setProducts] = useState<ProductDetail[]>([]);
    const [loadingProducts, setLoadingProducts] = useState<boolean>(true);

    const [isOpenModalAddQuantity, setIsOpenModalAddQuantity] = useState(false);

    const [orderDraftList, setOrderDraftList] = useState<Order[]>([]);
    const [loadingOrderDraftList, setLoaingOrderDraftList] = useState(true);

    const [order, setOrder] = useState<Order | null>(null);

    const [orderDetailList, setOrderDetailList] = useState<OrderDetail[]>([]);
    const [loadingOrderDetailList, setLoaingOrderDetailList] = useState(true);
    const [newOrderDetail, setOrderDetail] = useState<OrderDetail | null>(null);

    const [currentProductDetailId, setCurrentProductDetailId] = useState<number | null>(null);

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
        form.resetFields();
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
                const values = await form.validateFields();
                const { quantity } = values;
                const token = Cookies.get("accessToken");
                if (token) {
                    await addProductToOrderDetail({ idOrder, idProductDetail: currentProductDetailId, quantity });
                    toast.success('Thêm sản phẩm Thành Công');
                    handleAddQuantityCancel()

                    await refreshOrderDetails();
                    fetchListOrderDetail(order);
                    // refreshOrderDetails();
                } else {
                    toast.error("Authorization failed");
                }
            } catch (error: any) {
                toast.error(getErrorMessage(error))
            }
        }

    };

    const handleDeleteOrder = async (order: Order | null) => {
        try {
            const token = Cookies.get("accessToken");
            if (token && order) {
                await deleteOrder(order.id, token);
                toast.success("Xóa hóa đơn thành công");

                // Đặt lại tất cả các giá trị của form về initialValues.
                form.resetFields();

                // đặt lại một hoặc nhiều giá trị cụ thể trong form, vượt qua initialValues.
                form.setFieldsValue({
                    createdAt: "",
                    code: "",
                    idVoucher: ""
                });

                fetchListOrderDraft()
                setVouchers([]);

                // refreshOrderDetails();
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

    const fetchListProduct = async () => {
        setLoadingProducts(true)
        const pageable: PageableRequest = { page: 0, size: 15, sort: 'DESC', sortBy: 'createAt' }
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


    const handleOrder = (order: Order) => {
        setOrder(order);
        form.setFieldsValue(order)
        refreshOrderDetails()
        fetchListOrderDetail(order)
        fetchVouchersDebounced()
    }

    const fetchListOrderDetail = async (order: Order | null) => {
        if (order) {
            setLoaingOrderDetailList(true)
            const res = await getOrderDetailByIdOrder(order.id);
            setOrderDetailList([...res.data])
            setLoaingOrderDetailList(false)
        }
    }

    useEffect(() => {
        fetchListProduct()
        fetchListOrderDraft()

    }, [loadingOrderDraftList])

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
                        form={form}
                        vouchers={vouchers}
                        users={users}
                        handleCancel={handleDeleteOrder}
                    />
                </Col>
            </Row>

            <AddQuantityModal
                isModalOpen={isOpenModalAddQuantity}
                form={form}
                handleCancel={handleAddQuantityCancel}
                handleOk={handleAddQuantityOk}
            />

        </div >
    )

}

export default SellingAtStore