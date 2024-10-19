import { Button, Form, Input, Popconfirm, Table } from 'antd';
import Cookies from 'js-cookie';
import { debounce } from "lodash";
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { createCategory, deleteCategory, fetchAllCategories, getAllCategories, getCategoryById, updateCategory } from '../../../../api/CategoryApi.ts';
import AddCategoryModal from '../../../../components/Category/AddCategoryModal.tsx';
import CategoryDetailModal from '../../../../components/Category/CategoryDetailModal.tsx';
import UpdateCategoryModal from '../../../../components/Category/UpdateCategoryModal.tsx';
import LoadingCustom from "../../../../components/Loading/LoadingCustom.tsx";
import createPaginationConfig, { PaginationState } from '../../../../config/paginationConfig.ts';
import { Category } from '../../../../types/Category.ts';
import { getErrorMessage } from '../../../Error/getErrorMessage.ts';

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

  const fetchCategoriesDebounced = useCallback(debounce(async (current: number, pageSize: number, searchName: string) => {
    setLoading(true);
    try {
      const response = await fetchAllCategories(pageSize, current - 1, searchName);
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
  }, 500), []);

  const fetchCategories = (current: number, pageSize: number) => {
    fetchCategoriesDebounced(current, pageSize, searchParams.name);
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
        toast.success('Thêm danh mục Thành Công');
        handleAddCancel(); // Đóng modal sau khi thành công
        refreshCategories(); // Làm mới danh sách danh mục
      } else {
        toast.error("Authorization failed");
      }
    } catch (error: any) {
      // Kiểm tra phản hồi lỗi từ backend
      toast.error(getErrorMessage(error))
    }
  };


  const handleUpdateOk = async () => {
    try {
      const values = await form.validateFields();
      const { name, parentId } = values;
      const token = Cookies.get("accessToken");

      if (token && editingCategory) {
        await updateCategory(editingCategory.id, { name, parentId }, token);
        toast.success('Cật Nhật Thành Công');
        handleUpdateCancel();
        refreshCategories();
      } else {
        toast.error("Authorization failed");
      }
    } catch (error: any) {
      toast.error(getErrorMessage(error))
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
        toast.success("Xóa Thành Công");
        refreshCategories();
      } else {
        toast.error("Authorization failed");
      }
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  };

  const handleSearch = (changedValues: any) => {
    setSearchParams(prevParams => ({
      ...prevParams,
      name: changedValues.name,
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
      title: 'Tên danh mục',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Cấp độ',
      dataIndex: 'lever',
      key: 'lever',
    },
    {
      title: 'Thời gian tạo',
      dataIndex: 'createAt',
      key: 'createAt',
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Người tạo',
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
      title: 'Hành động',
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
            title="Bạn chắc chắn muốn xóa Danh mục này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Có"
            cancelText="Không"
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
    <div className="text-center" style={{ height: '200vh', marginLeft: 20, marginRight: 20 }}>
      <h1 className="text-danger">Quản Lý Danh Mục</h1>
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
        <Form.Item name="name" label="Tên Danh Mục">
          <Input placeholder="Tìm Kiếm Theo Tên Danh Mục" />
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
        loading={{
          spinning: loading,
          indicator: <LoadingCustom />,
        }}
        rowKey="id"
        pagination={createPaginationConfig(pagination, setPagination)}
        expandable={{ childrenColumnName: 'children' }}
        rowClassName={(record) => {
          switch (record.lever) {
            case 1:
              return 'parent-category-row';
            case 2:
              return 'sub-category-row-1';
            case 3:
              return 'sub-category-row-2';
            case 4:
              return 'sub-category-row-3';
            case 5:
              return 'sub-category-row-4';
            case 6:
              return 'sub-category-row-5';
            case 7:
              return 'sub-category-row-6';
            case 8:
              return 'sub-category-row-7';
            default:
              return 'sub-category-row';
          }
        }}
      />
      <style jsx>{`
        .sub-category-row-1 {
          background-color: #C4DFE6; /* 2 */
        }
        .sub-category-row-2 {
          background-color: #66CCCC; /* 3 */
        }
        .sub-category-row-3 {
          background-color: #66A5AD; /* 3 */
        }
          .sub-category-row-4 {
          background-color: #BCD2EE; /* 3 */
        }
          .sub-category-row-5 {
          background-color: #BFEFFF; /* 3 */
        }
          .sub-category-row-6 {
          background-color: #D1EEEE; /* 3 */
        }
           .sub-category-row-6 {
          background-color: #AEEEEE; /* 3 */
        }
      `}</style>
    </div>
  );
};

export default ManagerCategory;
