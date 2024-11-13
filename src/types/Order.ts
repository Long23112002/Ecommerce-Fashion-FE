import OrderDetail from './OrderDetail';
import { User } from './User';
type Order = {
    id: number;
    discountId?: number;
    user?: User;
    status: 'PENDING' | 'CANCEL' | 'SHIPPING' | 'SUCCESS' | 'DRAFT' | 'REFUND';
    // paymentMethod?: Payment;
    phoneNumber: string;
    address: string;
    shipdate?: Date;
    moneyShip: number;
    note?: string;
    totalMoney: number;
    updatedBy?: User;
    createdAt?: Date;
    updatedAt?: Date;
    orderDetails?: OrderDetail[];
}
export default Order

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