import { Box, Divider, IconButton, Popover, Stack, Tooltip, Typography } from '@mui/material';
import { Client, IMessage, StompSubscription } from '@stomp/stompjs';
import Cookies from 'js-cookie';
import React, { SetStateAction, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import SockJS from 'sockjs-client';
import { callGetInstance, refreshToken } from '../../api/AxiosInstance';
import { callDeleteByIdNoti, callFindAllNotiByUserId, callFindAllUnSeenNotiByUserId, callMarkSeenAllByIdUser, callMarkSeenByIdNoti } from '../../api/NotificationApi';
import { SOCKET_NOTIFICATION_API } from '../../constants/BaseApi';
import { userSelector } from '../../redux/reducers/UserReducer';
import Notification from '../../types/Notification';
import Button from '../Button';
import MuiLoading from '../Loading/MuiLoading';
import NotificationItem from './NotificationItem';

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

    const user = useSelector(userSelector);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [actionButton, setActionButton] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const subscriptionRef = useRef<StompSubscription | null>(null);
    const clientRef = useRef<Client | null>(null);
    const nextUrl = useRef<string | null>(null);
    const boxRef = useRef<HTMLElement | null>(null);

    const isUserIdExist = () => {
        return user.id && user.id > 0;
    }

    const fetchFindAllNotiByUserId = async () => {
        if (isUserIdExist()) {
            const { results, next } = await callFindAllNotiByUserId(user.id);
            nextUrl.current = next;
            setNotifications(prevs => [...uniqueNotis(results, prevs), ...prevs]);
        }
    }

    const fetchFindAllUnSeenNotiByUserId = async () => {
        if (user.id && user.id > 0) {
            const { results, next } = await callFindAllUnSeenNotiByUserId(user.id);
            nextUrl.current = next;
            setNotifications(prevs => [...uniqueNotis(results, prevs), ...prevs]);
        }
    }

    const uniqueNotis = (res: Notification[], prevs: Notification[]) => {
        const idNotis = prevs.map(n => n.id);
        const newNoti = res.filter(n => !idNotis.includes(n.id));
        return newNoti;
    }


    const updateNotifications = (updatedNotis: Notification[]) => {
        const resMap = new Map<string, Notification>();
        updatedNotis.forEach(noti => {
            resMap.set(noti.id, noti);
        });

        const newNotis = notifications.map(noti => {
            const id = noti.id;
            return resMap.get(id) || noti;
        });

        setNotifications(newNotis);
    };

    const handleMarkSeenAllByIdUser = async () => {
        if (isUserIdExist()) {
            const res: Notification[] = await callMarkSeenAllByIdUser(user.id);
            updateNotifications(res);
        }
    };

    const handleMarkSeenByIdNoti = async (id: string) => {
        if (id) {
            const res: Notification[] = await callMarkSeenByIdNoti(id);
            updateNotifications(res);
        }
    };

    const handleDeleteByIdNoti = async (id: string) => {
        if (id) {
            const res: Notification = await callDeleteByIdNoti(id);
            setNotifications(prev => prev.filter(noti => noti.id !== res.id))
        }
    };

    const handleLoadMore = async () => {
        const nextApi = nextUrl.current;
        if (nextApi) {
            const { results, next } = await callGetInstance(nextApi);
            setNotifications(prev => [...prev, ...uniqueNotis(results, prev)]);
            nextUrl.current = next;
        }
    }

    const handleScroll = () => {
        const box = boxRef.current;
        if (box) {
            if (box.scrollTop + box.clientHeight >= box.scrollHeight - 20) {
                handleLoadMore();
            }
        }
    };

    const handleAllNoti = async () => {
        if (actionButton != 0) {
            setLoading(true)
            setNotifications([])
            setActionButton(0)
            await fetchFindAllNotiByUserId()
            setLoading(false)
        }
    }

    const handleUnSeenNoti = async () => {
        if (actionButton != 1 && isUserIdExist()) {
            setLoading(true)
            setNotifications([])
            setActionButton(1)
            await fetchFindAllUnSeenNotiByUserId()
            setLoading(false)
        }
    }

    useEffect(() => {
        setLoading(true);
        setNotifications([]);

        const initializeWebSocket = async () => {
            try {
                await refreshToken();
                const token = Cookies.get("accessToken") + '';
                const sock = new SockJS(SOCKET_NOTIFICATION_API);
                const stompClient = new Client({
                    webSocketFactory: () => sock as WebSocket,
                    connectHeaders: { Authorization: token },
                    onConnect: async () => {
                        const subscription = stompClient.subscribe(`/notification/user/${user.id}`, (noti: IMessage) => {
                            const newNoti: Notification = JSON.parse(noti.body);
                            if (!notifications.includes(newNoti)) {
                                toast.info(newNoti.title);
                                setNotifications(prevNotis => [{ ...newNoti }, ...prevNotis]);
                            }
                        }, { Authorization: token });

                        subscriptionRef.current = subscription;

                        await fetchFindAllNotiByUserId();
                        setLoading(false);
                    },
                    // debug: (str) => {
                    //     console.log(str);
                    // },
                    onStompError: async (error) => {
                        if (error.headers['message'].includes('JWT expired ')) {
                            await initializeWebSocket();
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

        if (isUserIdExist()) {
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
    }, [user.id]);

    useEffect(() => {
        const count = notifications.reduce((total, current) => {
            if (!current.seen) {
                return total + 1;
            }
            return total;
        }, 0);

        setTotalNotifications(count);
    }, [notifications]);

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
                    backgroundColor: '#f5f5f5',
                    width: { xs: '90vw', sm: 350 },
                    maxWidth: 350,
                }}
            >
                <Box
                    sx={{
                        p: 2
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
                                onClick={handleClose}
                            >
                                <i className="fa-solid fa-xmark" />
                            </IconButton>
                            <Typography variant='h6'>Thông báo</Typography>
                        </Stack>
                        <Tooltip title="Đánh dấu đã đọc hết">
                            <IconButton
                                onClick={handleMarkSeenAllByIdUser}
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
                                ...actionButton === 0 ? { ...actionStyle } : {}
                            }}
                            onClick={() => handleAllNoti()}
                        >
                            Tất cả
                        </Button>
                        <Button
                            sx={{
                                p: 1.5,
                                py: 0.5,
                                borderRadius: 100,
                                ...actionButton === 1 ? { ...actionStyle } : {}
                            }}
                            onClick={() => handleUnSeenNoti()}
                        >
                            Chưa đọc
                        </Button>
                    </Stack>
                </Box>
                <Divider />
                <Box
                    ref={boxRef}
                    onScroll={handleScroll}
                    sx={{
                        maxHeight: 600,
                        overflowY: 'auto'
                    }}
                >
                    {
                        loading
                            ?
                            <MuiLoading />
                            :

                            <Stack>
                                {notifications.map((n, i) =>
                                    <NotificationItem
                                        key={i}
                                        notification={n}
                                        handleMarkSeenByIdNoti={handleMarkSeenByIdNoti}
                                        handleDeleteByIdNoti={handleDeleteByIdNoti}
                                    />
                                )}
                            </Stack>
                    }
                </Box>
            </Box>
        </Popover>
    )
}

export default NotificationBox;
