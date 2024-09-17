import React, { useEffect, useState } from "react";
import {
  createSize,
  deleteSize,
  fetchAllSizes,
  getSizeById,
  updateSize,
} from "./sizeManagament.ts";
import {
  Button,
  Form,
  Popconfirm,
  Table,
  Input,
  Modal,
  Space,
  Tooltip,
} from "antd";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import createPaginationConfig, {
  PaginationState,
} from "../../../../config/paginationConfig.ts";
import { SearchOutlined } from "@ant-design/icons";
import {
  PlusSquareFilled,
  EditFilled,
  DeleteFilled,
  BookFilled,
} from "@ant-design/icons";
import type { FilterDropdownProps } from "antd/es/table/interface";

const ManagerSize = () => {
  const [loading, setLoading] = useState(false);
  const [sizes, setSizes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [editingSize, setEditingSize] = useState(null);
  const [pagination, setPagination] = useState<PaginationState>({
    current: 1,
    pageSize: 5,
    total: 20,
    totalPage: 4,
  });

  const [filterName, setFilterName] = useState("");

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const [selectedSize, setSelectedSize] = useState(null);

  const mode = editingSize ? "update" : "add";

  const fetchSizes = async (
    current: number,
    pageSize: number,
    filterName: string = ""
  ) => {
    try {
      const response = await fetchAllSizes(filterName, pageSize, current - 1);
      setSizes(response.data);
      setPagination({
        current: response.metaData.page + 1,
        pageSize: response.metaData.size,
        total: response.metaData.total,
        totalPage: response.metaData.totalPage,
      });
    } catch (error) {
      console.error("Error fetching sizes:", error);
    } finally {
      setLoading(false);
    }
  };

  const showModal = async (size = null) => {
    if (size) {
      try {
        const sizeDetails = await getSizeById(size.id);
        form.setFieldsValue(sizeDetails);
        setEditingSize(sizeDetails);
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Failed to fetch size details"
        );
      }
    } else {
      form.resetFields();
      setEditingSize(null);
    }
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const { name } = values;
      const token = Cookies.get("accessToken");

      if (token) {
        if (mode === "add") {
          await createSize({ name }, token);
          toast.success("Size added successfully");
        } else if (mode === "update" && editingSize) {
          await updateSize(editingSize.id, { name }, token);
          toast.success("Size updated successfully");
        }
        handleCancel();
        fetchSizes(pagination.current, pagination.pageSize, filterName);
      } else {
        toast.error("Authorization failed");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save size");
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedSize(null);
    setIsDetailModalOpen(false);
  };

  const handleDelete = async (sizeId: number) => {
    try {
      const token = Cookies.get("accessToken");
      if (token) {
        await deleteSize(sizeId, token);
        toast.success("Size deleted successfully");
        fetchSizes(pagination.current, pagination.pageSize, filterName);
      } else {
        toast.error("Authorization failed");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete size");
    }
  };

  const handleTableChange = (pagination, filters) => {
    setPagination({
      ...pagination,
      current: pagination.current,
    });
    const nameFilter = filters.name || "";
    setFilterName(nameFilter);

    fetchSizes(pagination.current, pagination.pageSize, nameFilter);
  };

  const showDetailModal = async (size) => {
    const sizeDetails = await getSizeById(size.id);
    setSelectedSize(sizeDetails);
    setIsDetailModalOpen(true); // Open detail modal
  };

  const handleSearch = (
    selectedKeys: string[],
    confirm: FilterDropdownProps["confirm"]
  ) => {
    setFilterName(selectedKeys[0] || "");
    fetchSizes(pagination.current, pagination.pageSize, filterName);
    confirm();
  };

  const handleSearchReset = (clearFilters: () => void) => {
    clearFilters();
    setFilterName("");
    fetchSizes(pagination.current, pagination.pageSize, filterName);
  };

  useEffect(() => {
    fetchSizes(pagination.current, pagination.pageSize, filterName);
  }, [pagination.current, pagination.pageSize, filterName]);

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Size Name",
      dataIndex: "name",
      key: "name",
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Search size name"
            value={selectedKeys[0]}
            onChange={(e) => {
              const value = e.target.value;
              setSelectedKeys(value ? [value] : []);
            }}
            onPressEnter={() =>
              handleSearch(selectedKeys, confirm({ closeDropdown: true }))
            }
            style={{ marginBottom: 8, display: "block" }}
          />
          <Space>
            <Button
              type="primary"
              onClick={() => {
                handleSearch(selectedKeys, confirm);
                confirm({ closeDropdown: true });
              }}
              icon={<SearchOutlined />}
              size="small"
              style={{ width: 90 }}
            >
              Search
            </Button>
            <Button
              onClick={() => {
                handleSearchReset(clearFilters);
              }}
              size="small"
              style={{ width: 90 }}
            >
              Reset
            </Button>
          </Space>
        </div>
      ),
      filterIcon: (filtered: boolean) => (
        <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
      ),
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Updated At",
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (date) =>
        date ? new Date(date).toLocaleDateString() : "No updated available",
    },
    {
      title: "Created By",
      dataIndex: "createdBy",
      key: "createdBy",
      render: (createdBy) => (
        <div>
          <img
            src={createdBy.avatar}
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              marginRight: 20,
            }}
          />
          {createdBy.fullName}
        </div>
      ),
    },
    {
      title: "Updated By",
      dataIndex: "updatedBy",
      key: "updatedBy",
      render: (updatedBy) =>
        updatedBy ? (
          <div>
            <img
              src={updatedBy.avatar}
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                marginRight: 10,
              }}
            />
            {updatedBy.fullName}
          </div>
        ) : (
          "No updated available"
        ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div>
          <Tooltip title="Chỉnh sửa">
            <Button
              onClick={() => showModal(record)}
              style={{ marginRight: 8 }}
            >
              <EditFilled />
            </Button>
          </Tooltip>

          <Tooltip title="Chi tiết">
            <Button
              className="btn-outline-info"
              onClick={() => showDetailModal(record)}
              style={{ marginRight: 8 }}
            >
              <BookFilled />
            </Button>
          </Tooltip>

          <Popconfirm
            title="Are you sure you want to delete this size?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Tooltip title="Xóa size">
              <Button className="btn-outline-danger">
                <DeleteFilled />
              </Button>
            </Tooltip>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div
      className="text-center"
      style={{ height: "200vh", marginLeft: 20, marginRight: 20 }}
    >
      <h1 className="text-danger">Manager Size</h1>

      <Tooltip title="Thêm mới">
        <Button
          className="mt-3 mb-3"
          style={{ display: "flex", backgroundColor: "black", color: "white" }}
          type="default"
          onClick={() => showModal(null)}
        >
          <PlusSquareFilled />
        </Button>
      </Tooltip>
      <Modal
        title={mode === "add" ? "Add Size" : "Update Size"}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Size Name"
            rules={[{ required: true, message: "Please input the size name!" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        open={isDetailModalOpen}
        onOk={handleCancel}
        onCancel={handleCancel}
      >
        {selectedSize && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <h3 className=" d-flex text-center mt-2 mb-4">Size Details</h3>

            <div className="d-flex text-center mt-2 mb-4">
              <div>
                <h2>{selectedSize.name}</h2>
              </div>
            </div>

            <div
              style={{
                width: "100%",
                padding: "10px",
                background: "#f9f9f9",
                borderRadius: "8px",
              }}
            >
              <p>
                <b>Created At:</b>{" "}
                {new Date(selectedSize.createdAt).toLocaleDateString()}
              </p>
              <p>
                <b>Updated At:</b>{" "}
                {selectedSize.updatedAt
                  ? new Date(selectedSize.updatedAt).toLocaleDateString()
                  : "No updated available"}
              </p>
              <b>Created By:</b>
              <br />
              <p className="mt-3 mx-5">
                <img
                  src={selectedSize.createdBy.avatar}
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: "50%",
                    marginRight: 10,
                  }}
                />
                {selectedSize.createdBy.fullName}
              </p>
              <b>Updated By:</b>
              <br />
              <p>
                {selectedSize.updatedBy ? (
                  <p className="mt-3 mx-5">
                    <img
                      src={selectedSize.updatedBy.avatar}
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: "50%",
                        marginRight: 10,
                      }}
                    />
                    {selectedSize.updatedBy.fullName}
                  </p>
                ) : (
                  "No updated available"
                )}
              </p>
            </div>
          </div>
        )}
      </Modal>

      <Table
        dataSource={sizes}
        columns={columns}
        loading={loading}
        rowKey="id"
        pagination={createPaginationConfig(pagination, setPagination)}
        onChange={handleTableChange}
      />
    </div>
  );
};

export default ManagerSize;
