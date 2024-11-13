import React from "react";
import { Modal, Form, Input, Typography, Tag } from 'antd';
import { Order, OrderStatus, OrderStatusLabel } from '../../types/order.ts';

interface OrderDetailModalProps {
    visible: boolean;
    onCancel: () => void;
    order: Order | null;
}

const { Text } = Typography;

const OrderDetailModal: React.FC<OrderDetailModalProps> = ({ visible, onCancel, order }) => {
    if (!order) return null;

    return (
        <Modal
            title={
                <div style={{ textAlign: 'center' }}>
                    <Text strong style={{ fontSize: '18px' }}>Chi tiết Đơn Hàng</Text>
                    <div style={{ fontSize: '24px', color: '#d4af37', fontWeight: 'bold' }}>Mã Đơn: {order.id}</div>
                </div>
            }
            visible={visible}
            onCancel={onCancel}
            footer={null}
            width={600}
            bodyStyle={{ padding: '24px', fontSize: '16px' }}
        >
            <Form
                layout="vertical"
                initialValues={{
                    createdAt: new Date(order.createdAt).toLocaleDateString(),
                    updatedAt: order.updatedAt ? new Date(order.updatedAt).toLocaleDateString() : "Chưa cập nhật",
                    userId: order.user.fullName,
                    paymentMethod: order.paymentMethod.paymentMethod,
                    phoneNumber: order.phoneNumber,
                    address: order.address,
                    note: order.note,
                    totalAmount: order.totalMoney,
                }}
            >
                <Form.Item label={<Text strong>Tên Khách Hàng:</Text>} name="userId">
                    <Input disabled size="large" style={{ fontSize: '16px', color: '#000' }} />
                </Form.Item>

                <Form.Item label={<Text strong>Số Điện Thoại:</Text>} name="phoneNumber">
                    <Input disabled size="large" style={{ fontSize: '16px', color: '#000' }} />
                </Form.Item>

                <Form.Item label={<Text strong>Tổng Số Tiền:</Text>} name="totalAmount">
                    <Input disabled size="large" style={{ fontSize: '16px', color: '#000' }} />
                </Form.Item>
                <Form.Item label={<Text strong>Phương Thức Thanh Toán :</Text>} name="paymentMethod">
                    <Input disabled size="large" style={{ fontSize: '16px', color: '#000' }} />
                </Form.Item>
                <Form.Item label={<Text strong>Ngày Tạo:</Text>} name="createdAt">
                    <Input disabled size="large" style={{ fontSize: '16px', color: '#000' }} />
                </Form.Item>

                <Form.Item label={<Text strong>Ngày Cập Nhật:</Text>} name="updatedAt">
                    <Input disabled size="large" style={{ fontSize: '16px', color: '#000' }} />
                </Form.Item>
                <Form.Item label={<Text strong>Địa chỉ giao hàng:</Text>} name="address">
                    <Input disabled size="large" style={{ fontSize: '16px', color: '#000' }} />
                </Form.Item>
                <Form.Item label={<Text strong>Ghi Chú:</Text>} name="note">
                    <Input.TextArea
                        disabled
                        size="large"
                        style={{ fontSize: '16px', color: '#000' }}
                        autoSize={{ minRows: 3, maxRows: 5 }}
                    />
                </Form.Item>
                <Form.Item label={<Text strong>Trạng Thái:</Text>}>
                    <Tag color={
                        order.status === OrderStatus.PENDING ? "yellow" :
                            order.status === OrderStatus.SHIPPING ? "blue" :
                                order.status === OrderStatus.CANCEL ? "red" :
                                    order.status === OrderStatus.SUCCESS ? "green" :
                                        order.status === OrderStatus.DRAFT ? "#FF9933" :
                                            order.status === OrderStatus.REFUND ? "grey" :
                                                "grey"
                    }>
                        {OrderStatusLabel[order.status] || "Không xác Định"}
                    </Tag>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default OrderDetailModal;
