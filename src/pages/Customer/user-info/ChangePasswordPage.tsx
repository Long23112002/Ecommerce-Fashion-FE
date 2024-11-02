import { Box, Button, Checkbox, FormControlLabel, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { updateUserPassword } from '../../../api/UserApi';
import { userSelector } from '../../../redux/reducers/UserReducer';
import { ChangePasswordRequest } from '../../../types/User';

const ChangePasswordPage: React.FC = () => {
    const user = useSelector(userSelector);
    const [passwords, setPasswords] = useState<ChangePasswordRequest>({
        email: '',
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
    });

    const [passwordError, setPasswordError] = useState({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
    });

    const [isVisible, setIsVisible] = useState<boolean>(false);

    useEffect(() => {
        setPasswords({
            email: user.email + '',
            currentPassword: '',
            newPassword: '',
            confirmNewPassword: '',
        });
    }, [user]);

    const validatePasswords = () => {
        let isValid = true;
        const errors = { currentPassword: '', newPassword: '', confirmNewPassword: '' };

        if (!passwords.currentPassword) {
            errors.currentPassword = 'Vui lòng nhập mật khẩu hiện tại';
            isValid = false;
        }

        if (!passwords.newPassword) {
            errors.newPassword = 'Vui lòng nhập mật khẩu mới';
            isValid = false;
        } else if (passwords.newPassword.length < 6) {
            errors.newPassword = 'Mật khẩu mới phải có ít nhất 6 ký tự!';
            isValid = false;
        }

        if (passwords.confirmNewPassword !== passwords.newPassword) {
            errors.confirmNewPassword = 'Mật khẩu xác nhận không khớp';
            isValid = false;
        }

        setPasswordError(errors);
        return isValid;
    };

    const handleChange = (field: keyof typeof passwords, value: string) => {
        setPasswords((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handlePasswordUpdate = async () => {
        if (!validatePasswords()) {
            return;
        }

        if (user.email) {
            try {
                await updateUserPassword(passwords);
                toast.success('Đổi mật khẩu thành công');
            } catch (error: any) {
                const messages = error.response.data.message;
                if (typeof messages == 'string') {
                    toast.error(messages);
                    return;
                }
                const firstKey = Object.keys(messages)[0];
                const firstMessage = messages[firstKey];
                toast.error(firstMessage);
            }
        }
    };

    return (
        <Box sx={{ p: { xs: 3, sm: 5 } }}>
            <Typography variant="h5" align="center" gutterBottom>
                Đổi Mật Khẩu
            </Typography>

            <Box component="form" noValidate autoComplete="off">
                <TextField
                    fullWidth
                    label="Email"
                    value={user.email}
                    sx={{ mb: 2 }}
                    required
                    disabled
                />

                <TextField
                    fullWidth
                    label="Mật khẩu hiện tại"
                    type={isVisible ? 'text' : 'password'}
                    value={passwords.currentPassword}
                    onChange={(e) => handleChange('currentPassword', e.target.value)}
                    error={!!passwordError.currentPassword}
                    helperText={passwordError.currentPassword}
                    sx={{ mb: 2 }}
                />

                <TextField
                    fullWidth
                    label="Mật khẩu mới"
                    type={isVisible ? 'text' : 'password'}
                    value={passwords.newPassword}
                    onChange={(e) => handleChange('newPassword', e.target.value)}
                    error={!!passwordError.newPassword}
                    helperText={passwordError.newPassword}
                    sx={{ mb: 2 }}
                />

                <TextField
                    fullWidth
                    label="Xác nhận mật khẩu mới"
                    type={isVisible ? 'text' : 'password'}
                    value={passwords.confirmNewPassword}
                    onChange={(e) => handleChange('confirmNewPassword', e.target.value)}
                    error={!!passwordError.confirmNewPassword}
                    helperText={passwordError.confirmNewPassword}
                    sx={{ mb: 2 }}
                />

                <FormControlLabel control={<Checkbox checked={isVisible} onClick={() => setIsVisible(prev => !prev)} />} label='Hiển thị mật khẩu' />

                <Button variant="contained" color="primary" fullWidth sx={{ mt: 3 }} onClick={handlePasswordUpdate}>
                    Cập nhật mật khẩu
                </Button>
            </Box>
        </Box>
    );
};

export default ChangePasswordPage;
