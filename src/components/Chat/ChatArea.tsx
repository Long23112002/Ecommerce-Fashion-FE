import { Box } from '@mui/material';
import { Client, IMessage, StompSubscription } from '@stomp/stompjs';
import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import SockJS from 'sockjs-client';
import Cookies from "js-cookie";
import { refreshToken } from '../../api/AxiosInstance';
import { callFindAllChatByIdChatRoom, callSeenAllChatByIdChatRoom } from '../../api/ChatApi';
import { SOCKET_API } from '../../constants/BaseApi';
import { userSelector } from '../../redux/reducers/UserReducer';
import Chat from '../../types/Chat';
import MuiLoading from '../MuiLoading';
import ChatInput from './ChatInput';
import ChatItem from './ChatItem';

interface IProps {
    idRoom: string;
    isAdmin?: boolean;
    py?: number,
    px?: number
}

const ChatArea: React.FC<IProps> = ({ idRoom, isAdmin, py, px }) => {
    const user = useSelector(userSelector);
    const chatBoxRef = useRef<HTMLElement | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [moreLoading, setMoreLoading] = useState<boolean>(false);
    const [chats, setChats] = useState<Chat[]>([]);
    const clientRef = useRef<Client | null>(null);
    const subscriptionRef = useRef<StompSubscription | null>(null);
    const page = useRef<number>(0);
    const scroll = useRef<boolean>(false);

    const fetchFindAllChatByIdChatRoom = async () => {
        if (user.id > 0 && idRoom) {
            setMoreLoading(true);
            const res = await callFindAllChatByIdChatRoom(idRoom, page.current);
            setChats(prevChats => [...res, ...prevChats]);
            page.current++;
            setMoreLoading(false);
        }
    };

    const fetchSeenAllByIdChatRoom = async () => {
        if (idRoom && user.isAdmin) {
            await callSeenAllChatByIdChatRoom(idRoom);
        }
    };

    const shouldShowChat = (chat: Chat, prevChat?: Chat) => {
        return !prevChat || prevChat.createBy !== chat.createBy;
    };

    const scrollDown = () => {
        const item = chatBoxRef.current;
        if (item) {
            item.scrollTop = item.scrollHeight;
            scroll.current = false
        }
    };

    useEffect(() => {
        setLoading(true);
        setChats([]);
        page.current = 0;

        const initializeWebSocket = async () => {
            try {
                await refreshToken();
                const token = Cookies.get("accessToken") + ''
                const sock = new SockJS(SOCKET_API);
                const stompClient = new Client({
                    webSocketFactory: () => sock as WebSocket,
                    connectHeaders: { Authorization: token },
                    onConnect: async () => {
                        const subscription = stompClient.subscribe(`/room/${idRoom}`, (chat: IMessage) => {
                            const newChat: Chat = JSON.parse(chat.body);
                            if (newChat.idRoom === idRoom) {
                                setChats(prevChats => [...prevChats, newChat]);
                            }
                            scroll.current = true;
                        }, { Authorization: token });

                        subscriptionRef.current = subscription;

                        await fetchFindAllChatByIdChatRoom();
                        await fetchSeenAllByIdChatRoom();
                        setLoading(false);
                    },
                    debug: (str) => {
                        console.log(str);
                    }
                });

                stompClient.activate();
                clientRef.current = stompClient;
            } catch (error) {
                console.error('Error initializing WebSocket:', error);
                setLoading(false);
            }
        };

        if (idRoom) {
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
    }, [idRoom]);

    useEffect(() => {
        if (scroll.current) {
            scrollDown();
        }
    }, [chats]);

    useEffect(() => {
        if (!loading) {
            scrollDown()
        }
    }, [loading])

    const handleLoadmore = () => {
        const chatBox = chatBoxRef.current
        if (chatBox && chatBox.scrollTop === 0 && !moreLoading) {
            chatBox.scrollTop = 10
            fetchFindAllChatByIdChatRoom()
        }
    }

    const box = (
        <>
            <Box
                ref={chatBoxRef}
                sx={{
                    flex: 1,
                    overflowY: 'auto',
                    py: py || 3,
                    px: px || 4,
                    position: 'relative'
                }}
                onScroll={handleLoadmore}
            >
                {(moreLoading && !loading) &&
                    (
                        <Box
                            sx={{
                                position: 'absolute',
                                top: 15,
                                left: '50%',
                                transform: 'translateX(-50%)',
                                zIndex: 99
                            }}
                        >
                            <MuiLoading height='70px' />
                        </Box>
                    )}
                {!loading ? (
                    chats.map((chat, index) => {
                        const show = shouldShowChat(chat, chats[index - 1])
                        return (
                            <ChatItem
                                key={index}
                                chat={chat}
                                show={show}
                                id={user.id}
                                isAdmin={isAdmin || false}
                            />
                        )
                    })
                )
                    :
                    idRoom !== ""
                        ?
                        (
                            <MuiLoading />
                        )
                        :
                        <Box
                            display='flex'
                            justifyContent='center'
                            alignItems='center'
                            height='calc(100% - 100px)'
                        >
                            <img src="/logo.png"
                                alt="logo"
                                width='40%'
                                style={{
                                    borderRadius: '10%',
                                    opacity: 0.4,
                                    rotate: '8deg'
                                }} />
                        </Box>
                }
            </Box>

            <ChatInput
                client={clientRef.current}
                idRoom={idRoom}
            />
        </>
    )

    return (
        <>
            {isAdmin
                ?
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        height: 'calc(100vh - 100px)',
                    }}
                >
                    {box}
                </Box>
                :
                <>
                    {box}
                </>
            }

        </>
    )
}

export default ChatArea;
