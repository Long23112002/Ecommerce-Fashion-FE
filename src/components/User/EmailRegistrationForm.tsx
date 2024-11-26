import React, {useState} from 'react';
import {Button, Col, Divider, Form, Input, message, Row, Typography} from 'antd';
import {ArrowLeftOutlined, FacebookFilled, GoogleOutlined} from '@ant-design/icons';
import './../../styles/email-registration-form.css';
import OtpForm from './OtpForm';
import {BASE_API} from "../../constants/BaseApi.ts";
import {getErrorMessage} from "../../pages/Error/getErrorMessage.ts";
import AccountCreationForm from './AccountCreationForm';
import {handleContinueWithFacebook, handleContinueWithGoogle} from "../../api/Oauth2.ts";

const {Title, Text, Link} = Typography;

export default function EmailRegistrationForm({onBack}: { onBack: () => void }) {
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [isVerified, setIsVerified] = useState(false);

    const onFinish = async (values: any) => {
        setLoading(true);
        try {
            const response = await fetch(`${BASE_API + "/api/v1/auth/send-otp"}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({email: values.email}),
            });

            if (response.ok) {
                message.success('Mã xác minh đã được gửi!');
                setEmail(values.email);
                setIsOtpSent(true);
            } else {
                const errorData = await response.json();
                message.error(errorData.message);
            }
        } catch (error) {
            message.error(getErrorMessage(error))
        } finally {
            setLoading(false);
        }
    };

    return (
        <Row style={{margin: "29px 0"}}>
            <Col span={12}>
                <div className="header-section">
                    <ArrowLeftOutlined onClick={onBack} style={{fontSize: '18px', color: '#999', cursor: 'pointer'}}/>
                    <Title level={4} className="styled-title">
                        {isVerified ? "Tạo tài khoản" : isOtpSent ? "Nhập mã xác minh" : "Tạo tài khoản"}
                    </Title>
                </div>

                {isVerified ? (
                    <AccountCreationForm email={email} onBack={() => setIsVerified(false)}/>
                ) : isOtpSent ? (
                    <OtpForm
                        email={email}
                        onBack={() => setIsOtpSent(false)}
                        onSuccess={() => setIsVerified(true)}
                    />
                ) : (
                    <div className="form-section">
                        <Form name="email_registration" onFinish={onFinish} layout="vertical">
                            <Form.Item
                                name="email"
                                label="Vui lòng nhập email"
                                rules={[
                                    {required: true, message: 'Vui lòng nhập email của bạn!'},
                                    {type: 'email', message: 'Email không hợp lệ!'},
                                ]}
                            >
                                <Input placeholder="Email"/>
                            </Form.Item>

                            <Form.Item>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    block
                                    className="styled-button"
                                    loading={loading}
                                    disabled={loading}
                                >
                                    Tiếp Tục
                                </Button>
                            </Form.Item>
                        </Form>
                        <Divider plain>Hoặc tiếp tục bằng</Divider>
                        <div style={{display: 'flex', justifyContent: 'space-between'}}>
                            <Button onClick={handleContinueWithFacebook} icon={<FacebookFilled/>}
                                    className="social-button facebook">
                                Facebook
                            </Button>
                            <Button onClick={handleContinueWithGoogle} icon={<GoogleOutlined/>}
                                    className="social-button">Google</Button>
                        </div>
                        <div style={{marginTop: '20px', fontSize: '12px', textAlign: 'center'}}>
                            <Text type="secondary">
                                Bằng việc tiếp tục, bạn đã đọc và đồng ý với{' '}
                                <Link href="#" target="_blank">
                                    điều khoản sử dụng
                                </Link>{' '}
                                và{' '}
                                <Link href="#" target="_blank">
                                    Chính sách bảo mật thông tin cá nhân
                                </Link>{' '}
                                của Ecommerce fashion
                            </Text>
                        </div>
                    </div>
                )}
            </Col>
            <Col span={12} className="illustration-section">
                <div style={{textAlign: 'center'}}>
                    <img
                        src="	https://salt.tikicdn.com/ts/upload/df/48/21/b4d225f471fe06887284e1341751b36e.png?height=200&width=200"
                        alt="Ecommerce fashion mascot"
                        style={{maxWidth: '100%', height: 'auto', marginBottom: '20px'}}
                    />
                    <Title level={5} style={{color: '#0d5cb6', margin: 0}}>
                        Mua sắm tại Ecommerce fashion
                    </Title>
                    <Text style={{color: '#0d5cb6'}}>Siêu ưu đãi mỗi ngày</Text>
                </div>
            </Col>
        </Row>
    );
}
