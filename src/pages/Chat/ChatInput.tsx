import { Box, Button, TextField } from '@mui/material';
import { Client } from '@stomp/stompjs';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import { userSelector } from '../../redux/reducers/UserReducer';

interface IProps {
    client: Client | null,
    selectedRoom: number | string
}

const ChatInput: React.FC<IProps> = ({ client, selectedRoom }) => {

    const user = useSelector(userSelector)
    const [content, setContent] = useState<string>('')
    console.log(client)

    return (
        <Box display="flex" sx={{
            p: 2,
            borderTop: '1px solid #ccc',
            backgroundColor: 'white'
        }}>
            <TextField
                variant="outlined"
                placeholder="Write your message..."
                fullWidth
                value={content}
                sx={{
                    mr: 3
                }}
                onChange={(e) => setContent(e.target.value)}
            />
            <Button
                color="primary"
            >
                <i className="fa-solid fa-paper-plane"
                    style={{
                        fontSize: 30
                    }} />
            </Button>
        </Box>
    );
}

export default ChatInput;