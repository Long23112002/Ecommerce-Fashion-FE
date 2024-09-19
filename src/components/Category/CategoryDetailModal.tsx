import React from 'react';
import { Modal, Form, Input, Avatar, Typography } from 'antd';
import { Category } from "../../types/Category";

interface CategoryDetailModalProps {
    visible: boolean;
    onCancel: () => void;
    category: Category | null;
}

const { Text } = Typography;

const CategoryDetailModal: React.FC<CategoryDetailModalProps> = ({
    visible,
    onCancel,
    category,
}) => {
    if (!category) {
        return null;
    }

    return (
        <Modal
            title={
                <div style={{ textAlign: 'center' }}>
                    <Text strong style={{ fontSize: '18px' }}>Chi tiết danh mục</Text>
                    <div style={{ fontSize: '24px', color: '#d4af37', fontWeight: 'bold' }}>{category.name}</div>
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
                    createAt: new Date(category.createAt).toLocaleDateString(),
                    updateAt: category.updateAt ? new Date(category.updateAt).toLocaleDateString() : "Không có",
                    createBy: category.createBy?.fullName || "Không rõ",
                    updateBy: category.updateBy?.fullName || "Chưa cập nhật",
                    parentCategory: category.parentCategory ? category.parentCategory.name : "Không có",
                    subCategories: category.subCategories.length > 0
                        ? category.subCategories.map(sub => sub.name).join(", ")
                        : "Không có danh mục con",
                }}
            >
                <Form.Item label={<Text strong>Ngày tạo :</Text>} name="createAt">
                    <Input disabled size="large" style={{ fontSize: '16px', color: '#000' }} />
                </Form.Item>

                <Form.Item label={<Text strong>Người tạo :</Text>} name="createBy">
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        {category.createBy?.avatar ? (
                            <Avatar src={category.createBy.avatar} size={40} style={{ marginRight: 10 }} />
                        ) : (
                            <Avatar size={40} style={{ marginRight: 10, backgroundColor: '#ccc' }} />
                        )}
                        {<Text strong>{category.createBy?.fullName || 'Không rõ'}</Text>}
                    </div>
                </Form.Item>

                <Form.Item label={<Text strong>Ngày cập nhật :</Text>} name="updateAt">
                    <Input disabled size="large" style={{ fontSize: '16px', color: '#000' }} />
                </Form.Item>

                <Form.Item label={<Text strong>Người cập nhật :</Text>} name="updateBy">
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        {category.updateBy?.avatar ? (
                            <Avatar src={category.updateBy.avatar} size={40} style={{ marginRight: 10 }} />
                        ) : (
                            <Avatar size={40} style={{ marginRight: 10, backgroundColor: '#ccc' }} />
                        )}
                        {<Text strong>{category.updateBy?.fullName || 'Chưa có'}</Text>}
                    </div>
                </Form.Item>

                <Form.Item label={<Text strong>Danh mục cha</Text>} name="parentCategory">
                    <Input disabled size="large" style={{ fontSize: '16px', color: '#000' }} />
                </Form.Item>

                <Form.Item label={<Text strong>Danh mục con</Text>} name="subCategories">
                    <Input disabled size="large" style={{ fontSize: '16px', color: '#000' }} />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default CategoryDetailModal;
