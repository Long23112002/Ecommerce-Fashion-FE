import React, { useEffect } from 'react';
import { Modal, Form, Input, Button, Select } from 'antd';
import { Category } from '../../types/Category';

interface UpdateCategoryModalProps {
    isModalOpen: boolean;
    handleOk: () => void;
    handleCancel: () => void;
    form: any;  // Ant Design form instance
    category: Category | null;  // Category to be updated
    parentCategories: Category[];  // List of parent categories for the Select
}

const UpdateCategoryModal: React.FC<UpdateCategoryModalProps> = ({
    isModalOpen,
    handleOk,
    handleCancel,
    form,
    category,
    parentCategories
}) => {
    useEffect(() => {
        if (category) {
            form.setFieldsValue({
                name: category.name,
                parentId: category.parentCategory ? category.parentCategory.id : undefined
            });
        }
    }, [category, form]);

    const selectedParentCategory = parentCategories.find(cat => cat.id === form.getFieldValue('parentId'));

    return (
        <Modal
            title="Update Category"
            visible={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
            footer={[
                <Button key="cancel" onClick={handleCancel}>
                    Cancel
                </Button>,
                <Button key="submit" type="primary" onClick={handleOk}>
                    Update
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
                    <Select
                        placeholder="Select parent category"
                        allowClear
                        value={form.getFieldValue('parentId') || undefined}
                    >
                        {parentCategories.map(parentCategory => (
                            <Select.Option key={parentCategory.id} value={parentCategory.id}>
                                {parentCategory.name}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
                {selectedParentCategory && (
                    <div>
                        <strong>Current Parent Category:</strong> {selectedParentCategory.name}
                    </div>
                )}
            </Form>
        </Modal>
    );
};

export default UpdateCategoryModal;
