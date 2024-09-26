import { Box, Button, IconButton, Slide, Typography } from '@mui/material';
import { Button as AntdButton } from 'antd';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { callCreateChatRoom, callFindIdChatRoomByUserId } from '../../api/ChatApi';
import { userSelector } from '../../redux/reducers/UserReducer';
import ChatArea from './ChatArea';
import LoginUserModel from '../User/LoginModelUser';
import { UserOutlined } from '@ant-design/icons';

interface IProps {
  closeChat: () => void
  isChatOpen: boolean
}

const ChatRoomBox: React.FC<IProps> = ({ closeChat, isChatOpen }) => {

  const user = useSelector(userSelector)
  const [idRoom, setIdRoom] = useState<string>('')
  const [isRoomExist, setIsRoomExist] = useState<boolean>(true)
  const [isLoginModalVisible, setIsLoginModalVisible] = useState(false);

  const fetchFindIdChatRoomByUserId = async () => {
    if (user.id > 0) {
      try {
        const res = await callFindIdChatRoomByUserId(user.id);
        setIdRoom(res);
      } catch (error: any) {
        const code = error.response.data.messageCode;
        if (code === "CHAT_ROOM_NOT_FOUND") {
          setIsRoomExist(false)
        } else {
          console.error(error)
        }
      }
    }
  }

  useEffect(() => {
    fetchFindIdChatRoomByUserId()
  }, [user])

  const createRoom = async () => {
    if (user && user.id > 0) {
      try {
        const res = await callCreateChatRoom({ idClient: user.id })
        setIdRoom(res.id)
        setIsRoomExist(true)
      } catch (error) {

      }
    }
  }
  const openLoginModal = () => {
    setIsLoginModalVisible(true);
  };
  const closeLoginModal = () => {
    setIsLoginModalVisible(false);
  };

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
          maxWidth: 400,
          maxHeight: 500,
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

        {
          (user && user.id > 0)
            ?
            isRoomExist
              ?
              <ChatArea
                idRoom={idRoom}
                px={1.5}
              />
              :
              <Box
                display='flex'
                justifyContent='center'
                alignItems='center'
                height='100%'
              >
                <Button
                  variant='contained'
                  color='success'
                  size='large'
                  onClick={createRoom}
                >
                  Tạo chat
                </Button>
              </Box>
            :
            <>
              <Box
                display='flex'
                flexDirection='column'
                justifyContent='center'
                alignItems='center'
                height='100%'
              >
                <Typography>
                  Đăng nhập để nhắn tin
                </Typography>
                <AntdButton
                  type="text"
                  onClick={openLoginModal}
                  icon={<UserOutlined />}
                >
                  Đăng nhập
                </AntdButton>
              </Box>

              <LoginUserModel
                isModalVisible={isLoginModalVisible}
                handleCancel={closeLoginModal}
              />
            </>
        }

      </Box>
    </Slide>
  );
}

export default ChatRoomBox