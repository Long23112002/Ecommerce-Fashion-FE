import {Route, Routes} from 'react-router-dom';
import ProductManager from '../pages/Admin/Product';
import AdminLayout from '../layouts/Admin';
import AdminRoute from "../hook/AdminRoute.tsx";
import UserLayout from '../layouts/Customer/index.tsx';
import Home from '../pages/Customer/Home/index.tsx';
import ChatPage from '../pages/Admin/Chat/index.tsx';
import {ForbiddenPage} from '../pages/Error';
import {AuthenticateFacebook, AuthenticateGoogle, Login, ManagerRole, ManagerUser} from '../pages/Admin/User';


const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/login" element={<Login/>}/>
            <Route path="/authenticate" element={<AuthenticateGoogle/>}/>
            <Route path="/authenticate-fb" element={<AuthenticateFacebook/>}/>

            <Route element={<UserLayout />}>
                <Route path='/' element={<Home />} />
            </Route>

            <Route element={<AdminRoute/>}>
                <Route element={<AdminLayout/>}>
                    <Route path="/admin/product/*" element={<ProductManager/>}/>
                    <Route path="/admin/user/role" element={<ManagerRole/>}/>
                    <Route path="/admin/user" element={<ManagerUser/>}/>
                    <Route path="/admin/chat" element={<ChatPage/>}/>
                </Route>
            </Route>

            {/* Route xử lý lỗi */}
            <Route path="/403" element={<ForbiddenPage/>}/>
        </Routes>
    );
};

export default AppRoutes;