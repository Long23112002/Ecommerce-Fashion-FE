import React, { useEffect, useState } from 'react';
import { Button, Form, Input, Popconfirm, Select, Table } from 'antd';
import { getAllCategories, createCategory, updateCategory, deleteCategory } from '../../../../api/CategoryApi.ts';
import { CategoryData, CategoryRequest } from '../../../../types/Category.ts';
import { toast } from 'react-toastify';
import createPaginationConfig, { PaginationState } from '../../../../config/paginationConfig.ts';
import CategoryModel from '../../../../components/Category/CategoryModel.tsx';

const ManagerCategory = () => {
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [form] = Form.useForm();
  const [pagination, setPagination] = useState<PaginationState>({
    current: 1,
    pageSize: 5,
    total: 0,
    totalPage: 1,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<CategoryRequest | null>(null);
  const [filterParams, setFilterParams] = useState({
    page: 1,
    size: 5,
    name: '',
  });

  const fetchCategories = async (params = filterParams) => {
    setLoading(true);
    try {
      const response = await getAllCategories({ ...params, page: params.page - 1 });
      setCategories(response.data);
      setPagination({
        current: response.metaData.page + 1,
        pageSize: response.metaData.size,
        total: response.metaData.total,
        totalPage: response.metaData.totalPage,
      });
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [filterParams]);

  const handleTableChange = (newPagination) => {
    setFilterParams((prevParams) => ({
      ...prevParams,
      page: newPagination.current,
      size: newPagination.pageSize,
    }));
  };

  const handleFilterChange = (changedValues) => {
    setFilterParams((prevParams) => ({
      ...prevParams,
      ...changedValues,
      name: changedValues.name || prevParams.name,
      page: 1,
    }));
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (currentCategory) {
        await updateCategory(currentCategory.id, { ...currentCategory, ...values });
        toast.success('Category updated successfully.');
      } else {
        await createCategory(values);
        toast.success('Category added successfully.');
      }
      setIsModalOpen(false);
      fetchCategories();
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteCategory(id);
      fetchCategories();
      toast.success('Category deleted successfully.');
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  };

  const showModal = (record: CategoryRequest | null) => {
    setCurrentCategory(record);
    setIsModalOpen(true);
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Level',
      dataIndex: 'lever',
      key: 'lever',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <div>
          <Button onClick={() => showModal(record)} style={{ marginRight: 8 }}>
            Update
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this category?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button className="btn-outline-danger">Delete</Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="text-center" style={{ height: '200vh', marginLeft: 20, marginRight: 20 }}>
      <h1 className="text-danger">Manager Category</h1>
      <Button
        className="mt-3 mb-3"
        style={{ display: 'flex', backgroundColor: 'black', color: 'white' }}
        type="default"
        onClick={() => showModal(null)}
      >
        Add Category
      </Button>
      <Form
        layout="inline"
        onValuesChange={handleFilterChange}
        style={{ display: 'flex', justifyContent: 'flex-end' }}
        className="mt-2 mb-2"
      >
        <Form.Item name="name" label="Name">
          <Input placeholder="Search by name" />
        </Form.Item>
      </Form>
      <Table
        dataSource={categories}
        columns={columns}
        loading={loading}
        rowKey="id"
        pagination={createPaginationConfig(pagination, setPagination)}
        onChange={handleTableChange}
      />
      {isModalOpen && (
        <CategoryModel
          isModalOpen={isModalOpen}
          handleOk={handleModalOk}
          handleCancel={() => setIsModalOpen(false)}
          form={form}
          refreshCategories={fetchCategories}
          mode={currentCategory ? 'update' : 'add'}
          category={currentCategory ? { ...currentCategory } : undefined}
        />
      )}
    </div>
  );
};

export default ManagerCategory;
