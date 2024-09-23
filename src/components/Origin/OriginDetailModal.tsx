import React from "react";
import { Modal, Form, Input, Avatar, Typography } from 'antd';
import { Origin } from '../../types/origin';

interface OriginDetailModalProps {
    visible: boolean;
    onCancel: () => void;
    origin: Origin | null;
}
const { Text } = Typography;
const OriginDetailModal: React.FC<OriginDetailModalProps> = ({ visible, onCancel, origin }) => {
    if (!origin) return null;

    return (
        <Modal
            title={
                <div style={{ textAlign: 'center' }}>
                    <Text strong style={{ fontSize: '18px' }}>Chi tiết Xuất Xứ</Text>
                    <div style={{ fontSize: '24px', color: '#d4af37', fontWeight: 'bold' }}>{origin.name}</div>
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
                    createAt: new Date(origin.createAt).toLocaleDateString(),
                    updateAt: origin.updateAt ? new Date(origin.updateAt).toLocaleDateString() : "Không có",
                    createBy: origin.createBy?.fullName || "Không rõ",
                    updateBy: origin.updateBy?.fullName || "Chưa cập nhật",
                }}
            >
                <Form.Item label={<Text strong>Ngày tạo :</Text>} name="createAt">
                    <Input disabled size="large" style={{ fontSize: '16px', color: '#000' }} />
                </Form.Item>

                <Form.Item label={<Text strong>Người tạo :</Text>} name="createBy">
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        {origin.createBy?.avatar ? (
                            <Avatar src={origin.createBy.avatar} size={40} style={{ marginRight: 10 }} />
                        ) : (
                            <Avatar size={40} style={{ marginRight: 10, backgroundColor: '#ccc' }} />
                        )}
                        {<Text strong>{origin.createBy?.fullName || 'Không rõ'}</Text>}
                    </div>
                </Form.Item>

                <Form.Item label={<Text strong>Ngày cập nhật :</Text>} name="updateAt">
                    <Input disabled size="large" style={{ fontSize: '16px', color: '#000' }} />
                </Form.Item>

                <Form.Item label={<Text strong>Người cập nhật :</Text>} name="updateBy">
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        {origin.updateBy?.avatar ? (
                            <Avatar src={origin.updateBy.avatar} size={40} style={{ marginRight: 10 }} />
                        ) : (
                            <Avatar size={40} style={{ marginRight: 10, backgroundColor: '#ccc' }} />
                        )}
                        {<Text strong>{origin.updateBy?.fullName || 'Chưa có'}</Text>}
                    </div>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default OriginDetailModal;
