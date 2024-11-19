import PaymentMethodEnum from "./PaymentMethodEnum";

export enum OrderStatus {
    PENDING = 'PENDING',
    CANCEL = 'CANCEL',
    SHIPPING = 'SHIPPING',
    SUCCESS = 'SUCCESS',
    REFUND = 'REFUND',
  }

  export const OrderStatusLabel: Record<OrderStatus, string> = {
    [OrderStatus.PENDING]: "CHỜ XỬ LÝ",
    [OrderStatus.CANCEL]: "ĐÃ HỦY",
    [OrderStatus.SHIPPING]: "ĐANG GIAO",
    [OrderStatus.SUCCESS]: "THÀNH CÔNG",
    [OrderStatus.REFUND]: "HOÀN HÀNG",
  };


  export const OrderMeThodLabel: Record<PaymentMethodEnum,string> = {
    [PaymentMethodEnum.CASH]: "Tiền mặt",
    [PaymentMethodEnum.BANK_TRANSFER]: "Chuyển khoản",
    [PaymentMethodEnum.VNPAY]: "VNPAY",
  };
