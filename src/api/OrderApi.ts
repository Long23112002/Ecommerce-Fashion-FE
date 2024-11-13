import { BASE_API } from "../constants/BaseApi";
import { OrderDetailValue } from "../types/Order";
import axiosInstance from "./AxiosInstance";
import Cookies from "js-cookie";

export interface OrderAddressUpdate {
    provinceID: number;
    provinceName: string;
    districtID: number;
    districtName: string;
    wardCode: string;
    wardName: string;
}

export const createOrder = async (orderDetails: OrderDetailValue[]) => {
    const { data } = await axiosInstance({
        method: 'POST',
        url: `${BASE_API}/api/v1/orders`,
        data: {
            orderDetails: orderDetails
        }
    })
    return data
}

export const getOrderById = async () => {
    const orderId = Cookies.get('orderId')
    if (!orderId) {
        throw Error('Người dùng không có đơn hàng')
    }
    const { data } = await axiosInstance({
        method: 'GET',
        url: `${BASE_API}/api/v1/orders/${orderId}`
    })
    return data
}

export const updateAdressOrder = async (request: OrderAddressUpdate) => {
    const orderId = Cookies.get('orderId')
    if (!orderId) {
        throw Error('Người dùng không có đơn hàng')
    }
    const { data } = await axiosInstance({
        method: 'PUT',
        url: `${BASE_API}/api/v1/orders/update-address/${orderId}`,
        data: {...request}
    })
    return data
}