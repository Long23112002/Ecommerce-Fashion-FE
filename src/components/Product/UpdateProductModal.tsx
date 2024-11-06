import React, { useEffect } from "react";
import { Material } from "../../pages/Admin/Attributes/material/material";
import { Brand } from "../../types/brand";
import { Category } from "../../types/Category";
import { Origin } from "../../types/origin";
import { Product } from "../../types/Product";
import { Modal, Form, Input, Button, Select } from 'antd';

interface UpdateProductModalProps {
    isModalOpen: boolean;
    handleOk: (values: any) => void;
    handleCancel: () => void;
    form: any;
    product: Product | null;
    brands: Brand[];
    origins: Origin[];
    materials: Material[];
    categories: Category[];
}

const UpdateProductModal: React.FC<UpdateProductModalProps> = ({
    isModalOpen,
    handleOk,
    handleCancel,
    form,
    product,
    brands,
    origins,
    materials,
    categories
}) => {
    useEffect(() => {
        if (product) {
            form.setFieldsValue({
                name: product.name,
                code: product.code,
                description: product.description,
                idCategory: product.category?.id,
                idBrand: product.brand?.id,
                idOrigin: product.origin?.id,
                idMaterial: product.material?.id,
            });
        }
    }, [product, form])

    const onOk = () => {
        form.validateFields()
            .then((values: any) => {
                console.log('Form values:', values);
                handleOk(values);  // Gọi hàm xử lý với dữ liệu từ form
            })
            .catch((errorInfo: any) => {
                console.error('Validation failed:', errorInfo);
            });
    };

    return (
        <Modal
            title="Update Product"
            visible={isModalOpen}
            onOk={onOk}
            onCancel={handleCancel}
            footer={[
                <Button key="cancel" onClick={handleCancel}>
                    Thoát
                </Button>,
                <Button key="submit" type="primary" onClick={onOk}>
                    Cập Nhật
                </Button>
            ]}
        >
            <Form form={form} layout="vertical"
            >
                <Form.Item
                    name="name"
                    label="Tên Sản Phẩm"
                    rules={[{ required: true, message: 'Please enter product name' }]}
                >
                    <Input placeholder="Enter product name" />
                </Form.Item>

                <Form.Item
                    name="code"
                    label="Mã Sản Phẩm"
                >
                    <Input disabled size="large" style={{ fontSize: '16px', color: '#000' }} />
                </Form.Item>

                <Form.Item
                    name="description"
                    label="Mô tả"
                >
                    <Input placeholder="Enter description" />
                </Form.Item>

                <Form.Item
                    name="idOrigin"
                    label="Nguồn gốc"
                >
                    <Select
                        placeholder="Select origin"
                        allowClear
                    >
                        {origins.map(origin => (
                            <Select.Option key={origin.id} value={origin.id}>
                                {origin.name}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    name="idBrand"
                    label="Thương hiệu"
                >
                    <Select
                        placeholder="Select brand"
                        allowClear
                    >
                        {brands.map(brand => (
                            <Select.Option key={brand.id} value={brand.id}>
                                {brand.name}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    name="idMaterial"
                    label="Chất liệu"
                >
                    <Select
                        placeholder="Select material"
                        allowClear
                    >
                        {materials.map(material => (
                            <Select.Option key={material.id} value={material.id}>
                                {material.name}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    name="idCategory"
                    label="Danh mục"
                >
                    <Select
                        placeholder="Select category"
                        allowClear
                    >
                        {categories.map(category => (
                            <Select.Option key={category.id} value={category.id}>
                                {category.name}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    )
}

export default UpdateProductModal