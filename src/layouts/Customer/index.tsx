import React from 'react';
import { Outlet } from 'react-router-dom';
import UserHeader from './Header';
import { Box } from '@mui/material';
import Chat from '../../components/Chat';

const UserLayout: React.FC = () => {

    return (
        <div className="d-flex">
            <div className='w-100'>
                <UserHeader />
                <main>
                    <Outlet />
                    <Box
                        component='span'
                        sx={{
                            position: 'fixed',
                            bottom: 20,
                            right: 20
                        }}
                    >
                        <Chat />
                    </Box>
                </main>
            </div>
        </div>
    );
};

export default UserLayout;