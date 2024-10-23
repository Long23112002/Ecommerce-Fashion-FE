import { UserOutlined } from '@ant-design/icons';
import { MenuOutlined, SearchOutlined } from '@mui/icons-material';
import {
    AppBar, Box,
    Container,
    Drawer, IconButton, InputBase, List, ListItem, ListItemText,
    Toolbar, Typography
} from '@mui/material';
import { Button, Dropdown, MenuProps } from "antd";
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getUserData } from '../../../api/AuthApi';
import Avatar from '../../../components/Avatar';
import CartIcon from '../../../components/Cart/CartIcon';
import Notification from '../../../components/Notification';
import { LoginUserModel } from '../../../components/User/LoginModelUser';
import { setUser, userSelector } from '../../../redux/reducers/UserReducer';
import '../../../styles/style.css';

const headerHeight = 50;

const categories = ['Sản phẩm mới', 'Sản phẩm hot', 'Áo', 'Quần'];

const items: MenuProps['items'] = [
    {
        key: '0',
        label: (
            <a className="menu-link" target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
                Thông tin tài khoản
            </a>
        ),
    },
    {
        key: '1',
        label: (
            <a className="menu-link" target="_blank" rel="noopener noreferrer" href="https://www.aliyun.com">
                Đơn hàng của tôi
            </a>
        ),
    },
    {
        key: '2',
        label: (
            <a className="menu-link" target="_blank" rel="noopener noreferrer" href="https://www.aliyun.com">
                Trung tâm hỗ trợ
            </a>
        ),
    },
    {
        key: '3',
        label: (
            <a className="menu-link" target="_blank" rel="noopener noreferrer" href="https://www.luohanacademy.com">
                Đăng xuất
            </a>
        ),
    },
];

const UserHeader: React.FC = () => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isLogin, setIsLogin] = useState(false);
    const [isLoginModalVisible, setIsLoginModalVisible] = useState(false);

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector(userSelector);

    useEffect(() => {
        const userData = getUserData();
        dispatch(setUser({
            id: Number(userData.id),
            fullName: userData.fullName,
            email: userData.email,
            avatar: userData.avatar,
            isAdmin: false
        }));
    }, []);

    useEffect(() => {
        setIsLogin(user.id !== -1);
    }, [user]);

    const toggleDrawer = (open: boolean) => () => setIsDrawerOpen(open);

    const openLoginModal = () => setIsLoginModalVisible(true);
    const closeLoginModal = () => setIsLoginModalVisible(false);

    return (
        <>
            <AppBar position="sticky" sx={{ backgroundColor: 'white', boxShadow: 'none', borderBottom: '1px solid #eee' }}>
                <Container maxWidth="xl">
                    <Toolbar sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        height: headerHeight
                    }}
                    >
                        <Box sx={{ cursor: 'pointer' }}
                            onClick={() => navigate('/')}
                        >
                            <img src="/logo.png" alt="Logo" height="40" />
                        </Box>

                        <Box sx={{
                            display: {
                                xs: 'none',
                                lg: 'flex'
                            },
                            gap: 3.5
                        }}>
                            {categories.map((category) => (
                                <Typography
                                    key={category}
                                    variant="button"
                                    onClick={() => navigate(`/category/${category.toLowerCase()}`)}
                                    sx={{ cursor: 'pointer', color: 'black', position: 'relative' }}
                                >
                                    {category}
                                </Typography>
                            ))}
                        </Box>

                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2
                        }}
                        >
                            <Box
                                sx={{
                                    border: '1px solid #9b9b9b',
                                    backgroundColor: '#fafafa',
                                    borderRadius: '20px',
                                    alignItems: 'center',
                                    padding: '0 0 0 8px',
                                    display: { xs: 'none', lg: 'flex' },
                                    height: '40px',
                                }}
                            >
                                <InputBase
                                    placeholder="Bạn tìm gì..."
                                    sx={{ ml: 1, flex: 1 }}
                                />
                                <IconButton
                                    sx={{
                                        marginLeft: 1,
                                    }}
                                >
                                    <SearchOutlined />
                                </IconButton>
                            </Box>
                            <CartIcon />
                            <Notification invisible={false} />

                            {isLogin ? (
                                <Dropdown menu={{ items }} trigger={['hover', 'click']}>
                                    <Box
                                        // className="btn-custom"
                                        onClick={(e) => e.preventDefault()}
                                        sx={{
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            mx: {
                                                xs: 0.5,
                                                sm: 1.5,
                                                md: 3
                                            }
                                        }}
                                    >
                                        <Avatar height={headerHeight - 15} />
                                        <Typography
                                            sx={{
                                                color: 'black',
                                                display: {
                                                    xs: "none",
                                                    lg: "block"
                                                },
                                                ml: 1,
                                                textAlign: 'end',
                                                maxWidth: 220,
                                                height: 25,
                                                overflow: 'hidden',
                                                whiteSpace: 'nowrap',
                                                textOverflow: 'ellipsis',
                                                marginRight: '2px',
                                            }}
                                            aria-label="User's full name"
                                        >
                                            {user.fullName || 'Guest'}
                                        </Typography>
                                    </Box>
                                </Dropdown>
                            ) : (
                                <Button type="text"
                                    onClick={openLoginModal}
                                    icon={<UserOutlined />}
                                >
                                    Đăng nhập
                                </Button>
                            )}
                            <IconButton
                                edge="end"
                                onClick={toggleDrawer(true)}
                                sx={{ display: { xs: 'inline-flex', lg: 'none' } }}
                            >
                                <MenuOutlined />
                            </IconButton>
                        </Box>

                    </Toolbar>
                </Container>
            </AppBar >

            <Drawer
                anchor="right"
                open={isDrawerOpen}
                onClose={toggleDrawer(false)}
            >
                <Box sx={{
                    width: '85vw',
                    maxWidth: '500px',
                    p: 2,
                    pt: 4
                }}>
                    <Box
                        sx={{
                            border: '1px solid #9b9b9b',
                            backgroundColor: '#fafafa',
                            borderRadius: '20px',
                            alignItems: 'center',
                            padding: '0 0 0 8px',
                            display: { xs: 'flex', lg: 'none' },
                            height: '40px',
                        }}
                    >
                        <InputBase
                            placeholder="Bạn tìm gì..."
                            sx={{ ml: 1, flex: 1 }}
                        />
                        <IconButton
                            sx={{
                                marginLeft: 1,
                            }}
                        >
                            <SearchOutlined />
                        </IconButton>
                    </Box>
                    <List>
                        {categories.map((category, index) => (
                            <ListItem key={index} onClick={() => navigate(`/category/${category.toLowerCase()}`)}>
                                <ListItemText primary={category} />
                            </ListItem>
                        ))}
                    </List>
                </Box>
            </Drawer>

            <LoginUserModel isModalVisible={isLoginModalVisible} handleCancel={closeLoginModal} />
        </>
    );
};

export default UserHeader;
