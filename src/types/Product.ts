import { Color } from "../pages/Admin/Attributes/color/color"
import { Material } from "../pages/Admin/Attributes/material/material"
import { Size } from "../pages/Admin/Attributes/size/size"
import { Brand } from "./brand"
import { Category } from "./Category"
import { Origin } from "./origin"
import Review from "./Review"

// type tạm để làm trước giao diện nếu khi hoàn thành thì viết đè vào
type Product = {
    id?: number,
    name?: string,
    price?: number,
    images?: string[],
    description?: string,
    brand?: Brand,
    origin?: Origin,
    material?: Material,
    category?: Category,
    quantity?: number,
    colors?: Color[],
    sizes?: Size[],
    rating?: number,
    reviews?: Review[]
}
export default Product