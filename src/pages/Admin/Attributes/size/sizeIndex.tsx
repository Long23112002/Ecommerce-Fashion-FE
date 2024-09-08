import React, { useEffect, useState } from "react";
import { createSize, deleteSize, fetchAllSizes, getSizeById, updateSize } from "./sizeManagament.ts";
import { Button, Form, Popconfirm, Table, Input, Modal, Space } from 'antd';
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import createPaginationConfig, {PaginationState} from "../../../../config/paginationConfig.ts";
import { SearchOutlined } from '@ant-design/icons';

const ManagerColor = () => {
    const [loading, setLoading] = useState(true);
    const [sizes, setSizes] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();
    const [editingSize, setEditingSize] = useState(null);
    const [pagination, setPagination] = useState<PaginationState>({
        current: 1,
        pageSize: 5,
        total: 20,
        totalPage: 4
    });

    const [filterName, setFilterName] = useState('');

    const mode = editingSize ? 'update' : 'add';

    const fetchSizes = async (current: number, pageSize: number, filterName: string = '') => {
        try {
            const response = await fetchAllSizes(filterName, pageSize, current - 1);
            setSizes(response.data);
            setPagination({
                current: response.metaData.page + 1,
                pageSize: response.metaData.size,
                total: response.metaData.total,
                totalPage:response.metaData.totalPage
            });
        } catch (error) {
            console.error("Error fetching sizes:", error);
        } finally {
            setLoading(false);
        }
    };

    const showModal = async (size = null) => {
        if (size) {
            try {
                const sizeDetails = await getSizeById(size.id);
                form.setFieldsValue(sizeDetails);
                setEditingSize(sizeDetails);
            } catch (error) {
                toast.error(error.response?.data?.message || 'Failed to fetch size details');
            }
        } else {
            form.resetFields();
            setEditingSize(null);
        }
        setIsModalOpen(true);
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            const { name } = values;
            const token = Cookies.get("accessToken");

            if (token) {
                if (mode === 'add') {
                    await createSize({ name }, token);
                    toast.success('Size added successfully');
                } else if (mode === 'update' && editingSize) {
                    await updateSize(editingSize.id, { name }, token);
                    toast.success('Size updated successfully');
                }
                handleCancel();
                fetchSizes(pagination.current, pagination.pageSize,filterName);
            } else {
                toast.error("Authorization failed");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to save size');
        }
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const handleDelete = async (sizeId: number) => {
        try {
            const token = Cookies.get("accessToken");
            if (token) {
                await deleteSize(sizeId, token)
                toast.success("Size deleted successfully");
                fetchSizes(pagination.current, pagination.pageSize,filterName);
            } else {
                toast.error("Authorization failed");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete size');
        }
    };


    const handleTableChange = (pagination, filters) => {

        setPagination({
            ...pagination,
            current: pagination.current,
        });
        const nameFilter = filters.name || '';
         setFilterName(nameFilter);

       fetchSizes(pagination.current, pagination.pageSize, nameFilter);
    };

    useEffect(() => {
        fetchSizes(pagination.current, pagination.pageSize, filterName);
    }, [pagination.current, pagination.pageSize,filterName]);

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Size Name',
            dataIndex: 'name',
            key: 'name',
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters}) => (
                <div style={{ padding: 8 }}>
                    <Input
                        placeholder="Search size name"
                        value={selectedKeys[0]}
                        onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                        onPressEnter={confirm}
                        style={{ marginBottom: 8, display: 'block' }}
                    />
                    <Space>
                        <Button
                            type="primary"
                            onClick={confirm}
                            icon={<SearchOutlined />}
                            size="small"
                            style={{ width: 90 }}
                        >
                            Search
                        </Button>
                        <Button onClick={clearFilters} size="small" style={{ width: 90 }}>
                            Reset
                        </Button>
                    </Space>
                </div>
            ),
            filterIcon: (filtered: boolean) => (
                <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
              ),
        },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date) => new Date(date).toLocaleString(),
        },
        {
            title: 'Updated At',
            dataIndex: 'updatedAt',
            key: 'updatedAt',
            render: (date) => new Date(date).toLocaleString(),
        },
        {
            title: 'Created By',
            dataIndex: 'createdBy',
            key: 'createdBy',
            render: (createdBy) => (
                <div>
                    {createdBy.fullName}
                </div>
            )
        },
        {
            title: 'Updated By',
            dataIndex: 'updatedBy',
            key: 'updatedBy',
            render: (updatedBy) => (
                updatedBy ? (
                    <div>
                        {updatedBy.fullName}
                    </div>
                ) : 'No updated available'
            )
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
                        title="Are you sure you want to delete this size?"
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
            <h1 className="text-danger">Manager Size</h1>
            
            <Button
                className="mt-3 mb-3"
                style={{ display: "flex", backgroundColor: "black", color: "white" }}
                type="default"
                onClick={() => showModal(null)}
            >
                Add Size
            </Button>
            <Modal
                title={mode === 'add' ? 'Add Size' : 'Update Size'}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <Form
                    form={form}
                    layout="vertical"
                >
                    <Form.Item
                        name="name"
                        label="Size Name"
                        rules={[{ required: true, message: 'Please input the size name!' }]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>

            <Table
                dataSource={sizes}
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