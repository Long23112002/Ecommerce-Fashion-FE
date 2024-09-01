import React, {useEffect} from 'react';
import {Form, Modal, Input, Button, Select, Spin} from 'antd';
import {fetchAllPermission} from '../../api/PermissionApi.ts';
import {Role} from "../../types/role.ts";

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
                size: 10,
            };
            const response = await fetchAllPermission(params);
            const permissionOptions = response.data.map((perm: any) => ({
                label: perm.name,
                value: perm.id,
            }));
            setPermissions(permissionOptions);
        } catch (error) {
            console.error('Failed to fetch permissions', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPermissions();
    }, []);

    useEffect(() => {
        if (mode === 'update' && role) {
            form.setFieldsValue({
                name: role.name,
                permissionIds: role.permissions.map((perm: any) => perm.id),
            });
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
            title={mode === 'update' ? 'Update Role' : 'Add Role'}
            visible={isModalOpen}
            onOk={() => form.submit()}
            onCancel={handleCancel}
            footer={[
                <Button key="back" onClick={handleCancel}>
                    Cancel
                </Button>,
                <Button key="submit" type="primary" onClick={() => form.submit()}>
                    {mode === 'update' ? 'Update' : 'Add'}
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
                    label="Role Name"
                    rules={[{required: true, message: 'Please input the role name!'}]}
                >
                    <Input placeholder="Enter role name"/>
                </Form.Item>

                <Form.Item
                    name="permissionIds"
                    label="Permissions"
                    rules={[{required: true, message: 'Please select at least one permission'}]}
                >
                    <Select
                        mode="multiple"
                        placeholder="Select permissions"
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
