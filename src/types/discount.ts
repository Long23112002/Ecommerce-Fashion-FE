import { UserData } from "../api/AuthApi";
export enum TypeDiscount {
    PERCENTAGE = 'PERCENTAGE',  // Phần trăm
    FIXED_AMOUNT = 'FIXED_AMOUNT'  // Số tiền cố định
}

export enum StatusDiscount {
    ACTIVE = 'ACTIVE',  // Đang hoạt động
    INACTIVE = 'INACTIVE',  // Không hoạt động
    EXPIRED = 'EXPIRED' // ko hoat dong
}

export interface Condition {
    productId: number;        // Mã sản phẩm
    brandId: number;          // Mã thương hiệu
    categoryId: number;       // Mã danh mục
    productDetailId: number;  // Mã chi tiết sản phẩm
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
