import React, { useState } from 'react';
import { Button, Input, Modal } from 'antd';
import { FacebookFilled, GoogleOutlined } from '@ant-design/icons';
import '../../styles/animatied-text.css';
import { LoginRequest } from "../../types/login/request/loginRequest.ts";
import { handleLogin, storeUserData } from "../../api/AuthApi.ts";
import { toast } from "react-toastify";
import { getErrorMessage } from "../../pages/Error/getErrorMessage.ts";

interface LoginUserModelProps {
    isModalVisible: boolean;
    handleCancel: () => void;
}

const LoginUserModel: React.FC<LoginUserModelProps> = ({ isModalVisible, handleCancel }) => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

    const validateInputs = () => {
        const newErrors: { email?: string; password?: string } = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!email) {
            newErrors.email = "Email không được để trống!";
        } else if (!emailRegex.test(email)) {
            newErrors.email = "Email không đúng định dạng!";
        }

        if (!password) {
            newErrors.password = "Mật khẩu không được để trống!";
        } else if (password.length < 6) {
            newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự!";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleLoginClick = async () => {
        if (!validateInputs()) return;

        const loginRequest: LoginRequest = { email, password };
        setLoading(true);

        try {
            const loginResponse = await handleLogin(loginRequest);
            storeUserData(loginResponse);
            toast.success("Đăng nhập thành công!");
            handleCancel();
        } catch (error) {
            toast.error(getErrorMessage(error));
        } finally {
            setLoading(false);
        }
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
        setShowPassword(e.target.value.length > 0);
        validateInputs();
        setErrors({ ...errors, email: undefined });
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
        validateInputs();
        setErrors({ ...errors, password: undefined });
    };

    return (
        <>
            <Modal
                visible={isModalVisible}
                onCancel={handleCancel}
                footer={null}
                width={700}
            >
                <div className="container-fluid p-0">
                    <div className="row">
                        <div className="col-md-8">
                            <h2 className="mb-2" style={{ minHeight: '2.5rem' }}>
                                <span className="text_typing">Xin chào</span>
                            </h2>
                            <p className="text-muted mb-4" style={{ minHeight: '1.5rem' }}>
                                <span className="text_typing">Đăng nhập hoặc Tạo tài khoản</span>
                            </p>

                            <Input
                                placeholder="Nhập email của bạn"
                                className="mb-4"
                                value={email}
                                onChange={handleEmailChange}
                                status={errors.email ? 'error' : undefined}
                            />
                            {errors.email && <p className="text-danger">{errors.email}</p>}

                            <Input.Password
                                value={password}
                                onChange={handlePasswordChange}
                                placeholder="Nhập mật khẩu của bạn"
                                className={`mb-4 input-password ${showPassword ? 'visible' : ''}`}
                                status={errors.password ? 'error' : undefined}
                            />
                            {errors.password && <p className="text-danger">{errors.password}</p>}

                            <Button
                                onClick={handleLoginClick}
                                type="primary"
                                className="w-100 mb-4"
                                style={{ backgroundColor: '#ff424e', borderColor: '#ff424e' }}
                                loading={loading}
                                disabled={loading}
                            >
                                Tiếp Tục
                            </Button>

                            <div className="text-center mb-4 text-muted">
                                Hoặc tiếp tục bằng
                            </div>

                            <div className="d-flex justify-content-center mb-4">
                                <Button icon={<FacebookFilled />} shape="circle" className="me-3" />
                                <Button icon={<GoogleOutlined />} shape="circle" />
                            </div>

                            <p className="text-muted small text-center">
                                <a className="text_href" href="#">Quên mật khẩu?</a>
                                <p style={{ fontSize: '13px' }}>Chưa có tài khoản? <a className="text_href" href="#">Tạo tài khoản</a></p>
                                Bằng việc tiếp tục, bạn đã đọc và đồng ý với{' '}
                                <a href="#" className="text_href">điều khoản sử dụng</a> và{' '}
                                <a href="#" className="text_href">chính sách bảo mật thông tin cá nhân</a> của
                                Ecommerce fashion
                            </p>
                        </div>
                        <div className="col-md-4 d-none d-md-block" style={{ backgroundColor: '#f2f6fe' }}>
                            <div className="position-relative h-100">
                                <img
                                    src="http://ecommerce-fashion.site:9099/lNFf1ycSXW-imageLogoLogin.png"
                                    alt="Ecommerce fashion Character"
                                    className="position-absolute bottom-0 end-0 w-100"
                                />
                                <div className="position-absolute bottom-0 start-0 end-0 text-center mb-4">
                                    <p className="text-primary fw-bold mb-0">Mua sắm tại Ecommerce fashion</p>
                                    <p className="text-primary small">Siêu ưu đãi mỗi ngày</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default LoginUserModel;
