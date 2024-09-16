import React, { useEffect } from 'react';
import { Modal, Form, Input, Button, Select } from 'antd';
import { Category, SubCategory } from '../../types/Category';

interface UpdateCategoryModalProps {
    isModalOpen: boolean;
    handleOk: (values: any) => void;  // Hàm để xử lý cập nhật
    handleCancel: () => void;
    form: any;  // Ant Design form instance
    category: Category | null;  // Category để cập nhật
    parentCategories: SubCategory[];  // Danh sách danh mục cha
}

const UpdateCategoryModal: React.FC<UpdateCategoryModalProps> = ({
    isModalOpen,
    handleOk,
    handleCancel,
    form,
    category,
    parentCategories
}) => {
    // Khi category thay đổi, đặt lại giá trị form
    useEffect(() => {
        if (category) {
            form.setFieldsValue({
                name: category.name,
                parentId: category.parentCategory ? category.parentCategory.id : undefined
            });
        }
    }, [category, form]);

    const onOk = () => {
        // Lấy tất cả các giá trị từ form khi nhấn OK
        form.validateFields()
            .then((values: any) => {
                console.log('Form values:', values);  // Xem giá trị form lấy được
                handleOk(values);  // Gọi hàm xử lý với dữ liệu từ form
            })
            .catch((errorInfo: any) => {
                console.error('Validation failed:', errorInfo);
            });
    };

    return (
        <Modal
            title="Update Category"
            visible={isModalOpen}
            onOk={onOk}
            onCancel={handleCancel}
            footer={[
                <Button key="cancel" onClick={handleCancel}>
                    Cancel
                </Button>,
                <Button key="submit" type="primary" onClick={onOk}>
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
                    >
                        {parentCategories.map(parentCategory => (
                            <Select.Option key={parentCategory.id} value={parentCategory.id}>
                                {parentCategory.name}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default UpdateCategoryModal;
