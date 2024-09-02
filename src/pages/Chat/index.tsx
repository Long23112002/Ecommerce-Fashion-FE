import {
  Box,
  Grid
} from '@mui/material';
import React, { useState } from 'react';
import ChatArea from './ChatArea';
import Sidebar from './Sidebar';

const ChatPage: React.FC = () => {

  const [selectedRoom, setSelectedRoom] = useState<string>('')

  return (
    <Box sx={{ height: '100vh', display: 'flex' }}>
      <Grid container>
        <Grid item xs={3}>
          <Sidebar
            setSelectedRoom={setSelectedRoom}
          />
        </Grid>
        <Grid item xs={9}>
          <ChatArea
            selectedRoom={selectedRoom}
          />
        </Grid>
      </Grid>
    </Box>
  );
}

export default ChatPage;