import { AppBar, Box, IconButton, Toolbar, Typography } from '@mui/material'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Notification from '../../../components/Notification'
import { setUser, userSelector } from '../../../redux/reducers/UserReducer'
import Avatar from '../../../components/Avatar'
import AvatarDrawer from '../../../components/Avatar/AvatarDrawer'
import { getUserData } from '../../../api/AuthApi'

interface IProps {
    handleCollapse: () => void,
    handleToggled: () => void,
    broken: boolean
}

const AdminHeader: React.FC<IProps> = ({ handleCollapse, handleToggled, broken }) => {

    const user = useSelector(userSelector)
    const dispatch = useDispatch();

    useEffect(() => {
        const userData = getUserData();
        dispatch(setUser({
            id: Number(userData.id),
            fullName: userData.fullName,
            email: userData.email,
            avatar: userData.avatar,
            isAdmin: Boolean(userData.isAdmin)
        }));
    }, [dispatch]);

    return (
        <Box position='sticky' top={0} zIndex={10}>
            <AppBar
                position='static'
                sx={{
                    boxShadow: 'none',
                }}
            >
                <Toolbar
                    sx={{
                        backgroundColor: 'white',
                    }}
                >
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

                        <Notification mr />

                        <Box component='span' display='flex' alignItems='center'>

                            <Typography
                                sx={{
                                    color: 'black',
                                    display: {
                                        xs: "none",
                                        md: "block"
                                    },
                                    mr: {
                                        xs: 0,
                                        sm: 3
                                    },
                                    textAlign: 'end',
                                    maxWidth: 220,
                                    height: 25,
                                    overflow: 'hidden'
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

export default AdminHeader
