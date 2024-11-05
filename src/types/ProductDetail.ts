
import { UserData } from "../api/AuthApi";
import { Color } from "../pages/Admin/Attributes/color/color";
import { Size } from "../pages/Admin/Attributes/size/size";
import { Product } from "./Product";

export interface ProductDetail {
    id: number;
    price: number;
    quantity: number;
    images: string[];
    createAt: number;
    updateAt: number;
    createByUser: UserData | null;
    updateByUser: UserData | null;
    deleted: boolean;
    product: Product | null;
    size: Size | null;
    color: Color | null;
}

import { Color } from "../pages/Admin/Attributes/color/color"
import { Size } from "../pages/Admin/Attributes/size/size"
import Product from "./Product"
import { User } from "./User"

type ProductDetail = {
    id?: number,
    price?: number,
    quantity?: number,
    images?: string[],
    product?: Product,
    size?: Size,
    color?: Color,
    createAt?: Date,
    updateAt?: Date | null,
    createBy?: User,
    updateBy?: User
}

export default ProductDetail

