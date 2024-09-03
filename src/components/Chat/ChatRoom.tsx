import { Box, IconButton, Slide, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { userSelector } from '../../redux/reducers/UserReducer';
import Chat from '../../types/Chat';
import ChatInput from './ChatInput';
import ChatItem from './ChatItem';
import Cookies from "js-cookie";
import SockJS from 'sockjs-client';
import { SOCKET_API } from '../../constants/BaseApi';
import { Client, IMessage } from '@stomp/stompjs';

interface IProps {
  closeChat: () => void
  isChatOpen: boolean
}

const ChatRoom: React.FC<IProps> = ({ closeChat, isChatOpen }) => {

  const user = useSelector(userSelector)
  const [client, setClient] = useState<Client | null>(null)
  const [chats, setChats] = useState<Chat[]>([])

  useEffect(() => {
    const token = Cookies.get('accessToken');

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
        })
      },
      connectHeaders: {
        Authorization: token + '',
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

    <Slide direction="up" in={isChatOpen}>
      <Box
        sx={{
          position: 'fixed',
          bottom: 0,
          right: 20,
          width: 600,
          height: 700,
          bgcolor: 'white',
          border: '1px solid #ddd',
          borderRadius: '8px 8px 0 0',
          boxShadow: 3,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          p: 1,
          borderBottom: '1px solid #ddd'
        }}>

          <Typography
            variant="h5"
            color='black'
            mx={2}
          >
            Chat
          </Typography>

          <IconButton
            onClick={closeChat}
          >
            <i className="fa-solid fa-xmark" />
          </IconButton>

        </Box>

        <Box sx={{
          flex: 1,
          overflowY: 'auto',
          py: 3,
          px: 4
        }}>
          {chats.map((chat, index) =>
            <ChatItem
              key={index}
              chat={chat}
              id={user.id}
            />
          )}
        </Box>

        <ChatInput
          client={client}
        />

      </Box>
    </Slide>
  );
}

export default ChatRoom