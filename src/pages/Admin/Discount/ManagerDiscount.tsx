import React, { useEffect, useState } from "react";
import { Button, Form, Popconfirm, Table } from 'antd';
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { fetchAllDiscounts, createDiscount, updateDiscount, deleteDiscount, getDiscountById } from "../../../api/DiscountApi.ts";
import createPaginationConfig, { PaginationState } from "../../../config/paginationConfig.ts";
import DiscountModal from "../../../components/Discount/DiscountModal.tsx";
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
        total: 20,
        totalPage: 4
    });

    const mode = editingDiscount ? 'update' : 'add';

    const fetchDiscounts = async (current: number, pageSize: number) => {
        try {
            const response = await fetchAllDiscounts("", pageSize, current - 1);
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
    };

    const showModal = async (discount: Discount | null = null) => {
        if (discount) {
            try {
                const discountDetails = await getDiscountById(discount.id);
                form.setFieldsValue(discountDetails);
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

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            const token = Cookies.get("accessToken");

            if (token) {
                if (mode === 'add') {
                    await createDiscount(values, token);
                    toast.success('Discount added successfully');
                } else if (mode === 'update' && editingDiscount) {
                    await updateDiscount(editingDiscount.id, values, token);
                    toast.success('Discount updated successfully');
                }
                handleCancel();
                refreshDiscounts();
            } else {
                toast.error("Authorization failed");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to save discount');
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
                toast.success("Discount deleted successfully");
                refreshDiscounts();
            } else {
                toast.error("Authorization failed");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete discount');
        }
    };

    const refreshDiscounts = () => {
        fetchDiscounts(pagination.current, pagination.pageSize);
    };

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
            render: (timestamp) => new Date(timestamp).toLocaleDateString()
        },
        {
            title: 'End Date',
            dataIndex: 'endDate',
            key: 'endDate',
            render: (timestamp) => new Date(timestamp).toLocaleDateString()
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
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
        }
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
            <DiscountModal
                isModalOpen={isModalOpen}
                handleOk={handleOk}
                handleCancel={handleCancel}
                form={form}
                mode={editingDiscount ? 'update' : 'add'}
                discount={editingDiscount || undefined}
            />

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
