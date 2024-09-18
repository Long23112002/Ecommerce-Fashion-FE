import React from 'react';
import { Modal, Form, Input, Button } from 'antd';
import { Brand } from '../../types/brand.ts'; // Brand type
import { FormInstance } from 'antd/es/form';

interface BrandModelProps {
    isModalOpen: boolean;
    handleOk: () => void;
    handleCancel: () => void;
    form: FormInstance;
    mode: 'add' | 'update'; // Determines if we're adding or updating a brand
    brand?: Brand; // Optional when updating
}

const BrandModel: React.FC<BrandModelProps> = ({ isModalOpen, handleOk, handleCancel, form, mode, brand }) => {
    return (
        <Modal
            title={mode === 'add' ? 'Add Brand' : 'Update Brand'}
            visible={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
            footer={[
                <Button key="back" onClick={handleCancel}>
                    Cancel
                </Button>,
                <Button key="submit" type="primary" onClick={handleOk}>
                    {mode === 'add' ? 'Add' : 'Update'}
                </Button>,
            ]}
        >
            <Form
                form={form}
                layout="vertical"
                initialValues={{
                    name: brand?.name || '',
                }}
            >
                <Form.Item
                    name="name"
                    label="Brand Name"
                    rules={[{ required: true, message: 'Please enter the brand name' }]}
                >
                    <Input placeholder="Enter brand name" />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default BrandModel;
