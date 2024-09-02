import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminHeader from './Header';
import AdminSidebar from './Sidebar';
import { useSelector } from 'react-redux';
import { userSelector } from '../../redux/reducers/UserReducer';

const AdminLayout: React.FC = () => {
    const user = useSelector(userSelector)
    const [collapse, setCollapse] = useState<boolean>(false)
    const [toggled, setToggled] = React.useState(false);
    const [broken, setBroken] = React.useState(window.matchMedia('(max-width: 1000px)').matches);

    const handleCollapse = () => setCollapse(!collapse)
    const handleToggled = () => {
        setToggled(!toggled),
            setCollapse(false)
    }

    return (
        <div className="d-flex">
            <AdminSidebar
                collapse={collapse}
                toggled={toggled}
                setToggled={setToggled}
                setBroken={setBroken}
                broken={broken}
            />
            <div className='w-100'>
                <AdminHeader
                    handleCollapse={handleCollapse}
                    handleToggled={handleToggled}
                    broken={broken}
                />
                <main style={{ padding: '2em 0' }}>
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;