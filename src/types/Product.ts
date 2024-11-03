import { UserData } from "../api/AuthApi";
import { Material } from "../pages/Admin/Attributes/material/material";
import { Brand } from "./brand";
import { Category } from "./Category";
import { Origin } from "./origin";

export interface Product {
    id: number;
    code: string;
    name: string;
    description: string;
    createAt: number;
    updateAt: number;
    createByUser: UserData | null;
    updateByUser: UserData | null;
    deleted: boolean;
    brand: Brand | null;
    origin: Origin | null;
    material: Material | null;
    category: Category | null;
}