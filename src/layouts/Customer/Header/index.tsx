import { AppBar, Box, Toolbar, Typography } from '@mui/material'
import { Button } from "antd"
import Cookies from "js-cookie"
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getUserData } from '../../../api/AuthApi'
import Avatar from '../../../components/Avatar'
import AvatarDrawer from '../../../components/Avatar/AvatarDrawer'
import Notification from '../../../components/Notification'
import { setUser, userSelector } from '../../../redux/reducers/UserReducer'

import { UserOutlined } from '@ant-design/icons'
import { LoginUserModel } from "../../../components/User/LoginModelUser.tsx"

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
        <Box position='sticky' top={0} zIndex={10}>
            <AppBar
                position='static'
                sx={{
                    backgroundColor: 'white',
                    boxShadow: 'none',
                    height: 50
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
                    <Box sx={{ display: 'flex', flexGrow: 1, justifyContent: 'end' }}>

                        <Notification />

                        <Box component='span' display='flex' alignItems='center'>
                            {isLogin ? (
                                <>
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
                                            overflow: 'hidden'
                                        }}
                                    >
                                        {user?.fullName}
                                    </Typography>
                                    <Avatar draw={<AvatarDrawer/>}/>
                                </>
                            ) : (
                                <Button
                                    type="text"
                                    sx={{ xl: 2 }}
                                    onClick={openLoginModal}
                                    icon={<UserOutlined />}
                                >
                                    Đăng nhập
                                </Button>
                            )}
                        </Box>
                    </Box>
                </Toolbar>
            </AppBar>

            <LoginUserModel
                isModalVisible={isLoginModalVisible}
                handleCancel={closeLoginModal}
            />
        </Box>
    )
}

export default UserHeader;
