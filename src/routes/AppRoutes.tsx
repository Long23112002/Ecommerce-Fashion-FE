import { Route, Routes } from 'react-router-dom'
import ProductManager from '../pages/Admin/Product'
import AdminLayout from '../layouts/Admin'

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<AdminLayout/>}>
        <Route path='/admin/product/*' element={<ProductManager/>} />
      </Route>
    </Routes>
  )
}

export default AppRoutes