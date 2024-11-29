import { Button, Form, FormInstance, Input, Layout, Popconfirm, Select, Space } from "antd";
import { Discount } from "../../types/discount";
import { User } from "../../types/User";
import { Voucher } from "../../types/voucher";
import OrderDetailListTable from "./ListOrderDraft";
import Order from "../../types/Order";
import React, {useEffect, useState} from "react";
import {QrReader} from "react-qr-reader";
import {addProductToOrderDetail, OrderDetailData} from "../../api/StoreApi";
import {toast} from "react-toastify";
import {getOrderById} from "../../api/OrderApi";

interface OrderInformationProps {
    // onFill: () => void;
    vouchers: Voucher[];
    // users: User[];
    form: FormInstance;
    showModalUser: (e: any) => void;
    order: Order | null;
    handleCancel: (e: any) => void;
    handlePay: (e: any) => void;
    fetchListOrderDetail: (order: any) => void;
    isUpdateGuestDiscount: boolean;
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
    vouchers,
    // users,
    showModalUser,
    order,
    handleCancel,
    handlePay,
    fetchListOrderDetail,
    isUpdateGuestDiscount

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

    return (
        <div
            style={{
                position: "fixed",
                top: "54%",
                right: "35px",
                transform: "translateY(-50%)",
                width: "320px",
                maxHeight: "calc(100vh - 40px)",
                overflowY: "auto",
                border: "1px solid black",
                padding: "15px",
                borderRadius: "8px",
                backgroundColor: "white",
                zIndex: 1000,
                marginLeft: 'auto',
                paddingRight: 30
            }}
        >
            <Form
                form={form}
                {...layout}
                name="control-hooks"
                onFinish={onFinish}
                initialValues={{
                //     createdAt: order?.createdAt
                //         ? new Date(order.createdAt).toLocaleDateString()
                //         : "",
                //     code: order?.code || "",
                    fullName: order?.fullName || "",
                    totalMoney: order?.totalMoney || 0,
                //     payAmount: order?.payAmount || ""
                }}
            >
                <div className="card text-white mb-3" style={{
                    marginLeft:'18px'
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
                                style={{aspectRatio: '1/1'}}
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
                                    style={{borderWidth: '4px'}}></div>
                                <div
                                    className="position-absolute top-0 end-0 w-25 h-25 border-top border-end border-dark-subtle rounded-top-right"
                                    style={{borderWidth: '4px'}}></div>
                                <div
                                    className="position-absolute bottom-0 start-0 w-25 h-25 border-bottom border-start border-dark-subtle rounded-bottom-left"
                                    style={{borderWidth: '4px'}}></div>
                                <div
                                    className="position-absolute bottom-0 end-0 w-25 h-25 border-bottom border-end border-dark-subtle rounded-bottom-right"
                                    style={{borderWidth: '4px'}}></div>
                            </div>

                        </div>

                    </div>
                </div>
                <Form.Item
                    name="createdAt"
                    label="Ngày tạo"
                >
                    <Input disabled size="large" style={{fontSize: '16px', color: '#000'}}
                    />
                </Form.Item>

                <Form.Item label="Mã hóa đơn" name="code">
                    <Input disabled size="large" style={{fontSize: '16px', color: '#000'}}/>
                </Form.Item>

                <Form.Item
                    name="fullName"
                    label="Tên khách"
                    // rules={[
                    //     {
                    //         required: true,
                    //         message: "Tên khách hàng không được trống",
                    //     },
                    // ]}
                >
                    <Input placeholder="Nhập tên khách hàng"/>
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
                        size="large" style={{fontSize: '16px', color: '#000'}}
                    />
                </Form.Item>

                <Form.Item
                    name="idDiscount"
                    label="Giảm giá"
                    rules={[
                        {
                            required: false,
                            message: "Vui lòng chọn voucher",
                        },
                    ]}
                >
                    <Select
                        placeholder="Chọn mã giảm giá"
                        allowClear

                    >
                        {vouchers.map(voucher => (
                            <Select.Option key={voucher.id} value={voucher.id}>
                                {voucher.code}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>

                {/* <Form.Item
                    label="Thành tiền"
                    dependencies={['totalMoney', 'idVoucher']}
                    shouldUpdate={(prevValues, currentValues) =>
                        prevValues.totalMoney !== currentValues.totalMoney || prevValues.idVoucher !== currentValues.idVoucher
                    }
                >
                    {({ getFieldValue }) => {
                        const totalMoney = getFieldValue('totalMoney') || 0;
                        const idVoucher = getFieldValue('idVoucher');
                        const discount = vouchers.find(voucher => voucher.id === idVoucher)?.discountAmount || 0;
                        const payAmount = totalMoney - discount;

                        return (
                            <Input
                                disabled
                                value={payAmount > 0 ? payAmount : 0}
                                size="large"
                                style={{ fontSize: '16px', color: '#000' }}
                            />
                        );
                    }}
                </Form.Item> */}

                {/* <Form.Item
                    name="payAmount"
                    label="Thành tiền"
                >
                    <Input disabled size="large" style={{ fontSize: '16px', color: '#000' }} />
                </Form.Item> */}

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

        </div>

    )
}

export default OrderInformation