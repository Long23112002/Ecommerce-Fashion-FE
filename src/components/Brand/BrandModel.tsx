import React, { useState } from 'react';
import { Modal, Form, Input, FormInstance, message } from 'antd';
import { Brand } from '../../types/brand.ts';

interface BrandModelProps {
    isModalOpen: boolean;
    handleOk: (values: any) => void;
    handleCancel: () => void;
    form: FormInstance;
    mode: 'add' | 'update';
    brand?: Brand;
    existingBrand: Brand[];
}

const BrandModel: React.FC<BrandModelProps> = ({
    isModalOpen,
    handleOk,
    handleCancel,
    form,
    mode,
    brand,
    existingBrand = [],
}) => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const checkDuplicateName = (name: string, excludeName: string = "") => {
        return existingBrand.some((item) => item.name === name && item.name !== excludeName);
    };

    const onSubmit = async () => {
        try {
            const values = await form.validateFields();
            const excludeName = mode === "update" ? brand?.name : "";
            if (checkDuplicateName(values.name, excludeName)) {
                message.error("Tên đã tồn tại! Vui lòng chọn tên khác.");
                return;
            }
            setIsSubmitting(true);
            handleOk(values);
            setIsSubmitting(false);
        } catch (error) {
            console.error("Validation failed:", error);
        }
    };
    return (
        <Modal
            title={mode === 'add' ? 'Thêm Thương hiệu' : 'Chỉnh Sửa Thương hiệu'}
            visible={isModalOpen}
            onOk={onSubmit}
            onCancel={handleCancel}
            okText={mode === "add" ? "Add" : "Update"}
            cancelText="Cancel"
            confirmLoading={isSubmitting}
        >
            <Form
                form={form}
                layout="vertical"
                initialValues={
                    brand ? { name: brand.name } : { name: "" }
                }
            >
                <Form.Item
                    name="name"
                    label="Tên Thương Hiệu"
                    rules={[{ required: true, message: 'Vui lòng nhập tên !' },
                    { max: 50, message: "Tên phải ít hơn 50 ký tự" }
                    ]}
                >
                    <Input placeholder="Enter brand name" />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default BrandModel;
