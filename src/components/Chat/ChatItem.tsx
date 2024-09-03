import { Avatar, Box, Paper, Typography } from '@mui/material'
import React from 'react'
import Chat from '../../types/Chat'

interface IProps {
  chat: Chat
  id: number
}

const ChatItem: React.FC<IProps> = ({ chat, id }) => {
  return (
    <Box
      display="flex"
      justifyContent={chat.createBy == id ? 'flex-end' : 'flex-start'}
      sx={{ mb: 1 }}
    >
      {!(chat.createBy == id) &&
        <Avatar
          src={chat.avatar}
        />
      }
      <Paper
        sx={{
          p: 1.5,
          m: 1,
          backgroundColor: chat.createBy == id ? '#3A99D9' : '#C9E0F7',
          color: chat.createBy == id ? '#fff' : '#000',
          maxWidth: 350,
          wordBreak: 'break-word',
        }}
      >
        <Typography variant="body2">
          {chat.content}
        </Typography>
      </Paper>
    </Box>
  )
}

export default ChatItem