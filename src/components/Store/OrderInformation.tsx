import { Button, Form, FormInstance, Input, Layout, Popconfirm, Select, Space } from "antd";
import { Discount } from "../../types/discount";
import { User } from "../../types/User";
import { Voucher } from "../../types/voucher";
import OrderDetailListTable from "./ListOrderDraft";
import Order from "../../types/Order";
import React, { useEffect, useState } from "react";
import { QrReader } from "react-qr-reader";
import { addProductToOrderDetail, OrderDetailData } from "../../api/StoreApi";
import { toast } from "react-toastify";
import { getOrderById, updateDiscountOrder } from "../../api/OrderApi";
import DiscountSelector from "./DiscountSelector";
import { Box } from "@mui/material";

interface OrderInformationProps {
    form: FormInstance;
    showModalUser: (e: any) => void;
    order: Order | null;
    setOrder: React.Dispatch<React.SetStateAction<Order | null>>;
    handleCancel: (e: any) => void;
    handlePay: (e: any) => void;
    fetchListOrderDetail: (order: any) => void;
    isUpdateGuestDiscount: boolean;
    showModalDiscount: (e: any) => void;
}


interface ScanResult {
    text: string | null
}

const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
};

const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
};


const onFinish = (values: any) => {
    console.log(values);
};


