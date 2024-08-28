import React, {useEffect, useState} from "react";
import {fetchAllRole} from "../../../api/RoleApi.ts";
import {Table} from "antd";
import PermissionsCheckbox from "../../../components/User/PermissionsCheckbox.tsx";
import {assignPermissionToRole, fetchAllPermission, Permission} from "../../../api/PermissionApi.ts";
import createPaginationConfig, {PaginationState} from "../../../config/paginationConfig.ts";

const ManagerRole = () => {
    const [loading, setLoading] = useState(true);
    const [roles, setRoles] = useState<Role[]>([]);
    const [permissions, setPermissions] = useState<Permission[]>([]);
    const [selectedPermissions, setSelectedPermissions] = useState<Record<number, number[]>>({});
    const [pagination, setPagination] = useState<PaginationState>({
        current: 1,
        pageSize: 5,
        total: 20,
        totalPage: 4
    });

    const handlePermissionChange = async (roleId: number, selectedPermissions: number[]) => {
        setSelectedPermissions(prev => ({
            ...prev,
            [roleId]: selectedPermissions
        }));

        try {
            const permissionAssign = {roleId, permissionIds: selectedPermissions};
            await assignPermissionToRole(permissionAssign);
        } catch (error) {
            console.error("Error assigning permission:", error);
        }
    };
    useEffect(() => {
        const fetchPermissions = async () => {
            try {
                const params = {
                    page: 0,
                    size: 5
                };
                const response = await fetchAllPermission(params);
                console.log(response)

                setPermissions(response.data);

            } catch (error) {
                console.error("Error fetching permissions:", error);
            }
        };
        fetchPermissions();
    }, []);

    useEffect(() => {
        const fetchRoles = async (current: number, pageSize: number) => {
            try {
                const {current, pageSize} = pagination;
                const response = await fetchAllRole("", pageSize, current - 1)
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
                })
            } catch (error) {
                console.error("Error fetching roles:", error);
            } finally {
                setLoading(false);
            }
        };

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
            render: (_, record) => {
                if (!permissions || permissions.length === 0) {
                    return <span>Loading...</span>;
                }
                return (
                    <PermissionsCheckbox
                        permissions={permissions}
                        selectedPermissions={selectedPermissions[record.id] || []}
                        onChange={(selected) => handlePermissionChange(record.id, selected)}
                    />
                );
            }
        }
    ];

    return (
        <div className="text-center" style={{height: '200vh', marginLeft: 20, marginRight: 20}}>
            <h1 className="text-danger">Manager Role</h1>
            <Table
                dataSource={roles}
                columns={columns}
                loading={loading}
                rowKey="id"
                pagination={createPaginationConfig(pagination, setPagination)}
            />
        </div>
    );
}

export default ManagerRole;
