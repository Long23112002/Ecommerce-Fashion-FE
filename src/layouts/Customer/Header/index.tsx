import { AppBar, Box, Container, Toolbar, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Notification from '../../../components/Notification'
import { setUser, userSelector } from '../../../redux/reducers/UserReducer'
import Avatar from '../../../components/Avatar'
import { getUserData } from '../../../api/AuthApi'
import { Button, Dropdown, MenuProps } from "antd";
import { UserOutlined } from '@ant-design/icons';
import { LoginUserModel } from "../../../components/User/LoginModelUser.tsx";
import '../../../styles/style.css'
import { useNavigate } from 'react-router-dom'
import CartIcon from '../../../components/Cart/CartIcon.tsx'
import Search from 'antd/es/input/Search'

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

const headerHeight = 50;

const UserHeader: React.FC = () => {
    const user = useSelector(userSelector)
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState<boolean>(false);
    const [isLoginModalVisible, setIsLoginModalVisible] = useState(false);

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

    const openLoginModal = () => {
        setIsLoginModalVisible(true);
    };

    const closeLoginModal = () => {
        setIsLoginModalVisible(false);
    };

    useEffect(() => {
        console.log(user.id)
        setIsLogin(user.id != -1)
    }, [user])


    return (
        <>

            <a href="" style={{ textDecoration: "none", backgroundColor: "#EFFFF4", cursor: "pointer" }}
                className="d-flex justify-content-center align-items-center header-top">
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <p style={{ color: "#00AB56", fontWeight: "bold", fontSize: 11, marginBottom: 0 }}>Freeship đơn từ 45k, giảm nhiều hơn cùng</p>
                    <img style={{ height: '14px', marginLeft: "5px" }} alt=""
                        src="https://salt.tikicdn.com/ts/upload/a7/18/8c/910f3a83b017b7ced73e80c7ed4154b0.png" />
                </div>
            </a>

            <Box position='sticky' top={0} zIndex={10}>
                <AppBar
                    position='static'
                    sx={{
                        backgroundColor: 'white',
                        boxShadow: 'none',
                        borderBottom: "1px solid #f0f0f0",
                    }}
                >
                    <Container maxWidth='xl'>
                        <Toolbar
                            sx={{
                                maxHeight: `${headerHeight}px !important`,
                                minHeight: `${headerHeight}px !important`,
                                height: `${headerHeight}px !important`,
                                p: 0.5
                            }}
                        >

                            <Box
                                height='100%'
                                sx={{
                                    overflow: 'hidden',
                                    borderRadius: 2
                                }}
                            >
                                <img src="/logo.png" alt="" height='100%'
                                    onClick={() => navigate("/")} />
                            </Box>
                            <Box sx={{ display: 'flex', flexGrow: 1, justifyContent: 'end' }}>

                                <Container
                                    maxWidth='md'
                                    sx={{
                                        display: 'flex',
                                        flexGrow: 1,
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}>
                                    <Search
                                        placeholder="Tên sản phẩm"
                                        style={{
                                            width: '100%',
                                        }}
                                        prefix={<i className="fa-solid fa-magnifying-glass mx-2" />}
                                        enterButton={'Tìm kiếm'}
                                    />
                                </Container>

                                <Box component='span' display='flex' alignItems='center'>
                                    {isLogin ? (
                                        <>
                                            <Dropdown menu={{ items }} trigger={['hover']}>
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
                                                                md: "block"
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
                                        </>
                                    ) : (
                                        <Button
                                            type="text"
                                            onClick={openLoginModal}
                                            icon={<UserOutlined />}
                                        >
                                            Đăng nhập
                                        </Button>
                                    )}
                                </Box>

                                <Notification
                                    invisible={false}
                                    ml
                                />

                                <CartIcon />

                            </Box>
                        </Toolbar>
                    </Container>
                </AppBar>

                <LoginUserModel
                    isModalVisible={isLoginModalVisible}
                    handleCancel={closeLoginModal}
                />
            </Box>
        </>

    )
}

export default UserHeader;
