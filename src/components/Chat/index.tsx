import { Box, IconButton } from '@mui/material'
import React, { useState } from 'react'
import ChatRoom from './ChatRoom';

const Chat: React.FC = () => {

    const [isChatOpen, setIsChatOpen] = useState<boolean>(false);

    const toggleChat = () => {
        setIsChatOpen(!isChatOpen)
    };

    const closeChat = () => {
        setIsChatOpen(false)
    }

    return (
        <>
            <IconButton
                size="large"
                aria-label="account of current notification"
                sx={{
                    color: '#A6B0B8',
                    mr: {
                        xs: 0.5,
                        md: 3
                    },
                    position: 'relative'
                }}
                onClick={toggleChat}
            >
                <i className="fa-solid fa-message fs-2" />
                <Box
                    component='span'
                    sx={{
                        position: 'absolute',
                        top: 5,
                        right: 3,
                        width: 20,
                        height: 20,
                        backgroundColor: 'red',
                        color: 'white',
                        borderRadius: '50%',
                        justifyContent: 'center',
                        alignItems: 'center',
                        fontSize: 15,
                    }}
                >
                </Box>
            </IconButton>
            <ChatRoom
                isChatOpen={isChatOpen}
                closeChat={closeChat}
            />
        </>
    )
}

export default Chat