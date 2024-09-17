import React, {useEffect, useState} from 'react';
import {Button, Form, Input, Popconfirm, Select, Table} from 'antd';
import createPaginationConfig, {PaginationState} from "../../../config/paginationConfig.ts";
import {assignRoleToUser, createUser, deleteUser, getAllUsers, updateUser, UserParam} from "../../../api/UserApi.ts";
import {UserData} from "../../../api/AuthApi.ts";
import {UserRequest} from "../../../types/User.ts";
import {toast} from "react-toastify";
import {GenderEnum} from "../../../enum/GenderEnum.ts";
import RolesCheckbox from "../../../components/User/RolesCheckboxProps.tsx";
import UserModel from "../../../components/User/UserModel.tsx";
import {makeSlug} from "../../../utils/slug.ts";

const ManagerUser = () => {
    const [users, setUsers] = useState<UserData[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [form] = Form.useForm();
    const [pagination, setPagination] = useState<PaginationState>({
        current: 0,
        pageSize: 5,
        total: 20,
        totalPage: 4,
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState<UserRequest | null>(null);
    const [filterParams, setFilterParams] = useState<UserParam>({
        page: 0,
        size: 5,
        phone: '',
        email: '',
        fullName: '',
        gender: '',
    });

    const fetchUsers = async (params = filterParams) => {
        setLoading(true);
        try {
            const response = await getAllUsers({
                ...params,
                page: params.page - 1,
            });
            setUsers(response.data);
            setPagination({
                current: response.metaData.page + 1,
                pageSize: response.metaData.size,
                total: response.metaData.total,
                totalPage: response.metaData.totalPage,
            });
        } catch (error) {
            console.error("Failed to fetch users:", error);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchUsers();
    }, [filterParams]);

    const handleTableChange = (newPagination) => {
        setFilterParams(prevParams => ({
            ...prevParams,
            page: newPagination.current,
            size: newPagination.pageSize
        }));
    };

    const handleFilterChange = (changedValues) => {
        setFilterParams(prevParams => ({
            ...prevParams,
            ...changedValues,
            email: changedValues.email !== undefined ? makeSlug(changedValues.email || '') : prevParams.email,
            phone: changedValues.phone !== undefined ? makeSlug(changedValues.phone || '') : prevParams.phone,
            fullName: changedValues.fullName !== undefined ? makeSlug(changedValues.fullName || '') : prevParams.fullName,
            page: 1
        }));
    };


    const handleModalOk = async () => {
        try {
            const values = await form.validateFields();
            if (currentUser) {
                await updateUser(currentUser.id, {...currentUser, ...values});
                toast.success("User updated successfully.");
            } else {
                await createUser(values);
                toast.success("User added successfully.");
            }
            setIsModalOpen(false);
            fetchUsers();
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        }
    };

    const handleRoleChange = async (userId: number, selectedRoles: number[]) => {
        try {
            const user = users.find(u => u.id === userId);
            if (user) {
                await assignRoleToUser({email: user.email, roleIds: selectedRoles});
                setUsers(prevUsers =>
                    prevUsers.map(u =>
                        u.id === userId ? {...u, roles: selectedRoles.map(roleId => ({id: roleId, name: ''}))} : u
                    )
                );
                toast.success("Roles updated successfully.");
            }
        } catch (error) {
            toast.error(error.response?.data?.message);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await deleteUser(id);
            fetchUsers();
            toast.success("User deleted successfully.");
        } catch (error) {
            toast.error(error.response?.data?.message);
        }
    };

    const showModal = (record: UserRequest | null) => {
        setCurrentUser(record);
        setIsModalOpen(true);
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Avatar',
            dataIndex: 'avatar',
            key: 'avatar',
            render: (avatar) => (
                <img
                    src={avatar}
                    alt="avatar"
                    style={{width: 40, height: 40, borderRadius: '50%'}}
                />
            ),
        },
        {
            title: 'Full Name',
            dataIndex: 'fullName',
            key: 'fullName',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Phone Number',
            dataIndex: 'phoneNumber',
            key: 'phoneNumber',
        },
        {
            title: 'Gender',
            dataIndex: "gender",
            key: 'gender'
        },
        {
            title: 'Roles',
            dataIndex: 'roles',
            key: 'roles',
            render: (roles, record) => (
                <RolesCheckbox
                    email={record.email}
                    userId={record.id}
                    selectedRoles={roles.map(role => role.id)}
                    onChange={(selectedRoles) => handleRoleChange(record.id, selectedRoles)}
                />
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <div>
                    <Button onClick={() => showModal(record)} style={{marginRight: 8}}>
                        Update
                    </Button>
                    <Popconfirm
                        title="Are you sure you want to delete this user?"
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
        <div className="text-center" style={{height: '200vh', marginLeft: 20, marginRight: 20}}>
            <h1 className="text-danger">Manager User</h1>
            <Button
                className="mt-3 mb-3"
                style={{display: "flex", backgroundColor: "black", color: "white"}}
                type="default"
                onClick={() => showModal(null)}
            >
                Add User
            </Button>
            <Form
                layout="inline"
                onValuesChange={handleFilterChange}
                style={{display: 'flex', justifyContent: 'flex-end'}}
                className="mt-2 mb-2"
            >
                <Form.Item name="email" label="Email">
                    <Input placeholder="Search by email"/>
                </Form.Item>
                <Form.Item name="phone" label="Phone Number">
                    <Input placeholder="Search by phone number"/>
                </Form.Item>
                <Form.Item name="fullName" label="Full Name">
                    <Input placeholder="Search by full name"/>
                </Form.Item>
                <Form.Item name="gender" label="Gender">
                    <Select placeholder="Select gender">
                        {Object.entries(GenderEnum).map(([key, value]) => (
                            <Select.Option key={value} value={value}>
                                {key}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
            </Form>
            <Table
                dataSource={users}
                columns={columns}
                loading={loading}
                rowKey="id"
                pagination={createPaginationConfig(pagination, setPagination)}
                onChange={handleTableChange}
            />
            {isModalOpen && (
                <UserModel
                    isModalOpen={isModalOpen}
                    handleOk={handleModalOk}
                    handleCancel={() => setIsModalOpen(false)}
                    form={form}
                    refreshUsers={fetchUsers}
                    mode={currentUser ? 'update' : 'add'}
                    user={currentUser ? {...currentUser} : undefined}
                />
            )}
        </div>
    );

};

export default ManagerUser;
