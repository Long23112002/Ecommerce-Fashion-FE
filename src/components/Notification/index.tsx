import { Box, IconButton } from '@mui/material';
import React, { useState } from 'react';
import NotificationBox from './NotificationBox';

interface IProps {
    invisible?: boolean;
    ml?: boolean;
    mr?: boolean;
}

const NotificationIcon: React.FC<IProps> = ({ invisible = true, ml, mr }) => {

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
                justifyContent: 'center',
                alignItems: 'center',
                ml: ml ? {
                    xs: 2,
                    md: 3
                } : 0,
                mr: mr ? {
                    xs: 2,
                    md: 3
                } : 0
            }}
        >
            <IconButton
                sx={{
                    color: '#A6B0B8',
                    position: 'relative',
                    aspectRatio: '1',
                }}
                onClick={handleClick}
            >
                <i className='fa-solid fa-bell fs-4' />
                <Box
                    component='span'
                    sx={{
                        position: 'absolute',
                        top: 3,
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

export default NotificationIcon