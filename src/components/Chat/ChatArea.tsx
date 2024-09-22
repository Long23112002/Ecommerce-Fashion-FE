import React, { useEffect, useRef, useState } from 'react'
import ChatInput from './ChatInput'
import { Box, CircularProgress } from '@mui/material'
import ChatItem from './ChatItem'
import Chat from '../../types/Chat'
import { callFindAllChatByIdChatRoom, callSeenAllChatByIdChatRoom } from '../../api/ChatApi'
import { useSelector } from 'react-redux'
import { userSelector } from '../../redux/reducers/UserReducer'
import { refreshToken } from '../../api/AxiosInstance'
import SockJS from 'sockjs-client'
import { SOCKET_API } from '../../constants/BaseApi'
import { Client, IMessage } from '@stomp/stompjs'

interface IProps {
    idRoom: string,
    isAdmin?: boolean
}

const ChatArea: React.FC<IProps> = ({ idRoom, isAdmin }) => {

    const user = useSelector(userSelector)
    const chatBoxRef = useRef<HTMLElement | null>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const [client, setClient] = useState<Client | null>(null)
    const [chats, setChats] = useState<Chat[]>([])

    const fetchFindAllChatByIdChatRoom = async () => {
        if (user.id != -1 && idRoom) {
            const res = await callFindAllChatByIdChatRoom(idRoom)
            setChats([...res])
        }
    }

    useEffect(() => {
        setLoading(true)
        const initializeWebSocket = async () => {
            const token = await refreshToken();
            const sock = new SockJS(SOCKET_API);
            const stompClient = new Client({
                webSocketFactory: () => sock as WebSocket,
                onConnect: () => {
                    stompClient.subscribe(`/room/${idRoom}`, (chat: IMessage) => {
                        setChats(prevChats => [...prevChats, JSON.parse(chat.body)]);
                    }, { Authorization: token });

                    fetchFindAllChatByIdChatRoom();
                },
                connectHeaders: { Authorization: token },
                debug: (str) => console.log(str),
            });
            stompClient.activate();
            setClient(stompClient);

            setLoading(false);

            return () => {
                stompClient.deactivate();
            };
        };


        if (idRoom) {
            initializeWebSocket();
        }
        return () => {
            if (client) {
                client.deactivate();
            }
        };
    }, [idRoom]);

    useEffect(() => {
        const item = chatBoxRef.current;
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
                    chats.map((chat, index) => (
                        <ChatItem
                            key={index}
                            chat={chat}
                            id={user.id}
                            isAdmin={isAdmin || false}
                        />
                    ))
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
                client={client}
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
                box
            }

        </>
    )
}

export default ChatArea