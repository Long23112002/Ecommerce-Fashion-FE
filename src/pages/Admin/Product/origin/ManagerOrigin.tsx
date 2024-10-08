import React, { useCallback, useEffect, useState } from "react";
import { Input, Button, Form, Popconfirm, Table } from 'antd';
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { fetchAllOrigins, createOrigin, updateOrigin, deleteOrigin, getOriginById } from "../../../../api/OriginApi.ts";
import OriginModel from "../../../../components/Origin/OriginModel.tsx";
import createPaginationConfig, { PaginationState } from "../../../../config/origin/paginationConfig.ts";
import OriginDetailModal from "../../../../components/Origin/OriginDetailModal.tsx";
import { Origin } from "../../../../types/origin.ts";
import { debounce } from "lodash";
import LoadingCustom from "../../../../components/Loading/LoadingCustom.tsx";

const ManaggerOrigin = () => {
    const [loading, setLoading] = useState(true);
    const [origins, setOrigins] = useState<Origin[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [editingOrigin, setEditingOrigin] = useState<Origin | null>(null);
    const [detailOrigin, setDetailOrigin] = useState<Origin | null>(null);
    const [pagination, setPagination] = useState<PaginationState>({
        current: 1,
        pageSize: 5,
        total: 20,
        totalPage: 4
    });
    const [searchParams, setSearchParams] = useState<{ name: string }>({
        name: '',
    });

    const mode = editingOrigin ? 'update' : 'add';

    const fetchOriginsDebounced = useCallback(debounce(async (current: number, pageSize: number, searchName: string) => {
        setLoading(true);
        try {
            const response = await fetchAllOrigins(pageSize, current - 1, searchName);
            setOrigins(response.data);
            setPagination({
                current: response.metaData.page + 1,
                pageSize: response.metaData.size,
                total: response.metaData.total,
                totalPage: response.metaData.totalPage
            });
        } catch (error) {
            console.error("Error fetching origins:", error);
        } finally {
            setLoading(false);
        }
    }, 500), []);
    const fetchOrigins = (current: number, pageSize: number) => {
        fetchOriginsDebounced(current, pageSize, searchParams.name);
    };
    const showModal = async (origin: Origin | null = null) => {
        if (origin) {
            try {
                const originDetails = await getOriginById(origin.id);
                form.setFieldsValue({
                    name: originDetails.name
                });
                setEditingOrigin(originDetails);
            } catch (error) {
                toast.error(error.response?.data?.message || 'Failed to fetch origin details');
            }
        } else {
            form.resetFields();
            setEditingOrigin(null);
        }
        setIsModalOpen(true);
    };
    const handleViewDetails = (origin: Origin) => {
        setDetailOrigin(origin);
        setIsDetailModalOpen(true);
    };
    const handleDetailCancel = () => {
        setIsDetailModalOpen(false);
        setDetailOrigin(null);
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            const { name } = values;
            const token = Cookies.get("accessToken");
    
            if (token) {
                if (mode === 'add') {
                    await createOrigin({ name }, token);
                    toast.success('Xuất Xứ Thêm Thành Công');
                } else if (mode === 'update' && editingOrigin) {
                    await updateOrigin(editingOrigin.id, { name }, token);
                    toast.success('Chỉnh Sửa Thành Công');
                }
                handleCancel();
                refreshOrigins();
            } else {
                toast.error("Authorization failed");
            }
        } catch (error) {
            // Kiểm tra xem phản hồi có lỗi từ backend không và hiển thị thông báo chi tiết
            if (error.response && error.response.data && error.response.data.message) {
                const errorMessage = error.response.data.message;
                // Nếu message là object, bạn có thể map nó thành chuỗi
                if (typeof errorMessage === 'object') {
                    const errorMessages = Object.values(errorMessage).join(', ');
                    toast.error(errorMessages);
                } else {
                    toast.error(errorMessage);
                }
            } else {
                // Thông báo lỗi chung nếu không có chi tiết lỗi
                toast.error('Failed to save origin');
            }
        }
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };



    const handleDelete = async (originId: number) => {
        try {
            const token = Cookies.get("accessToken");
            if (token) {
                await deleteOrigin(originId, token);
                toast.success("Xóa Thành Công");
                refreshOrigins();
            } else {
                toast.error("Authorization failed");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete origin');
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

    const refreshOrigins = () => {
        fetchOrigins(pagination.current, pagination.pageSize);
    };

    useEffect(() => {
        fetchOrigins(pagination.current, pagination.pageSize);
    }, [pagination.current, pagination.pageSize, searchParams]);

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Tên xuất xứ',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Thời gian tạo',
            dataIndex: 'createAt',
            key: 'createAt',
            render: (date) => new Date(date).toLocaleDateString(),
        },
        {
            title: 'Thời Gian cập nhật',
            dataIndex: 'updateAt',
            key: 'updateAt',
            render: (date) => {
                if (date) {
                    return (new Date(date).toLocaleDateString())

                } else {
                    return <span>Chưa có</span>;
                }

            }
        },
        {
            title: 'Người tạo',
            dataIndex: 'createBy',
            key: 'createBy',
            render: (createBy) => (
                <div>
                    <img
                        src={createBy.avatar}
                        style={{
                            width: 40,
                            height: 40,
                            borderRadius: "50%",
                            marginRight: 10,
                        }}
                    />
                    {createBy.fullName}
                </div>
            ),

        },
        {
            title: 'Người cập nhật',
            dataIndex: 'updateBy',
            key: 'updateBy',
            render: (updateBy) => {
                if (updateBy) {
                    return (
                        <div>
                            <img
                                src={updateBy.avatar}
                                style={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: "50%",
                                    marginRight: 10,
                                }}
                                alt="Avatar"
                            />
                            {updateBy.fullName}
                        </div>
                    );
                } else {
                    return <span>Chưa có</span>;
                }
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
                        title="Bạn chắc chắn muốn xóa Xuất xứ này?"
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
        <div className="text-center" style={{ height: '200vh', marginLeft: 20, marginRight: 20 }}>
            <h1 className="text-danger">Quản Lý Xuất Xứ</h1>
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
                <Form.Item name="name" label="Tên Xuất Xứ">
                    <Input placeholder="Tìm kiếm theo tên xuất xứ" />
                </Form.Item>
            </Form>
            <OriginModel
                isModalOpen={isModalOpen}
                handleOk={handleOk}
                handleCancel={handleCancel}
                form={form}
                mode={editingOrigin ? 'update' : 'add'}
                origin={editingOrigin || undefined}
            />
            <OriginDetailModal
                visible={isDetailModalOpen}
                onCancel={handleDetailCancel}
                origin={detailOrigin}
            />
            <Table
                dataSource={origins}
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

export default ManaggerOrigin;
