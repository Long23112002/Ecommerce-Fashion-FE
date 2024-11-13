import { UserData } from "../api/AuthApi";

export enum OrderStatus {
    NOPE = "",
    PENDING = "PENDING",
    CANCEL = "CANCEL",
    SHIPPING = "SHIPPING",
    SUCCESS = "SUCCESS",
    DRAFT = "DRAFT",
    REFUND = "REFUND"
}

export const OrderStatusLabel: Record<OrderStatus, string> = {
    [OrderStatus.PENDING]: "Đang chờ xử lý",
    [OrderStatus.CANCEL]: "Đã hủy",
    [OrderStatus.SHIPPING]: "Đang vận chuyển",
    [OrderStatus.SUCCESS]: "Thành công",
    [OrderStatus.DRAFT]: "Nháp",
    [OrderStatus.REFUND]: "Hoàn tiền",
    [OrderStatus.NOPE]: "Không xác Định"
};

export interface Order {
    id: number;
    user: UserData;
    status: OrderStatus;
    phoneNumber: string;
    totalMoney: number;
    address: string;
    note: string;
    createdAt: number;
    updatedAt: number;
}
