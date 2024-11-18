import React from "react";
import { Modal, Form, Input, Avatar, Typography } from 'antd';
import { Voucher } from '../../types/voucher.ts';
import { StatusDiscount } from "../../types/discount.ts";

interface VoucherDetailModalProps {
    visible: boolean;
    onCancel: () => void;
    voucher: Voucher | null;
}

const { Text } = Typography;

const VoucherDetailModal: React.FC<VoucherDetailModalProps> = ({ visible, onCancel, voucher }) => {
    if (!voucher) return null;

    return (
        <Modal
            title={
                <div style={{ textAlign: 'center' }}>
                    <Text strong style={{ fontSize: '18px' }}>Chi tiết Voucher</Text>
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
                    code: voucher.code,
                    discount: voucher.discount?.name || "No discount",
                    startDate: voucher.discount.startDate,
                    endDate: voucher.discount.endDate,
                    status: voucher.discount.discountStatus,
                    createAt: new Date(voucher.createAt).toLocaleDateString(),
                    updateAt: voucher.updateAt ? new Date(voucher.updateAt).toLocaleDateString() : "Không có",
                    createBy: voucher.createBy?.fullName || "Không rõ",
                    updateBy: voucher.updateBy?.fullName || "Chưa cập nhật",
                }}
            >
                <Form.Item label={<Text strong>Code :</Text>} name="code">
                    <Input disabled size="large" style={{ fontSize: '16px', color: '#000' }} />
                </Form.Item>

                <Form.Item label={<Text strong>Tên Phiếu :</Text>} name="discount">
                    <Input disabled size="large" style={{ fontSize: '16px', color: '#000' }} />
                </Form.Item>

                <Form.Item label={<Text strong>Ngày Bắt Đầu:</Text>} name="startDate">
                    <Input disabled size="large" style={{ fontSize: '16px', color: '#000' }} />
                </Form.Item>

                <Form.Item label={<Text strong>Ngày Kết Thúc:</Text>} name="endDate">
                    <Input disabled size="large" style={{ fontSize: '16px', color: '#000' }} />
                </Form.Item>

                <Form.Item label={<Text strong>Trạng Thái:</Text>} name="status">
                    <Input disabled size="large" style={{ fontSize: '16px', color: '#000' }} />
                </Form.Item>
                <Form.Item label={<Text strong>Ngày tạo :</Text>} name="createAt">
                    <Input disabled size="large" style={{ fontSize: '16px', color: '#000' }} />
                </Form.Item>

                <Form.Item label={<Text strong>Người tạo :</Text>} name="createBy">
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        {voucher.createBy?.avatar ? (
                            <Avatar src={voucher.createBy.avatar} size={40} style={{ marginRight: 10 }} />
                        ) : (
                            <Avatar size={40} style={{ marginRight: 10, backgroundColor: '#ccc' }} />
                        )}
                        <Text strong>{voucher.createBy?.fullName || 'Không rõ'}</Text>
                    </div>
                </Form.Item>

                <Form.Item label={<Text strong>Ngày cập nhật :</Text>} name="updateAt">
                    <Input disabled size="large" style={{ fontSize: '16px', color: '#000' }} />
                </Form.Item>

                <Form.Item label={<Text strong>Người cập nhật :</Text>} name="updateBy">
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        {voucher.updateBy?.avatar ? (
                            <Avatar src={voucher.updateBy.avatar} size={40} style={{ marginRight: 10 }} />
                        ) : (
                            <Avatar size={40} style={{ marginRight: 10, backgroundColor: '#ccc' }} />
                        )}
                        <Text strong>{voucher.updateBy?.fullName || 'Chưa có'}</Text>
                    </div>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default VoucherDetailModal;
