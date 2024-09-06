import { Box, IconButton, Slide, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { callFindIdChatRoomByUserId } from '../../api/ChatApi';
import { userSelector } from '../../redux/reducers/UserReducer';
import ChatArea from './ChatArea';

interface IProps {
  closeChat: () => void
  isChatOpen: boolean
}

const ChatRoomBox: React.FC<IProps> = ({ closeChat, isChatOpen }) => {

  const user = useSelector(userSelector)
  const [idRoom, setIdRoom] = useState<string>('')

  const fetchFindIdChatRoomByUserId = async () => {
    if (user.id != -1) {
      const res = await callFindIdChatRoomByUserId(user.id)
      setIdRoom(res)
    }
  }

  useEffect(() => {
    fetchFindIdChatRoomByUserId()
  }, [user])

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

        <ChatArea
          idRoom={idRoom}
        />

      </Box>
    </Slide>
  );
}

export default ChatRoomBox