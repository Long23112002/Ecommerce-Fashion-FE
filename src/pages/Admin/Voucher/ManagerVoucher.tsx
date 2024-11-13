import { Button, Form, Popconfirm, Table } from 'antd';
import Cookies from "js-cookie";
import { debounce } from "lodash";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { createVoucher, deleteVoucher, fetchAllVouchers, getVoucherById, updateVoucher } from "../../../api/VoucherApi.ts";
import VoucherDetailModal from "../../../components/Voucher/VoucherDetailModal.tsx"; // New detail modal for vouchers
import VoucherModel from "../../../components/Voucher/VoucherModel.js";
import LoadingCustom from "../../../components/Loading/LoadingCustom.js";
import createPaginationConfig, { PaginationState } from "../../../config/paginationConfig.ts";
import { Voucher } from "../../../types/voucher.ts";
import { getErrorMessage } from "../../Error/getErrorMessage.ts";

const ManagerVoucher = () => {
    const [loading, setLoading] = useState(true);
    const [vouchers, setVouchers] = useState<Voucher[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false); // State for detail modal
    const [form] = Form.useForm();
    const [editingVoucher, setEditingVoucher] = useState<Voucher | null>(null);
    const [detailVoucher, setDetailVoucher] = useState<Voucher | null>(null); // State for voucher details
    const [pagination, setPagination] = useState<PaginationState>({
        current: 1,
        pageSize: 5,
        total: 20,
        totalPage: 4
    });
    const [searchParams, setSearchParams] = useState<{ code: string }>({ code: '' });

    const mode = editingVoucher ? 'update' : 'add';

    const fetchVouchersDebounced = useCallback(
        debounce(async (current: number, pageSize: number) => {
            setLoading(true);
            try {
                const response = await fetchAllVouchers(pageSize, current - 1);
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
        }, 500), []);

    const fetchVouchers = (current: number, pageSize: number) => {
        fetchVouchersDebounced(current, pageSize);
    };

    const showModal = async (voucher: Voucher | null = null) => {
        if (voucher) {
            try {
                const voucherDetails = await getVoucherById(voucher.id);
                form.setFieldsValue({
                    code: voucherDetails.code,
                });
                setEditingVoucher(voucherDetails);
            } catch (error) {
                toast.error(getErrorMessage(error))
            }
        } else {
            form.resetFields();
            setEditingVoucher(null);
        }
        setIsModalOpen(true);
    };

    const handleViewDetails = (voucher: Voucher) => {
        setDetailVoucher(voucher);
        setIsDetailModalOpen(true);
    };

    const handleDetailCancel = () => {
        setIsDetailModalOpen(false);
        setDetailVoucher(null);
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            const token = Cookies.get("accessToken");
            if (token) {
                if (mode === 'add') {
                    await createVoucher(values.discountId, token);
                    toast.success('Thêm voucher thành công');
                } else if (mode === 'update' && editingVoucher) {
                    await updateVoucher(editingVoucher.id, values.discountId, token);
                    toast.success('Cập nhật voucher thành công');
                }
                handleCancel();
                refreshVouchers();
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

    const handleDelete = async (voucherId: number) => {
        try {
            const token = Cookies.get("accessToken");
            if (token) {
                await deleteVoucher(voucherId, token);
                toast.success("Xóa voucher thành công");
                refreshVouchers();
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
            code: changedValues.code,
        }));
        setPagination(prevPagination => ({
            ...prevPagination,
            current: 1
        }));
    };

    const refreshVouchers = () => {
        fetchVouchers(pagination.current, pagination.pageSize);
    };

    useEffect(() => {
        fetchVouchers(pagination.current, pagination.pageSize);
    }, [pagination.current, pagination.pageSize, searchParams]);

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Mã Voucher',
            dataIndex: 'code',
            key: 'code',
        },
        {
            title: 'Thời gian tạo',
            dataIndex: 'createAt',
            key: 'createAt',
            render: (date) => new Date(date).toLocaleDateString(),
        },
        {
            title: 'Người tạo',
            dataIndex: 'createBy',
            key: 'createBy',
            render: (createBy) => (
                <div>
                    <img
                        src={createBy?.avatar}
                        style={{
                            width: 40,
                            height: 40,
                            borderRadius: "50%",
                            marginRight: 10,
                        }}
                    />
                    {createBy?.fullName}
                </div>
            ),
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
                        title="Bạn chắc chắn muốn xóa voucher này?"
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
            <h1 className="text-danger">Quản Lý Voucher</h1>
            <Button
                className="mt-3 mb-3"
                style={{ display: "flex", backgroundColor: "black", color: "white" }}
                type="default"
                onClick={() => showModal(null)}
            >
                <i className="fa-solid fa-circle-plus"></i>
            </Button>
            {/* <Form
                layout="inline"
                onValuesChange={handleSearch}
                style={{ display: 'flex', justifyContent: 'flex-end' }}
                className="mt-2 mb-2"
            >
                <Form.Item name="code" label="Mã Voucher">
                    <Input placeholder="Tìm kiếm theo mã voucher" />
                </Form.Item>
            </Form> */}
            <VoucherModel
                isModalOpen={isModalOpen}
                handleOk={handleOk}
                handleCancel={handleCancel}
                form={form}
                mode={editingVoucher ? 'update' : 'add'}
                voucher={editingVoucher || undefined}
            />
            <VoucherDetailModal
                visible={isDetailModalOpen}
                onCancel={handleDetailCancel}
                voucher={detailVoucher}
            />
            <Table
                dataSource={vouchers}
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

export default ManagerVoucher;
