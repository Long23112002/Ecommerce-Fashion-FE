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

const SellingAtStore = () => {
    const [form] = Form.useForm();

    const [vouchers, setVouchers] = useState<Voucher[]>([]); // State for voucher details
    const [loadingVouchers, setLoadingVouchers] = useState(true);

    const [users, setUsers] = useState<User[]>([]);
    const [loadingUsers, setLoadingUsers] = useState(true);

    const [products, setProducts] = useState<ProductDetail[]>([]);
    const [loadingProducts, setLoadingProducts] = useState<boolean>(true);

    const fetchVouchersDebounced = useCallback(
        debounce(async (current: number, pageSize: number) => {
            setLoadingVouchers(true);
            try {
                const response = await fetchAllVouchers(pageSize, current - 1);
                setVouchers(response.data);
            } catch (error) {
                console.error("Error fetching vouchers:", error);
            } finally {
                setLoadingVouchers(false);
            }
        }, 500), []);

    const fetchListProduct = async () => {
        setLoadingProducts(true)
        const pageable: PageableRequest = { page: 0, size: 15, sort: 'DESC', sortBy: 'createAt' }
        const res = await getAllProductDetails({ pageable: pageable })
        setProducts([...res.data])
        setLoadingProducts(false)
    }

    useEffect(() => {
        fetchListProduct()
    }, [])

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
            // onClick={}
            >
                <i className="fa-solid fa-circle-plus"></i>
                Tạo hóa đơn
            </Button>
            <Row>
                <Col flex={4}>
                    <ListOrderDraft />
                    <ListOrderDetail />
                    <ListProduct
                        products={products}
                        loading={loadingProducts} />
                </Col>

                <Col flex={1}>
                    <OrderInformation
                        form={form}
                        vouchers={vouchers}
                        users={users}
                    />
                </Col>
            </Row>



        </div >
    )

}

export default SellingAtStore