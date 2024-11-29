import React, {useEffect} from 'react';
import {Button, Form, Input, Modal, Select, Spin} from 'antd';
import {fetchAllPermission} from '../../api/PermissionApi.ts';
import {Role} from "../../types/role.ts";
/* eslint-disable */
interface RoleModelProps {
    isModalOpen: boolean;
    handleOk: () => void;
    handleCancel: () => void;
    form: any;
    refreshRoles: () => void;
    mode: 'add' | 'update';
    role?: Role;
}

const RoleModel: React.FC<RoleModelProps> = ({isModalOpen, handleOk, handleCancel, form, mode, role}) => {
    const [permissions, setPermissions] = React.useState<{ label: string; value: number }[]>([]);
    const [loading, setLoading] = React.useState(false);
    const [searchValue, setSearchValue] = React.useState('');

    const loadPermissions = async (search: string = '') => {
        setLoading(true);
        try {
            const params = {
                search,
                page: 0,
                size: 2000,
            };
            const response = await fetchAllPermission(params);
            const permissionOptions = response.data.map((perm: any) => {
                return {
                    label: perm.name,
                    value: perm.id
                };
            });
            setPermissions(permissionOptions);
        } catch (error) {
            console.error('Failed to fetch permissions', error);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        loadPermissions().then(res => {
            console.log(res);
        });
    }, []);

    useEffect(() => {
        if (mode === 'update' && role) {
            form.setFieldsValue({
                name: role.description,
                permissionIds: role.permissions.map((perm: any) => perm.id),
            });
            console.log({
                name: role.description,
                permissionIds: role.permissions.map((perm: any) => perm.id),
            })
        } else {
            form.resetFields();
        }
    }, [mode, role, form]);

    const handleSearch = (value: string) => {
        setSearchValue(value);
        loadPermissions(value);
    };

    return (
        <Modal
            title={mode === 'update' ? 'Cập nhập vai trò' : 'Thêm vai trò'}
            visible={isModalOpen}
            onOk={() => form.submit()}
            onCancel={handleCancel}
            footer={[
                <Button key="back" onClick={handleCancel}>
                    Cancel
                </Button>,
                <Button key="submit" type="primary" onClick={() => form.submit()}>
                    {mode === 'update' ? 'Cập nhập' : 'Thêm mới'}
                </Button>,
            ]}
        >
            <Form
                form={form}
                layout="vertical"
                name={mode === 'update' ? 'update_role_form' : 'add_role_form'}
                onFinish={handleOk}
            >
                <Form.Item
                    name="name"
                    label="Tên vai trò"
                    rules={[{required: true, message: 'Tên vai trò không được để trống !'}]}
                >
                    <Input placeholder="Tên vai trò"/>
                </Form.Item>

                <Form.Item
                    name="permissionIds"
                    label="Quyền"
                    rules={[{required: true, message: 'Vui lòng chọn ít nhất một quyền !'}]}
                >
                    <Select
                        mode="multiple"
                        placeholder="Chọn quyền"
                        filterOption={false}
                        onSearch={handleSearch}
                        notFoundContent={loading ? <Spin size="small"/> : null}
                        options={permissions}
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default RoleModel;
