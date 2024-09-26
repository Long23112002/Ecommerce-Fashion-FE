import React, {useState} from 'react';
import {Button, Col, Divider, Form, Input, message, Row, Typography} from 'antd';
import {ArrowLeftOutlined, FacebookFilled, GoogleOutlined} from '@ant-design/icons';
import './../../styles/email-registration-form.css';
import OtpForm from './OtpForm';

const {Title, Text, Link} = Typography;

export default function EmailRegistrationForm({onBack}: { onBack: () => void }) {
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [email, setEmail] = useState('');

    const onFinish = async (values: any) => {
        try {
            const response = await fetch('/api/verify-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({email: values.email}),
            });

            if (true) {
                message.success('Mã xác minh đã được gửi!');
                setEmail(values.email);
                setIsOtpSent(true);
            } else {
                message.error('Có lỗi xảy ra khi gửi mã xác minh.');
            }
        } catch (error) {
            message.error('Không thể kết nối tới server.');
        }
    };

    return (
        <Row style={{margin: "29px 0"}}>
            <Col span={12}>
                <div className="header-section">
                    <ArrowLeftOutlined onClick={onBack} style={{fontSize: '18px', color: '#999', cursor: 'pointer'}}/>
                    <Title level={4} className="styled-title">{isOtpSent ? "Nhập mã xác minh" : "Tạo tài khoản"}</Title>
                </div>

                {isOtpSent ? (
                    <OtpForm email={email} onBack={() => setIsOtpSent(false)}/>
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
                                <Button type="primary" htmlType="submit" block className="styled-button">
                                    Tiếp Tục
                                </Button>
                            </Form.Item>
                        </Form>
                        <Divider plain>Hoặc tiếp tục bằng</Divider>
                        <div style={{display: 'flex', justifyContent: 'space-between'}}>
                            <Button icon={<FacebookFilled/>} className="social-button facebook">
                                Facebook
                            </Button>
                            <Button icon={<GoogleOutlined/>} className="social-button">Google</Button>
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
                        src="http://ecommerce-fashion.site:9099/lNFf1ycSXW-imageLogoLogin.png?height=200&width=200"
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
