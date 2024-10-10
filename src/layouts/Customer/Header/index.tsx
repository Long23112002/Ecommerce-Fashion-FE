import {AppBar, Box, Toolbar, Typography} from '@mui/material'
import React, {useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import Notification from '../../../components/Notification'
import {setUser, userSelector} from '../../../redux/reducers/UserReducer'
import Avatar from '../../../components/Avatar'
import AvatarDrawer from '../../../components/Avatar/AvatarDrawer'
import {getUserData} from '../../../api/AuthApi'
import Cookies from "js-cookie";
import {Button, Dropdown, MenuProps} from "antd";
import {UserOutlined} from '@ant-design/icons';
import {LoginUserModel} from "../../../components/User/LoginModelUser.tsx";
import '../../../styles/style.css'

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
    const user = useSelector(userSelector)
    const dispatch = useDispatch();
    const isLogin = Cookies.get('accessToken');

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
    }, [dispatch]);

    const openLoginModal = () => {
        setIsLoginModalVisible(true);
    };

    const closeLoginModal = () => {
        setIsLoginModalVisible(false);
    };

    return (
        <>
            <a href="" style={{textDecoration: "none", backgroundColor: "#EFFFF4", cursor: "pointer"}}
               className="d-flex justify-content-center align-items-center header-top">
                <div style={{color: "#00AB56", fontWeight: "bold"}}>
                    Freeship đơn từ 45k, giảm nhiều hơn cùng
                    <img style={{height: '16px', width: '79px', marginLeft: "10px"}} alt=""
                         src="https://salt.tikicdn.com/ts/upload/a7/18/8c/910f3a83b017b7ced73e80c7ed4154b0.png"/>
                </div>
            </a>
            <Box position='sticky' top={0} zIndex={10}>
                <AppBar
                    position='static'
                    sx={{
                        backgroundColor: 'white',
                        boxShadow: 'none',
                        height: 70,
                        borderBottom: "1px solid #f0f0f0",
                    }}
                >
                    <Toolbar>
                        <Box
                            width={50}
                            sx={{
                                overflow: 'hidden',
                                borderRadius: 2
                            }}
                        >
                            <img src="/logo.png" alt="" width='100%'/>
                        </Box>
                        <Box sx={{display: 'flex', flexGrow: 1, justifyContent: 'end'}}>


                            <Box component='span' display='flex' alignItems='center'>
                                {isLogin ? (
                                    <>
                                        <Dropdown menu={{items}} trigger={['hover']}>
                                            <div
                                                className="btn-custom"
                                                onClick={(e) => e.preventDefault()}
                                                style={{
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                }}
                                            >
                                                <div style={{margin: "0 10px"}}>
                                                    <Avatar draw={<AvatarDrawer/>} aria-label="User avatar"/>
                                                </div>
                                                <Typography
                                                    sx={{
                                                        color: 'black',
                                                        display: {
                                                            xs: "none",
                                                            md: "block"
                                                        },
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
                                                    {user?.fullName || 'Guest'}
                                                </Typography>
                                            </div>
                                        </Dropdown>

                                    </>
                                ) : (
                                    <Button
                                        type="text"
                                        sx={{xl: 2}}
                                        onClick={openLoginModal}
                                        icon={<UserOutlined/>}
                                    >
                                        Đăng nhập
                                    </Button>
                                )}
                            </Box>

                            <div style={{marginLeft: '13px'}}>
                                <Notification/>
                            </div>
                        </Box>
                    </Toolbar>
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
