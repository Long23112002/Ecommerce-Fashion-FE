import {
    EyeInvisibleOutlined,
    EyeTwoTone,
    FacebookFilled,
    GoogleOutlined,
    LockOutlined,
    UserOutlined
} from '@ant-design/icons';
import { Button, Divider, Form, Input, Typography } from 'antd';
import 'react-toastify/dist/ReactToastify.css';
import { handleContinueWithFacebook, handleContinueWithGoogle } from "../../../api/Oauth2.ts";
import { useUserAction } from '../../../hook/useUserAction.ts';
import { LoginRequest } from "../../../types/login/request/loginRequest.ts";

const { Title } = Typography;

export default function Login() {
    const [form] = Form.useForm();
    const userAction = useUserAction()

    const onFinish = async (values: LoginRequest) => {
        userAction.login(values)
    };


    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            backgroundColor: 'black'
        }}>
            <div style={{
                width: '100%',
                maxWidth: '400px',
                padding: '2rem',
                backgroundColor: 'white',
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)'
            }}>
                <Title level={2} style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    Admin Login
                </Title>
                <Form
                    form={form}
                    name="login"
                    onFinish={onFinish}
                    layout="vertical"
                >
                    <Form.Item
                        name="email"
                        rules={[
                            { required: true, message: 'Please input your Email!' },
                            { type: 'email', message: 'Please enter a valid email!' }
                        ]}
                    >
                        <Input
                            prefix={<UserOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                            placeholder="Email"
                            size="large"
                        />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'Please input your Password!' }]}
                    >
                        <Input.Password
                            prefix={<LockOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                            placeholder="Password"
                            iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                            size="large"
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit"
                            style={{ width: '100%', backgroundColor: 'black', borderColor: 'black' }} size="large">
                            Sign in with Email
                        </Button>
                    </Form.Item>
                </Form>

                <Divider plain>Or continue with</Divider>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <Button
                        icon={<GoogleOutlined />}
                        onClick={handleContinueWithGoogle}
                        size="large"
                        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                    >
                        Google
                    </Button>
                    <Button
                        icon={<FacebookFilled />}
                        onClick={handleContinueWithFacebook}
                        style={{
                            backgroundColor: '#1877F2',
                            borderColor: '#1877F2',
                            color: 'white',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                        size="large"
                    >
                        Facebook
                    </Button>
                </div>
            </div>

        </div>
    );
}
