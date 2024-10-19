import { Box, IconButton } from '@mui/material'
import React, { useEffect, useState } from 'react'
import ChatRoomBox from './ChatRoomBox';
import { chatSelector, setNewChat } from '../../redux/reducers/ChatReducer';
import { useDispatch, useSelector } from 'react-redux';

const Chat: React.FC = () => {

    const seen = useSelector(chatSelector)
    const dispatch = useDispatch()
    const [isChatOpen, setIsChatOpen] = useState<boolean>(false);

    const toggleChat = () => {
        setIsChatOpen(!isChatOpen)
    };

    const closeChat = () => {
        setIsChatOpen(false)
    }

    useEffect(()=>{
        if(isChatOpen){
            dispatch(setNewChat(false))
        }
    },[isChatOpen])

    return (
        <>
            <IconButton
                size="large"
                aria-label="account of current notification"
                sx={{
                    color: '#A6B0B8',
                    position: 'relative',
                    p: 1.5,
                    border: '1px solid #7d7d7d'
                }}
                onClick={toggleChat}
            >
                <i className="fa-solid fa-message fs-3" />
                {
                    seen &&
                    <Box
                        component='span'
                        sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            width: 18,
                            height: 18,
                            backgroundColor: 'red',
                            color: 'white',
                            borderRadius: '50%',
                            justifyContent: 'center',
                            alignItems: 'center',
                            fontSize: 15,
                        }}
                    >
                    </Box>
                }
            </IconButton>
            <ChatRoomBox
                isChatOpen={isChatOpen}
                closeChat={closeChat}
            />
        </>
    )
}

export default Chat