const OrderInformation: React.FC<OrderInformationProps> = ({
    form,
    showModalUser,
    order,
    setOrder,
    handleCancel,
    handlePay,
    fetchListOrderDetail,
    isUpdateGuestDiscount,
    showModalDiscount

}) => {
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    };


    const [frameSize, setFrameSize] = useState(200)

    const [data, setData] = useState("");
    const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(null);
    const [loading, setLoading] = useState(false); // Loading state

    const handleResult: any = (result: ScanResult | null) => {
        if (result?.text) {
            console.log(result);
            setData(result.text);
            setFrameSize(150);
        } else {
            setFrameSize(200);
        }
    };

    const processOrder = async (data: string) => {
        const parts = data.split("|");
        const idProductDetail = parts.find(part => part.startsWith("ID:"))?.split(":")[1]?.trim();
        const idOrder = order?.id;

        if (idOrder != null && idProductDetail) {
            const requestBody: OrderDetailData = {
                idOrder: Number(idOrder),
                idProductDetail: Number(idProductDetail),
                quantity: 1
            };

            setLoading(true);
            try {
                await addProductToOrderDetail(requestBody);
                fetchListOrderDetail(order);
                toast.success("Thêm sản phẩm vào hóa đơn thành công!");
            } catch (error) {
                toast.error("Đã xảy ra lỗi khi thêm sản phẩm!");
                console.error(error);
            } finally {
                setLoading(false);
                setData("");
            }
        } else {
            toast.error("Không tìm thấy sản phẩm trong QR Code hoặc hóa đơn!");
        }
    };

    useEffect(() => {
        if (data) {
            if (debounceTimeout) {
                clearTimeout(debounceTimeout);
            }

            const timeout = setTimeout(() => {
                processOrder(data);
            }, 1000); // Adjust the delay as necessary

            setDebounceTimeout(timeout);
        }
    }, [data]);

    const startScanner = () => {
        console.log("Scanner started");
    };

    const stopScanner = () => {
        console.log("Scanner stopped");
    };

    useEffect(() => {
        startScanner();

        return () => {
            stopScanner();
        };
    }, []);

    const onSelect = async (discount: Discount) => {
        if (!discount.id || discount.id <= 0 || !order || !order.id) return
        console.log(discount)
        const res = await updateDiscountOrder(order?.id, discount.id)
        setOrder({ ...res })
    }

    const onCancel = async () => {
        if (!order || !order.id) return
        const res = await updateDiscountOrder(order?.id, null)
        setOrder({ ...res })
    }

    return (
        <div
            style={{
                position: 'fixed',
                top: 75,
                bottom: 5,
                right: 30,
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                borderRadius: 20,
            }}
        >
            <Box
                sx={{
                    margin: 3,
                    marginLeft: 1,
                    height: '100%',
                    overflowY: 'auto'
                }}
            >
                <Form
                    form={form}
                    {...layout}
                    name="control-hooks"
                    onFinish={onFinish}
                    initialValues={{
                        createdAt: order?.createdAt
                            ? new Date(order.createdAt).toLocaleDateString()
                            : "",
                        //     code: order?.code || "",
                        fullName: order?.fullName || "",
                        totalMoney: order?.totalMoney ? formatCurrency(order?.totalMoney) : 0 + " đ",
                        payAmount: order
                            ? order?.payAmount !== null
                                ? formatCurrency(order?.payAmount)
                                : formatCurrency(order?.totalMoney)
                            : 0 + " đ"
                    }}
                >
                    <div className="card text-white mb-3" style={{
                        marginLeft: '18px'
                    }}>
                        <div className="card-body">
                            <h5 className="card-title text-center text-dark mb-2">Quét QR Sản Phẩm</h5>

                            <div className="position-relative">
                                <QrReader
                                    onResult={handleResult}
                                    constraints={{
                                        facingMode: 'environment'
                                    }}
                                    className="w-100"
                                    style={{ aspectRatio: '1/1' }}
                                />
                                <div
                                    className="position-absolute top-50 start-50 translate-middle pointer-events-none"
                                    style={{
                                        width: `136px`,
                                        height: `126px`,
                                        transition: 'all 0.3s ease-in-out'
                                    }}
                                >
                                    <div
                                        className="position-absolute top-0 start-0 w-25 h-25 border-top border-start border-dark-subtle rounded-top-left"
                                        style={{ borderWidth: '4px' }}></div>
                                    <div
                                        className="position-absolute top-0 end-0 w-25 h-25 border-top border-end border-dark-subtle rounded-top-right"
                                        style={{ borderWidth: '4px' }}></div>
                                    <div
                                        className="position-absolute bottom-0 start-0 w-25 h-25 border-bottom border-start border-dark-subtle rounded-bottom-left"
                                        style={{ borderWidth: '4px' }}></div>
                                    <div
                                        className="position-absolute bottom-0 end-0 w-25 h-25 border-bottom border-end border-dark-subtle rounded-bottom-right"
                                        style={{ borderWidth: '4px' }}></div>
                                </div>

                            </div>

                        </div>
                    </div>
                    <Form.Item
                        name="createdAt"
                        label="Ngày tạo"
                    >
                        <Input disabled size="large" style={{ fontSize: '16px', color: '#000' }}
                        />
                    </Form.Item>

                    <Form.Item label="Mã hóa đơn" name="code">
                        <Input disabled size="large" style={{ fontSize: '16px', color: '#000' }} />
                    </Form.Item>

                    <Form.Item
                        name="fullName"
                        label="Tên khách"
                    >
                        <Input placeholder="Nhập tên khách hàng" />
                    </Form.Item>
                    <Form.Item {...tailLayout}>
                        <Space>
                            <Button type="primary" htmlType="submit" onClick={showModalUser}>
                                Chọn khách hàng
                            </Button>
                        </Space>
                    </Form.Item>

                    <Form.Item
                        name="totalMoney"
                        label="Tổng tiền"
                    >
                        <Input
                            disabled
                            size="large" style={{ fontSize: '16px', color: '#000' }}
                        />
                    </Form.Item>

                    <Form.Item name="discountId" {...tailLayout}>
                        <DiscountSelector
                            order={order}
                            onSelect={onSelect}
                            onCancel={onCancel}
                        />
                    </Form.Item>

                    <Form.Item
                        name="payAmount"
                        label="Thành tiền"
                    >
                        <Input disabled size="large" style={{ fontSize: '16px', color: '#000' }} />
                    </Form.Item>

                    <Form.Item {...tailLayout}>
                        <Space>
                            <Button type="primary" htmlType="submit" onClick={() => handlePay(order)}>
                                Thanh toán
                            </Button>

                            <Popconfirm
                                title="Bạn chắc chắn muốn xóa hóa đơn này?"
                                onConfirm={() => handleCancel(order)}
                                okText="Có"
                                cancelText="Không"
                            >
                                <Button>
                                    Hủy đơn
                                </Button>
                            </Popconfirm>
                        </Space>
                    </Form.Item>
                </Form>

            </Box>
        </div>

    )
}

export default OrderInformation