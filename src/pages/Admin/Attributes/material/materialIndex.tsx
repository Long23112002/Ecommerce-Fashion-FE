import React, { Fragment, useEffect, useState } from "react";
import {
  createMaterial,
  deleteMaterial,
  fetchAllMaterials,
  getMaterialById,
  updateMaterial,
} from "./materialManagament.ts";
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
import { toast, ToastContainer } from "react-toastify";
import Cookies from "js-cookie";
import createPaginationConfig, {
  PaginationState,
} from "../../../../config/paginationConfig.ts";
import { debounce } from "lodash";
import { getErrorMessage } from "../../../Error/getErrorMessage.ts";

const ManagerMaterial = () => {
  const [loading, setLoading] = useState(false);
  const [materials, setMaterials] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [editingMaterial, setEditingMaterial] = useState(null);
  const [pagination, setPagination] = useState<PaginationState>({
    current: 1,
    pageSize: 5,
    total: 20,
    totalPage: 4,
  });

  const [filterName, setFilterName] = useState("");

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const [selectedMaterial, setSelectedMaterial] = useState(null);

  const mode = editingMaterial ? "update" : "add";

  const fetchMaterials = async (
    current: number,
    pageSize: number,
    filterName: string = ""
  ) => {
    try {
      const response = await fetchAllMaterials(
        filterName,
        pageSize,
        current - 1
      );
      const materialData = response.data || [];
      setMaterials(materialData);
      setPagination({
        current: response.metaData.page + 1,
        pageSize: response.metaData.size,
        total: response.metaData.total,
        totalPage: response.metaData.totalPage,
      });
    } catch (error) {
      console.error("Error fetching materials:", error);
    } finally {
      setLoading(false);
    }
  };

  const showModal = async (material = null) => {
    if (material) {
      try {
        const materialDetails = await getMaterialById(material.id);
        form.setFieldsValue(materialDetails);
        setEditingMaterial(materialDetails);
      } catch (error) {
        toast.error(getErrorMessage(error));
      }
    } else {
      form.resetFields();
      setEditingMaterial(null);
    }
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();

      const trimmedValues = {
        ...values,
        name: values.name.trim(),
      };

      const { name } = trimmedValues;
      const token = Cookies.get("accessToken");

      if (token) {
        if (mode === "add") {
          await createMaterial({ name }, token);
          toast.success("Thêm mới chất liệu thành công");
        } else if (mode === "update" && editingMaterial) {
          await updateMaterial(editingMaterial.id, { name }, token);
          toast.success("Cập nhật chất liệu thành công");
        }
        handleCancel();
        fetchMaterials(pagination.current, pagination.pageSize, filterName);
      } else {
        toast.error("Lỗi xác thực");
      }
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedMaterial(null);
    setIsDetailModalOpen(false);
  };

  const handleDelete = async (materialId: number) => {
    try {
      const token = Cookies.get("accessToken");
      if (token) {
        await deleteMaterial(materialId, token);
        toast.success("Xóa chất liệu thành công");
        fetchMaterials(pagination.current, pagination.pageSize, filterName);
      } else {
        toast.error("Lỗi xác thực");
      }
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleTableChange = (pagination, filters) => {
    setPagination({
      ...pagination,
      current: pagination.current,
    });
    const nameFilter = filters.name || "";
    setFilterName(nameFilter);

    fetchMaterials(pagination.current, pagination.pageSize, nameFilter);
  };

  const showDetailModal = async (material) => {
    const materialDetails = await getMaterialById(material.id);
    setSelectedMaterial(materialDetails);
    setIsDetailModalOpen(true);
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

  const handleSearch = async (e) => {
    const search = e.target.value.trim();
    setLoading(true);
    debouncedSearch(search);
    return () => {
      debouncedSearch.cancel();
    };
  };

  useEffect(() => {
    fetchMaterials(pagination.current, pagination.pageSize, filterName);
  }, [pagination.current, pagination.pageSize, filterName]);

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Tên chất liệu",
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
        date ? new Date(date).toLocaleDateString() : "N/A",
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
          "N/A"
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
            title="Xác nhận xóa chất liệu?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Tooltip title="Xóa chất liệu">
              <Button className="btn-outline-danger">
              <i className="fa-solid fa-trash-can"></i>
              </Button>
            </Tooltip>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return <Fragment>
    <div className="text-center" style={{ marginLeft: 20, marginRight: 20 }}>
      <h1 className="text-danger">Quản lý chất liệu</h1>

      <Tooltip title="Thêm mới">
        <Button
          className="mt-3 mb-3"
          style={{ display: "flex", backgroundColor: "black", color: "white" }}
          type="default"
          onClick={() => showModal(null)}
        >
           <i className="fa-solid fa-circle-plus"></i>
        </Button>
      </Tooltip>

      <div className="mb-5 d-flex justify-content-end">
        <Input
          placeholder="Nhập tên chất liệu..."
          onChange={(e) => handleSearch(e)}
          className="form-control"
          style={{ width: 300 }}
        />
      </div>

      <Modal
        title={mode === "add" ? "Thêm chất liệu" : "Cập nhật chất liệu"}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Tên chất liệu"
            rules={[
              { required: true, message: "Vui lòng nhập tên chất liệu!" },
            ]}
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
        {selectedMaterial && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "20px",
            }}
          >

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
              Chi tiết chất liệu
            </h3>

            <div
              style={{
                textAlign: "center",
                marginBottom: "20px",
                fontSize: "24px",
                fontWeight: "bold",
                color: "#D2B48C",
              }}
            >
              {selectedMaterial.name}
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
                  value={new Date(selectedMaterial.createdAt).toLocaleDateString()}
                  readOnly
                  style={{
                    backgroundColor: "#f9f9f9",
                    cursor: "default",
                    border: "1px solid #ddd",
                  }}
                />
              </div>

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
                    src={selectedMaterial.createdBy.avatar}
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
                    {selectedMaterial.createdBy.fullName}
                  </span>
                </div>
              </div>

              {selectedMaterial.updatedAt && (
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
                    value={new Date(
                      selectedMaterial.updatedAt
                    ).toLocaleDateString()}
                    readOnly
                    style={{
                      backgroundColor: "#f9f9f9",
                      cursor: "default",
                      border: "1px solid #ddd",
                    }}
                  />
                </div>
              )}

              {selectedMaterial.updatedBy && (
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
                  <div style={{ padding: "10px" }}>
                    <img
                      src={selectedMaterial.updatedBy.avatar}
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
                      {selectedMaterial.updatedBy.fullName}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>

      <Table
        dataSource={materials}
        columns={columns}
        loading={loading}
        rowKey="id"
        pagination={createPaginationConfig(pagination, setPagination)??''}
        onChange={handleTableChange}
      />
    </div>
    <ToastContainer/>
  </Fragment>
};

export default ManagerMaterial;
