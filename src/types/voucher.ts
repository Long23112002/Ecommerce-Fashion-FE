import { UserData } from "../api/AuthApi";
export interface VoucherResponse {
    id: number;
    code: string;
    createAt: number; // Timestamp in milliseconds
    updateAt: number;
    usedAt?: number | null; // Optional in case the voucher hasn't been used
    createBy?: UserData | null; // User details for the creator
    updateBy?: UserData | null; // User details for the updater
    usedBy?: UserData | null;  // User details for the person who used the voucher
    deleted: boolean;
    discount: {
        id: number;
        code: string;
        name: string;
        condition: {
            categoryId?: number;
            productDetailId?: number;
            productId?: number;
            brandId?: number;
        };
        type: string; // Example: 'PERCENTAGE' or 'FIXED_AMOUNT'
        value: number;
        maxValue?: number;
        startDate: string; // Date in ISO format
        endDate: string;
        discountStatus: string; // Example: 'ACTIVE', 'EXPIRED'
        createAt: string; // Date in ISO format
        updateAt: string;
        createBy?: UserData | null;
        updateBy?: UserData | null;
        deleted: boolean;
    };
}