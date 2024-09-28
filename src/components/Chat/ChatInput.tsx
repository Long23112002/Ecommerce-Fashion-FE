import { Box, Button, IconButton, TextField, Typography } from '@mui/material'
import { Client } from '@stomp/stompjs'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { userSelector } from '../../redux/reducers/UserReducer'
import Chat from '../../types/Chat'

interface IProps {
    client: Client | null,
    idRoom: string,
    reply: Chat | null,
    setReply: React.Dispatch<React.SetStateAction<Chat | null>>
}

const ChatInput: React.FC<IProps> = ({ client, idRoom, reply, setReply }) => {

    const user = useSelector(userSelector)
    const [content, setContent] = useState<string>('')

    const sendMessage = (content: string) => {
        console.log(reply)
        if (client && client.connected && content.trim().length > 0) {
            client.publish({
                destination: `/app/chat.sendMessage/${idRoom}`,
                body: JSON.stringify({
                    idRoom: idRoom,
                    content: content,
                    createBy: user.id,
                    idReply: reply?.id || null
                })
            });
        }
    };

    const handleSend = async () => {
        sendMessage(content);
        setContent('');
        setReply(null)
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
                borderTop: '1px solid #ddd',
            }}
        >
            {
                reply &&
                <Box
                    sx={{
                        m: 1,
                        px: 2,
                        py: 1,
                        borderRadius: 2,
                        backgroundColor: '#EEF0F1'
                    }}
                >
                    <Box
                        display='flex'
                        justifyContent='space-between'
                        alignItems='center'
                    >
                        <Typography variant='subtitle2'>
                            Trả lời: {reply.nameCreateBy}
                        </Typography>
                        <IconButton
                            onClick={() => setReply(null)}
                        >
                            <i className="fa-solid fa-xmark fs-5" />
                        </IconButton>
                    </Box>
                    <Typography variant='body2'
                        sx={{
                            overflow: 'hidden'
                        }}
                    >
                        {reply.content}
                    </Typography>
                </Box>
            }
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    p: 1,
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
        </Box>
    )
}

export default ChatInput