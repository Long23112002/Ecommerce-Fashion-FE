import React, {useEffect, useState} from "react";
import {createRole, deleteRole, fetchAllRole, getRoleById, updateRole} from "../../../api/RoleApi.ts";
import {Button, Form, Popconfirm, Table} from 'antd';
import PermissionsCheckbox from "../../../components/User/PermissionsCheckbox.tsx";
import {assignPermissionToRole, fetchAllPermission, Permission} from "../../../api/PermissionApi.ts";
import createPaginationConfig, {PaginationState} from "../../../config/paginationConfig.ts";
import {Role} from "../../../types/role.ts";
import RoleModel from "../../../components/User/RoleModel.tsx";
import {toast} from "react-toastify";
import Cookies from "js-cookie";

const ManagerRole = () => {
    const [loading, setLoading] = useState(true);
    const [roles, setRoles] = useState<Role[]>([]);
    const [permissions, setPermissions] = useState<Permission[]>([]);
    const [selectedPermissions, setSelectedPermissions] = useState<Record<number, number[]>>({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();
    const [editingRole, setEditingRole] = useState<Role | null>(null);
    const [pagination, setPagination] = useState<PaginationState>({
        current: 1,
        pageSize: 5,
        total: 20,
        totalPage: 4
    });

    const mode = editingRole ? 'update' : 'add';

    const fetchPermissions = async () => {
        try {
            const params = {page: 0, size: 5};
            const response = await fetchAllPermission(params);
            setPermissions(response.data);
        } catch (error) {
            console.error("Error fetching permissions:", error);
        }
    };

    const fetchRoles = async (current: number, pageSize: number) => {
        try {
            const response = await fetchAllRole("", pageSize, current - 1);
            const rolesWithPermissions = response.data.map((role: any) => ({
                ...role,
                permissions: role.permissions.map((perm: any) => perm.id)
            }));
            setRoles(rolesWithPermissions);
            const rolePermissions = response.data.reduce((acc: Record<number, number[]>, role: any) => {
                acc[role.id] = role.permissions.map((perm: any) => perm.id);
                return acc;
            }, {});
            setSelectedPermissions(rolePermissions);
            setPagination({
                current: response.metaData.page + 1,
                pageSize: response.metaData.size,
                total: response.metaData.total,
                totalPage: response.metaData.totalPage
            });
        } catch (error) {
            console.error("Error fetching roles:", error);
        } finally {
            setLoading(false);
        }
    };

    const showModal = async (role: Role | null = null) => {
        if (role) {
            try {
                const roleDetails = await getRoleById(role.id);
                form.setFieldsValue({
                    name: roleDetails.name,
                    permissionIds: roleDetails.permissions.map((perm: any) => perm.id)
                });
                setEditingRole(roleDetails);
            } catch (error) {
                toast.error(error.response?.data?.message || 'Failed to fetch role details');
            }
        } else {
            form.resetFields();
            setEditingRole(null);
        }
        setIsModalOpen(true);
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            const {name, permissionIds} = values;
            const token = Cookies.get("accessToken");

            if (token) {
                if (mode === 'add') {
                    await createRole({name, permissionIds}, token);
                    toast.success('Role added successfully');
                } else if (mode === 'update' && editingRole) {
                    await updateRole(editingRole.id, {name, permissionIds}, token);
                    toast.success('Role updated successfully');
                }
                handleCancel();
                refreshRoles();
            } else {
                toast.error("Authorization failed");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to save role');
        }
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const handlePermissionChange = async (roleId: number, selectedPermissions: number[]) => {
        setSelectedPermissions(prev => ({
            ...prev,
            [roleId]: selectedPermissions
        }));
        try {
            const permissionAssign = {roleId, permissionIds: selectedPermissions};
            await assignPermissionToRole(permissionAssign);
        } catch (error) {
            console.error("Error assigning permissions:", error);
        }
    };

    const handleDelete = async (roleId: number) => {
        try {
            const token = Cookies.get("accessToken");
            if (token) {
                await deleteRole(roleId, token);
                toast.success("Role deleted successfully");
                refreshRoles();
            } else {
                toast.error("Authorization failed");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete role');
        }
    };

    const refreshRoles = () => {
        fetchRoles(pagination.current, pagination.pageSize);
    };

    useEffect(() => {
        fetchPermissions();
        fetchRoles(pagination.current, pagination.pageSize);
    }, [pagination.current, pagination.pageSize]);

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Role Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Permissions',
            dataIndex: 'permissions',
            key: 'permissions',
            render: (_, record) => (
                <PermissionsCheckbox
                    permissions={permissions}
                    selectedPermissions={selectedPermissions[record.id] || []}
                    onChange={(selected) => handlePermissionChange(record.id, selected)}
                />
            )
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
                        title="Are you sure you want to delete this role?"
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
            <h1 className="text-danger">Manager Role</h1>
            <Button
                className="mt-3 mb-3"
                style={{display: "flex", backgroundColor: "black", color: "white"}}
                type="default"
                onClick={() => showModal(null)}
            >
                Add Role
            </Button>
            <RoleModel
                isModalOpen={isModalOpen}
                handleOk={handleOk}
                handleCancel={handleCancel}
                form={form}
                refreshRoles={refreshRoles}
                mode={editingRole ? 'update' : 'add'}
                role={editingRole || undefined}
            />

            <Table
                dataSource={roles}
                columns={columns}
                loading={loading}
                rowKey="id"
                pagination={createPaginationConfig(pagination, setPagination)}
            />
        </div>
    );
};

export default ManagerRole;
