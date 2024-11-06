import { Material } from "../pages/Admin/Attributes/material/material"
import { Brand } from "./brand"
import { Category } from "./Category"
import { Origin } from "./origin"
import Review from "./Review"

type Product = {
    id?: number,
    name?: string,
    image?: string,
    minPrice?: number,
    maxPrice?: number,
    description?: string,
    brand?: Brand,
    origin?: Origin,
    material?: Material,
    category?: Category,
    rating?: number,
    reviews?: Review[]
}
export default Product