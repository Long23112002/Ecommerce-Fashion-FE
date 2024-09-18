import React, { useEffect, useState } from "react";
import {
  createColor,
  deleteColor,
  fetchAllColors,
  getColorById,
  updateColor,
} from "./colorManagament.ts";
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
import { getColorCode } from "./mapColor.ts";
import {
  PlusSquareFilled,
  EditFilled,
  DeleteFilled,
  EyeFilled,
} from "@ant-design/icons";

import type { FilterDropdownProps } from "antd/es/table/interface";

const ManagerColor = () => {
  const [loading, setLoading] = useState(false);

  const [colors, setColors] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [editingColor, setEditingColor] = useState(null);
  const [pagination, setPagination] = useState<PaginationState>({
    current: 1,
    pageSize: 5,
    total: 20,
    totalPage: 4,
  });

  const [filterName, setFilterName] = useState("");

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const [selectedColor, setSelectedColor] = useState(null);

  const mode = editingColor ? "update" : "add";

  const fetchColors = async (
    current: number,
    pageSize: number,
    filterName: string = ""
  ) => {

    setLoading(true);

    try {
      const response = await fetchAllColors(filterName, pageSize, current - 1);
      setColors(response.data);
      setPagination({
        current: response.metaData.page + 1,
        pageSize: response.metaData.size,
        total: response.metaData.total,
        totalPage: response.metaData.totalPage,
      });
    } catch (error) {
      console.error("Error fetching colors:", error);
    } finally {
      setLoading(false);
    }
  };

  const showModal = async (color = null) => {
    if (color) {
      try {
        const colorDetails = await getColorById(color.id);
        form.setFieldsValue(colorDetails);
        setEditingColor(colorDetails);
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Failed to fetch color details"
        );
      }
    } else {
      form.resetFields();
      setEditingColor(null);
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
          await createColor({ name }, token);
          toast.success("Color added successfully");
        } else if (mode === "update" && editingColor) {
          await updateColor(editingColor.id, { name }, token);
          toast.success("Color updated successfully");
        }
        handleCancel();
        fetchColors(pagination.current, pagination.pageSize, filterName);
      } else {
        toast.error("Authorization failed");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save color");
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedColor(null);
    setIsDetailModalOpen(false);
  };

  const handleDelete = async (colorId: number) => {
    try {
      const token = Cookies.get("accessToken");
      if (token) {
        await deleteColor(colorId, token);
        toast.success("Color deleted successfully");
        fetchColors(pagination.current, pagination.pageSize, filterName);
      } else {
        toast.error("Authorization failed");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete color");
    }
  };

  const handleTableChange = (pagination, filters) => {
    setPagination({
      ...pagination,
      current: pagination.current,
    });
    const nameFilter = filters.name || "";
    setFilterName(nameFilter);

    fetchColors(pagination.current, pagination.pageSize, nameFilter);
  };

  const showDetailModal = async (color) => {
    const colorDetails = await getColorById(color.id);
    setSelectedColor(colorDetails);
    setIsDetailModalOpen(true); // Open detail modal
  };


  const handleSearch = (
    selectedKeys: string[],
    confirm: FilterDropdownProps["confirm"]
  ) => {
    setFilterName(selectedKeys[0] || "");
    fetchColors(1, pagination.pageSize, filterName);
    confirm();
  };

  const handleSearchReset = (clearFilters: () => void) => {
    clearFilters();
    setFilterName("");
    fetchColors(pagination.current, pagination.pageSize, filterName);
  };


  useEffect(() => {
    fetchColors(pagination.current, pagination.pageSize, filterName);
  }, [pagination.current, pagination.pageSize, filterName]);

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Color Name",
      dataIndex: "name",
      key: "name",
      render: (text, record) => {
        const colorName = text; // Tên màu từ dữ liệu
        const colorCode = getColorCode(colorName); // Tìm mã màu tương ứng với tên màu hoặc từ khóa

        return (
          <div style={{ display: "flex", alignItems: "center" }}>
            <div
              style={{
                height: 20,
                width: 20,
                backgroundColor: colorCode, // Sử dụng mã màu từ ánh xạ
                marginRight: 10,
                borderRadius: 4,
                border: "0.1px solid gray",
              }}
            />
            {colorName}
          </div>
        );
      },
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Search color name"
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
                confirm({ closeDropdown: false});
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
              marginRight: 10,
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
              className="btn-outline-warning"
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
              <EyeFilled />
            </Button>
          </Tooltip>
          <Popconfirm
            title="Are you sure you want to delete this color?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Tooltip title="Xóa màu">
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
      style={{marginLeft: 20, marginRight: 20 }}
    >
      <h1 className="text-danger">Manager Color</h1>
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
        title={mode === "add" ? "Add Color" : "Update Color"}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Color Name"
            rules={[
              { required: true, message: "Please input the color name!" },
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
      >
        {selectedColor && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <h3 className=" d-flex text-center mt-2 mb-4">Color Details</h3>

            <div className="d-flex text-center mt-2 mb-4">
              <div
                style={{
                  height: "50px",
                  width: "50px",
                  backgroundColor: getColorCode(selectedColor.name),
                  borderRadius: "10%",
                  border: "0.1px solid #ccc",
                  marginRight: "20px",
                }}
              />
              <div>
                <h2>{selectedColor.name}</h2>
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
                {new Date(selectedColor.createdAt).toLocaleDateString()}
              </p>
              <p>
                <b>Updated At:</b>{" "}
                {selectedColor.updatedAt
                  ? new Date(selectedColor.updatedAt).toLocaleDateString()
                  : "No updated available"}
              </p>

              <b>Created By:</b>
              <br />

              <p className="mt-3 mx-5">
                <img
                  src={selectedColor.createdBy.avatar}
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: "50%",
                    marginRight: 10,
                  }}
                />
                {selectedColor.createdBy.fullName}
              </p>

              <b>Updated By:</b>
              <br />
              <p>
                {selectedColor.updatedBy ? (
                  <p className="mt-3 mx-5">

                    <img
                      src={selectedColor.updatedBy.avatar}
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: "50%",
                        marginRight: 10,
                      }}
                    />
                    {selectedColor.updatedBy.fullName}
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
        dataSource={colors}
        columns={columns}
        loading={loading}
        rowKey="id"
        pagination={createPaginationConfig(pagination, setPagination)}
        onChange={handleTableChange}
      />
    </div>
  );
};

export default ManagerColor;
