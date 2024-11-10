import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getUserData } from '../../../api/AuthApi';
import Avatar from '../../../components/avatar';
import CartIcon from '../../../components/cart/CartIcon';
import Link from '../../../components/Link';
import Notification from '../../../components/notification';
import SearchInput from '../../../components/SearchInput';
import { LoginUserModel } from '../../../components/User/LoginModelUser';
import { useUserAction } from '../../../hook/useUserAction';
import { userSelector } from '../../../redux/reducers/UserReducer';
import '../../../styles/style.css';

import { UserOutlined } from '@ant-design/icons';
import { MenuOutlined } from '@mui/icons-material';
import {
    AppBar, Box, Container,
    Drawer, IconButton, List,
    ListItem, ListItemText,
    Toolbar, Typography
} from '@mui/material';
import { Button, Dropdown, MenuProps } from "antd";

const categories = ['Sản phẩm mới', 'Sản phẩm hot', 'Áo', 'Quần'];
const headerHeight = 55; // min = 15 nếu không thì bị vỡ do avatar

const UserHeader: React.FC = () => {
    const userAction = useUserAction();
    const user = useSelector(userSelector);

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isLogin, setIsLogin] = useState(false);
    const [isLoginModalVisible, setIsLoginModalVisible] = useState(false);

    const logout = async () => {
        await userAction.logout();
    };

    const toggleDrawer = (open: boolean) => () => setIsDrawerOpen(open);
    const openLoginModal = () => setIsLoginModalVisible(true);
    const closeLoginModal = () => setIsLoginModalVisible(false);

    const items: MenuProps['items'] = [
        { key: '0', label: <Link to='/user-info' color='black'>Thông tin tài khoản</Link> },
        { key: '1', label: <Link to='/user-info' color='black'>Đơn hàng của tôi</Link> },
        { key: '2', label: <Link to='/user-info' color='black'>Trung tâm hỗ trợ</Link> },
        { key: '3', label: <Link to='/' color='black' onClick={logout}>Đăng xuất</Link> },
    ];

    useEffect(() => {
        const userData = getUserData();
        userAction.save(userData);
    }, []);

    useEffect(() => {
        setIsLogin(user.id !== -1);
    }, [user]);

    return (
        <Box position='sticky' top={-1} zIndex={10} className='shadow-header'>
            <AppBar
                position="sticky"
                id='user-header'
                sx={{
                    top: -1,
                    backgroundColor: 'white',
                    boxShadow: 'none',
                    borderBottom: '1px solid #eee'
                }}
            >
                <Container maxWidth="xl">
                    <Toolbar
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                        }}
                        style={{
                            minHeight: headerHeight,
                            height: headerHeight,
                            maxHeight: headerHeight
                        }}
                    >
                        <Box sx={{ cursor: 'pointer', overflow: "hidden", borderRadius: 2 }}>
                            <Link to='/'>
                                <img src="/logo.png" alt="Logo" height={`${headerHeight - 10}px`} />
                            </Link>
                        </Box>

                        <Box sx={{ display: { xs: 'none', lg: 'flex' }, gap: 3.5 }}>
                            {categories.map((category) => (
                                <Link to={`/filter/${category.toLowerCase()}`} key={category}>
                                    <Typography
                                        variant="button"
                                        sx={{
                                            cursor: 'pointer',
                                            color: 'black',
                                            ":hover": { color: '#1E90FF' }
                                        }}
                                    >
                                        {category}
                                    </Typography>
                                </Link>
                            ))}
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <SearchInput sx={{ display: { xs: 'none', lg: 'flex' } }} height={Math.min(headerHeight - 5, 37)} />
                            <CartIcon />
                            {/* <Notification invisible={false} /> */}

                            {isLogin ? (
                                <Dropdown menu={{ items }} trigger={['hover', 'click']}>
                                    <Box
                                        onClick={(e) => e.preventDefault()}
                                        sx={{
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            mx: { xs: 0.5, sm: 1.5, md: 3 }
                                        }}
                                    >
                                        <Avatar height={headerHeight - 15} />
                                        <Typography
                                            sx={{
                                                color: 'black',
                                                display: { xs: "none", lg: "block" },
                                                ml: 1,
                                                maxWidth: 220,
                                                height: 25,
                                                whiteSpace: 'nowrap',
                                                textOverflow: 'ellipsis',
                                            }}
                                            aria-label="User's full name"
                                        >
                                            {user.fullName || 'Guest'}
                                        </Typography>
                                    </Box>
                                </Dropdown>
                            ) : (
                                <Button type="text" onClick={openLoginModal} icon={<UserOutlined />}>
                                    Đăng nhập
                                </Button>
                            )}

                            <IconButton onClick={toggleDrawer(true)} sx={{ display: { xs: 'inline-flex', lg: 'none' } }}>
                                <MenuOutlined />
                            </IconButton>
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>

            <Drawer anchor="right" open={isDrawerOpen} onClose={toggleDrawer(false)} sx={{ color: '#f4f4f4' }}>
                <Box sx={{ width: '85vw', maxWidth: '400px', p: 3, pt: 4 }}>
                    <SearchInput height={45} sx={{ display: 'flex', mb: 3 }} />
                    <List>
                        {categories.map((category, index) => (
                            <Link to={`/filter/${category.toLowerCase()}`} key={index} color='black'>
                                <ListItem
                                    sx={{
                                        borderRadius: '12px',
                                        '&:hover': { backgroundColor: '#e0f7fa' },
                                        mb: 1
                                    }}
                                >
                                    <ListItemText primary={category} primaryTypographyProps={{
                                        component: "span",
                                        fontSize: '18px',
                                        fontWeight: 500
                                    }} />
                                </ListItem>
                            </Link>
                        ))}
                    </List>
                </Box>
            </Drawer>

            <LoginUserModel isModalVisible={isLoginModalVisible} handleCancel={closeLoginModal} />
        </Box>
    );
};

export default UserHeader;
