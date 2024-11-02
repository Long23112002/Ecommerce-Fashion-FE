import { UserOutlined } from '@ant-design/icons';
import { MenuOutlined } from '@mui/icons-material';
import {
    AppBar, Box,
    Container,
    Drawer, IconButton,
    List, ListItem, ListItemText,
    Toolbar, Typography
} from '@mui/material';
import { Button, Dropdown, MenuProps } from "antd";
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

const categories = ['Sản phẩm mới', 'Sản phẩm hot', 'Áo', 'Quần'];

const items: MenuProps['items'] = [
    {
        key: '0',
        label: (
            <Link to='/user-info' color='black'>
                Thông tin tài khoản
            </Link>
        ),
    },
    {
        key: '1',
        label: (
            <Link to='/user-info' color='black'>
                Đơn hàng của tôi
            </Link>
        ),
    },
    {
        key: '2',
        label: (
            <Link to='/user-info' color='black'>
                Trung tâm hỗ trợ
            </Link>
        ),
    },
    {
        key: '3',
        label: (
            <Link to='/user-info' color='black'>
                Đăng xuất
            </Link>
        ),
    },
];

const headerHeight = 50;

const UserHeader: React.FC = () => {
    const userAction = useUserAction()
    const user = useSelector(userSelector);

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isLogin, setIsLogin] = useState(false);
    const [isLoginModalVisible, setIsLoginModalVisible] = useState(false);

    useEffect(() => {
        const userData = getUserData();
        userAction.save(userData)
    }, []);

    useEffect(() => {
        setIsLogin(user.id !== -1);
    }, [user]);

    const toggleDrawer = (open: boolean) => () => setIsDrawerOpen(open);

    const openLoginModal = () => setIsLoginModalVisible(true);
    const closeLoginModal = () => setIsLoginModalVisible(false);

    return (
        <>
            <AppBar position="sticky"
                id='user-header'
                sx={{
                    top: -1,
                    backgroundColor: 'white',
                    boxShadow: 'none',
                    borderBottom: '1px solid #eee'
                }}>
                <Container maxWidth="xl">
                    <Toolbar sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        height: headerHeight
                    }}
                    >
                        <Box sx={{
                            cursor: 'pointer',
                            overflow: "hidden",
                            borderRadius: 2,
                        }}>
                            <Link to={'/'}>
                                <img src="/logo.png" alt="Logo" height={`${headerHeight - 5}px`} />
                            </Link>
                        </Box>

                        <Box sx={{
                            display: {
                                xs: 'none',
                                lg: 'flex'
                            },
                            gap: 3.5
                        }}>
                            {categories.map((category) => (
                                <Link to={`/filter/${category.toLowerCase()}`} key={category}>
                                    <Typography
                                        variant="button"
                                        sx={{
                                            cursor: 'pointer',
                                            color: 'black',
                                            position: 'relative',
                                            ":hover": {
                                                color: '#1E90FF'
                                            }
                                        }}
                                    >
                                        {category}
                                    </Typography>
                                </Link>
                            ))}
                        </Box>

                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2
                        }}
                        >
                            <SearchInput
                                height={38}
                                sx={{
                                    display: { xs: 'none', lg: 'flex' }
                                }}
                            // onChange={}
                            // onClick={}
                            />
                            <CartIcon />
                            <Notification invisible={false} />

                            {isLogin ? (
                                <Dropdown menu={{ items }} trigger={['hover', 'click']} >
                                    <Box
                                        className="btn-custom"
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
                sx={{
                    color: '#f4f4f4',
                }}
            >
                <Box
                    sx={{
                        width: '85vw',
                        maxWidth: '400px',
                        p: 3,
                        pt: 4,
                    }}
                >
                    <SearchInput
                        // onChange={}
                        // onClick={}
                        height={45}
                        sx={{
                            display: 'flex',
                            mb: 3,
                        }}
                    />

                    <List>
                        {categories.map((category, index) => (
                            <Link to={`/filter/${category.toLowerCase()}`} color={'black'} key={index}>
                                <ListItem
                                    sx={{
                                        borderRadius: '12px',
                                        '&:hover': {
                                            backgroundColor: '#e0f7fa',
                                        },
                                        mb: 1,
                                    }}
                                >
                                    <ListItemText
                                        primary={category}
                                        primaryTypographyProps={{
                                            component: "span",
                                            fontSize: '18px',
                                            fontWeight: 500,
                                        }}
                                    />
                                </ListItem>
                            </Link>
                        ))}
                    </List>
                </Box>
            </Drawer>


            <LoginUserModel isModalVisible={isLoginModalVisible} handleCancel={closeLoginModal} />
        </>
    );
};

export default UserHeader;
