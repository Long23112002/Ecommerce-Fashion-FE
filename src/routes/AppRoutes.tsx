import {Route, Routes} from 'react-router-dom'
import ProductManager from '../pages/Admin/Product'
import AdminLayout from '../layouts/Admin'
import  {ManagerRole} from "../pages/Admin/User";
import Login from "../pages/Admin/User/Login.tsx";
import AuthenticateGoogle from "../pages/Admin/User/AuthenticateGoogle.tsx";
import AuthenticateFacebook from "../pages/Admin/User/AuthenticateFacebook.tsx";
import UserLayout from '../layouts/Customer/index.tsx';
import Home from '../pages/Customer/Home/index.tsx';

const AppRoutes = () => {
    return (
        <Routes>

            <Route element={<UserLayout/>}>
                <Route path='/' element={<Home/>}/>
            </Route>

            <Route element={<AdminLayout/>}>
                <Route path='/admin/product/*' element={<ProductManager/>}/>
                <Route path='/admin/user/role' element={<ManagerRole/>}/>
            </Route>

            <Route path='/login' element={<Login/>}/>
            <Route path="/authenticate" element={<AuthenticateGoogle />} />
            <Route path="/authenticate-fb" element={<AuthenticateFacebook />} />
        </Routes>
    )
}

export default AppRoutes