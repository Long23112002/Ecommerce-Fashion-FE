import { Box, Grid } from '@mui/material'
import React, { useEffect, useState } from 'react'
import ChatArea from '../../../components/Chat/ChatArea'
import ChatRoomList from '../../../components/Chat/ChatRoomList'

const ChatPage: React.FC = () => {

    const [idRoom, setIdRoom] = useState<string>('')
    useEffect(()=>{
        console.log(idRoom)
    },[idRoom])

    return (
        <Box sx={{ display: 'flex', py: 0, flexDirection: 'column' }}>
            <Grid container justifyContent='space-between'>
                <Grid item xs={2.5}>
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