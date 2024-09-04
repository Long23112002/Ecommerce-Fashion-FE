import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {getUserData} from "../api/AuthApi.ts";


const useAdminAuth = () => {
    const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const userData = getUserData();
        if (userData.isAdmin === 'true') {
            setIsAdmin(true);
        } else {
            setIsAdmin(false);
            navigate('/403');
        }
    }, [navigate]);

    return isAdmin;
};

export default useAdminAuth;
