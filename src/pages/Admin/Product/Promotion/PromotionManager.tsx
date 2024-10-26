import { useEffect, useState } from "react";
import {
  Button,
  DatePicker,
  Form,
  Input,
  Popconfirm,
  Select,
  Table,
  Tag,
  Tooltip,
} from "antd";
import { Container } from "@mui/material";
import { toast } from "react-toastify";
import {
  getAllPromotions,
  createPromotion,
  updatePromotion,
  deletePromotion,
  getPromotionById,
} from "../../../../api/PromotionApi.ts";
import {
  StatusPromotionEnum,
  StatusPromotionLable,
} from "../../../../enum/StatusPromotionEnum.ts";
import {
  TypePromotionEnum,
  TypePromotionLabel,
} from "../../../../enum/TypePromotionEnum.ts";
import PromotionModal from "../../../../components/Promotion/PromotionModal.tsx";
import PromotionDetailModal from "../../../../components/Promotion/PromotionDetailModal.tsx";
import LoadingCustom from "../../../../components/Loading/LoadingCustom.tsx";
import createPaginationConfig, {
  PaginationState,
} from "../../../../config/paginationConfig.ts";
import {
  Promotion,
  PromotionRequest,
} from "../../../../types/Promotion.ts";
import { getErrorMessage } from "../../../Error/getErrorMessage.ts";
import moment from "moment";
import Cookies from "js-cookie";
import dayjs from 'dayjs';

