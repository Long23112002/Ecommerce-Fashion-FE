import ProductDetail from "./ProductDetail"
import { User } from "./User"

export interface Cart {
    id: number,
    userId: number,
    cartValues: CartValues[],
    cartValueInfos: CartValueInfos[]
    //     createAt: Date,
    //     createUpdate: Date | null
}

export interface CartValueInfos {
    quantity: number;
    productDetail: ProductDetail;
}

export interface CartValues {
    quantity: number;
    productDetailId: number;
}

export interface CartRequest {
    userId: number,
    cartValues: CartValues[]
}