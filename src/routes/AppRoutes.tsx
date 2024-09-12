import { Route, Routes } from 'react-router-dom';
import ProductManager from '../pages/Admin/Product';
import AdminLayout from '../layouts/Admin';

import Login from '../pages/Admin/User/Login';
import AuthenticateGoogle from '../pages/Admin/User/AuthenticateGoogle';
import AuthenticateFacebook from '../pages/Admin/User/AuthenticateFacebook';
import AdminRoute from "../hook/AdminRoute.tsx";
import { ManagerRole, ManagerUser } from "../pages/Admin/User";
import ForbiddenPage from "../pages/Error/ForbiddenPage.tsx";
import UserLayout from "../layouts/Customer";
import Home from "../pages/Customer/Home";
import ChatPage from "../pages/Admin/Chat";
import ManagerCategory from '../pages/Admin/Product/ManagerCategory/ManagerCategory.tsx';


const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/authenticate" element={<AuthenticateGoogle />} />
            <Route path="/authenticate-fb" element={<AuthenticateFacebook />} />

            <Route element={<UserLayout />}>
                <Route path='/' element={<Home />} />
            </Route>

            <Route element={<AdminRoute />}>

                <Route element={<AdminLayout />}>
                    <Route path="/admin/product/*" element={<ProductManager />} />
                    <Route path="/admin/user/role" element={<ManagerRole />} />
                    <Route path="/admin/chat" element={<ChatPage />} />
                    <Route path="/admin/user" element={<ManagerUser />} />
                    <Route path="/admin/category" element={<ManagerCategory />} />
                </Route>
            </Route>

            {/* Route xử lý lỗi */}
            <Route path="/403" element={<ForbiddenPage />} />
        </Routes>
    );
};

export default AppRoutes;
