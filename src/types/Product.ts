import { UserData } from "../api/AuthApi";

export interface Product {
    id: number;
    code: string;
    name: string;
    description: string;
    createAt: number;
    updateAt: number;
    createBy: UserData | null;
    updateBy: UserData | null;
    deleted: boolean;
    idBrand: number;
    idOrigin: number;
    idMaterial: number;
    idCategory: number;
}