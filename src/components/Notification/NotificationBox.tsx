import { Box, Divider, Drawer, IconButton, Stack, Tooltip, Typography } from '@mui/material'
import React, { SetStateAction, useEffect, useState } from 'react'
import Button from '../Button'
import Notification from '../../types/Notification'
import NotificationItem from './NotificationItem'

interface IProps {
    open: boolean,
    toggleDrawer: (open: boolean) => () => void,
    setTotalNotifications: React.Dispatch<SetStateAction<number>>
}

const actionStyle = {
    color: '#005FC6',
    backgroundColor: '#DFE8F2'
}

const NotificationBox: React.FC<IProps> = ({ open, toggleDrawer, setTotalNotifications }) => {

    const [notifications, setNotifications] = useState<Notification[]>([])
    const [actionButton, setActionButton] = useState<number>(0)

    useEffect(() => {
        handleAllNotification()
    }, [])

    useEffect(() => {

        const count = notifications.reduce((total, current) => {
            if (!current.viewed && !current.deleted) {
                return total + 1
            }
            return total
        }, 0)

        setTotalNotifications(count)
    }, [notifications])

    const handleAllNotification = () => {
        setNotifications([
            {
                id: 1,
                message: "ăn cứt",
                sender: {
                    name: 'Mai Nghiệp Quật',
                    avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRpflPOek8jpaaDWt3iC6CcmonrgrAqRTx74w&s'
                },
                viewed: true,
                deleted: false,
                createAt: new Date()
            },
            {
                id: 2,
                message: "đã bố thí bạn 1 tỷ",
                sender: {
                    name: 'Thaideptraibodoiqua',
                    avatar: 'https://hoang-phuc.com/media/magefan_blog/2021/12/meme-cheems-1.jpg'
                },
                viewed: false,
                deleted: false,
                createAt: new Date()
            },
            {
                id: 3,
                message: "đặt đơn hàng",
                sender: {
                    name: 'BeXuanMaiLonTon',
                    avatar: 'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcQP-OqBydsr8MWjV-dRe6I5s-0Myl_0XyS62PicRKrMURYvVmzA'
                },
                viewed: false,
                deleted: false,
                createAt: new Date()
            },
            {
                id: 4,
                message: "đã gửi cho bạn 1 yêu cầu",
                sender: {
                    name: 'Thaideptraibodoiqua',
                    avatar: 'https://hoang-phuc.com/media/magefan_blog/2021/12/meme-cheems-1.jpg'
                },
                viewed: true,
                deleted: true,
                createAt: new Date()
            },
        ])
        setActionButton(0)
    }

    const handleUnreadNotification = () => {
        setNotifications([
            {
                id: 2,
                message: "đã bố thí bạn 1 tỷ",
                sender: {
                    name: 'Thaideptraibodoiqua',
                    avatar: 'https://hoang-phuc.com/media/magefan_blog/2021/12/meme-cheems-1.jpg'
                },
                viewed: false,
                deleted: false,
                createAt: new Date()
            },
            {
                id: 3,
                message: "đặt đơn hàng",
                sender: {
                    name: 'BeXuanMaiLonTon',
                    avatar: 'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcQP-OqBydsr8MWjV-dRe6I5s-0Myl_0XyS62PicRKrMURYvVmzA'
                },
                viewed: false,
                deleted: false,
                createAt: new Date()
            }
        ])
        setActionButton(1)
    }

    return (
        <Drawer
            anchor='right'
            open={open}
            onClose={toggleDrawer ? toggleDrawer(false) : undefined}
        >
            <Box
                sx={{
                    width: {
                        xs: '100vw',
                        md: 330
                    },
                    padding: 2,
                    height: '100%',
                    backgroundColor: '#f5f5f5'
                }}
            >
                <Stack
                    direction='row'
                    alignItems='center'
                    justifyContent='space-between'
                >
                    <Stack
                        direction='row'
                        alignItems='center'
                    >
                        <IconButton
                            onClick={toggleDrawer ? toggleDrawer(false) : undefined}
                        >
                            <i className="fa-solid fa-xmark" />
                        </IconButton>
                        <Typography variant='h6'>Thông báo</Typography>
                    </Stack>
                    <Tooltip title="Đánh dấu đã đọc hết">
                        <IconButton
                        >
                            <i className="fa-solid fa-check"></i>
                        </IconButton>
                    </Tooltip>
                </Stack>
                <Stack
                    direction='row'
                    alignItems='center'
                >
                    <Button
                        sx={{
                            p: 2,
                            py: 0.5,
                            borderRadius: 100,
                            ...actionButton == 0 ? { ...actionStyle } : {}
                        }}
                        onClick={handleAllNotification}
                    >
                        Tất cả
                    </Button>
                    <Button
                        sx={{
                            p: 1.5,
                            py: 0.5,
                            borderRadius: 100,
                            ...actionButton == 1 ? { ...actionStyle } : {}
                        }}
                        onClick={handleUnreadNotification}
                    >
                        Chưa đọc
                    </Button>
                </Stack>
                <Divider sx={{ my: 2 }} />
                <Stack>
                    {notifications.map(n =>
                        <NotificationItem
                            key={n.id}
                            notification={n}
                        />
                    )}
                </Stack>
            </Box>
        </Drawer >
    )
}

export default NotificationBox