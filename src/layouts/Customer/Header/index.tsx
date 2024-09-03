import { AppBar, Box, Toolbar, Typography } from '@mui/material'
import React from 'react'
import { useSelector } from 'react-redux'
import Avatar from '../../../components/Avatar'
import Notification from '../../../components/Notification'
import { userSelector } from '../../../redux/reducers/UserReducer'
import UserAvatarDrawer from './UserAvatarDrawer'

const UserHeader: React.FC = () => {

    const user = useSelector(userSelector)

    return (
        <Box position='sticky' top={0}>
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
                                {user?.name}
                            </Typography>

                            <Avatar draw={<UserAvatarDrawer />} />

                        </Box>
                    </Box>
                </Toolbar>
            </AppBar>
        </Box>
    )
}

export default UserHeader
