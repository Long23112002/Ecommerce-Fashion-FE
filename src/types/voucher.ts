import { UserData } from "../api/AuthApi";
import { Discount } from "./discount";
export interface Voucher {
    id: number;
    code: string;
    createAt: number;
    updateAt: number;
    usedAt?: number | null;
    createBy?: UserData | null;
    updateBy?: UserData | null;
    usedBy?: UserData | null;
    deleted: boolean;
    discount: Discount
}