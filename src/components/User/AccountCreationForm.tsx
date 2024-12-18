import React, {useState} from 'react';
import {Button, Form, Input, message, Typography} from 'antd';
import {createUser} from "../../api/UserApi.ts";
import {GenderEnum} from "../../enum/GenderEnum.ts";

const {Text} = Typography;

interface AccountCreationFormProps {
    email: string;
    onBack: () => void;
}

const AccountCreationForm: React.FC<AccountCreationFormProps> = ({email, onBack}) => {
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    const onFinish = async (values: any) => {
        setLoading(true);
        try {
            const errors = form.getFieldsError();
            const response = await createUser({
                email,
                fullName: values.name,
                phoneNumber: values.phone,
                password: values.password,
                birth: new Date(),
                gender: GenderEnum.OTHER,
                avatar: null,
                isCheck: true
            });
            message.success('Tài khoản đã được tạo thành công!');
            form.resetFields(); // Reset form khi thành công
        } catch (error) {
            message.error('Đã xảy ra lỗi khi tạo tài khoản, vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Form
                form={form}
                name="account_creation"
                onFinish={onFinish}
                layout="vertical"
                style={{padding: '24px'}}
            >
                <Form.Item
                    name="name"
                    label="Vui lòng cho biết tên bạn"
                    rules={[{required: true, message: 'Vui lòng nhập tên của bạn!'}]}
                >
                    <Input placeholder="Nhập họ và tên"/>
                </Form.Item>

                <Form.Item
                    name="phone"
                    label="Số điện thoại"
                    rules={[{required: true, message: 'Vui lòng nhập số điện thoại!'}]}
                >
                    <Input placeholder="Nhập số điện thoại"/>
                </Form.Item>

                <Form.Item
                    name="password"
                    label="Đặt mật khẩu"
                    rules={[{required: true, message: 'Vui lòng nhập mật khẩu!'}]}
                >
                    <Input.Password/>
                </Form.Item>
                <Text type="secondary" style={{display: 'block', marginTop: '-20px', marginBottom: '16px'}}>
                    Từ 8 đến 32 kí tự, bao gồm số và chữ
                </Text>

                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        style={{width: '100%', backgroundColor: '#ff424e', borderColor: '#ff424e'}}
                        loading={loading}
                        disabled={loading}
                    >
                        Tạo tài khoản
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
}

export default AccountCreationForm;
