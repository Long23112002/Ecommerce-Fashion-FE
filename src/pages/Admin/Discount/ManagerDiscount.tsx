import React, { useEffect, useState } from "react";
import { Button, Form, Popconfirm, Table } from 'antd';
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { fetchAllDiscount, createDiscount, updateDiscount, deleteDiscount, getDiscountById } from "../../../api/DiscountApi.ts";
import createPaginationConfig, { PaginationState } from "../../../config/paginationConfig.ts";
import AddDiscountModal from "../../../components/Discount/AddDiscountModal.tsx";
import UpdateDiscountModal from "../../../components/Discount/UpdateDiscountModal.tsx";
import { Discount } from "../../../types/discount.ts";

const ManagerDiscount = () => {
    const [loading, setLoading] = useState(true);
    const [discounts, setDiscounts] = useState<Discount[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();
    const [editingDiscount, setEditingDiscount] = useState<Discount | null>(null);
    const [pagination, setPagination] = useState<PaginationState>({
        current: 1,
        pageSize: 5,
        total: 0,
        totalPage: 1
    });

    const isUpdateMode = Boolean(editingDiscount);

    // Hàm lấy danh sách discount từ API
    const fetchDiscounts = async (current: number, pageSize: number) => {
        setLoading(true);
        try {
            const response = await fetchAllDiscount({ type: '', status: '', name: '' }, pageSize, current - 1);
            setDiscounts(response.data);
            setPagination({
                current: response.metaData.page + 1,
                pageSize: response.metaData.size,
                total: response.metaData.total,
                totalPage: response.metaData.totalPage
            });
        } catch (error) {
            toast.error("Error fetching discounts");
        } finally {
            setLoading(false);
        }
    };

    // Mở modal cho việc tạo mới hoặc chỉnh sửa discount
    const showModal = async (discount: Discount | null = null) => {
        if (discount) {
            try {
                const discountDetails = await getDiscountById(discount.id);
                form.setFieldsValue({
                    ...discountDetails,
                    startDate: dayjs(discountDetails.startDate),
                    endDate: dayjs(discountDetails.endDate),
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

    // Xử lý khi nhấn OK trong modal
    const handleModalOk = async (values: any) => {
        const token = Cookies.get("accessToken");
        if (!token) {
            toast.error("Authorization failed");
            return;
        }

        try {
            if (isUpdateMode) {
                if (editingDiscount) {
                    await updateDiscount(editingDiscount.id, values, token);
                    toast.success('Discount updated successfully');
                }
            } else {
                await createDiscount(values, token);
                toast.success('Discount added successfully');
            }
            handleModalCancel();
            refreshDiscounts();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to save discount');
        }
    };

    // Đóng modal
    const handleModalCancel = () => {
        setIsModalOpen(false);
    };

    // Xử lý xóa discount
    const handleDelete = async (discountId: number) => {
        const token = Cookies.get("accessToken");
        if (!token) {
            toast.error("Authorization failed");
            return;
        }

        try {
            await deleteDiscount(discountId, token);
            toast.success("Discount deleted successfully");
            refreshDiscounts();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete discount');
        }
    };

    // Làm mới danh sách discount
    const refreshDiscounts = () => {
        fetchDiscounts(pagination.current, pagination.pageSize);
    };

    // Lấy dữ liệu khi trang hoặc pageSize thay đổi
    useEffect(() => {
        fetchDiscounts(pagination.current, pagination.pageSize);
    }, [pagination.current, pagination.pageSize]);

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Discount Code',
            dataIndex: 'code',
            key: 'code',
        },
        {
            title: 'Condition',
            dataIndex: 'condition',
            key: 'condition',
            render: (condition: any) =>
                `Product ID: ${condition.productId}, Brand ID: ${condition.brandId}, Category ID: ${condition.categoryId}, Product Detail ID: ${condition.productDetailId}`

        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
        },
        {
            title: 'Value',
            dataIndex: 'value',
            key: 'value',
        },
        {
            title: 'Max Value',
            dataIndex: 'maxValue',
            key: 'maxValue',
        },
        {
            title: 'Start Date',
            dataIndex: 'startDate',
            key: 'startDate',
            render: (timestamp: number) => new Date(timestamp).toLocaleDateString(),
        },
        {
            title: 'End Date',
            dataIndex: 'endDate',
            key: 'endDate',
            render: (timestamp: number) => new Date(timestamp).toLocaleDateString(),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: Discount) => (
                <div>
                    <Button onClick={() => showModal(record)} style={{ marginRight: 8 }}>
                        Update
                    </Button>
                    <Popconfirm
                        title="Are you sure you want to delete this discount?"
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
            <h1 className="text-danger">Manager Discount</h1>
            <Button
                className="mt-3 mb-3"
                style={{ display: "flex", backgroundColor: "black", color: "white" }}
                type="default"
                onClick={() => showModal(null)}
            >
                Add Discount
            </Button>
            {isUpdateMode ? (
                <UpdateDiscountModal
                    isModalOpen={isModalOpen}
                    handleOk={handleModalOk}
                    handleCancel={handleModalCancel}
                    form={form}
                    discount={editingDiscount!}
                />
            ) : (
                <AddDiscountModal
                    isModalOpen={isModalOpen}
                    handleOk={handleModalOk}
                    handleCancel={handleModalCancel}
                    form={form}
                />
            )}
            <Table
                dataSource={discounts}
                columns={columns}
                loading={loading}
                rowKey="id"
                pagination={createPaginationConfig(pagination, setPagination)}
            />
        </div>
    );
};

export default ManagerDiscount;
