export enum OrderStatus {
    PENDING = 'PENDING',
    CANCEL = 'CANCEL',
    SHIPPING = 'SHIPPING',
    SUCCESS = 'SUCCESS',
    DRAFT = 'DRAFT',
    REFUND = 'REFUND',
  }

  export const OrderStatusLabel: Record<OrderStatus, string> = {
    [OrderStatus.PENDING]: "CHỜ XỬ LÝ",
    [OrderStatus.CANCEL]: "ĐÃ HỦY",
    [OrderStatus.SHIPPING]: "ĐANG GIAO",
    [OrderStatus.SUCCESS]: "THÀNH CÔNG",
    [OrderStatus.DRAFT]: "BẢN NHÁP",
    [OrderStatus.REFUND]: "HOÀN HÀNG",
  };