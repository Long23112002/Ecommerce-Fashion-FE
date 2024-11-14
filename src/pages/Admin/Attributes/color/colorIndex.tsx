import { Button, Form, Input, Modal, Popconfirm, Table, Tooltip } from "antd";
import Cookies from "js-cookie";
import { debounce } from "lodash";
import { Fragment, useEffect, useState } from "react";
import { toast } from "react-toastify";
import LoadingCustom from "../../../../components/Loading/LoadingCustom.js";
import createPaginationConfig, {
  PaginationState,
} from "../../../../config/paginationConfig.ts";
import { getErrorMessage } from "../../../Error/getErrorMessage.ts";
import {
  createColor,
  deleteColor,
  fetchAllColors,
  getColorById,
  updateColor,
} from "./colorManagament.ts";
import { SketchPicker } from "react-color";

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

  const [colorCode, setColorCode] = useState("#000000");

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
        setColorCode(colorDetails.code || "#000000");
      } catch (error) {
        toast.error(getErrorMessage(error));
      }
    } else {
      form.resetFields();
      setEditingColor(null);
      setColorCode("#000000");
    }
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();

      const trimmedValues = {
        ...values,
        name: values.name.trim(),
        code: colorCode,
      };

      const token = Cookies.get("accessToken");

      if (token) {
        if (mode === "add") {
          await createColor(trimmedValues, token);
          toast.success("Thêm màu thành công");
        } else if (mode === "update" && editingColor) {
          await updateColor(editingColor.id, trimmedValues, token);
          toast.success("Cập nhật màu thành công");
        }
        handleCancel();
        fetchColors(pagination.current, pagination.pageSize, filterName);
      } else {
        toast.error("Lỗi xác thực");
      }
    } catch (error) {
      toast.error(getErrorMessage(error));
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
        toast.success("Xóa màu thành công");
        fetchColors(pagination.current, pagination.pageSize, filterName);
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

    fetchColors(pagination.current, pagination.pageSize, nameFilter);
  };

  const showDetailModal = async (color) => {
    const colorDetails = await getColorById(color.id);
    setSelectedColor(colorDetails);
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
    fetchColors(pagination.current, pagination.pageSize, filterName);
  }, [pagination.current, pagination.pageSize, filterName]);

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Tên màu",
      dataIndex: "name",
      key: "name",
      render: (name, record) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            style={{
              width: "20px",
              height: "20px",
              backgroundColor: record.code,
              border: "1px solid #ddd",
              borderRadius: "4px",
              marginRight: "8px",
            }}
          />
          <span>{name}</span>
        </div>
      ),
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
              marginRight: 10,
            }}
          />
          {createdBy.fullName}
        </div>
      ),
    },
    // {
    //   title: "Ngày cập nhật",
    //   dataIndex: "updatedAt",
    //   key: "updatedAt",
    //   render: (date) => (date ? new Date(date).toLocaleDateString() : "N/A"),
    // },
    // {
    //   title: "Người cập nhật",
    //   dataIndex: "updatedBy",
    //   key: "updatedBy",
    //   render: (updatedBy) =>
    //     updatedBy ? (
    //       <div>
    //         <img
    //           src={updatedBy.avatar}
    //           style={{
    //             width: 40,
    //             height: 40,
    //             borderRadius: "50%",
    //             marginRight: 10,
    //           }}
    //         />
    //         {updatedBy.fullName}
    //       </div>
    //     ) : (
    //       "N/A"
    //     ),
    // },
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
            title="Xác nhận xóa màu?"
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Tooltip title="Xóa màu" placement="bottom">
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
    <Fragment>
      <div className="text-center" style={{ marginLeft: 20, marginRight: 20 }}>
        <h1 className="text-danger">Quản lý màu sắc</h1>
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
            placeholder="Nhập tên màu..."
            onChange={(e) => handleSearch(e)}
            className="form-control"
            style={{ width: 300 }}
          />
        </div>

        <Modal
          title={mode === "add" ? "Thêm màu" : "Cập nhật màu"}
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
          cancelText={"Hủy"}
          okText={"Lưu"}
        >
          <Form form={form} layout="vertical">
            <Form.Item
              name="name"
              label="Tên màu"
              rules={[{ required: true, message: "Vui lòng nhập tên màu!" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item label="Mã màu" name="code">
              <Input value={colorCode} name="code" readOnly />
              <br />
              <br />
              <div style={{ display: "flex", justifyContent: "center" }}>
                <SketchPicker
                  color={colorCode}
                  onChange={(color) => setColorCode(color.hex)}
                />
              </div>
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
          {selectedColor && (
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
                Chi tiết màu sắc
              </h3>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  textAlign: "center",
                  marginBottom: "20px",
                  fontSize: "24px",
                  fontWeight: "bold",
                  color: selectedColor.code,
                }}
              >
                {/* <div
                  style={{
                    width: "24px",
                    height: "24px",
                    backgroundColor: selectedColor.code,
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    marginRight: "10px",
                  }}
                /> */}
                {selectedColor.name}
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
                    value={new Date(
                      selectedColor.createdAt
                    ).toLocaleDateString()}
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
                      src={selectedColor.createdBy.avatar}
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
                      {selectedColor.createdBy.fullName}
                    </span>
                  </div>
                </div>

                {selectedColor.updatedAt && (
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
                        selectedColor.updatedAt
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

                {selectedColor.updatedBy && (
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
                        src={selectedColor.updatedBy.avatar}
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
                        {selectedColor.updatedBy.fullName}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </Modal>

        <Table
          dataSource={colors}
          columns={columns}
          loading={{
            spinning: loading,
            indicator: <LoadingCustom />,
          }}
          rowKey="id"
          pagination={createPaginationConfig(pagination, setPagination) ?? ""}
          onChange={handleTableChange}
        />
      </div>
    </Fragment>
  );
};

export default ManagerColor;
