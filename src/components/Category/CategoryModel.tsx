import React, { useEffect } from 'react';
import { Modal, Form, Input, Select } from 'antd';
import { CategoryRequest } from '../../types/Category';
import { toast } from 'react-toastify';

interface CategoryModelProps {
  isModalOpen: boolean;
  handleOk: (values: any) => void;
  handleCancel: () => void;
  form: any;
  mode: 'add' | 'update';
  category?: CategoryRequest;
  parentCategories: CategoryRequest[];
}

const CategoryModel: React.FC<CategoryModelProps> = ({
  isModalOpen,
  handleOk,
  handleCancel,
  form,
  mode,
  category,
  parentCategories = [] // Đảm bảo parentCategories luôn là mảng
}) => {

  useEffect(() => {
    if (category) {
      form.setFieldsValue({
        name: category.name,
        parentCategory: category.parentCategory ? category.parentCategory.id : undefined, // Nếu không có parentCategory thì để undefined
      });
    } else {
      form.resetFields();
    }
  }, [category, form]);

  const onSubmit = async () => {
    try {
      const values = await form.validateFields();
      // Nếu parentCategory không được chọn, loại bỏ nó khỏi dữ liệu gửi đi
      if (values.parentCategory === undefined || values.parentCategory === null) {
        delete values.parentCategory;
      }
      handleOk(values); // Gửi dữ liệu form lên handler cha
    } catch (error) {
      console.error('Failed to create category:', error); // In chi tiết lỗi vào console
      toast.error("Please fill out the form correctly.");
    }
  };

  return (
    <Modal
      title={mode === 'add' ? 'Add Category' : 'Update Category'}
      open={isModalOpen}
      onOk={onSubmit}
      onCancel={handleCancel}
      okText={mode === 'add' ? 'Add' : 'Update'}
      cancelText="Cancel"
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="name"
          label="Category Name"
          rules={[{ required: true, message: 'Please enter the category name' }]}
        >
          <Input placeholder="Enter category name" />
        </Form.Item>

        <Form.Item
          name="parentCategory"
          label="Parent Category"
        >
          <Select placeholder="Select parent category" allowClear>
            {parentCategories.length > 0 ? (
              parentCategories.map((parent) => (
                <Select.Option key={parent.id} value={parent.id}>
                  {parent.name}
                </Select.Option>
              ))
            ) : (
              <Select.Option disabled>No parent categories available</Select.Option>
            )}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CategoryModel;
