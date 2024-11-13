import { UserData } from "../api/AuthApi";
import OrderDetail from "./OrderDetail";
import { User } from "./User";

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
    discountId: number;
    user: User;
    status: OrderStatus;
    phoneNumber: string;
    totalMoney: number;
    shipdate?: Date;
    address: string;
    note: string;
    createdAt: number;
    updatedAt: number;
    orderDetails?: OrderDetail[];
}

export type OrderRequest = {
    discountId?: number;
    paymentMethodId: number;
    phoneNumber: string;
    fullName: string;
    email: string;
    address: string;
    shipDate?: Date;
    moneyShip?: number;
    note?: string;
    totalMoney: number;
    orderDetails: OrderDetailValue[];
}

export type OrderCreateRequest = {
    orderDetails: OrderDetailValue[]
}

export type OrderDetailValue = {
    productDetailId: number,
    quantity: number
}

export default Order