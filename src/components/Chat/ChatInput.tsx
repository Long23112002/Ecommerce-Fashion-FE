import { Box, Button, TextField } from '@mui/material'
import { Client } from '@stomp/stompjs'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { userSelector } from '../../redux/reducers/UserReducer'

interface IProps {
    client: Client | null,
    idRoom: string,
}

const ChatInput: React.FC<IProps> = ({ client, idRoom }) => {

    const user = useSelector(userSelector)
    const [content, setContent] = useState<string>('')

    const sendMessage = (content: string) => {
        if (client && client.connected && content.trim().length > 0) {
            client.publish({
                destination: `/app/chat.sendMessage/${idRoom}`,
                body: JSON.stringify({
                    idRoom: idRoom,
                    content: content,
                    createBy: user.id
                })
            });
        }
    };

    const handleSend = async () => {
        sendMessage(content);
        setContent('');
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Enter') {
            handleSend()
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setContent(e.target.value)
    }

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                p: 1,
                borderTop: '1px solid #ddd',
                gap: 1,
            }}
        >
            <TextField
                variant="outlined"
                size="small"
                fullWidth
                value={content}
                onKeyDown={handleKeyDown}
                onChange={handleChange}
            />
            <Button variant="text"
                onClick={handleSend}
            >
                <i className="fa-solid fa-paper-plane fs-4" />
            </Button>
        </Box>
    )
}

export default ChatInput