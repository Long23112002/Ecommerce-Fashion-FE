import React from 'react';
import { Modal, Form, Input, Button, Select } from 'antd';
import { Category } from '../../types/Category';

interface AddCategoryModalProps {
    isModalOpen: boolean;
    handleOk: () => void;
    handleCancel: () => void;
    form: any;  // Ant Design form instance
    parentCategories: Category[];  // List of parent categories for the Select
}

const AddCategoryModal: React.FC<AddCategoryModalProps> = ({
    isModalOpen,
    handleOk,
    handleCancel,
    form,
    parentCategories
}) => {
    return (
        <Modal
            title="Add Category"
            visible={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
            footer={[
                <Button key="cancel" onClick={handleCancel}>
                    Cancel
                </Button>,
                <Button key="submit" type="primary" onClick={handleOk}>
                    Add
                </Button>
            ]}
        >
            <Form form={form} layout="vertical">
                <Form.Item
                    name="name"
                    label="Category Name"
                    rules={[{ required: true, message: 'Please enter category name' }]}
                >
                    <Input placeholder="Enter category name" />
                </Form.Item>
                <Form.Item
                    name="parentId"
                    label="Parent Category"
                >
                    <Select placeholder="Select parent category">
                        {parentCategories.map(category => (
                            <Select.Option key={category.id} value={category.id}>
                                {category.name}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default AddCategoryModal;
