import { AppBar, Box, IconButton, Toolbar, Typography } from '@mui/material';
import { Dropdown } from 'antd';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserData } from '../../../api/AuthApi';
import Avatar from '../../../components/avatar';
import Link from '../../../components/Link';
import NotificationIcon from '../../../components/notification';
import { useUserAction } from '../../../hook/useUserAction';
import { userSelector } from '../../../redux/reducers/UserReducer';

interface IProps {
    handleCollapse: () => void;
    handleToggled: () => void;
    broken: boolean;
}

const AdminHeader: React.FC<IProps> = ({ handleCollapse, handleToggled, broken }) => {
    const userAction = useUserAction();
    const user = useSelector(userSelector);
    const dispatch = useDispatch();

    useEffect(() => {
        userAction.save(getUserData());
    }, [dispatch, userAction]);

    const menuItems = [
        { key: '0', label: <Link to='/admin/user-info' color='black'>Thông tin tài khoản</Link> },
        { key: '1', label: <Link to='/' color='black' onClick={() => userAction.logout()}>Đăng xuất</Link> },
    ];

    return (
        <Box position='sticky' top={0} zIndex={10} className='shadow-header'>
            <AppBar position='static' sx={{ boxShadow: 'none' }}>
                <Toolbar sx={{ backgroundColor: 'white' }}>
                    <IconButton
                        size="large"
                        edge="start"
                        aria-label="menu"
                        onClick={broken ? handleToggled : handleCollapse}
                        sx={{ mr: 2, color: '#1A2023' }}
                    >
                        <i className="fa-solid fa-bars fs-2" />
                    </IconButton>

                    <Box sx={{ display: 'flex', flexGrow: 1, justifyContent: 'end' }}>
                        <NotificationIcon mr />
                        <Dropdown menu={{ items: menuItems }} trigger={['hover', 'click']}>
                            <Box
                                className="btn-custom"
                                onClick={(e) => e.preventDefault()}
                                sx={{
                                    cursor: 'pointer', display: 'flex', alignItems: 'center',
                                }}
                            >
                                <Typography
                                    sx={{
                                        color: 'black', display: { xs: 'none', lg: 'block' },
                                        mr: 2, textAlign: 'end', maxWidth: 220, height: 25,
                                        overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis',
                                    }}
                                >
                                    {user.fullName || 'Guest'}
                                </Typography>
                                <Avatar />
                            </Box>
                        </Dropdown>
                    </Box>
                </Toolbar>
            </AppBar>
        </Box>
    );
};

export default AdminHeader;
