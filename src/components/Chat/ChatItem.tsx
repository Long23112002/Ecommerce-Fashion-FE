import { Avatar, Box, IconButton, Paper, Typography } from '@mui/material'
import React, { useState } from 'react'
import Chat from '../../types/Chat'

interface IProps {
  chat: Chat,
  id: number,
  isAdmin: boolean,
  show: boolean,
  setReply: React.Dispatch<React.SetStateAction<Chat | null>>
}

const ChatItem: React.FC<IProps> = ({ chat, id, isAdmin, show, setReply }) => {

  const [isHover, setIsHover] = useState<boolean>(false);

  const replyIcon = (
    (isHover) &&
    <IconButton
      onClick={() => setReply(chat)}
    >
      <i className="fa-solid fa-reply fs-5"></i>
    </IconButton>
  )

  return (
    <Box
      display="flex"
      justifyContent={chat.createBy == id ? 'flex-end' : 'flex-start'}
      alignItems='center'
      sx={{ mb: 1 }}
      onMouseOver={() => setIsHover(true)}
      onMouseOut={() => setIsHover(false)}
    >

      {chat.createBy == id &&
        replyIcon
      }

      {!(chat.createBy == id) &&
        <Avatar
          src={isAdmin ? chat.avatar : "logo.png"}
          sx={{
            opacity: show ? 1 : 0
          }}
        />
      }
      <Paper
        sx={{
          p: 1.5,
          m: 1,
          backgroundColor: chat.createBy == id ? '#5ca8db' : '#E5EFFF',
          color: chat.createBy == id ? '#fff' : '#000',
          maxWidth: '70%',
          wordBreak: 'break-word',
          position: 'relative',
          borderRadius: 2
        }}
      >
        {chat.reply &&
          <Paper
            sx={{
              p: 0.5,
              mb: 1,
              backgroundColor: chat.createBy === id ? '#308cc9' : '#C4D6F4',
              boxShadow: 'none',
              color: chat.createBy === id ? '#fff' : '#000',
              maxWidth: '100%',
              overflow: 'hidden'
            }}
          >
            <Typography variant='subtitle2'
            sx={{
              fontSize: 13
            }}>
              {chat.reply.nameCreateBy}
            </Typography>
            <Typography variant="body2"
              sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitBoxOrient: 'vertical',
                WebkitLineClamp: 3,
                fontSize: 13
              }}>
              {chat.reply.content}
            </Typography>
          </Paper>


        }
        <Typography variant="body2">
          {chat.content}
        </Typography>
      </Paper>

      {chat.createBy != id &&
        replyIcon
      }

    </Box>
  )
}

export default ChatItem