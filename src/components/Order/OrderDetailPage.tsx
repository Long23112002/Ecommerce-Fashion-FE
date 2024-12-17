import React, { useEffect, useState } from "react";
import { Form, Input, Typography, Table, Row, Col, Button } from 'antd';
import { Order, OrderStatusLabel } from '../../types/Order';
import { getOrderById } from "../../api/OrderApi";
import { useNavigate, useParams } from "react-router-dom";
import LoadingCustom from "../../components/Loading/LoadingCustom";
import { getErrorMessage } from "../../pages/Error/getErrorMessage";
import { toast } from "react-toastify";

const { Text } = Typography;

const OrderDetailPage: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const { orderId } = useParams<{ orderId: string }>();
    const [order, setOrder] = useState<Order | null>(null);

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
            } catch (error) {
                toast.error(getErrorMessage(error));
            } finally {
                setLoading(false);
            }
        };
        fetchOrderDetails();
    }, [orderId]);

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
        },
        {
            title: 'Phí Ship',
            key: 'moneyShip',
            render: (_: any, record: any) => `${order.moneyShip.toLocaleString()|| '0'}₫`,
        },
        {
            title: 'mã giảm giá',
            key: 'discountAmount',
            render: (_: any, record: any) => `${order.discountAmount.toLocaleString()|| '0'}₫`,
        },
        {
            title: 'Tổng Tiền',
            dataIndex: 'payAmount',
            key: 'payAmount',
            render: (_: any, record: any) => `${order.payAmount.toLocaleString()}₫`,
        }
    ];

    if (loading) {
        return <LoadingCustom />;
    }

    if (!order) {
        return null;
    }
    const fullAddress = `${order.address?.specificAddress || 'Không có'} , ${order.address?.wardName || ''} , ${order.address?.districtName|| ''} , ${order.address?.provinceName|| ''}`;
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
                    payAmount: order.payAmount.toLocaleString() + "₫"
                }}
            >
                <Row gutter={16}>
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
                        <Form.Item label={<Text strong>Trạng Thái:</Text>} name="status">
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
