import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import AdminHeader from './Header';
import AdminSidebar from './Sidebar';

const AdminLayout: React.FC = () => {
    const [collapse, setCollapse] = useState<boolean>(false);
    const [toggled, setToggled] = useState(false);
    const [broken, setBroken] = useState(window.matchMedia('(max-width: 1000px)').matches);

    const handleCollapse = () => setCollapse(!collapse);
    const handleToggled = () => {
        setToggled(!toggled);
        setCollapse(false);
    };

    useEffect(() => {
        const handleResize = () => setBroken(window.matchMedia('(max-width: 1000px)').matches);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="d-flex" style={{ overflow: 'hidden', width: '100vw', height: '100vh' }}>
            <AdminSidebar
                collapse={collapse}
                toggled={toggled}
                setToggled={setToggled}
                setBroken={setBroken}
                broken={broken}
            />
            <div className='w-100' style={{ overflow: 'auto' }}>
                <AdminHeader
                    handleCollapse={handleCollapse}
                    handleToggled={handleToggled}
                    broken={broken}
                />
                <main style={{ padding: 0 }}>
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
