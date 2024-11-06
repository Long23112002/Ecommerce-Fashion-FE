import ProductDetail from "./ProductDetail"
import { User } from "./User"

export interface Cart {
    id: number,
    cartValues: CartValues,
    productDetail: ProductDetail,
    user: User,
//     createAt: Date,
//     createUpdate: Date | null
}

export interface CartValueInfos{
        quantity: number;
        productDetail: ProductDetail;        
}

export interface CartValues{
    quantity: number;
    productDetailId: number;
}