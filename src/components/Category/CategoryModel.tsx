import React, { useEffect } from 'react';
import { Modal, Form, Input, TreeSelect } from 'antd';
import { CategoryRequest } from '../../types/Category';
import { toast } from 'react-toastify';

interface CategoryModelProps {
  isModalOpen: boolean;
  handleOk: (values: any) => void;
  handleCancel: () => void;
  form: any;
  mode: 'add' | 'update';
  category?: CategoryRequest;
  parentCategories: CategoryRequest[]; // Parent categories list
}

const CategoryModel: React.FC<CategoryModelProps> = ({
  isModalOpen,
  handleOk,
  handleCancel,
  form,
  mode,
  category,
  parentCategories = [] // Ensure parentCategories is always an array
}) => {

  // UseEffect to set the form values when the category is provided
  useEffect(() => {
    if (category) {
      form.setFieldsValue({
        name: category.name,
        parentCategory: category.parentCategoryId || undefined, // Set parentCategoryId if available
      });
    } else {
      form.resetFields();
    }
  }, [category, form]);

  // Recursive function to map categories to TreeSelect structure
  const mapCategoriesToTreeData = (categories: CategoryRequest[]) => {
    return categories.map((category) => ({
      title: category.name,
      value: category.id,
      children: category.subCategories ? mapCategoriesToTreeData(category.subCategories) : [], // Recurse on subCategories
    }));
  };

  // On form submit
  const onSubmit = async () => {
    try {
      const values = await form.validateFields();
      // Remove parentCategory if not selected
      if (!values.parentCategory) {
        delete values.parentCategory;
      }
      handleOk(values); // Send the form data to the parent handler
    } catch (error) {
      console.error('Failed to create category:', error); // Log error details
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
          <TreeSelect
            placeholder="Select parent category"
            treeData={mapCategoriesToTreeData(parentCategories)} // Use recursive data mapping
            allowClear
            treeDefaultExpandAll
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CategoryModel;
