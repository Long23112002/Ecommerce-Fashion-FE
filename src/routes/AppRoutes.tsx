import { Route, Routes } from 'react-router-dom';
import AdminLayout from '../layouts/Admin';
import UserLayout from "../layouts/Customer";
import ManagerColor from '../pages/Admin/Attributes/color/colorIndex.tsx';
import ManagerMaterial from '../pages/Admin/Attributes/material/materialIndex.tsx';
import ManagerSize from '../pages/Admin/Attributes/size/sizeIndex.tsx';
import ChatPage from '../pages/Admin/Chat/index.tsx';
import ProductManager from '../pages/Admin/Product';
import ManagerBrand from '../pages/Admin/Product/brand/ManagerBrand.tsx';
import ManagerCategory from '../pages/Admin/Product/Category/ManagerCategory.tsx';
import ManaggerOrigin from '../pages/Admin/Product/origin/ManagerOrigin.tsx';
import { ManagerRole, ManagerUser } from "../pages/Admin/User";
import AuthenticateFacebook from '../pages/Admin/User/AuthenticateFacebook';
import AuthenticateGoogle from '../pages/Admin/User/AuthenticateGoogle';
import Login from '../pages/Admin/User/Login';
import ProductFilterPage from '../pages/Customer/filter/page.tsx';
import HomePage from '../pages/Customer/home/page.tsx';
import ProductDetailPage from '../pages/Customer/product-detail/page.tsx';
import ForbiddenPage from "../pages/Error/ForbiddenPage.tsx";
import ManagerPromotion from '../pages/Admin/Product/Promotion/PromotionManager.tsx';
import ProductDetail from '../pages/Customer/ProductDetail.tsx';
import PromotionSheducled from '../components/Promotion/PromotionScheduled.tsx';
import CartPage from '../pages/Customer/cart/page.tsx';



const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/authenticate" element={<AuthenticateGoogle />} />
            <Route path="/authenticate-fb" element={<AuthenticateFacebook />} />

            <Route element={<UserLayout />}>
                <Route path='/' element={<HomePage />} />
                <Route path='/product/:id' element={<ProductDetailPage />} />
                <Route path='/filter' element={<ProductFilterPage />} />
                <Route path='/cart' element={<CartPage />} />
            </Route>

            <Route element={<AdminLayout />}>
                <Route path="/admin/product/*" element={<ProductManager />} />
                <Route path="/admin/user/role" element={<ManagerRole />} />
                <Route path="/admin/brand" element={<ManagerBrand />} />
                <Route path="/admin/origin" element={<ManaggerOrigin />} />
                <Route path="/admin/color" element={<ManagerColor />} />
                <Route path="/admin/size" element={<ManagerSize />} />
                <Route path="/admin/material" element={<ManagerMaterial />} />
                <Route path="/admin/chat" element={<ChatPage />} />
                <Route path="/admin/user" element={<ManagerUser />} />
                <Route path="/admin/category" element={<ManagerCategory />} />
                <Route path="/admin/promotion" element={<ManagerPromotion />} />
                <Route path="/admin/promotion/scheduled/:id" element={<PromotionSheducled />}/>
            </Route>

            {/* Route xử lý lỗi */}
            <Route path="/403" element={<ForbiddenPage />} />
        </Routes>
    );
};

export default AppRoutes;