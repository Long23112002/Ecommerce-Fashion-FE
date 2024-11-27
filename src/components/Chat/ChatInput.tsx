import { Box, Button, IconButton, TextField, Typography } from '@mui/material'
import { Client } from '@stomp/stompjs'
import React, { useEffect, useState } from 'react'
import DoNotDisturbAltIcon from '@mui/icons-material/DoNotDisturbAlt';
import { useSelector } from 'react-redux'
import { userSelector } from '../../redux/reducers/UserReducer'
import Chat from '../../types/Chat'
import { uploadMutiImage } from '../../api/ImageApi'

interface IProps {
    client: Client | null,
    idRoom: string,
    reply: Chat | null,
    setReply: React.Dispatch<React.SetStateAction<Chat | null>>
}

const ChatInput: React.FC<IProps> = ({ client, idRoom, reply, setReply }) => {

    const user = useSelector(userSelector)
    const [content, setContent] = useState<string>('')
    const [fileImages, setFileImages] = useState<File[]>([])
    const [previewImages, setPreviewImages] = useState<string[]>([])

    const randomNumber = () => {
        return Math.floor(Math.random() * 1000000000)
    }

    const sendMessage = async (content: string) => {
        if (fileImages.length > 0) {
            const images = await uploadMutiImage(fileImages, randomNumber(), 'CHAT')
            for (const image of images) {
                await publish(null, image);
            }
        }
        if (content.trim().length > 0) {
            await publish(content, null)
        }
    };

    const publish = async (content: string | null, image: string | null) => {
        if (!idRoom || !client || !client.connected) return
        await client.publish({
            destination: `/app/chat.sendMessage/${idRoom}`,
            body: JSON.stringify({
                idRoom: idRoom,
                content: content,
                image: image,
                createBy: user.id,
                idReply: reply?.id || null
            })
        });
    }

    const handleSend = async () => {
        await sendMessage(content);
        setContent('');
        setFileImages([])
        setReply(null)
    };

    const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (files?.length) {
            setFileImages([...files])
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

    useEffect(() => {
        const link = fileImages.map(file => URL.createObjectURL(file))
        setPreviewImages(link)
        return () => {
            if (previewImages.length > 0) {
                previewImages.map(pre => URL.revokeObjectURL(pre))
            }
        }
    }, [fileImages])

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
                        {(reply.content?.length || 0) > 0 ? reply.content?.length : 'Hình ảnh'}
                    </Typography>
                </Box>
            }
            {previewImages.length > 0 &&
                <Box
                    height={80}
                    sx={{
                        display: 'flex',
                        gap: 1,
                        p: 1,
                        overflowX: 'auto'
                    }}>
                    <Button
                        variant='outlined'
                        color='error'
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            color: ''
                        }}
                        onClick={() => setFileImages([])}
                    >
                        <DoNotDisturbAltIcon sx={{ fontSize: 50 }} />
                    </Button>
                    {previewImages.map(link =>
                        <img
                            key={link}
                            src={link}
                            height='100%'
                            style={{
                                borderRadius: 5,
                                aspectRatio: '1/1',
                                objectFit: 'cover'
                            }} />
                    )}
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
                <IconButton
                    component="label"
                    tabIndex={-1}
                >
                    <i className="fa-solid fa-camera fs-4" style={{ color: '#464646' }} />
                    <input type="file" accept="image/*" multiple onChange={handleImage} style={{ display: 'none' }} />
                </IconButton>
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