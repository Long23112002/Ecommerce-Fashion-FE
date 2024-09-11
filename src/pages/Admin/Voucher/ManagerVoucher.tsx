import React, { useEffect, useState } from "react";
import { fetchAllVouchers, createVoucher, updateVoucher, deleteVoucher } from "../../../api/VoucherApi.ts";
import { Button, Form, Popconfirm, Table } from 'antd';
import VoucherModel from "../../../components/Voucher/VoucherModel.tsx";
import createPaginationConfig, { PaginationState } from "../../../config/paginationConfig.ts";
import { toast } from "react-toastify";
import Cookies from "js-cookie";

const ManagerVoucher = () => {
    const [loading, setLoading] = useState(true);
    const [vouchers, setVouchers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();
    const [editingVoucher, setEditingVoucher] = useState(null);
    const [pagination, setPagination] = useState<PaginationState>({
        current: 1,
        pageSize: 5,
        total: 20,
        totalPage: 4
    });

    const fetchVouchers = async (current: number, pageSize: number) => {
        try {
            const response = await fetchAllVouchers(current - 1, pageSize);
            setVouchers(response.data);
            setPagination({
                current: response.metaData.page + 1,
                pageSize: response.metaData.size,
                total: response.metaData.total,
                totalPage: response.metaData.totalPage
            });
        } catch (error) {
            console.error("Error fetching vouchers:", error);
        } finally {
            setLoading(false);
        }
    };

    const showModal = (voucher = null) => {
        if (voucher) {
            form.setFieldsValue({
                code: voucher.code,
                discountId: voucher.discount.id,
            });
            setEditingVoucher(voucher);
        } else {
            form.resetFields();
            setEditingVoucher(null);
        }
        setIsModalOpen(true);
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            const token = Cookies.get("accessToken");

            if (token) {
                if (!editingVoucher) {
                    await createVoucher(values, token);
                    toast.success('Voucher added successfully');
                } else {
                    await updateVoucher(editingVoucher.id, values, token);
                    toast.success('Voucher updated successfully');
                }
                handleCancel();
                fetchVouchers(pagination.current, pagination.pageSize);
            } else {
                toast.error("Authorization failed");
            }
        } catch (error) {
            toast.error('Failed to save voucher');
        }
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const handleDelete = async (voucherId) => {
        try {
            const token = Cookies.get("accessToken");
            if (token) {
                await deleteVoucher(voucherId, token);
                toast.success("Voucher deleted successfully");
                fetchVouchers(pagination.current, pagination.pageSize);
            } else {
                toast.error("Authorization failed");
            }
        } catch (error) {
            toast.error('Failed to delete voucher');
        }
    };

    useEffect(() => {
        fetchVouchers(pagination.current, pagination.pageSize);
    }, [pagination.current, pagination.pageSize]);

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Code',
            dataIndex: 'code',
            key: 'code',
        },
        {
            title: 'Discount',
            dataIndex: 'discount',
            key: 'discount',
            render: (text, record) => record.discount?.name || 'No discount'
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
                        title="Are you sure you want to delete this voucher?"
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
        <div className="text-center" style={{ marginLeft: 20, marginRight: 20 }}>
            <h1 className="text-danger">Manager Voucher</h1>
            <div className="text-left mb-3">
                <Button
                    className="mt-3 mb-3"
                    style={{ display: "flex", backgroundColor: "black", color: "white" }}
                    type="default"
                    onClick={() => showModal(null)}
                >
                    Add Voucher
                </Button>
            </div>
            <VoucherModel
                isModalOpen={isModalOpen}
                handleOk={handleOk}
                handleCancel={handleCancel}
                form={form}
                mode={editingVoucher ? 'update' : 'add'}
                voucher={editingVoucher || undefined}
            />
            <Table
                dataSource={vouchers}
                columns={columns}
                loading={loading}
                rowKey="id"
                pagination={createPaginationConfig(pagination, setPagination)}
            />
        </div>
    );
};

export default ManagerVoucher;
