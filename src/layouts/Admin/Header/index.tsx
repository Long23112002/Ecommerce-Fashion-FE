import { AppBar, Box, IconButton, Toolbar, Typography } from '@mui/material'
import React from 'react'
import Avatar from '../../../components/Avatar'
import AdminAvatarDrawer from './AdminAvatarDrawer'
import { useSelector } from 'react-redux'
import { userSelector } from '../../../redux/reducers/UserReducer'
import Notification from '../../../components/Notification'

interface IProps {
    handleCollapse: () => void,
    handleToggled: () => void,
    broken: boolean
}

const AdminHeader: React.FC<IProps> = ({ handleCollapse, handleToggled, broken }) => {

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

                            <Avatar draw={<AdminAvatarDrawer />} />

                        </Box>
                    </Box>
                </Toolbar>
            </AppBar>
        </Box>
    )
}

export default AdminHeader
