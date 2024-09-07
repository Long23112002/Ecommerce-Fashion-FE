import { List, ListItem, ListItemText, CircularProgress, Typography, Box, Divider, Avatar } from '@mui/material';
import React, { useEffect, useState } from 'react'
import ChatRoom from '../../types/ChatRoom'
import { useSelector } from 'react-redux'
import { userSelector } from '../../redux/reducers/UserReducer'
import { callFindAllChatRoom } from '../../api/ChatApi'
import { refreshToken } from '../../api/AxiosInstance';
import SockJS from 'sockjs-client';
import { Client, IMessage } from '@stomp/stompjs';
import { SOCKET_API } from '../../constants/BaseApi';

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
          debug: function (str) {
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
    <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
      <Typography variant="h5" align="center" sx={{ p: 2 }}>
        Danh sách chat
      </Typography>
      <Divider />
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="100%">
          <CircularProgress />
        </Box>
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