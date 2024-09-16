import React, { useEffect, useState } from "react";
import { Input, Button, Form, Popconfirm, Table } from 'antd';
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { fetchAllOrigins, createOrigin, updateOrigin, deleteOrigin, getOriginById } from "../../../../api/OriginApi.ts";
import OriginModel from "../../../../components/Origin/OriginModel.tsx";
import createPaginationConfig, { PaginationState } from "../../../../config/origin/paginationConfig.ts";
import OriginDetailModal from "../../../../components/Origin/OriginDetailModal.tsx";
import { Origin } from "../../../../types/origin.ts";

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

    const fetchOrigins = async (current: number, pageSize: number) => {
        setLoading(true);
        try {
            const response = await fetchAllOrigins(pageSize, current - 1, searchParams.name);
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
                    toast.success('Origin added successfully');
                } else if (mode === 'update' && editingOrigin) {
                    await updateOrigin(editingOrigin.id, { name }, token);
                    toast.success('Origin updated successfully');
                }
                handleCancel();
                refreshOrigins();
            } else {
                toast.error("Authorization failed");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to save origin');
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
                toast.success("Origin deleted successfully");
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
            ...changedValues,
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
            title: 'Origin Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Create at',
            dataIndex: 'createAt',
            key: 'createAt',
            render: (date) => new Date(date).toLocaleDateString(),
        },
        {
            title: 'Update at',
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
            title: 'Create By',
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
            title: 'Update By',
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
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <div>
                    <Button onClick={() => showModal(record)} style={{ marginRight: 8 }}>
                        Update
                    </Button>
                    <Button onClick={() => handleViewDetails(record)} style={{ marginRight: 8 }}>
                        View Details
                    </Button>
                    <Popconfirm
                        title="Are you sure you want to delete this origin?"
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
            <h1 className="text-danger">Manager Origin</h1>
            <Button
                className="mt-3 mb-3"
                style={{ display: "flex", backgroundColor: "black", color: "white" }}
                type="default"
                onClick={() => showModal(null)}
            >
                Add Origin
            </Button>
            <Form
                layout="inline"
                onValuesChange={handleSearch}
                style={{ display: 'flex', justifyContent: 'flex-end' }}
                className="mt-2 mb-2"
            >
                <Form.Item name="name" label="Origin Name">
                    <Input placeholder="Search by origin name" />
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
                loading={loading}
                rowKey="id"
                pagination={createPaginationConfig(pagination, setPagination)}
            />
        </div>
    );
};

export default ManaggerOrigin;
