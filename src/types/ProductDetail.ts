import { Color } from "../pages/Admin/Attributes/color/color"
import { Size } from "../pages/Admin/Attributes/size/size"
import Product from "./Product"
import { User } from "./User"

type ProductDetail = {
    id?: number,
    price?: number,
    originPrice?: number,
    quantity?: number,
    images?: string[],
    createAt?: Date,
    updateAt?: Date | null,
    createBy?: User,
    updateBy?: User
    product?: Product,
    size?: Size,
    color?: Color,
}

export default ProductDetail