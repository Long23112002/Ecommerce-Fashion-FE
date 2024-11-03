import { Box, Grid } from '@mui/material'
import React, { useState } from 'react'
import ChatArea from '../../../components/chat/ChatArea'
import ChatRoomList from '../../../components/chat/ChatRoomList'

const ChatPage: React.FC = () => {

    const [idRoom, setIdRoom] = useState<string>('')

    return (
        <Box sx={{ display: 'flex', py: 0, flexDirection: 'column' }}>
            <Grid container justifyContent='space-between'>
                <Grid item xs={2.8}
                    sx={{
                        borderRight: '1px solid #C6C7C8',
                        maxWidth: '73px'
                    }}>
                    <ChatRoomList
                        setIdRoom={setIdRoom}
                    />
                </Grid>
                <Grid item xs={9}>
                    <ChatArea
                        idRoom={idRoom}
                        isAdmin={true}
                    />
                </Grid>
            </Grid>
        </Box>
    )
}

export default ChatPage