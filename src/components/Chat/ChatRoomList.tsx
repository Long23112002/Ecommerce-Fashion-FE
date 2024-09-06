import { List, ListItem, ListItemText, CircularProgress, Typography, Box, Divider, Avatar } from '@mui/material';
import React, { useEffect, useState } from 'react'
import ChatRoom from '../../types/ChatRoom'
import { useSelector } from 'react-redux'
import { userSelector } from '../../redux/reducers/UserReducer'
import { callFindAllChatRoom } from '../../api/ChatApi'

interface IProps {
  setIdRoom: React.Dispatch<React.SetStateAction<string>>
}

const ChatRoomList: React.FC<IProps> = ({ setIdRoom }) => {

  const user = useSelector(userSelector)
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([])
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchFindAllChatRoom = async () => {
      const data = await callFindAllChatRoom()
      setChatRooms([...data])
      setLoading(false)
    }
    fetchFindAllChatRoom()
  }, [user])

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
          {chatRooms.length > 0 ? (
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
                  // secondary={room.lastMessage}
                  sx={{
                    overflow: 'hidden',
                    textWrap: 'nowrap'
                  }} />
                {
                  // ((room.unseenMessageCount ?? 0) > 0 && room.idLastSender != user.id) &&
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
                  >
                    {/* {(room.unseenMessageCount ?? 0) > 9 ? "9+" : room.unseenMessageCount} */}
                  </Box>
                }
              </ListItem>
            ))
          ) : (
            <Typography variant="body1" align="center" sx={{ p: 2 }}>
              Không có phòng chat nào
            </Typography>
          )}
        </List>
      )}
    </Box>
  )
}

export default ChatRoomList