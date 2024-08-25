import { Avatar, Box, Stack, Typography } from '@mui/material'
import React from 'react'
import Notification from '../../types/Notification'

interface IProps {
    notification: Notification
}

const NotificationItem: React.FC<IProps> = ({ notification }) => {
    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                mb: 1,
                p: 2,
                position: 'relative',
                borderRadius: 2,
            }}
        >
            <Avatar
                alt={notification.sender.name}
                src={notification.sender.avatar}
                sx={{ mr: 2 }}
            />
            <Stack spacing={0.5}>
                <Typography
                    variant="body2"
                >
                    <strong
                        style={{
                            marginRight: 5
                        }}
                    >
                        {notification.sender.name}
                    </strong>
                    {notification.message}
                </Typography>
                <Typography
                    variant="caption"
                    color="textSecondary"
                >
                    {notification.createAt.toLocaleString()}
                </Typography>
            </Stack>

            {!notification.viewed && (
                <Box
                    sx={{
                        width: 10,
                        height: 10,
                        position: 'absolute',
                        top: '50%',
                        right: 0,
                        transform: 'translateY(-50%)',
                        backgroundColor: '#00B8D9',
                        borderRadius: '50%',
                    }}
                />
            )}
        </Box>
    )
}

export default NotificationItem