const ManagerPromotion = () => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [pagination, setPagination] = useState<PaginationState>({
    current: 1,
    pageSize: 5,
    total: 20,
    totalPage: 4,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPromotion, setCurrentPromotion] =
    useState<PromotionRequest | null>(null);
  const [filterParams, setFilterParams] = useState({
    page: 0,
    size: 5,
    startDate: "",
    endDate: "",
    typePromotionEnum: "",
    statusPromotionEnum: "",
  });

  const [form] = Form.useForm();
  const [editingPromotion, setEditingPromotion] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const mode = editingPromotion ? "update" : "add";

  const fetchPromotions = async (params = filterParams) => {
    setLoading(true);
    try {
      const response = await getAllPromotions({
        ...params,
        page: params.page - 1,
      });
      setPromotions(response.data);
      setPagination({
        current: response.metaData.page + 1,
        pageSize: response.metaData.size,
        total: response.metaData.total,
        totalPage: response.metaData.totalPage,
      });
    } catch (error) {
      toast.error("Lỗi khi tải danh sách khuyến mãi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromotions();
  }, [filterParams]);

  const handleTableChange = (newPagination: any) => {
    setFilterParams((prevParams) => ({
      ...prevParams,
      page: newPagination.current,
      size: newPagination.pageSize,
    }));
  };

  const formatDateToString = (date: moment.Moment): string => {
    return date.format("YYYY-MM-DD");
  };

  const handleFilterChange = (changedValues: any) => {
    if (changedValues.startDate) {
      changedValues.startDate = formatDateToString(changedValues.startDate);
    }
    if (changedValues.endDate) {
      changedValues.endDate = formatDateToString(changedValues.endDate);
    }
    setFilterParams((prevParams) => ({
      ...prevParams,
      ...changedValues,
      page: 1,
    }));
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();

      const dataToSubmit = {
        ...values,
        startDate: new Date(values.startDate).getTime(),
        endDate: new Date(values.endDate).getTime(),
      };

      const token = Cookies.get("accessToken");

      if (token) {
        if (mode === "add") {
          await createPromotion(dataToSubmit, token);
          toast.success("Thêm mới đợt giảm giá thành công");
        } else if (mode === "update" && editingPromotion) {
          await updatePromotion(editingPromotion.id, dataToSubmit, token);
          toast.success("Cập nhật đợt giảm giá thành công");
        }
        handleCancel();
        fetchPromotions();
      } else {
        toast.error("Lỗi xác thực");
      }
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    // setSelectedPro(null);
    // setIsDetailModalOpen(false);
  };

  const handleDelete = async (id: number) => {
    try {
      const token = Cookies.get("accessToken");
      if (token) {
        await deletePromotion(id, token);
        fetchPromotions();
        toast.success("Xóa khuyến mãi thành công.");
      } else {
        toast.error("Lỗi xác thực.");
      }
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const showModal = async (record: PromotionRequest | null) => {
    if (record) {
        const formattedPromotion = {
          ...record,
          startDate: dayjs(record.startDate),
          endDate: dayjs(record.endDate),
        };
    
        setCurrentPromotion(formattedPromotion);
        setEditingPromotion(formattedPromotion);
      } else {
        setCurrentPromotion(null);
      }
    setIsModalOpen(true);
  };

  const showDetail = (record: PromotionRequest) => {
    if (record) {
        const formattedPromotion = {
          ...record,
          startDate: dayjs(record.startDate),
          endDate: dayjs(record.endDate),
        };
    
        setCurrentPromotion(formattedPromotion);
      } else {
        setCurrentPromotion(null);
      }
    setIsDetailModalOpen(true);
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "startDate",
      key: "startDate",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "endDate",
      key: "endDate",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Kiểu khuyến mãi",
      dataIndex: "typePromotionEnum",
      key: "typePromotionEnum",
      render: (type: TypePromotionEnum) => TypePromotionLabel[type],
    },
    {
      title: "Giá trị",
      dataIndex: "value",
      key: "value",
    },
    {
      title: "Trạng thái",
      dataIndex: "statusPromotionEnum",
      key: "statusPromotionEnum",
      render: (status: StatusPromotionEnum) => {
        let color = 'default'; // Mặc định
  
        switch (status) {
          case StatusPromotionEnum.ACTIVE:
            color = 'green';
            break;
          case StatusPromotionEnum.ENDED:
            color = 'red';
            break;
          case StatusPromotionEnum.UPCOMING:
            color = 'gold';
            break;
          default:
            color = 'grey';
        }
  
        return (
          <Tag color={color}>
            {StatusPromotionLable[status]}
          </Tag>
        );
      },
    },
    {
      title: "Thao tác",
      key: "actions",
      render: (_: any, record: any) => (
        <div>
          <Tooltip title="Chi tiết">
            <Button
              className="btn-outline-info"
              onClick={() => showDetail(record)}
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
            title="Bạn có chắc chắn muốn xóa khuyến mãi này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Có"
            cancelText="Không"
          >
            <Tooltip title="Xóa" placement="bottom">
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
    <Container maxWidth="xl">
      <h1 className="text-danger text-center">Quản lý đợt giảm giá</h1>
      <Button
        className="mt-3 mb-3"
        style={{ display: "flex", backgroundColor: "black", color: "white" }}
        type="default"
        onClick={() => showModal(null)}
      >
        <i className="fa-solid fa-circle-plus"></i>
      </Button>
      <Form
        layout="inline"
        onValuesChange={handleFilterChange}
        style={{ display: "flex", justifyContent: "flex-end" }}
        className="mt-3 mb-3"
      >
        <Form.Item name="startDate">
          <DatePicker
            format="YYYY-MM-DD"
            style={{ width: "100%" }}
            placeholder="Chọn ngày bắt đầu"
          />
        </Form.Item>
        <Form.Item name="endDate">
          <DatePicker
            format="YYYY-MM-DD"
            style={{ width: "100%" }}
            placeholder="Chọn ngày kết thúc"
          />
        </Form.Item>
        <Form.Item name="typePromotionEnum">
          <Select placeholder="Chọn kiểu khuyến mãi">
            {Object.entries(TypePromotionEnum).map(([key, value]) => (
              <Select.Option key={value} value={value}>
                {TypePromotionLabel[value]}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="statusPromotionEnum">
          <Select placeholder="Chọn trạng thái">
            {Object.entries(StatusPromotionEnum).map(([key, value]) => (
              <Select.Option key={value} value={value}>
                {StatusPromotionLable[value]}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
      <Table
        dataSource={promotions}
        columns={columns}
        loading={{
          spinning: loading,
          indicator: <LoadingCustom />,
        }}
        rowKey="id"
        pagination={createPaginationConfig(pagination, setPagination)}
        onChange={handleTableChange}
      />
      {isModalOpen && (
        <PromotionModal
          isModalOpen={isModalOpen}
          handleOk={handleModalOk}
          handleCancel={() => {
            setIsModalOpen(false);
            form.resetFields();
          }}
          form={form}
          promotion={currentPromotion ? { ...currentPromotion } : undefined}
          mode={currentPromotion ? "update" : "add"}
        />
      )}

      {isDetailModalOpen && (
        <PromotionDetailModal
          promotion={currentPromotion}
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
        />
      )}
    </Container>
  );
};

export default ManagerPromotion;
