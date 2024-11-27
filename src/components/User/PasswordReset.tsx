import React from 'react';
import {Input, Button} from 'antd';
import {ArrowLeftOutlined} from '@ant-design/icons';

export default function PasswordReset({onBack}: { onBack: () => void }) {
    return (
        <div className=" d-flex align-items-center justify-content-center" >
            <div className="" style={{maxWidth: '900px', width: '100%', margin: "30px 0"}}>
                <div className="row g-0">
                    <div className="col-md-6 p-4">
                        <div className="d-flex align-items-center mb-4" onClick={onBack} style={{cursor: 'pointer'}}>
                            <ArrowLeftOutlined className="me-3" style={{fontSize: '18px'}}/>
                            <h4 className="mb-0">Quên mật khẩu ?</h4>
                        </div>
                        <p className="text-muted mb-4">
                            Vui lòng nhập thông tin tài khoản để lấy lại mật khẩu
                        </p>
                        <Input
                            placeholder="Email"
                            size="large"
                            className="mb-3"
                        />
                        <button className="mb-3 btn btn-danger w-100">
                            Lấy lại mật khẩu
                        </button>
                        <p className="text-center mb-0">
                            <small>
                                Liên hệ Hotline 0888880243
                            </small>
                        </p>
                    </div>
                    <div style={{background: "linear-gradient(136deg, rgb(240, 248, 255) -1%, rgb(219, 238, 255) 85%)"}}
                         className="col-md-6  d-flex flex-column justify-content-center align-items-center text-white p-4">
                        <img
                            src="	https://salt.tikicdn.com/ts/upload/df/48/21/b4d225f471fe06887284e1341751b36e.png"
                            alt="Illustration"
                            style={{maxWidth: '150px'}}
                        />
                        <p className="text-center text-primary mt-3 mb-0">
                            <strong>Mua sắm tại Ecommerce fashion</strong>
                        </p>
                        <p className="text-center text-primary">
                            <small>Siêu ưu đãi mỗi ngày</small>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}