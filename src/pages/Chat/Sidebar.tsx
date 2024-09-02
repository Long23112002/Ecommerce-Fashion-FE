import { Autocomplete, Avatar, Button, List, ListItem, ListItemText, TextField, Typography } from '@mui/material';
import React, { SetStateAction, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { userSelector } from '../../redux/reducers/UserReducer';
import ChatRoom from '../../types/ChatRoom';
import User from '../../types/User';

interface IProps {
    setSelectedRoom: React.Dispatch<SetStateAction<string>>
}

const Sidebar: React.FC<IProps> = ({ setSelectedRoom }) => {
    const user = useSelector(userSelector)
    const [chatRooms, setChatRooms] = useState<ChatRoom[]>([])
    const [users, setUsers] = useState<User[]>([])
    const [selectedUser, setSelectedUser] = useState<number>(0)

    return (
        <>
            <List sx={{ px: 2 }}>
                <Typography variant='h5' m={3} my={1}>{user?.fullName}</Typography>
                <ListItem
                    sx={{
                        display: 'flex',
                        alignItems: 'center'
                    }}
                >
                </ListItem>
                {chatRooms.map(cr => (
                    <ListItem button key={cr.id}
                        onClick={() => setSelectedRoom(cr.id+'')}
                    >
                        <Avatar
                            sx={{
                                mr: 1
                            }} />
                        <ListItemText primary={cr.nameReceiver} // secondary={cr.lastMessage}
                            sx={{
                                overflow: 'hidden',
                                textWrap: 'nowrap'
                            }} />
                        {/* {
                            ((cr.unseenMessageCount ?? 0) > 0 && cr.idLastSender != user.id) &&
                            <Box
                                sx={{
                                    position: 'absolute',
                                    left: 40,
                                    top: 10,
                                    backgroundColor: 'red',
                                    color: 'white',
                                    borderRadius: '50%',
                                    fontSize: '14px',
                                    width: 20,
                                    height: 20,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                {(cr.unseenMessageCount ?? 0) > 9 ? "9+" : cr.unseenMessageCount}
                            </Box>
                        } */}
                    </ListItem>
                ))}

            </List>
        </>
    );
}

export default Sidebar;