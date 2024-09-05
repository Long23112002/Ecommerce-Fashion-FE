import { Box, CircularProgress, IconButton, Slide, Typography } from '@mui/material';
import { Client, IMessage } from '@stomp/stompjs';
import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import SockJS from 'sockjs-client';
import { refreshToken } from '../../api/AxiosInstance';
import { callFindAllChatByIdChatRoom, callFindIdChatRoomByUserId } from '../../api/ChatApi';
import { SOCKET_API } from '../../constants/BaseApi';
import { userSelector } from '../../redux/reducers/UserReducer';
import Chat from '../../types/Chat';
import ChatInput from './ChatInput';
import ChatItem from './ChatItem';

interface IProps {
  closeChat: () => void
  isChatOpen: boolean
}

const ChatRoom: React.FC<IProps> = ({ closeChat, isChatOpen }) => {

  const user = useSelector(userSelector)
  const [client, setClient] = useState<Client | null>(null)
  const [chats, setChats] = useState<Chat[]>([])
  const [idRoom, setIdRoom] = useState<string>('')
  const chatBoxRef = useRef<HTMLElement | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  const fetchFindIdChatRoomByUserId = async () => {
    if (user.id != -1) {
      const res = await callFindIdChatRoomByUserId(user.id)
      setIdRoom(res)
    }
  }

  const fetchFindAllChatByIdChatRoom = async () => {
    if (user.id != -1 && idRoom) {
      const res = await callFindAllChatByIdChatRoom(idRoom)
      setChats(res)
    }
  }

  useEffect(() => {
    const initializeWebSocket = async () => {
      const token = await refreshToken();
      await fetchFindIdChatRoomByUserId();

      if (idRoom) {
        const sock = new SockJS(SOCKET_API);
        const stompClient = new Client({
          webSocketFactory: () => sock as WebSocket,
          onConnect: () => {
            stompClient.subscribe(`/room/${idRoom}`, (chat: IMessage) => {
              setChats(prevChats => [
                ...prevChats,
                JSON.parse(chat.body)
              ]);
            },
              {
                Authorization: token
              });
            fetchFindAllChatByIdChatRoom();
          },
          connectHeaders: {
            Authorization: token,
          },
          debug: (str) => {
            console.log(str);
          }
        });

        stompClient.activate();
        setClient(stompClient);

        setLoading(false)

        return () => {
          stompClient.deactivate();
        };
      }
    };

    initializeWebSocket().catch(error => {
      console.error('Error initializing WebSocket:', error);
    });

    return () => {
      if (client) {
        client.deactivate();
      }
    };
  }, [user, idRoom]);



  useEffect(() => {
    const item = chatBoxRef.current;
    if (item) {
      item.scrollTop = item.scrollHeight
    }
  }, [chats])

  return (

    <Slide direction="up" in={isChatOpen}>
      <Box
        sx={{
          position: 'fixed',
          zIndex: 20,
          bottom: 0,
          right: {
            xs: 0,
            md: 15
          },
          width: '100%',
          height: '100%',
          maxWidth: 600,
          maxHeight: 700,
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

        <Box
          ref={chatBoxRef}
          sx={{
            flex: 1,
            overflowY: 'auto',
            py: 3,
            px: 4
          }}>
          {
            !loading
              ?
              chats.map((chat, index) =>
                <ChatItem
                  key={index}
                  chat={chat}
                  id={user.id}
                />
              )
              :
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%'
                }}
              >
                <CircularProgress />
              </Box>
          }
        </Box>

        <ChatInput
          client={client}
          idRoom={idRoom}
        />

      </Box>
    </Slide>
  );
}

export default ChatRoom