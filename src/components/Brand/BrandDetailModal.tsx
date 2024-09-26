import React from "react";
import { Modal, Form, Input, Avatar, Typography } from 'antd';
import { Brand } from '../../types/brand.ts';



interface BrandDetailModalProps {
    visible: boolean;
    onCancel: () => void;
    brand: Brand | null;
}
const { Text } = Typography;

const BrandDetailModal: React.FC<BrandDetailModalProps> = ({ visible, onCancel, brand }) => {
    if (!brand) return null;

    return (
        <Modal
            title={
                <div style={{ textAlign: 'center' }}>
                    <Text strong style={{ fontSize: '18px' }}>Chi tiết Thương Hiệu</Text>
                    <div style={{ fontSize: '24px', color: '#d4af37', fontWeight: 'bold' }}>{brand.name}</div>
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
                    createAt: new Date(brand.createAt).toLocaleDateString(),
                    updateAt: brand.updateAt ? new Date(brand.updateAt).toLocaleDateString() : "Không có",
                    createBy: brand.createBy?.fullName || "Không rõ",
                    updateBy: brand.updateBy?.fullName || "Chưa cập nhật",
                }}
            >
                <Form.Item label={<Text strong>Ngày tạo :</Text>} name="createAt">
                    <Input disabled size="large" style={{ fontSize: '16px', color: '#000' }} />
                </Form.Item>

                <Form.Item label={<Text strong>Người tạo :</Text>} name="createBy">
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        {brand.createBy?.avatar ? (
                            <Avatar src={brand.createBy.avatar} size={40} style={{ marginRight: 10 }} />
                        ) : (
                            <Avatar size={40} style={{ marginRight: 10, backgroundColor: '#ccc' }} />
                        )}
                        {<Text strong>{brand.createBy?.fullName || 'Không rõ'}</Text>}
                    </div>
                </Form.Item>

                <Form.Item label={<Text strong>Ngày cập nhật :</Text>} name="updateAt">
                    <Input disabled size="large" style={{ fontSize: '16px', color: '#000' }} />
                </Form.Item>

                <Form.Item label={<Text strong>Người cập nhật :</Text>} name="updateBy">
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        {brand.updateBy?.avatar ? (
                            <Avatar src={brand.updateBy.avatar} size={40} style={{ marginRight: 10 }} />
                        ) : (
                            <Avatar size={40} style={{ marginRight: 10, backgroundColor: '#ccc' }} />
                        )}
                        {<Text strong>{brand.updateBy?.fullName || 'Chưa có'}</Text>}
                    </div>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default BrandDetailModal;
