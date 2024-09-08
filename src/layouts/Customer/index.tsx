import React from 'react';
import { Outlet } from 'react-router-dom';
import UserHeader from './Header';

const UserLayout: React.FC = () => {
    
    return (
        <div className="d-flex">
            <div className='w-100'>
                <UserHeader/>
                <main style={{ padding: '2em 0' }}>
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default UserLayout;