// <<<<<<< feat/product
// import { UserData } from "../api/AuthApi";
// import { Color } from "../pages/Admin/Attributes/color/color";
// import { Size } from "../pages/Admin/Attributes/size/size";
// import { Product } from "./Product";

// export interface ProductDetail {
//     id: number;
//     price: number;
//     quantity: number;
//     images: string[];
//     createAt: number;
//     updateAt: number;
//     createByUser: UserData | null;
//     updateByUser: UserData | null;
//     deleted: boolean;
//     product: Product | null;
//     size: Size | null;
//     color: Color | null;
// }
// =======
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
<<<<<<< HEAD
    updateBy?: User
    product?: Product,
    size?: Size,
    color?: Color,
=======
    updateBy?: User,
    originPrice?:number,
>>>>>>> 7bf5a911beec74582a27c7d61cfd82c8af75af37
}

export default ProductDetail
