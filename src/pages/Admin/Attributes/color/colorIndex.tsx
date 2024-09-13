import React, { useEffect, useState } from "react";
import { createColor, deleteColor, fetchAllColors, getColorById, updateColor } from "./colorManagament.ts";
import { Button, Form, Popconfirm, Table, Input, Modal, Space } from 'antd';
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import createPaginationConfig, {PaginationState} from "../../../../config/paginationConfig.ts";
import { SearchOutlined } from '@ant-design/icons';
import { SketchPicker } from 'react-color';

const ManagerColor = () => {
    const [loading, setLoading] = useState(true);
    const [colors, setColors] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();
    const [editingColor, setEditingColor] = useState(null);
    const [pagination, setPagination] = useState<PaginationState>({
        current: 1,
        pageSize: 5,
        total: 20,
        totalPage: 4
    });

    const [filterName, setFilterName] = useState('');

    const [color, setColor] = useState('#fff');

    const mode = editingColor ? 'update' : 'add';

    const fetchColors = async (current: number, pageSize: number, filterName: string = '') => {
        try {
            const response = await fetchAllColors(filterName, pageSize, current - 1);
            setColors(response.data);
            setPagination({
                current: response.metaData.page + 1,
                pageSize: response.metaData.size,
                total: response.metaData.total,
                totalPage:response.metaData.totalPage
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
                setColor(colorDetails.name || '#fff');
            } catch (error) {
                toast.error(error.response?.data?.message || 'Failed to fetch color details');
            }
        } else {
            form.resetFields();
            setEditingColor(null);
            setColor('#fff');
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
                    await createColor({name}, token);
                    toast.success('Color added successfully');
                } else if (mode === 'update' && editingColor) {
                    await updateColor(editingColor.id, {name}, token);
                    toast.success('Color updated successfully');
                }
                handleCancel();
                fetchColors(pagination.current, pagination.pageSize,filterName);
            } else {
                toast.error("Authorization failed");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to save color');
        }
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const handleDelete = async (colorId: number) => {
        try {
            const token = Cookies.get("accessToken");
            if (token) {
                await deleteColor(colorId, token)
                toast.success("Color deleted successfully");
                fetchColors(pagination.current, pagination.pageSize,filterName);
            } else {
                toast.error("Authorization failed");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete color');
        }
    };


    const handleTableChange = (pagination, filters) => {

        setPagination({
            ...pagination,
            current: pagination.current,
        });
        const nameFilter = filters.name || '';
         setFilterName(nameFilter);

       fetchColors(pagination.current, pagination.pageSize, nameFilter);
    };

    const handleColorChange = (color) => {
        setColor(color.hex); // Cập nhật mã màu khi người dùng chọn màu
        form.setFieldsValue({ name: color.hex }); // Cập nhật ô nhập liệu với mã màu
    };

    useEffect(() => {
        fetchColors(pagination.current, pagination.pageSize, filterName);
    }, [pagination.current, pagination.pageSize,filterName]);

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Color Name',
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div
                        style={{
                            
                            height: 20,
                            backgroundColor: record.name, // Assuming 'color' field holds the color code
                            marginRight: 10,
                            width: 20, 
                            borderRadius: 4, 
                        }}
                    />
                    {text}
                </div>
            ),
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters}) => (
                <div style={{ padding: 8 }}>
                    <Input
                        placeholder="Search color name"
                        value={selectedKeys[0]}
                        onChange={(e) => {setSelectedKeys(e.target.value ? [e.target.value] : []);
                            confirm({ closeDropdown: false });
                        }}
                        onPressEnter={confirm}
                        style={{ marginBottom: 8, display: 'block' }}
                    />
                    <Space>
                        <Button
                            type="primary"
                            onClick={()=>confirm({ closeDropdown: true })}
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
            render: (date) => date ? 
            (new Date(date).toLocaleString())
            : 'No updated available',
        },
        {
            title: 'Created By',
            dataIndex: 'createdBy',
            key: 'createdBy',
            render: (createdBy) => (
                <div>
                    <img 
                    src={createdBy.avatar} 
                    style={{
                        width: 40, 
                        height: 40, 
                        borderRadius: '50%', 
                        marginRight: 10
                    }}
                    />
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
                        <img 
                    src={updatedBy.avatar} 
                    style={{
                        width: 40, 
                        height: 40, 
                        borderRadius: '50%', 
                        marginRight: 10}}
                    />
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
                        title="Are you sure you want to delete this color?"
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
            <h1 className="text-danger">Manager Color</h1>
            
            <Button
                className="mt-3 mb-3"
                style={{ display: "flex", backgroundColor: "black", color: "white" }}
                type="default"
                onClick={() => showModal(null)}
            >
                Add Color
            </Button>
            <Modal
                title={mode === 'add' ? 'Add Color' : 'Update Color'}
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
                        label="Color Name"
                        rules={[{ required: true, message: 'Please input the color name!' }]}
                    >
                        <Input readOnly/>
                    </Form.Item>

                    <Form.Item label="Pick Color">
                    <SketchPicker
                            color={color}
                            onChangeComplete={handleColorChange} // Cập nhật mã màu khi chọn màu
                        />
                    </Form.Item>

                </Form>
            </Modal>

            <Table
                dataSource={colors}
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