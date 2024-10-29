import { Avatar, Box, MenuItem, Stack, Typography } from '@mui/material'
import { Parser } from 'html-to-react'
import React, { useState } from 'react'
import Notification from '../../types/Notification'
import { formatDateTime } from '../../utils/formatDateTime'
import MenuCustom from '../MenuCustom'

interface IProps {
    notification: Notification,
    handleMarkSeenByIdNoti: (id: string) => void
    handleDeleteByIdNoti: (id: string) => void
}

const NotificationItem: React.FC<IProps> = ({ notification, handleMarkSeenByIdNoti, handleDeleteByIdNoti }) => {

    const [over, setOver] = useState<boolean>(false)
    const parser = Parser();
    const content = parser.parse(notification.content);

    const handleOnMouseOver = () => {
        setOver(true)
    }

    const handleOnMouseOut = () => {
        setOver(false)
    }

    const handleMenu = (handleFunction: () => void) => {
        handleOnMouseOut()
        handleFunction()
    }

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                mb: 1,
                p: 2,
                pr: 2.5,
                position: 'relative',
                borderRadius: 2,
            }}
            onMouseOver={handleOnMouseOver}
            onMouseOut={handleOnMouseOut}
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

                <MenuCustom
                    open={over}
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        right: 25,
                        transform: 'translateY(-50%)',
                        display: over ? 'display' : 'none'
                    }}
                >
                    <MenuItem
                        onClick={() => handleMenu(() => handleMarkSeenByIdNoti(notification.id))}
                    >
                        <i className="fa-solid fa-eye me-3" />
                        Đánh dấu đã xem
                    </MenuItem>
                    <MenuItem
                        onClick={() => handleMenu(() => handleDeleteByIdNoti(notification.id))}
                    >
                        <i className="fa-solid fa-trash me-3" />
                        Xóa thông báo
                    </MenuItem>
                </MenuCustom>
            </Stack>

            {!notification.seen && (
                <Box
                    sx={{
                        width: 10,
                        height: 10,
                        position: 'absolute',
                        top: '50%',
                        right: 5,
                        backgroundColor: '#00B8D9',
                        borderRadius: '50%',
                    }}
                />
            )}
        </Box>
    )
}

export default NotificationItem
