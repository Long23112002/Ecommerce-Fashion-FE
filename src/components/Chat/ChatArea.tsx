import { Box } from '@mui/material';
import { Client, IMessage, StompSubscription } from '@stomp/stompjs';
import Cookies from "js-cookie";
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SockJS from 'sockjs-client';
import { refreshToken } from '../../api/AxiosInstance';
import { callFindAllChatByIdChatRoom, callFindChatsUntilTarget, callSeenAllChatByIdChatRoom } from '../../api/ChatApi';
import { SOCKET_API } from '../../constants/BaseApi';
import { setNewChat } from '../../redux/reducers/ChatReducer';
import { userSelector } from '../../redux/reducers/UserReducer';
import Chat from '../../types/Chat';
import MuiLoading from '../MuiLoading';
import ChatInput from './ChatInput';
import ChatItem from './ChatItem';

interface IProps {
    idRoom: string;
    isAdmin?: boolean;
    py?: number,
    px?: number,
    isChatOpen?: boolean
}

export interface ChatWithFocus extends Chat {
    focus?: boolean;
}

const ChatArea: React.FC<IProps> = ({ idRoom, isAdmin, py, px, isChatOpen }) => {
    const user = useSelector(userSelector);
    const dispatch = useDispatch()
    const chatBoxRef = useRef<HTMLElement | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [moreLoading, setMoreLoading] = useState<boolean>(false);
    const [chats, setChats] = useState<ChatWithFocus[]>([]);
    const clientRef = useRef<Client | null>(null);
    const subscriptionRef = useRef<StompSubscription | null>(null);
    const page = useRef<number>(0);
    const [reply, setReply] = useState<Chat | null>(null)
    const shouldScroll = useRef<boolean>(false);

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
            await callSeenAllChatByIdChatRoom(idRoom, user.id);
        }
    };

    const shouldShowAvatar = (chat: Chat, prevChat?: Chat) => {
        return !prevChat || prevChat.createBy !== chat.createBy;
    };

    const scrollDown = () => {
        const item = chatBoxRef.current;
        if (item) {
            item.scrollTop = item.scrollHeight;
        }
    };

    const scrollUp = () => {
        const item = chatBoxRef.current;
        if (item) {
            item.scrollTop = 20
        }
    }

    const setChatInChats = (newChat: ChatWithFocus) => {
        setChats((prevChats) =>
            prevChats.map(chat =>
                chat.id === newChat.id ? { ...newChat } : chat
            )
        )
    }

    const fetchFindChatsUntilTarget = async (id: string) => {
        if (!chats.map(c => c.id).includes(id)) {
            setLoading(true);
            const res = await callFindChatsUntilTarget(id);
            setChats([...res.map((chat: ChatWithFocus) => {
                if (chat.id === id) {
                    chat.focus = true
                }
                return chat
            })])
            scrollUp()
            setLoading(false);
        }
        else {
            const focusChat = { ...chats.filter(c => c.id === id)[0], focus: true }
            setChatInChats(focusChat)
        }
    }

    const uniqueChats: Chat[] = chats.filter((chat, index, self) =>
        index === self.findIndex((c) => c.id === chat.id)
    );

    useEffect(() => {
        setLoading(true);
        setChats([]);
        setReply(null)
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
                                shouldScroll.current = true
                            }
                        }, { Authorization: token });

                        subscriptionRef.current = subscription;

                        await fetchFindAllChatByIdChatRoom();
                        shouldScroll.current = true
                        await fetchSeenAllByIdChatRoom();
                        setLoading(false);
                    },
                    // debug: (str) => {
                    //     console.log(str);
                    // },
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
        if (!isAdmin && chats.length > 0) {
            const chat = chats[chats.length - 1]
            if (!chat.seen && chat.createBy != user.id && !isChatOpen) {
                dispatch(setNewChat(true))
            }
        }
    }, [chats]);

    useEffect(() => {
        if (!loading && shouldScroll.current) {
            scrollDown()
            shouldScroll.current = false
        }
    }, [loading])

    useEffect(() => {
        if (!moreLoading) {
            scrollUp()
        }
    }, [moreLoading])

    const handleLoadmore = async () => {
        const chatBox = chatBoxRef.current
        if (chatBox && chatBox.scrollTop === 0 && !moreLoading) {
            await fetchFindAllChatByIdChatRoom()
            chatBox.scrollTop = 20
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
                    px: px || {
                        xs: 1,
                        md: 4
                    },
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
                    uniqueChats.map((chat, index) => {
                        const show = shouldShowAvatar(chat, uniqueChats[index - 1]);
                        return (
                            <ChatItem
                                key={chat.id}
                                chat={chat}
                                show={show}
                                id={user.id}
                                isAdmin={isAdmin || false}
                                setReply={setReply}
                                fetchFindChatsUntilTarget={fetchFindChatsUntilTarget}
                                setChatInChats={setChatInChats}
                            />
                        );
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
                reply={reply}
                setReply={setReply}
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
                        height: 'calc(100vh - 65px)',
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
