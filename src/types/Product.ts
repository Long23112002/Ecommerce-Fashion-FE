import { Material } from "../pages/Admin/Attributes/material/material"
import { Brand } from "./brand"
import { Category } from "./Category"
import { Origin } from "./origin"
import ProductDetail from "./ProductDetail"
import Review from "./Review"

type Product = {
    id?: number,
    name?: string,
    price?: number,
    description?: string,
    brand?: Brand,
    origin?: Origin,
    material?: Material,
    category?: Category,
    productDetails?: ProductDetail[],
    rating?: number,
    reviews?: Review[]
}
export default Product