import { Avatar, Box, Stack, Typography } from '@mui/material'
import React from 'react'
import Notification from '../../types/Notification'
import { formatDateTime } from '../../utils/timeUtils'
import {Parser} from 'html-to-react'

interface IProps {
    notification: Notification
}

const NotificationItem: React.FC<IProps> = ({ notification }) => {

    const parser = Parser();
    const content = parser.parse(notification.content);

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
            {
                notification.avatar &&
                (
                    <Avatar
                        alt={notification?.nameCreateBy}
                        src={notification.avatar}
                        sx={{ mr: 2 }}
                    />
                )
            }
            <Stack spacing={0.5}>
                <Typography
                    variant="body2"
                >
                    {
                        notification.nameCreateBy &&
                        (
                            <strong
                                style={{
                                    marginRight: 5
                                }}
                            >
                                {notification.nameCreateBy}
                            </strong>
                        )
                    }
                    {content}
                </Typography>
                <Typography
                    variant="caption"
                    color="textSecondary"
                >
                    {formatDateTime(notification.createAt)}
                </Typography>
            </Stack>

            {!notification.seen && (
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
