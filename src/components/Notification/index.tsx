import { Box, IconButton } from '@mui/material';
import React, { useState } from 'react';
import NotificationBox from './NotificationBox';

interface IProps {
    invisible?: boolean;
    ml?: boolean;
    mr?: boolean;
}

const Notification: React.FC<IProps> = ({ invisible = true, ml, mr }) => {

    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
    const [totalNotifications, setTotalNotifications] = useState<number>(0)

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <Box
            sx={{
                display: invisible ? 'flex' : 'none',
                ml: ml ? {
                    xs: 0.5,
                    md: 2
                } : 0,
                mr: mr ? {
                    xs: 0.5,
                    md: 2
                } : 0
            }}
        >
            <IconButton
                sx={{
                    color: '#A6B0B8',
                    position: 'relative',
                    aspectRatio: '1/1',
                    // padding: 0
                }}
                onClick={handleClick}
            >
                <i className='fa-solid fa-bell fs-5' />
                <Box
                    component='span'
                    sx={{
                        position: 'absolute',
                        top: 5,
                        right: 3,
                        width: 16,
                        height: 16,
                        backgroundColor: 'red',
                        color: 'white',
                        borderRadius: '50%',
                        display: totalNotifications ? 'flex' : 'none',
                        justifyContent: 'center',
                        alignItems: 'center',
                        fontSize: 12,
                    }}
                >
                    {totalNotifications < 10 ? totalNotifications : '9+'}
                </Box>
            </IconButton>

            <NotificationBox
                anchorEl={anchorEl}
                handleClose={handleClose}
                setTotalNotifications={setTotalNotifications}
            />
        </Box>
    )
}

export default Notification