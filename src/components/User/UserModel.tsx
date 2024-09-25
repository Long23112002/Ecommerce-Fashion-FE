
import React, {useEffect, useState} from 'react';
import {Button, DatePicker, Form, Input, Modal, Select} from 'antd';
import {GenderEnum} from "../../enum/GenderEnum.ts";
import {fetchAllRole} from "../../api/RoleApi.ts";
import {UserRequest} from "../../types/User.ts";
import moment from 'moment';

interface UserModelProps {
    isModalOpen: boolean;
    handleOk: () => void;
    handleCancel: () => void;
    form: any;
    refreshUsers: () => void;
    mode: 'add' | 'update';
    user?: UserRequest;
}

const UserModel: React.FC<UserModelProps> = ({isModalOpen, handleOk, handleCancel, form, mode, user}) => {
    const [roles, setRoles] = React.useState<{ label: string; value: number }[]>([]);
    const [loading, setLoading] = React.useState(false);
    const [searchValue, setSearchValue] = React.useState('');

    const loadRoles = async (search: string = '') => {
        setLoading(true);
        try {
            const params = {
                search,
                page: 0,
                size: 10,
            };
            const response = await fetchAllRole("", params.size, params.page);
            const roleOptions = response.data.map((role: any) => ({
                label: role.name,
                value: role.id,
            }));
            setRoles(roleOptions);
        } catch (error) {
            console.error('Failed to fetch roles', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadRoles();
    }, []);

    useEffect(() => {
        if (mode === 'update' && user) {
            form.setFieldsValue({
                email: user.email,
                password: '',
                confirmPassword: '',
                fullName: user.fullName,
                phoneNumber: user.phoneNumber,
                birth: user.birth ? moment(user.birth) : null,
                gender: user.gender,
                avatar: user.avatar,
            });
        } else {
            form.resetFields();
        }
    }, [mode, user, form]);

    const handleSearch = (value: string) => {
        setSearchValue(value);
        loadRoles(value);
    };

    return (
        <Modal
            title={mode === 'update' ? 'Cập nhật' : 'Thêm mới'}
            visible={isModalOpen}
            onOk={() => form.submit()}
            onCancel={handleCancel}
            footer={[
                <Button key="back" onClick={handleCancel}>
                    Cancel
                </Button>,
                <Button key="submit" type="primary" onClick={() => form.submit()}>
                    {mode === 'update' ? 'Cập nhật' : 'Thêm mới'}
                </Button>,
            ]}
        >
            <Form
                form={form}
                layout="vertical"
                name={mode === 'update' ? 'update_user_form' : 'add_user_form'}
                onFinish={handleOk}
                initialValues={{birth: null}}
            >
                <Form.Item
                    name="email"
                    label="Email"
                    rules={[{required: true, message: 'Email không được để trống!'}]}
                >
                    <Input/>
                </Form.Item>
                <Form.Item
                    name="password"
                    label="Mật khẩu"
                    rules={[{required: mode === 'add', message: 'Mật khẩu không được để trống!'}]}
                >
                    <Input.Password/>
                </Form.Item>
                <Form.Item
                    name="confirmPassword"
                    label="Xác nhận mật khẩu"
                    dependencies={['password'] as any}
                    rules={[
                        {required: mode === 'add', message: 'Xác nhận mật khẩu không được để trống!'},
                        ({getFieldValue}) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('password' as any) === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                            },
                        }),
                    ]}
                >
                    <Input.Password/>
                </Form.Item>
                <Form.Item
                    name="fullName"
                    label="Họ và tên"
                    rules={[{required: true, message: 'Họ và tên không được để trống!'}]}
                >
                    <Input/>
                </Form.Item>
                <Form.Item
                    name="phoneNumber"
                    label="Số điện thoại"
                    rules={[{required: true, message: 'Số điện thoại không được để trống!'}]}
                >
                    <Input/>
                </Form.Item>
                <Form.Item
                    name="birth"
                    label="Ngày sinh"
                >
                    <DatePicker format="YYYY-MM-DD"/>
                </Form.Item>
                <Form.Item
                    name="gender"
                    label="Giới tính"
                >
                    <Select>
                        {Object.entries(GenderEnum).map(([key, value]) => (
                            <Select.Option key={value} value={value}>
                                {key}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default UserModel;
