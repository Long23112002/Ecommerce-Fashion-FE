import ProductDetail from "./ProductDetail"
import { User } from "./User"

type Cart = {
    id: number,
    quantity: number,
    productDetail: ProductDetail,
    user: User
    createAt: Date
    createUpdate: Date | null
}