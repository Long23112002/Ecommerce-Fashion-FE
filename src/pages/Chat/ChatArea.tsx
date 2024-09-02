import { Avatar, Box, Paper, Typography } from '@mui/material';
import { Client, IMessage } from '@stomp/stompjs';
import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import SockJS from 'sockjs-client';
import Cookie from "js-cookie";
import { userSelector } from '../../redux/reducers/UserReducer';
import Chat from '../../types/Chat';
import ChatInput from './ChatInput';
import { SOCKET_API } from '../../constants/BaseApi';

interface IProps {
    selectedRoom: string
}

const ChatArea: React.FC<IProps> = ({ selectedRoom }) => {

    const user = useSelector(userSelector)
    const [client, setClient] = useState<Client | null>(null);
    const [chats, setChats] = useState<Chat[]>([])
    const chatBoxRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const token = Cookie.get('accessToken');
    
        const sock = new SockJS(SOCKET_API);
        const stompClient = new Client({
            webSocketFactory: () => sock as WebSocket,
            onConnect: () => {
                console.log("Connecting...")
                stompClient.subscribe(`/room/public`, (chat: IMessage) => {
                    setChats(prevChats => [
                        ...prevChats,
                        JSON.parse(chat.body)
                    ]);
                }),
                {
                    token: token + ""
                }
            },
            connectHeaders: {
                Authorization: `Bearer ${token}`,
            },
            debug: function (str) {
                console.log(str);
            },
        });
    
        stompClient.activate();
        setClient(stompClient);
    
        return () => {
            if (stompClient) {
                stompClient.deactivate();
            }
        }
    }, [user]);
    

        return (
            <Box
                sx={{
                    p: 2,
                    pb: 0,
                    position: 'relative',
                    height: '100vh',
                    boxSizing: 'border-box',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <Box
                    ref={chatBoxRef}
                    sx={{
                        flexGrow: 1,
                        overflowY: 'auto',
                        pr: 2,
                    }}
                >
                    {chats.map((chat, index) => (
                        <Box
                            key={index}
                            display="flex"
                            justifyContent={chat.createBy == user?.id ? 'flex-end' : 'flex-start'}
                            sx={{ mb: 1 }}
                        >
                            {!(chat.createBy == user?.id) &&
                                <Avatar />
                            }
                            <Paper
                                sx={{
                                    p: 1.5,
                                    m: 1,
                                    backgroundColor: chat.createBy == user?.id ? '#3A99D9' : '#C9E0F7',
                                    color: chat.createBy == user?.id ? '#fff' : '#000',
                                    maxWidth: 750,
                                    wordBreak: 'break-word',
                                }}
                            >
                                <Typography variant="body2">
                                    {chat.content}
                                </Typography>
                            </Paper>
                        </Box>
                    ))}
                </Box>

                <Box
                    sx={{
                        position: 'sticky',
                        bottom: 0,
                        width: '100%',
                        p: 1,
                        boxSizing: 'border-box',
                    }}
                >
                    <ChatInput
                        client={client}
                        selectedRoom={selectedRoom}
                    />
                </Box>
            </Box>
        );
}

export default ChatArea;