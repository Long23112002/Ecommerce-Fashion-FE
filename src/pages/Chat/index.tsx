import {
  Box,
  Grid
} from '@mui/material';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { userSelector } from '../../redux/reducers/UserReducer';
import ChatArea from './ChatArea';
import Sidebar from './Sidebar';
  
  const ChatPage: React.FC = () => {
  
    const user = useSelector(userSelector);
    const [selectedRoom, setSelectedRoom] = useState<string>('')
  
    if (user) {
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
  };
  
  export default ChatPage;