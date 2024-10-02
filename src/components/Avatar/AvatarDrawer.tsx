import { Avatar, Box, Drawer, Grid, IconButton, Stack, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useNavigate } from "react-router-dom";
import { getUserData, handleLogout } from "../../api/AuthApi.ts";
import { clearUser, setUser, userSelector } from "../../redux/reducers/UserReducer.ts";
import Button from "../Button.tsx";

interface IProps {
    open?: boolean;
    toggleDrawer?: (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => void;
}

const AvatarDrawer: React.FC<IProps> = ({ open, toggleDrawer }) => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const logout = async () => {
        await handleLogout();
        dispatch(clearUser())
        navigate('/');
    }

    useEffect(() => {
        const userData = getUserData();
        dispatch(setUser({
            id: Number(userData.id),
            isAdmin: userData.isAdmin === "true",
            fullName: userData.fullName,
            email: userData.email,
            avatar: userData.avatar,
        }));
    }, [dispatch]);


    const user = useSelector(userSelector);

    return (
        <Drawer
            anchor='right'
            open={open}
            onClose={toggleDrawer ? toggleDrawer(false) : undefined}
        >
            <Box
                sx={{
                    width: {
                        xs: '90vw',
                        md: 330
                    },
                    padding: 2,
                    height: '100%',
                    backgroundColor: '#f5f5f5'
                }}
            >
                <IconButton
                    onClick={toggleDrawer ? toggleDrawer(false) : undefined}
                >
                    <i className="fa-solid fa-xmark" />

                </IconButton>
                <Grid
                    container
                    justifyContent='center'
                    rowGap={1}
                >
                    <Grid
                        item
                        xs={12}
                        display='flex'
                        justifyContent='center'
                    >
                        <Box
                            sx={{
                                width: "60%",
                                aspectRatio: "1/1"
                            }}
                        >
                            <Avatar
                                alt="Remy Sharp"
                                src={user?.avatar}
                                sx={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover'
                                }}
                            />
                        </Box>
                    </Grid>
                    <Grid
                        item
                        xs={12}
                        display='flex'
                        justifyContent='center'
                    >
                        <Typography variant='h6'>
                            {user?.fullName}
                        </Typography>
                    </Grid>
                    <Grid
                        item
                        xs={12}
                        display='flex'
                        justifyContent='center'
                    >
                        <Typography variant='body2' noWrap>
                            {user?.email}
                        </Typography>
                    </Grid>
                </Grid>

                <Stack>
                    <Button
                        onClick={logout}
                        backgroundColor='rgba(255, 86, 48, 0.18)'
                        color='rgba(255, 86, 48)'
                    >
                        Logout
                    </Button>
                </Stack>
            </Box >
        </Drawer >
    );
};

export default AvatarDrawer;