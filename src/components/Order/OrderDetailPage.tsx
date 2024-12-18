import React, { useEffect, useState } from "react";
import { Form, Input, Typography, Table, Row, Col, Button, Select, Steps, Space } from 'antd';
import { Order, OrderStatusLabel, OrderStatus } from '../../types/Order';
import { getOrderById, updateStateOrder } from "../../api/OrderApi";
import { useNavigate, useParams } from "react-router-dom";
import LoadingCustom from "../../components/Loading/LoadingCustom";
import { getErrorMessage } from "../../pages/Error/getErrorMessage";
import { toast } from "react-toastify";
import { Step } from "@mui/material";
const { Option } = Select;
const { Text } = Typography;

const OrderDetailPage: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const { orderId } = useParams<{ orderId: string }>();
    const [order, setOrder] = useState<Order | null>(null);
    // const [selectedStatus, setSelectedStatus] = useState<string>("");
    const [currentStep, setCurrentStep] = useState<number>(0);
    const statusOrder = [
        OrderStatus.PENDING,       // Đang chờ xử lý
        OrderStatus.SHIPPING,      // Đang vận chuyển
        OrderStatus.SUCCESS,       // Thành công
        OrderStatus.CANCEL         // Đã hủy
    ];
    useEffect(() => {
        const fetchOrderDetails = async () => {
            setLoading(true);
            try {
                const parsedOrderId = Number(orderId);
                if (isNaN(parsedOrderId)) {
                    console.error("ID đơn hàng không hợp lệ:", orderId);
                    return;
                }
                const orderData = await getOrderById(parsedOrderId);
                setOrder(orderData);
                // setSelectedStatus(orderData.status);
                setCurrentStep(statusOrder.indexOf(orderData.status));
            } catch (error) {
                toast.error(getErrorMessage(error));
            } finally {
                setLoading(false);
            }
        };
        fetchOrderDetails();
    }, [orderId]);
    const handleStatusChange = async (newStatus: string) => {
        if (!order) return;

        setLoading(true);
        try {
            await updateStateOrder(order.id, { status: newStatus });
            toast.success("Cập nhật trạng thái thành công");
            setOrder({ ...order, status: newStatus });
            setCurrentStep(statusOrder.indexOf(newStatus));
        } catch (error) {
            toast.error(getErrorMessage(error));
        } finally {
            setLoading(false);
        }
    };

    const handleNextStatus = () => {
        const nextStep = currentStep + 1;
        if (nextStep < statusOrder.length) {
            handleStatusChange(statusOrder[nextStep]);
        }
    };

    const handleCancelOrder = () => {
        handleStatusChange(OrderStatus.CANCEL);
    };
    const orderItemColumns = [
        {
            title: 'ID Sản Phẩm',
            dataIndex: ['productDetail', 'id'],
            key: 'productDetailId',
        },
        {
            title: 'Hình Ảnh',
            dataIndex: ['productDetail', 'images'],
            key: 'images',
            render: (images: { url: string }[]) => (
                images && images.length > 0 ? (
                    <img src={images[0].url} alt="Product" style={{ width: 50, height: 50, objectFit: 'cover' }} />
                ) : null
            ),
        },
        {
            title: 'Giá',
            dataIndex: 'price',
            key: 'price',
            render: (price: number) => `${price.toLocaleString()}₫`,
        },
        {
            title: 'Số Lượng',
            dataIndex: 'quantity',
            key: 'quantity',
        }
    ];
    const nextStepTitle = currentStep < statusOrder.length - 1 ? OrderStatusLabel[statusOrder[currentStep + 1]] : "";
    if (loading) {
        return <LoadingCustom />;
    }

    if (!order) {
        return null;
    }
    const fullAddress = `${order.address?.specificAddress || 'Không có'} , ${order.address?.wardName || ''} , ${order.address?.districtName || ''} , ${order.address?.provinceName || ''}`;
    return (
        <div style={{ padding: '24px' }}>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <Text strong style={{ fontSize: '28px' }}>Chi tiết Đơn Hàng</Text>
                <Button onClick={() => navigate('/admin/order')} style={{
                    "position": "relative",
                    "right": "760px",
                    "bottom": "12px",
                }}>
                    <i className="fa-solid fa-reply-all"></i>
                </Button>
            </div>
            <Form
                layout="vertical"
                initialValues={{
                    orderCode: order.id,
                    orderDate: new Date(order.createdAt).toLocaleDateString(),
                    status: OrderStatusLabel[order.status],
                    phoneNumber: order.phoneNumber,
                    address: fullAddress,
                    payAmount: order.payAmount.toLocaleString() + "₫",
                    moneyShip: order.moneyShip.toLocaleString() + "₫",
                    discountAmount: order.discountAmount.toLocaleString() + "₫",
                }}
            >
                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item label={<Text strong>Trạng Thái:</Text>}>
                            <Steps current={currentStep} size="small">
                                {order.status === OrderStatus.CANCEL ? (
                                    <>
                                        <Steps.Step
                                            title="Đang chờ xử lý"
                                            icon={<i className="fa-regular fa-clock"></i>}
                                            status="wait"
                                        />
                                        <Steps.Step
                                            title="Đang vận chuyển"
                                            icon={<i className="fa-solid fa-truck-fast"></i>}
                                            status="wait"
                                        />
                                        <Steps.Step
                                            title="Thành công"
                                            icon={<i className="fa-solid fa-circle-check"></i>}
                                            status="wait"
                                        />
                                        <Steps.Step
                                            title="Đã hủy"
                                            icon={<i className="fa-solid fa-ban"></i>}
                                            status="error"
                                        />
                                    </>) : (
                                    <>
                                        <Steps.Step
                                            title="Đang chờ xử lý"
                                            icon={<i className="fa-regular fa-clock"></i>}
                                        />
                                        <Steps.Step
                                            title="Đang vận chuyển"
                                            icon={<i className="fa-solid fa-truck-fast"></i>}
                                        />
                                        <Steps.Step
                                            title="Thành công"
                                            icon={<i className="fa-solid fa-circle-check"></i>}
                                        />
                                        <Steps.Step
                                            title="Đã hủy"
                                            icon={<i className="fa-solid fa-ban"></i>}
                                        />
                                    </>
                                )}
                            </Steps>

                            <Space style={{ marginTop: 20 }}>
                                <Button
                                    type="primary"
                                    onClick={handleNextStatus}
                                    disabled={order.status === OrderStatus.SUCCESS || order.status === OrderStatus.CANCEL}
                                >
                                    {nextStepTitle || "Chuyển Tiếp"}
                                </Button>
                                <Button
                                    type="default"
                                    danger
                                    onClick={handleCancelOrder}
                                    disabled={order.status === OrderStatus.CANCEL || order.status === OrderStatus.SUCCESS}
                                >
                                    Hủy
                                </Button>
                            </Space>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label={<Text strong>Mã Đơn Hàng:</Text>} name="orderCode">
                            <Input disabled size="large" style={{ fontSize: '16px', color: '#000' }} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label={<Text strong>Ngày Đặt Hàng:</Text>} name="orderDate">
                            <Input disabled size="large" style={{ fontSize: '16px', color: '#000' }} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label={<Text strong>Số Điện Thoại:</Text>} name="phoneNumber">
                            <Input disabled size="large" style={{ fontSize: '16px', color: '#000' }} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label={<Text strong>Địa Chỉ Giao Hàng:</Text>} name="address">
                            <Input disabled size="large" style={{ fontSize: '16px', color: '#000' }} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label={<Text strong>Tiền Ship:</Text>} name="moneyShip">
                            <Input disabled size="large" style={{ fontSize: '16px', color: '#000' }} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label={<Text strong>giảm giá:</Text>} name="discountAmount">
                            <Input disabled size="large" style={{ fontSize: '16px', color: '#000' }} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label={<Text strong>Tổng Tiền:</Text>} name="payAmount">
                            <Input disabled size="large" style={{ fontSize: '16px', color: '#000' }} />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
            <div style={{ display: 'flex', justifyContent: 'center', padding: 20 }}>
                <Text strong style={{ fontSize: '28px' }}>Danh Sách Sản Phẩm</Text>
            </div>
            <Table
                columns={orderItemColumns}
                dataSource={order.orderDetails || []}
                rowKey="id"
                pagination={false}
            />
        </div>
    );
};

export default OrderDetailPage;