import { Box, Button, TextField } from '@mui/material'
import { Client } from '@stomp/stompjs'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { userSelector } from '../../redux/reducers/UserReducer'
import Cookies from "js-cookie";

interface IProps {
    client: Client | null
}

const ChatInput: React.FC<IProps> = ({ client }) => {

    const user = useSelector(userSelector)
    const [content, setContent] = useState<string>('')

    const handleSend = () => {
        const token = Cookies.get('accessToken')
        if (client && client.connected && content.trim().length > 0) {
            client.publish({
                destination: `/app/chat.sendMessage`,
                body: JSON.stringify({
                    content: content,
                    createBy: user.id
                }),
                headers: {
                    token: token + ''
                }
            })
            setContent('')
        }
    }

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