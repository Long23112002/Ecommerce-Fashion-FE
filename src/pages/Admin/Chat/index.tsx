import { Box, Grid } from '@mui/material'
import React, { useState } from 'react'
import ChatArea from '../../../components/Chat/ChatArea'
import ChatRoomList from '../../../components/Chat/ChatRoomList'

const ChatPage: React.FC = () => {

    const [idRoom, setIdRoom] = useState<string>('')

    return (
        <Box sx={{ display: 'flex', height: '82vh' }}>
            <Grid container justifyContent='space-between'>
                <Grid item xs={2.5}>
                    <ChatRoomList
                        setIdRoom={setIdRoom}
                    />
                </Grid>
                <Grid item xs={8.5}>
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