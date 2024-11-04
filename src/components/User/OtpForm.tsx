import React, {useEffect, useState} from 'react';
import {Button, GetProps, Input, message} from 'antd';
import {BASE_API} from '../../constants/BaseApi.ts';

type OTPProps = GetProps<typeof Input.OTP>;

interface OtpFormProps {
    email: string;
    onBack: () => void;
    onSuccess: () => void;
}

const OtpForm: React.FC<OtpFormProps> = ({email, onBack , onSuccess}) => {
    const [otp, setOtp] = useState('');
    const [countdown, setCountdown] = useState(30);
    const [canResend, setCanResend] = useState(false);
    const [isLoading, setIsLoading] = useState(false); // State cho loading

    const onChange: OTPProps['onChange'] = (text) => {
        setOtp(text);
    };

    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        const char = String.fromCharCode(event.which);
        if (!/^[0-9]$/.test(char)) {
            event.preventDefault();
        }
    };

    const sharedProps: OTPProps = {
        onChange,
        value: otp,
        maxLength: 6,
        onKeyPress: handleKeyPress,
    };

    const handleResend = async () => {
        setCanResend(false);
        setCountdown(30);

        try {
            const response = await fetch(`${BASE_API + '/api/v1/auth/send-otp'}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({email}),
            });

            if (response.ok) {
                message.info('Mã xác minh đã được gửi lại!');
            } else {
                message.error('Không thể gửi lại mã xác minh. Vui lòng thử lại sau.');
            }
        } catch (error) {
            message.error('Không thể kết nối tới server.');
        }
    };

    const handleSubmit = async () => {
        setIsLoading(true); // Set loading khi bắt đầu submit
        try {
            const response = await fetch(`${BASE_API + '/api/v1/auth/valid-email'}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({email, otp}),
            });

            if (response.ok) {
                message.success('Xác minh thành công!');
                onSuccess();
            } else {
                const errorData = await response.json();
                message.error(errorData.message);
            }
        } catch (error) {
            console.log(error);
            message.error('Không thể kết nối tới server.');
        } finally {
            setIsLoading(false); // Tắt loading sau khi hoàn thành
        }
    };

    useEffect(() => {
        if (countdown > 0) {
            const timer = setInterval(() => {
                setCountdown((prev) => prev - 1);
            }, 1000);
            return () => clearInterval(timer);
        } else {
            setCanResend(true);
        }
    }, [countdown]);

    return (
        <div className="otp-form">
            <p className="text-muted text-center mb-4 mt-2" style={{width: '96%'}}>
                Vui lòng nhập mã xác minh đã được gửi đến email {email}
            </p>
            <Input.OTP
                style={{marginLeft: '25px'}}
                formatter={(str) => str.toUpperCase()}
                {...sharedProps}
            />
            <Button
                className="mb-3 mt-3 btn btn-danger"
                style={{width: '93%'}}
                onClick={handleSubmit}
                disabled={isLoading}
            >
                Xác minh
            </Button>
            <p className="mb-0">
                {canResend ? (
                    <small>
                        Không nhận được mã xác minh? <a className="text_href" onClick={handleResend}>Gửi lại</a>
                    </small>
                ) : (
                    <small>
                        <p className="mt-2">Gửi lại mã sau <a className="text_href" href="">{countdown}s</a></p>
                        Mã xác minh có hiệu lực trong <b>5 phút</b>
                    </small>
                )}
            </p>
        </div>
    );
};

export default OtpForm;
