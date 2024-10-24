import { UserData } from "../api/AuthApi";

export interface Brand {
    id?: number;
    name?: string;
    createAt?: number;   // Timestamp or Date type depending on your preference
    updateAt?: number;   // Timestamp or Date type depending on your preference
    createBy?: UserData | null;  // ID of the user who created the brand
    updateBy?: UserData | null;  // ID of the user who last updated the brand
    deleted?: boolean;
}
