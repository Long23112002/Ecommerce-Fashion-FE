import { Box, Divider, Drawer, IconButton, Popover, Stack, Tooltip, Typography } from '@mui/material'
import React, { SetStateAction, useEffect, useRef, useState } from 'react'
import Cookies from 'js-cookie'
import Button from '../Button'
import Notification from '../../types/Notification'
import NotificationItem from './NotificationItem'
import { refreshToken } from '../../api/AxiosInstance'
import SockJS from 'sockjs-client'
import { SOCKET_API } from '../../constants/BaseApi'
import { Client, IMessage, StompSubscription } from '@stomp/stompjs'
import { useSelector } from 'react-redux'
import { userSelector } from '../../redux/reducers/UserReducer'
import MuiLoading from '../MuiLoading'
import { toast } from 'react-toastify'

interface IProps {
    anchorEl: HTMLButtonElement | null,
    handleClose: () => void,
    setTotalNotifications: React.Dispatch<SetStateAction<number>>
}

const actionStyle = {
    color: '#005FC6',
    backgroundColor: '#DFE8F2'
}

const NotificationBox: React.FC<IProps> = ({ anchorEl, handleClose, setTotalNotifications }) => {

    const user = useSelector(userSelector)
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [actionButton, setActionButton] = useState<number>(0)
    const [loading, setLoading] = useState<boolean>(true)
    const subscriptionRef = useRef<StompSubscription | null>(null)
    const clientRef = useRef<Client | null>(null)

    useEffect(() => {
        setLoading(true);
        setNotifications([]);

        const initializeWebSocket = async () => {
            try {
                await refreshToken();
                const token = Cookies.get("accessToken") + ''
                const sock = new SockJS(SOCKET_API);
                const stompClient = new Client({
                    webSocketFactory: () => sock as WebSocket,
                    connectHeaders: { Authorization: token },
                    onConnect: async () => {
                        const subscription = stompClient.subscribe(`/notification/user/${user.id}`, (noti: IMessage) => {
                            const newNoti: Notification = JSON.parse(noti.body)
                            toast.info(newNoti.title)
                            setNotifications(prevNotis => [...prevNotis, newNoti]);
                        }, { Authorization: token });

                        subscriptionRef.current = subscription;

                        // await fetchFindAllChatByIdChatRoom();

                        setLoading(false);
                    },
                    debug: (str) => {
                        console.log(str);
                    },
                    onStompError: async (error) => {
                        if (error.headers['message'].includes('JWT expired ')) {
                            await initializeWebSocket()
                        }
                    }

                });

                stompClient.activate();
                clientRef.current = stompClient;
            } catch (error) {
                console.error('Error initializing WebSocket:', error);
                setLoading(false);
            }
        };

        if (user.id > 0) {
            initializeWebSocket();
        }


        return () => {
            if (subscriptionRef.current) {
                subscriptionRef.current.unsubscribe();
                subscriptionRef.current = null;
            }
            if (clientRef.current) {
                clientRef.current.deactivate();
                clientRef.current = null;
            }
        };
    }, [user.id])

    useEffect(() => {
        const count = notifications.reduce((total, current) => {
            if (!current.seen) {
                return total + 1
            }
            return total
        }, 0)

        setTotalNotifications(count)
    }, [notifications])

    return (
        <Popover
            open={Boolean(anchorEl)}
            anchorEl={anchorEl}
            onClose={handleClose}
            disableScrollLock={true}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
            }}
        >
            <Box
                sx={{
                    width: {
                        xs: '100%',
                        md: 330
                    },
                    padding: 2,
                    height: '100%',
                    backgroundColor: '#f5f5f5'
                }}
            >
                {
                    loading
                        ?
                        <MuiLoading />
                        :
                        (
                            <>
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
                                            onClick={handleClose}
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
                                    // onClick={handleAllNotification}
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
                                    // onClick={handleUnreadNotification}
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
                            </>
                        )
                }
            </Box>
        </Popover>
    )
}

export default NotificationBox