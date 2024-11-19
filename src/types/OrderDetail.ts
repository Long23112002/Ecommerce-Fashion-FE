import Order from "./Order";
import ProductDetail from "./ProductDetail";

type OrderDetail = {
    id: number;
    order: Order;
    productDetail: ProductDetail;
    quantity: number;
    price: number;
    totalMoney: number;
    createdAt: Date;
    updatedAt: Date;
    deleted: boolean;
    code: string;
}

export default OrderDetail