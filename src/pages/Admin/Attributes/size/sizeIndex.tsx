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
import { debounce } from "lodash";

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
    setLoading(true);
    try {
      const response = await fetchAllSizes(filterName, pageSize, current - 1);
      const sizeData = response.data || [];
      setSizes(sizeData);
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
          toast.success("Thêm size thành công");
        } else if (mode === "update" && editingSize) {
          await updateSize(editingSize.id, { name }, token);
          toast.success("Cập nhật size thành công");
        }
        handleCancel();
      } else {
        toast.error("Authorization failed");
      }
    } catch (error) {
      if (error.response?.data?.message?.name != null) {
        toast.error(error.response?.data?.message?.name);
      }
      toast.error(error.response?.data?.message || "Lưu size thất bại");
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
        toast.success("Xóa size thành công");
        
      } else {
        toast.error("Authorization failed");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Xóa size thất bại");
    }
  };

  const handleTableChange = (pagination, filters) => {
    setPagination({
      ...pagination,
      current: pagination.current,
    });
  };

  const showDetailModal = async (size) => {
    const sizeDetails = await getSizeById(size.id);
    setSelectedSize(sizeDetails);
    setIsDetailModalOpen(true); // Open detail modal
  };

  const debouncedSearch = debounce((value) => {
    const search = value.trim();
    if (search) {
      setPagination((prev) => ({
        ...prev,
        current: 1,
      }));
    }
    setFilterName(search);
  }, 1000);

  const handleSearch = (e) => {
    const search = e.target.value.trim();
    setLoading(true);
    debouncedSearch(search);
  };

  useEffect(() => {
    fetchSizes(pagination.current, pagination.pageSize, filterName)
    console.log(filterName);
  }, [pagination.current, pagination.pageSize, filterName]);

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Tên size",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Người tạo",
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
      title: "Ngày cập nhật",
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (date) =>
        date ? new Date(date).toLocaleDateString() : "Chưa cập nhật",
    },

    {
      title: "Người cập nhật",
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
          "Chưa cập nhật"
        ),
    },
    {
      title: "Thao tác",
      key: "actions",
      render: (_, record) => (
        <div>
          <Tooltip title="Chi tiết">
            <Button
              className="btn-outline-info"
              onClick={() => showDetailModal(record)}
              style={{ marginRight: 8 }}
            >
              <i className="fa-solid fa-eye"></i>
            </Button>
          </Tooltip>

          <Tooltip title="Chỉnh sửa">
            <Button
              className="btn-outline-warning"
              onClick={() => showModal(record)}
              style={{ marginRight: 8 }}
            >
              <i className="fa-solid fa-pen-to-square"></i>
            </Button>
          </Tooltip>

          <Popconfirm
            title="Xác nhận xóa size này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Tooltip title="Xóa size">
              <Button className="btn-outline-danger">
                <i className="fa-solid fa-trash-can"></i>
              </Button>
            </Tooltip>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="text-center" style={{ marginLeft: 20, marginRight: 20 }}>
      <h1 className="text-danger">Quản lý size</h1>

      <Tooltip title="Thêm mới">
        <Button
          className="mt-3 mb-3"
          style={{
            display: "flex",
            backgroundColor: "black",
            color: "white",
          }}
          type="default"
          onClick={() => showModal(null)}
        >
          <i className="fa-solid fa-circle-plus"></i>
        </Button>
      </Tooltip>

      <div className="mb-5 d-flex justify-content-end">
        <Input
          placeholder="Nhập tên size..."
          onChange={(e) => handleSearch(e)}
          className="form-control"
          style={{ width: 300 }}
        />
      </div>

      <Modal
        title={mode === "add" ? "Thêm size" : "Cập nhật size"}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Tên size"
            rules={[{ required: true, message: "Vui lòng nhập tên size!" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        open={isDetailModalOpen}
        onOk={handleCancel}
        onCancel={handleCancel}
        centered
        footer={null}
      >
        {selectedSize && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "20px",
            }}
          >
            {/* Header */}
            <h3
              style={{
                fontWeight: "bold",
                color: "#333",
                textAlign: "center",
                marginBottom: "20px",
                borderBottom: "1px solid #ddd",
                paddingBottom: "10px",
                width: "100%",
              }}
            >
              Chi tiết size
            </h3>

            {/* Size Name */}
            <div
              style={{
                textAlign: "center",
                marginBottom: "20px",
                fontSize: "24px",
                fontWeight: "bold",
                color: "#D2B48C",
              }}
            >
              {selectedSize.name}
            </div>

            <div
              style={{
                width: "100%",
                padding: "15px",
                borderRadius: "10px",
                display: "flex",
                flexDirection: "column",
                gap: "15px",
              }}
            >
              {/* Created At */}
              <div>
                <label
                  style={{
                    color: "#555",
                    fontWeight: "bold",
                    marginBottom: "5px",
                  }}
                >
                  Ngày tạo:
                </label>
                <input
                  className="form-control"
                  type="text"
                  value={new Date(selectedSize.createdAt).toLocaleDateString()}
                  readOnly
                  style={{
                    backgroundColor: "#f9f9f9",
                    cursor: "default",
                    border: "1px solid #ddd",
                  }}
                />
              </div>

              {/* Created By */}
              <div>
                <label
                  style={{
                    color: "#555",
                    fontWeight: "bold",
                    marginBottom: "5px",
                  }}
                >
                  Người tạo:
                </label>
                <div style={{ padding: "10px" }}>
                  <img
                    src={selectedSize.createdBy.avatar}
                    alt="createdBy-avatar"
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: "50%",
                      marginRight: 15,
                      border: "2px solid #ddd",
                    }}
                  />
                  <span
                    style={{
                      fontWeight: "bold",
                      fontSize: "16px",
                      color: "#333",
                    }}
                  >
                    {selectedSize.createdBy.fullName}
                  </span>
                </div>
              </div>

              {/* Updated At */}
              <div>
                <label
                  style={{
                    color: "#555",
                    fontWeight: "bold",
                    marginBottom: "5px",
                  }}
                >
                  Ngày cập nhật:
                </label>
                <input
                  className="form-control"
                  type="text"
                  value={
                    selectedSize.updatedAt
                      ? new Date(selectedSize.updatedAt).toLocaleDateString()
                      : "Chưa cập nhật"
                  }
                  readOnly
                  style={{
                    backgroundColor: "#f9f9f9",
                    cursor: "default",
                    border: "1px solid #ddd",
                  }}
                />
              </div>

              {/* Updated By */}
              <div>
                <label
                  style={{
                    color: "#555",
                    fontWeight: "bold",
                    marginBottom: "5px",
                  }}
                >
                  Người cập nhật:
                </label>
                {selectedSize.updatedBy ? (
                  <div style={{ padding: "10px" }}>
                    <img
                      src={selectedSize.updatedBy.avatar}
                      alt="updatedBy-avatar"
                      style={{
                        width: 50,
                        height: 50,
                        borderRadius: "50%",
                        marginRight: 15,
                        border: "2px solid #ddd",
                      }}
                    />
                    <span
                      style={{
                        fontWeight: "bold",
                        fontSize: "16px",
                        color: "#333",
                      }}
                    >
                      {selectedSize.updatedBy.fullName}
                    </span>
                  </div>
                ) : (
                  <input
                    className="form-control"
                    type="text"
                    value="Chưa cập nhật"
                    readOnly
                    style={{
                      backgroundColor: "#f9f9f9",
                      cursor: "default",
                      border: "1px solid #ddd",
                    }}
                  />
                )}
              </div>
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
