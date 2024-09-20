import { AppBar, Box, Toolbar, Typography } from '@mui/material'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Chat from '../../../components/Chat'
import Notification from '../../../components/Notification'
import { setUser, userSelector } from '../../../redux/reducers/UserReducer'
import Avatar from '../../../components/Avatar'
import AvatarDrawer from '../../../components/Avatar/AvatarDrawer'
import { getUserData } from '../../../api/AuthApi'

const UserHeader: React.FC = () => {

    const user = useSelector(userSelector)
    const dispatch = useDispatch();

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
                        <img src="/logo.png" alt="" width='100%' />
                    </Box>
                    <Box sx={{ display: 'flex', flexGrow: 1, justifyContent: 'end' }}>

                        <Notification />

                        <Box component='span' display='flex' alignItems='center'>

                            <Typography
                                sx={{
                                    color: 'black',
                                    display: {
                                        xs: "none",
                                        md: "block"
                                    }
                                }}
                            >
                                {user?.fullName}
                            </Typography>

                            <Avatar draw={<AvatarDrawer />} />

                        </Box>
                    </Box>
                </Toolbar>
            </AppBar>
        </Box>
    )
}

export default UserHeader
