import React, { useEffect, useState } from 'react';
import { Input, Button, Form, Popconfirm, Table } from 'antd';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import { getAllCategories, fetchAllCategories, createCategory, updateCategory, deleteCategory, getCategoryById } from '../../../../api/CategoryApi.ts';
import AddCategoryModal from '../../../../components/Category/AddCategoryModal.tsx';
import UpdateCategoryModal from '../../../../components/Category/UpdateCategoryModal.tsx';
import createPaginationConfig, { PaginationState } from '../../../../config/paginationConfig.ts';
import CategoryDetailModal from '../../../../components/Category/CategoryDetailModal.tsx';
import { Category } from '../../../../types/Category.ts';

const ManagerCategory = () => {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [parentCategories, setParentCategories] = useState<Category[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [detailCategory, setDetailCategory] = useState<Category | null>(null);
  const [pagination, setPagination] = useState<PaginationState>({
    current: 1,
    pageSize: 5,
    total: 20,
    totalPage: 4
  });
  const [searchParams, setSearchParams] = useState<{ name: string }>({
    name: '',
  });
  const buildCategoryTree = (categories: Category[]): Category[] => {
    return categories.map((category) => ({
      ...category,
      children: category.subCategories?.length > 0 ? buildCategoryTree(category.subCategories) : []
    }));
  };

  const fetchCategories = async (current: number, pageSize: number) => {
    setLoading(true);
    try {
      const response = await fetchAllCategories(pageSize, current - 1, searchParams.name);
      const categoryTree = buildCategoryTree(response.data); // Xây dựng cây danh mục
      setCategories(categoryTree); // Lưu cây danh mục
      // setCategories(response.data);
      setPagination({
        current: response.metaData.page + 1,
        pageSize: response.metaData.size,
        total: response.metaData.total,
        totalPage: response.metaData.totalPage
      });
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchParentCategories = async () => {
    try {
      const response = await getAllCategories(); // Assuming this fetches all categories
      setParentCategories(response.data.filter(category => !category.parentId)); // Filter to get top-level categories
    } catch (error) {
      console.error("Error fetching parent categories:", error);
    }
  };

  const showAddModal = () => {
    form.resetFields();
    fetchParentCategories()
    setIsAddModalOpen(true);
  };

  const showUpdateModal = async (category: Category) => {
    try {
      const categoryDetails = await getCategoryById(category.id);
      form.setFieldsValue({
        name: categoryDetails.name,
        parentId: categoryDetails.parentId
      });
      setEditingCategory(categoryDetails);
      fetchParentCategories()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch category details');
    }
    setIsUpdateModalOpen(true);
  };

  const handleViewDetails = (category: Category) => {
    setDetailCategory(category);
    setIsDetailModalOpen(true);
  };

  const handleDetailCancel = () => {
    setIsDetailModalOpen(false);
    setDetailCategory(null);
  };

  const handleAddOk = async () => {
    try {
      const values = await form.validateFields();
      const { name, parentId } = values;
      const token = Cookies.get("accessToken");

      if (token) {
        await createCategory({ name, parentId }, token);
        toast.success('Category added successfully');
        handleAddCancel();
        refreshCategories();
      } else {
        toast.error("Authorization failed");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add category');
    }
  };


  const handleUpdateOk = async () => {
    try {
      const values = await form.validateFields();
      const { name, parentId } = values;
      const token = Cookies.get("accessToken");

      if (token && editingCategory) {
        await updateCategory(editingCategory.id, { name, parentId }, token);
        toast.success('Category updated successfully');
        handleUpdateCancel();
        refreshCategories();
      } else {
        toast.error("Authorization failed");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update category');
    }
  };

  const handleAddCancel = () => {
    setIsAddModalOpen(false);
  };

  const handleUpdateCancel = () => {
    setIsUpdateModalOpen(false);
  };

  const handleDelete = async (categoryId: number) => {
    try {
      const token = Cookies.get("accessToken");
      if (token) {
        await deleteCategory(categoryId, token);
        toast.success("Category deleted successfully");
        refreshCategories();
      } else {
        toast.error("Authorization failed");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete category');
    }
  };

  const handleSearch = (changedValues: any) => {
    setSearchParams(prevParams => ({
      ...prevParams,
      ...changedValues,
    }));
    setPagination(prevPagination => ({
      ...prevPagination,
      current: 1
    }));
  };

  const refreshCategories = () => {
    fetchCategories(pagination.current, pagination.pageSize);
  };

  useEffect(() => {
    fetchCategories(pagination.current, pagination.pageSize);
    fetchParentCategories();
  }, [pagination.current, pagination.pageSize, searchParams]);

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
      title: 'Lever',
      dataIndex: 'lever',
      key: 'lever',
    },
    {
      title: 'Create at',
      dataIndex: 'createAt',
      key: 'createAt',
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Update at',
      dataIndex: 'updateAt',
      key: 'updateAt',
      render: (date) => {
        if (date) {
          return (new Date(date).toLocaleDateString());
        } else {
          return <span>Chưa có</span>;
        }
      }
    },
    {
      title: 'Create By',
      dataIndex: 'createBy',
      key: 'createBy',
      render: (createBy) => (
        <div>
          <img
            src={createBy.avatar}
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              marginRight: 10,
            }}
          />
          {createBy.fullName}
        </div>
      ),
    },
    {
      title: 'Update By',
      dataIndex: 'updateBy',
      key: 'updateBy',
      render: (updateBy) => {
        if (updateBy) {
          return (
            <div>
              <img
                src={updateBy.avatar}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  marginRight: 10,
                }}
                alt="Avatar"
              />
              {updateBy.fullName}
            </div>
          );
        } else {
          return <span>Chưa có</span>;
        }
      },

    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <div>
          <Button onClick={() => handleViewDetails(record)} className="btn-outline-warning">
          <i className="fa-solid fa-eye"></i>
          </Button>
          <Button onClick={() => showUpdateModal(record)} style={{ margin: '0 8px' }} className="btn-outline-primary">
          <i className="fa-solid fa-pen-to-square"></i>
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this category?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button className="btn-outline-danger">
            <i className="fa-solid fa-trash-can"></i>
            </Button>
          </Popconfirm>
        </div>
      ),
    }
  ];

  return (
    <div className="text-center" style={{marginLeft: 20, marginRight: 20 }}>
      <h1 className="text-danger">Manager Category</h1>
      <Button
        className="mt-3 mb-3"
        style={{ display: "flex", backgroundColor: "black", color: "white" }}
        type="default"
        onClick={showAddModal}
      >
        <i className="fa-solid fa-circle-plus"></i>
      </Button>
      <Form
        layout="inline"
        onValuesChange={handleSearch}
        style={{ display: 'flex', justifyContent: 'flex-end' }}
        className="mt-2 mb-2"
      >
        <Form.Item name="name" label="Category Name">
          <Input placeholder="Search by category name" />
        </Form.Item>
      </Form>
      <AddCategoryModal
        isModalOpen={isAddModalOpen}
        handleOk={handleAddOk}
        handleCancel={handleAddCancel}
        form={form}
        parentCategories={parentCategories}
      />
      <UpdateCategoryModal
        isModalOpen={isUpdateModalOpen}
        handleOk={handleUpdateOk}
        handleCancel={handleUpdateCancel}
        form={form}
        category={editingCategory}
        parentCategories={parentCategories}
      />
      <CategoryDetailModal
        visible={isDetailModalOpen}
        onCancel={handleDetailCancel}
        category={detailCategory}
      />
      <Table
        dataSource={categories}
        columns={columns}
        loading={loading}
        rowKey="id"
        pagination={createPaginationConfig(pagination, setPagination)}
        expandable={{ childrenColumnName: 'children' }} // Cấu hình expandable cho bảng
      />
    </div>
  );
};

export default ManagerCategory;
