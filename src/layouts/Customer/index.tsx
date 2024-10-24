import React from 'react';
import { Outlet } from 'react-router-dom';
import UserHeader from './Header';
import { Box } from '@mui/material';
import Chat from '../../components/Chat';

const UserLayout: React.FC = () => {

    return (
        <div className="d-flex">
            <div className='w-100'
                style={{
                    backgroundColor: '#f5f5f5'
                }}>

                <a href="" style={{ textDecoration: "none", backgroundColor: "#EFFFF4", cursor: "pointer" }}
                    className="d-flex justify-content-center align-items-center header-top">
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <p style={{ color: "#00AB56", fontWeight: "bold", fontSize: 11, marginBottom: 0 }}>Freeship đơn từ 45k, giảm nhiều hơn cùng</p>
                        <img style={{ height: '14px', marginLeft: "5px" }} alt=""
                            src="https://salt.tikicdn.com/ts/upload/a7/18/8c/910f3a83b017b7ced73e80c7ed4154b0.png" />
                    </div>
                </a>
                
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