import React, {useState} from 'react';
import {Modal} from 'antd';
import '../../styles/animatied-text.css';
import LoginForm from "./LoginForm.tsx";
import PasswordReset from "./PasswordReset.tsx";
import EmailRegistrationForm from "./EmailRegistrationForm.tsx";

interface LoginUserModelProps {
    isModalVisible: boolean;
    handleCancel: () => void;
}

export const LoginUserModel: React.FC<LoginUserModelProps> = ({isModalVisible, handleCancel}) => {
    const [isResetPassword, setIsResetPassword] = useState<boolean>(false);
    const [isRegistering, setIsRegistering] = useState<boolean>(false);

    const handleBack = () => {
        setIsResetPassword(false);
        setIsRegistering(false);
    };

    return (
        <Modal
            open={isModalVisible}
            onCancel={handleCancel}
            footer={null}
            width={700}
            className="custom-modal"
        >
            {isResetPassword ? (
                <PasswordReset onBack={handleBack}/>
            ) : isRegistering ? (
                <EmailRegistrationForm
                onBack={handleBack}
                />
            ) : (
                <LoginForm
                    handleCancel={handleCancel}
                    onForgotPassword={() => setIsResetPassword(true)}
                    onRegister={() => setIsRegistering(true)}
                />
            )}
        </Modal>
    );
};

