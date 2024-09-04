import React from 'react';
import {Navigate, Outlet} from 'react-router-dom';
import useAdminAuth from './useAdminAuth.tsx';
import {Spin} from "antd";

const AdminRoute: React.FC = () => {
    const isAdmin = useAdminAuth();

    if (isAdmin === null) {
        return <div><Spin/></div>;
    }

    return isAdmin ? <Outlet/> : <Navigate to="/403"/>;
};

export default AdminRoute;
