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