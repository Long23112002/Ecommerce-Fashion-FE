import { Avatar, Box, Divider, List, ListItem, ListItemText, Typography } from '@mui/material';
import { Client, IMessage } from '@stomp/stompjs';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import SockJS from 'sockjs-client';
import { refreshToken } from '../../api/AxiosInstance';
import { callFindAllChatRoom } from '../../api/ChatApi';
import { SOCKET_API } from '../../constants/BaseApi';
import { userSelector } from '../../redux/reducers/UserReducer';
import ChatRoom from '../../types/ChatRoom';
import MuiLoading from '../MuiLoading';

interface IProps {
  setIdRoom: React.Dispatch<React.SetStateAction<string>>
}

const ChatRoomList: React.FC<IProps> = ({ setIdRoom }) => {

  const user = useSelector(userSelector)
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [client, setClient] = useState<Client | null>(null)

  const fetchFindAllChatRoom = async () => {
    const data = await callFindAllChatRoom()
    setChatRooms([...data])
    setLoading(false)
  }

  useEffect(() => {
    const initializeWebSocket = async () => {
      if (user.id) {
        const token = await refreshToken();
        const sock = new SockJS(SOCKET_API);
        const stompClient = new Client({
          webSocketFactory: () => sock as WebSocket,
          onConnect: () => {
            stompClient.subscribe(`/admin`, (chatRoom: IMessage) => {
              setChatRooms([...JSON.parse(chatRoom.body)]);
            },
              {
                Authorization: token
              });
            fetchFindAllChatRoom();
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
  }, [user]);

  const handleChangeRoom = (id: string) => {
    setIdRoom(id)
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h5" align="center" sx={{ p: 2 }}>
        Danh sách chat
      </Typography>
      <Divider />
      {loading ? (
        <MuiLoading />
      ) : (
        <List>
          {
            chatRooms.map((room) => (
              <ListItem button key={room.id}
                onClick={() => handleChangeRoom(room.id + '')}
              >
                <Avatar
                  src={room.avatar}
                  sx={{
                    mr: 1
                  }} />
                <ListItemText
                  primary={room.nameClient}
                  secondary={room.lastChat}
                  sx={{
                    width: 0,
                    overflow: 'hidden',
                    textWrap: 'nowrap'
                  }} />
                {
                  (room.seen !== null && room.seen === false) &&
                  <Box
                    sx={{
                      position: 'absolute',
                      right: -20,
                      top: '50%',
                      transform: 'translate(0,-50%)',
                      backgroundColor: '#00B8D9',
                      color: 'white',
                      borderRadius: '50%',
                      fontSize: '14px',
                      width: 20,
                      height: 20,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  />
                }
              </ListItem>
            ))
          }
        </List>
      )}
    </Box>
  )
}

export default ChatRoomList