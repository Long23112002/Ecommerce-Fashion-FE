import PaymentMethodEnum from "../enum/PaymentMethodEnum";
import Address from "./Address";
import OrderDetail from "./OrderDetail";
import { User } from "./User";

export enum OrderStatus {
    PENDING = "PENDING",
    SHIPPING = "SHIPPING",
    SUCCESS = "SUCCESS",
    CANCEL = "CANCEL",
    PENDING_AT_STORE = "PENDING_AT_STORE"
}

export const OrderStatusLabel: Record<OrderStatus, string> = {
    [OrderStatus.PENDING]: "Đang chờ xử lý",
    [OrderStatus.SHIPPING]: "Đang vận chuyển",
    [OrderStatus.SUCCESS]: "Thành công",
    [OrderStatus.CANCEL]: "Đã hủy",
    [OrderStatus.PENDING_AT_STORE]: "Tại Quầy",
};

export interface Order {
    id: number;
    discountId: number;
    user: User | null;
    status: OrderStatus;
    paymentMethod: PaymentMethodEnum;
    fullName: string,
    discountAmount: number,
    revenueAmount: number;
    payAmount: number;
    moneyShip: number;
    phoneNumber: string;
    totalMoney: number;
    shipdate?: Date;
    address: Address;
    note: string;
    createdAt: number;
    updatedAt: number;
    successAt: number;
    orderDetails?: OrderDetail[];
    code: string;
    staffId: number;
    orderLogs?: OrderLog[];
}

export interface OrderUpdateRequest {
    fullName: string;
    phoneNumber: string;
    specificAddress: string;
    note: string;
    paymentMethod: PaymentMethodEnum;
}

export type OrderCreateRequest = {
    orderDetails: OrderDetailValue[]
}

export type OrderValue = {
    id: number,
    orderValues: OrderDetailValue[]
}

export type OrderDetailValue = {
    productDetailId: number,
    quantity: number
}

export interface OrderLog {
    id: number;
    oldStatus: string;
    newValue: string;
    createdAt: number;
    updatedAt: number;
}

export default Order