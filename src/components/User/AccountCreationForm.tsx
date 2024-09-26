import React, { useState } from 'react';
import { Modal, Form, Input, Button, Typography, Row, Col } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export default function AccountCreationForm() {
    const [isModalVisible, setIsModalVisible] = useState(true);

    const handleClose = () => {
        setIsModalVisible(false);
    };

    const onFinish = (values: any) => {
        console.log('Success:', values);
    };

    return (
        <Modal
            visible={isModalVisible}
            footer={null}
            closable={false}
            width={800}
            bodyStyle={{ padding: 0 }}
        >
            <Row>
                <Col span={12}>
                    <div style={{ padding: '16px', borderBottom: '1px solid #f0f0f0' }}>
                        <ArrowLeftOutlined onClick={handleClose} style={{ fontSize: '18px', color: '#999' }} />
                        <Title level={4} style={{ textAlign: 'center', margin: '0 0 0 24px' }}>
                            Tạo tài khoản
                        </Title>
                    </div>
                    <Form
                        name="account_creation"
                        onFinish={onFinish}
                        layout="vertical"
                        style={{ padding: '24px' }}
                    >
                        <Form.Item
                            name="name"
                            label="Vui lòng cho biết tên bạn"
                            rules={[{ required: true, message: 'Vui lòng nhập tên của bạn!' }]}
                        >
                            <Input placeholder="Nguyễn Hải Long S" />
                        </Form.Item>

                        <Form.Item
                            name="password"
                            label="Đặt mật khẩu"
                            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
                        >
                            <Input.Password />
                        </Form.Item>
                        <Text type="secondary" style={{ display: 'block', marginTop: '-20px', marginBottom: '16px' }}>
                            Từ 8 đến 32 kí tự, bao gồm số và chữ
                        </Text>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" style={{ width: '100%', backgroundColor: '#ff424e', borderColor: '#ff424e' }}>
                                Tạo tài khoản
                            </Button>
                        </Form.Item>
                    </Form>
                    <div style={{ backgroundColor: '#e5f1ff', padding: '24px', textAlign: 'center' }}>
                        <Title level={5} style={{ color: '#0d5cb6', margin: 0 }}>
                            Mua sắm tại Tiki
                        </Title>
                        <Text style={{ color: '#0d5cb6' }}>
                            Siêu ưu đãi mỗi ngày
                        </Text>
                    </div>
                </Col>
                <Col span={12} style={{ backgroundColor: '#e5f1ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img
                        src="/placeholder.svg?height=300&width=300"
                        alt="Tiki mascot"
                        style={{ maxWidth: '100%', height: 'auto' }}
                    />
                </Col>
            </Row>
        </Modal>
    );
}