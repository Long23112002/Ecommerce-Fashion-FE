import { Avatar, Box, IconButton, Paper, Typography } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import Chat from '../../types/Chat';
import { ChatWithFocus } from './ChatArea';
import '../../styles/animatied-chat.css'

interface IProps {
  chat: ChatWithFocus,
  id: number,
  isAdmin: boolean,
  show: boolean,
  setReply: React.Dispatch<React.SetStateAction<Chat | null>>,
  fetchFindChatsUntilTarget: (id: string) => void,
  setChatInChats: (newChat: ChatWithFocus) => void
}

const ChatItem: React.FC<IProps> = ({ chat, id, isAdmin, show, setReply, fetchFindChatsUntilTarget, setChatInChats }) => {

  const [isHover, setIsHover] = useState<boolean>(false);
  const focusChatRef = useRef<HTMLDivElement | null>(null);

  const replyIcon = (
    (isHover) &&
    <IconButton
      onClick={() => setReply(chat)}
    >
      <i className="fa-solid fa-reply fs-5"></i>
    </IconButton>
  );

  useEffect(() => {
    if (chat.focus) {
      const item = focusChatRef.current;
      item?.scrollIntoView();
      const newChat = { ...chat, focus: false };
      setTimeout(()=>{
        setChatInChats(newChat);
      },500)
    }
  }, [chat]);

  return (
    <Box
      display="flex"
      justifyContent={chat.createBy == id ? 'flex-end' : 'flex-start'}
      alignItems='center'
      sx={{ mb: 1 }}
      onMouseOver={() => setIsHover(true)}
      onMouseOut={() => setIsHover(false)}
    >

      {chat.createBy == id && replyIcon}

      {!(chat.createBy == id) && (
        <Avatar
          src={isAdmin ? chat.avatar : "logo.png"}
          sx={{
            opacity: show ? 1 : 0
          }}
        />
      )}
      <Paper
        ref={focusChatRef}
        className={chat.focus ? 'focused' : ''}
        sx={{
          p: 1.5,
          m: 1,
          backgroundColor: chat.createBy == id ? '#5ca8db' : '#E5EFFF',
          color: chat.createBy == id ? '#fff' : '#000',
          maxWidth: '70%',
          wordBreak: 'break-word',
          position: 'relative',
          borderRadius: 2,
          animation: chat.focus ? chat.createBy == id ? 'chat__focus--slideLeft 0.5s forwards' : 'chat__focus--slideRight 0.5s forwards' : 'none',
        }}
      >
        {chat.reply && (
          <Paper
            sx={{
              p: 0.5,
              mb: 1,
              backgroundColor: chat.createBy === id ? '#308cc9' : '#C4D6F4',
              boxShadow: 'none',
              color: chat.createBy === id ? '#fff' : '#000',
              maxWidth: '100%',
              overflow: 'hidden',
              cursor: 'pointer'
            }}
            onClick={() => fetchFindChatsUntilTarget(chat.reply?.id + '')}
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
        )}
        <Typography variant="body2">
          {chat.content}
        </Typography>
      </Paper>

      {chat.createBy != id && replyIcon}
    </Box>
  );
}

export default ChatItem;
