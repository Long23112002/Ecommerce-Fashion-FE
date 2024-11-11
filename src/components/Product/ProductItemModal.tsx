import { Avatar, Form, Image, Input, Modal, Typography } from "antd";
import { Product } from "../../types/Product";
import React from "react";

interface ProductItemModalProps {
    visible: boolean;
    onCancel: () => void;
    product: Product | null
}

const { Text } = Typography

const ProductItemModal: React.FC<ProductItemModalProps> = ({
    visible,
    onCancel,
    product
}) => {
    if (!product) {
        return null;
    }
    return (
        <Modal
            title={
                <div style={{ textAlign: 'center' }}>
                    <Text strong style={{ fontSize: '18px' }}>Chi tiết sản phẩm </Text>
                    <div style={{ fontSize: '24px', color: '#d4af37', fontWeight: 'bold' }}>{product.name}</div>
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
                    code: product.code,
                    description: product.description,
                    createAt: new Date(product.createAt).toLocaleDateString(),
                    updateAt: product.updateAt ? new Date(product.updateAt).toLocaleDateString() : "Không có",
                    createByUser: product.createByUser?.fullName || "Không rõ",
                    updateByUser: product.updateByUser?.fullName || "Chưa cập nhật",
                    category: product.category?.name,
                    origin: product.origin?.name,
                    material: product.material?.name,
                    brand: product.brand?.name,
                }}
            >
                  <Form.Item
                    name="image"
                    label="Ảnh bìa"
                    rules={[
                        { required: true, message: 'Vui lòng upload một ảnh!' },
                    ]}
                    valuePropName="image"
                >
                    <Image
                        width={120}
                        src={product.image}
                        alt="first-image"
                        style={{ borderRadius: '10px' }}
                    />
                </Form.Item>
                
                <Form.Item label={<Text strong>Mã Sản Phẩm :</Text>} name="code">
                    <Input disabled size="large" style={{ fontSize: '16px', color: '#000' }} />
                </Form.Item>

                <Form.Item label={<Text strong>Mô tả :</Text>} name="description">
                    <Input disabled size="large" style={{ fontSize: '16px', color: '#000' }} />
                </Form.Item>

                <Form.Item label={<Text strong>Danh mục</Text>} name="category">
                    <Input disabled size="large" style={{ fontSize: '16px', color: '#000' }} />
                </Form.Item>

                <Form.Item label={<Text strong>Thương hiệu </Text>} name="brand">
                    <Input disabled size="large" style={{ fontSize: '16px', color: '#000' }} />
                </Form.Item>

                <Form.Item label={<Text strong>Nguồn gốc</Text>} name="origin">
                    <Input disabled size="large" style={{ fontSize: '16px', color: '#000' }} />
                </Form.Item>

                <Form.Item label={<Text strong>Chất liệu</Text>} name="material">
                    <Input disabled size="large" style={{ fontSize: '16px', color: '#000' }} />
                </Form.Item>

                <Form.Item label={<Text strong>Ngày tạo :</Text>} name="createAt">
                    <Input disabled size="large" style={{ fontSize: '16px', color: '#000' }} />
                </Form.Item>

                <Form.Item label={<Text strong>Người tạo :</Text>} name="createByUser">
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        {product.createByUser?.avatar ? (
                            <Avatar src={product.createByUser.avatar} size={40} style={{ marginRight: 10 }} />
                        ) : (
                            <Avatar size={40} style={{ marginRight: 10, backgroundColor: '#ccc' }} />
                        )}
                        {<Text strong>{product.createByUser?.fullName || 'Không rõ'}</Text>}
                    </div>
                </Form.Item>

                <Form.Item label={<Text strong>Ngày cập nhật :</Text>} name="updateAt">
                    <Input disabled size="large" style={{ fontSize: '16px', color: '#000' }} />
                </Form.Item>

                <Form.Item label={<Text strong>Người cập nhật :</Text>} name="updateByUser">
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        {product.updateByUser?.avatar ? (
                            <Avatar src={product.updateByUser.avatar} size={40} style={{ marginRight: 10 }} />
                        ) : (
                            <Avatar size={40} style={{ marginRight: 10, backgroundColor: '#ccc' }} />
                        )}
                        {<Text strong>{product.updateByUser?.fullName || 'Chưa có'}</Text>}
                    </div>
                </Form.Item>

            </Form>
        </Modal>
    )
}

export default ProductItemModal