import { Avatar, Form, Input, Modal, Row, Col, Typography } from "antd";
import { Product } from "../../types/Product";
import React from "react";

interface ProductModalProps {
    // visible: boolean;
    // onCancel: () => void;
    product: Product | null
}

const { Text } = Typography

const ProductModal: React.FC<ProductModalProps> = ({
    // visible,
    // onCancel,
    product
}) => {
    if (!product) {
        return null;
    }
    return (
        <div 
        style={{
            border: '1px solid #d9d9d9', 
            padding: '24px',
            textAlign: 'left' 
        }}
        > 
            <h2 style={{ marginBottom: '16px' }}>Thông tin sản phẩm</h2>
            <Form
                layout="vertical"
                initialValues={{
                    name: product.name,
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
                <Form.Item label={<Text strong>Sản Phẩm :</Text>} name="name">
                    <Input disabled size="large" style={{ fontSize: '16px', color: '#000' }} />
                </Form.Item>
                <Form.Item label={<Text strong>Mã Sản Phẩm :</Text>} name="code">
                    <Input disabled size="large" style={{ fontSize: '16px', color: '#000' }} />
                </Form.Item>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item label={<Text strong>Danh mục</Text>} name="category">
                            <Input disabled size="large" style={{ fontSize: '16px', color: '#000' }} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label={<Text strong>Thương hiệu </Text>} name="brand">
                            <Input disabled size="large" style={{ fontSize: '16px', color: '#000' }} />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item label={<Text strong>Nguồn gốc</Text>} name="origin">
                            <Input disabled size="large" style={{ fontSize: '16px', color: '#000' }} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label={<Text strong>Chất liệu</Text>} name="material">
                            <Input disabled size="large" style={{ fontSize: '16px', color: '#000' }} />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </div>
    )
}

export default ProductModal