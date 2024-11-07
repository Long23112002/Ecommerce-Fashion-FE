import { UserData } from "../api/AuthApi";
export enum TypeDiscount {
    "NONE" = "",
    PERCENTAGE = 'PERCENTAGE',  // Phần trăm
    FIXED_AMOUNT = 'FIXED_AMOUNT'  // Số tiền cố định
}

export enum StatusDiscount {
    "NONE" = "",
    UPCOMING = 'UPCOMING',
    ACTIVE = 'ACTIVE',
    ENDED = 'ENDED'
}

export interface Condition {
    idProduct: number[];        // Mã sản phẩm
    idBrand: number[];          // Mã thương hiệu
    idCategory: number[];       // Mã danh mục
    idProductDetail: number[];  // Mã chi tiết sản phẩm
}
export interface Discount {
    id: number;
    code: string;
    name: string;
    condition: Condition;
    type: TypeDiscount;
    value: number;
    maxValue: number;
    startDate: number;  // Unix timestamp (miligiây)
    endDate: number;    // Unix timestamp (miligiây)
    discountStatus: StatusDiscount;
    createAt: number;   // Unix timestamp (miligiây)
    updateAt: number;   // Unix timestamp (miligiây)
    createBy: UserData | null; // Người tạo giảm giá, có thể null
    updateBy: UserData | null; // Người chỉnh sửa giảm giá lần cuối, có thể null
    deleted: boolean;  // Cờ cho việc xóa mềm
}
export const StatusDiscountLable: Record<StatusDiscount, string> = {
    [StatusDiscount.UPCOMING]: "Chưa diễn ra",
    [StatusDiscount.ACTIVE]: "Đang diễn ra",
    [StatusDiscount.ENDED]: "Đã kết thúc",
    [StatusDiscount.NONE]: "chưa xác định",
}

export const TypeDiscountLabel: Record<TypeDiscount, string> = {
    [TypeDiscount.PERCENTAGE]: "Giảm theo %",
    [TypeDiscount.FIXED_AMOUNT]: "Giảm theo số tiền",
    [TypeDiscount.NONE]: "Chưa xác định",
};