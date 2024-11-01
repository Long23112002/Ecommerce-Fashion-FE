import {useEffect, useState} from "react";
import {createRole, deleteRole, fetchAllRole, getRoleById, updateRole} from "../../../api/RoleApi.ts";
import {Button, Form, Popconfirm, Table, Tooltip} from 'antd';
import PermissionsCheckbox from "../../../components/User/PermissionsCheckbox.tsx";
import {assignPermissionToRole, fetchAllPermission} from "../../../api/PermissionApi.ts";
import createPaginationConfig, {PaginationState} from "../../../config/paginationConfig.ts";
import {Role} from "../../../types/role.ts";
import RoleModel from "../../../components/User/RoleModel.tsx";
import {toast} from "react-toastify";
import Cookies from "js-cookie";
import {getErrorMessage} from "../../Error/getErrorMessage.ts";
import {Container} from "@mui/material";
import LoadingCustom from "../../../components/Loading/LoadingCustom.tsx";


interface Permission {
    id: number;
    name: string;
}


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
            const rolesWithPermissions = response.data.map((role: Role) => ({
                ...role,
                permissions: role.permissions.map((perm: Permission) => perm.id)
            }));
            setRoles(rolesWithPermissions);
            const rolePermissions = response.data.reduce((acc: Record<number, number[]>, role: Role) => {
                acc[role.id] = role.permissions.map((perm: Permission) => perm.id);
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
                    permissionIds: roleDetails.permissions.map((perm: Permission) => perm.id)
                });
                setEditingRole(roleDetails);
            } catch (error) {
                toast.error(getErrorMessage(error));
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
                    toast.success('Thêm mới vai trò thành công');
                } else if (mode === 'update' && editingRole) {
                    await updateRole(editingRole.id, {name, permissionIds}, token);
                    toast.success('Cập nhật vai trò thành công');
                }
                handleCancel();
                refreshRoles();
            } else {
                toast.error("Không có quyên truy cập");
            }
        } catch (error) {
            toast.error(getErrorMessage(error));
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
                toast.success("Xóa vài trò thành công");
                refreshRoles();
            } else {
                toast.error("Authorization failed");
            }
        } catch (error) {
            console.log(getErrorMessage(error));
            toast.error(getErrorMessage(error));
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
            title: 'Tên vai trò',
            dataIndex: 'description',
            key: 'name',
        },
        {
            title: 'Quyền',
            dataIndex: 'permissions',
            key: 'permissions',
            render: (_: any, record: Permission) => (
                <PermissionsCheckbox
                    permissions={permissions}
                    selectedPermissions={selectedPermissions[record.id] || []}
                    onChange={(selected) => handlePermissionChange(record.id, selected)}
                />
            )
        },
        {
            title: 'Thao tác',
            key: 'actions',
            render: (_: any, record: any) => (
                <div>
                    <Tooltip title="Chỉnh sửa">
                        <Button
                            className="btn-outline-warning"
                            onClick={() => showModal(record)}
                            style={{marginRight: 8}}
                        >
                            <i className="fa-solid fa-pen-to-square"></i>
                        </Button>
                    </Tooltip>
                    <Popconfirm
                        title="Bạn có chắc chắn muốn xóa vai trò này ?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Tooltip title="Xóa vai trò" placement="bottom">
                            <Button className="btn-outline-danger">
                                <i className="fa-solid fa-trash-can"></i>
                            </Button>
                        </Tooltip>
                    </Popconfirm>
                </div>
            ),
        }
    ];

    return (
        <Container maxWidth='xl'>
            <div>
                <h1 className="text-danger text-center">Quản lí vai trò</h1>
                <Button
                    className="mt-3 mb-3"
                    style={{display: "flex", backgroundColor: "black", color: "white"}}
                    type="default"
                    onClick={() => showModal(null)}
                >
                    Thêm mới
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
                    loading={{
                        spinning: loading,
                        indicator: <LoadingCustom />,
                    }}
                    rowKey="id"
                    pagination={createPaginationConfig(pagination, setPagination)}
                />
            </div>
        </Container>
    );
};

export default ManagerRole;