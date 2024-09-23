import React, { useEffect, useRef, useState } from 'react'
import ChatInput from './ChatInput'
import { Box, CircularProgress, Button } from '@mui/material'
import ChatItem from './ChatItem'
import Chat from '../../types/Chat'
import { callFindAllChatByIdChatRoom } from '../../api/ChatApi'
import { useSelector } from 'react-redux'
import { userSelector } from '../../redux/reducers/UserReducer'
import { refreshToken } from '../../api/AxiosInstance'
import SockJS from 'sockjs-client'
import { SOCKET_API } from '../../constants/BaseApi'
import { Client, IMessage, StompSubscription } from '@stomp/stompjs'

interface IProps {
    idRoom: string,
    isAdmin?: boolean
}

const ChatArea: React.FC<IProps> = ({ idRoom, isAdmin }) => {

    const user = useSelector(userSelector)
    const chatBoxRef = useRef<HTMLElement | null>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const [chats, setChats] = useState<Chat[]>([])
    const clientRef = useRef<Client | null>(null)
    const subscriptionRef = useRef<StompSubscription | null>(null)

    const fetchFindAllChatByIdChatRoom = async () => {
        if (user.id !== -1 && idRoom) {
            const res = await callFindAllChatByIdChatRoom(idRoom)
            setChats([...res])
        }
    }

    const shouldShowChat = (chat: Chat, prevChat: Chat | undefined) => {
        return !prevChat || prevChat.createBy !== chat.createBy
    }

    useEffect(() => {
        setLoading(true)

        if (clientRef.current) {
            clientRef.current.deactivate()
            clientRef.current = null
            subscriptionRef.current = null
        }

        const initializeWebSocket = async () => {
            try {
                const token = await refreshToken();
                const sock = new SockJS(SOCKET_API);
                const stompClient = new Client({
                    webSocketFactory: () => sock as WebSocket,
                    connectHeaders: { Authorization: token },
                    onConnect: () => {

                        const subscription = stompClient.subscribe(`/room/${idRoom}`, (chat: IMessage) => {
                            const newChat: Chat = JSON.parse(chat.body);
                            if (newChat.idRoom === idRoom) {
                                setChats(prevChats => [...prevChats, newChat]);
                            }
                        }, { Authorization: token });

                        subscriptionRef.current = subscription;

                        fetchFindAllChatByIdChatRoom();
                        setLoading(false)
                    },
                    debug: (str) => console.log(str),
                });
                stompClient.activate()
                clientRef.current = stompClient
            } catch (error) {
                console.error('Error initializing WebSocket:', error)
                setLoading(false)
            }
        };

        if (idRoom) {
            initializeWebSocket()
        }

        return () => {
            if (subscriptionRef.current) {
                subscriptionRef.current.unsubscribe()
                subscriptionRef.current = null
            }
            if (clientRef.current) {
                clientRef.current.deactivate()
                clientRef.current = null
            }
        }
    }, [idRoom])

    useEffect(() => {
        const item = chatBoxRef.current
        if (item) {
            item.scrollTop = item.scrollHeight
        }
    }, [chats])

    const box = (
        <>
            <Box
                ref={chatBoxRef}
                sx={{
                    flex: 1,
                    overflowY: 'auto',
                    py: 3,
                    px: 4,
                }}
            >
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
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    height: '100%',
                                }}
                            >
                                <CircularProgress />
                            </Box>
                        )
                        :
                        <></>
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

export default ChatArea
