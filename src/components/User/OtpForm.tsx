import React, {useState} from 'react';
import type {GetProps} from 'antd';
import {Input} from "antd";
import {toast} from "react-toastify";

type OTPProps = GetProps<typeof Input.OTP>;

interface OtpFormProps {
    email: string;
    onBack: () => void;
}

const OtpForm: React.FC<OtpFormProps> = ({email, onBack}) => {
    const [otp, setOtp] = useState('');


    const onChange: OTPProps['onChange'] = (text) => {
        console.log('onChange:', text);
    };

    const sharedProps: OTPProps = {
        onChange,
    };

    const handleSubmit = async () => {
        try {
            const response = await fetch('null', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({email, otp}),
            });

            if (response.ok) {
                toast.success('Xác minh thành công!');
            } else {
                toast.error('Mã xác minh không hợp lệ!');
            }
        } catch (error) {
            toast.error('Không thể kết nối tới server.');
        }
    };

    return (
        <div className="otp-form">
            <p className="text-muted text-center mb-4 mt-2" style={{width: "96%"}}>Vui lòng nhập mã xác minh đã được gửi
                đến email {email}</p>
            <Input.OTP style={{marginLeft: '25px'}} formatter={(str) => str.toUpperCase()} {...sharedProps} />
            <button className="mb-3 mt-3 btn btn-danger" style={{width: "93%"}}>
                Xác minh
            </button>
            <p className="mb-0 text-center">
                <small>Không nhận được mã xác minh? <a className="text_href">Gửi lại</a></small>
            </p>
        </div>
    );
};

export default OtpForm;
