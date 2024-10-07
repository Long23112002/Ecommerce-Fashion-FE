import { Box, IconButton } from '@mui/material'
import React, { useState } from 'react'
import NotificationBox from './NotificationBox'

const Notification: React.FC = () => {

    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
    const [totalNotifications, setTotalNotifications] = useState<number>(0)

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <IconButton
                size="large"
                sx={{
                    color: '#A6B0B8',
                    mr: {
                        xs: 0.5,
                        md: 3
                    },
                    position: 'relative'
                }}
                onClick={handleClick}
            >
                <i className='fa-solid fa-bell fs-2' />
                <Box
                    component='span'
                    sx={{
                        position: 'absolute',
                        top: 5,
                        right: 3,
                        width: 20,
                        height: 20,
                        backgroundColor: 'red',
                        color: 'white',
                        borderRadius: '50%',
                        display: totalNotifications ? 'flex' : 'none',
                        justifyContent: 'center',
                        alignItems: 'center',
                        fontSize: 15,
                    }}
                >
                    {totalNotifications}
                </Box>
            </IconButton>

            <NotificationBox
                anchorEl={anchorEl}
                handleClose={handleClose}
                setTotalNotifications={setTotalNotifications}
            />
        </>
    )
}

export default Notification