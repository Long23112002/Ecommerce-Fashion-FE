import { Button, Form, Input, Popconfirm, Table, Tag } from 'antd';
import Cookies from "js-cookie";
import { debounce } from "lodash";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { createDiscount, deleteDiscount, fetchAllDiscounts, getDiscountById, updateDiscount } from "../../../api/DiscountApi.ts";
import DiscountDetailModal from "../../../components/Discount/DiscountDetailModal.tsx";
import DiscountModel from "../../../components/Discount/DiscountModel.tsx";
import LoadingCustom from "../../../components/Loading/LoadingCustom.js";
import createPaginationConfig, { PaginationState } from "../../../config/discount/paginationConfig.ts";
import { Discount, StatusDiscount, StatusDiscountLable, TypeDiscount, TypeDiscountLabel } from "../../../types/discount.ts";
import { getErrorMessage } from "../../Error/getErrorMessage.ts";

const ManagerDiscount = () => {
    const [loading, setLoading] = useState(true);
    const [discounts, setDiscounts] = useState<Discount[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [form] = Form.useForm();
    const [editingDiscount, setEditingDiscount] = useState<Discount | null>(null);
    const [detailDiscount, setDetailDiscount] = useState<Discount | null>(null);
    const [pagination, setPagination] = useState<PaginationState>({
        current: 1,
        pageSize: 5,
        total: 20,
        totalPage: 4
    });
    const [searchParams, setSearchParams] = useState<{ name: string }>({ name: '' });

    const mode = editingDiscount ? 'update' : 'add';

    const fetchDiscountsDebounced = useCallback(debounce(async (current: number, pageSize: number, searchName: string) => {
        setLoading(true);
        try {
            const response = await fetchAllDiscounts(pageSize, current - 1, searchName);
            setDiscounts(response.data);
            setPagination({
                current: response.metaData.page + 1,
                pageSize: response.metaData.size,
                total: response.metaData.total,
                totalPage: response.metaData.totalPage
            });
        } catch (error) {
            console.error("Error fetching discounts:", error);
        } finally {
            setLoading(false);
        }
    }, 500), []);

    const fetchDiscounts = (current: number, pageSize: number) => {
        fetchDiscountsDebounced(current, pageSize, searchParams.name);
    };

    const showModal = async (discount: Discount | null = null) => {
        if (discount) {
            try {
                const discountDetails = await getDiscountById(discount.id);
                form.setFieldsValue({
                    name: discountDetails.name,
                    value: discountDetails.value,
                    maxValue: discountDetails.maxValue
                });
                setEditingDiscount(discountDetails);
            } catch (error) {
                toast.error(error.response?.data?.message || 'Failed to fetch discount details');
            }
        } else {
            form.resetFields();
            setEditingDiscount(null);
        }
        setIsModalOpen(true);
    };

    const handleViewDetails = (discount: Discount) => {
        setDetailDiscount(discount);
        setIsDetailModalOpen(true);
    };

    const handleDetailCancel = () => {
        setIsDetailModalOpen(false);
        setDetailDiscount(null);
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            const { name, value, maxValue } = values;
            const token = Cookies.get("accessToken");

            if (token) {
                if (mode === 'add') {
                    await createDiscount({ name, value, maxValue }, token);
                    toast.success('Thêm khuyến mãi Thành Công');
                } else if (mode === 'update' && editingDiscount) {
                    await updateDiscount(editingDiscount.id, { name, value, maxValue }, token);
                    toast.success('Cập nhật Thành Công');
                }
                handleCancel();
                refreshDiscounts();
            } else {
                toast.error("Authorization failed");
            }
        } catch (error) {
            toast.error(getErrorMessage(error))
        }
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const handleDelete = async (discountId: number) => {
        try {
            const token = Cookies.get("accessToken");
            if (token) {
                await deleteDiscount(discountId, token);
                toast.success("Xóa Thành Công");
                refreshDiscounts();
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

    const refreshDiscounts = () => {
        fetchDiscounts(pagination.current, pagination.pageSize);
    };

    useEffect(() => {
        fetchDiscounts(pagination.current, pagination.pageSize);
    }, [pagination.current, pagination.pageSize, searchParams]);

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Tên phiếu',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Giá trị',
            dataIndex: 'value',
            key: 'value',
        },
        {
            title: 'Giá trị Tối đa',
            dataIndex: 'maxValue',
            key: 'maxValue',
        },
        {
            title: 'kiểu phiếu ',
            dataIndex: 'type',
            key: 'type',
            render: (type: TypeDiscount) => TypeDiscountLabel[type],
        },
        {
            title: 'Thời gian bắt đầu',
            dataIndex: 'startDate',
            key: 'startDate',
            render: (date) => new Date(date).toLocaleDateString(),
        },
        {
            title: 'Thời gian kết thúc',
            dataIndex: 'endDate',
            key: 'endDate',
            render: (date) => new Date(date).toLocaleDateString(),
        },
        {
            title: "Trạng thái",
            dataIndex: "discountStatus",
            key: "discountStatus",
            render: (status: StatusDiscount) => {
              let color = "default"; // Mặc định
      
              switch (status) {
                case StatusDiscount.ACTIVE:
                  color = "green";
                  break;
                case StatusDiscount.ENDED:
                  color = "red";
                  break;
                case StatusDiscount.UPCOMING:
                  color = "gold";
                  break;
                default:
                  color = "grey";
              }
      
              return <Tag color={color}>{StatusDiscountLable[status]}</Tag>;
            },
          },
        {
            title: 'Hành động',
            key: 'actions',
            render: (_, record) => (
                <div>
                    <Button onClick={() => handleViewDetails(record)} style={{ marginRight: 8 }} className="btn-outline-primary">
                        <i className="fa-solid fa-eye"></i>
                    </Button>
                    <Button onClick={() => showModal(record)} style={{ marginRight: 8 }} className="btn-outline-warning">
                        <i className="fa-solid fa-pen-to-square"></i>
                    </Button>
                    <Popconfirm
                        title="Bạn chắc chắn muốn xóa Khuyến mãi này?"
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
        <div className="text-center" style={{ marginLeft: 20, marginRight: 20 }}>
            <h1 className="text-danger">Quản Lý Phiếu giảm Giá</h1>
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
                onValuesChange={handleSearch}
                style={{ display: 'flex', justifyContent: 'flex-end' }}
                className="mt-2 mb-2"
            >
                <Form.Item name="name" label="Tên Khuyến Mãi">
                    <Input placeholder="Tìm kiếm theo tên khuyến mãi" />
                </Form.Item>
            </Form>
            <DiscountModel
                isModalOpen={isModalOpen}
                handleOk={handleOk}
                handleCancel={handleCancel}
                form={form}
                mode={editingDiscount ? 'update' : 'add'}
                discount={editingDiscount || undefined}
            />
            <DiscountDetailModal
                visible={isDetailModalOpen}
                onCancel={handleDetailCancel}
                discount={detailDiscount}
            />
            <Table
                dataSource={discounts}
                columns={columns}
                loading={{
                    spinning: loading,
                    indicator: <LoadingCustom />,
                }}
                rowKey="id"
                pagination={createPaginationConfig(pagination, setPagination)}
            />
        </div>
    );
};

export default ManagerDiscount;
