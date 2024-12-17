import { BASE_API } from "../constants/BaseApi";
import axiosInstance, { PageableRequest } from "./AxiosInstance";
import {toast} from "react-toastify";

const BASE_URL = `${BASE_API}/api/v1/orders`;
const BASE_URL_DETAIL = `${BASE_API}/api/v1/order-detail`;

export interface OrderDetailData {
    idOrder: number;
    idProductDetail: number;
    quantity: number;
}

export interface OrderUpdateData {
    idGuest: number;
    idDiscount: number;
}


export const getAllOrderPendingAtStore = async () => {
    const { data } = await axiosInstance({
        method: 'GET',
        url: `${BASE_URL}/list-pending`,
        // headers: {
        //     Authorization: `Bearer ${token}`
        // }
    })
    return data
};

export const createOrderPendingAtStore = async () => {
    try {
        const response = await axiosInstance.get(`${BASE_URL}/store`);
        return response;
    } catch (error) {
        console.error("Error create pending order: ", error);
        throw error;
    }
};

export const getOrderDetailByIdOrder = async (idOrder: number | string, pageable?: PageableRequest) => {
    const { data } = await axiosInstance({
        method: 'GET',
        url: `${BASE_URL_DETAIL}/${idOrder}`,
        params: {
            ...pageable
        }
    })
    return data
}

export const deleteOrderDetail = async (orderDetailId: number, token: string) => {
    try {
        const response = await axiosInstance.delete(`${BASE_URL_DETAIL}/${orderDetailId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });        
        return response.data;
    } catch (error) {
        console.error('Lỗi khi xóa hóa đơn chi tiết:', error);
        throw error;
    }
}

export const addProductToOrderDetail = async (orderDetailData: OrderDetailData) => {
    try {
        const response = await axiosInstance.post(`${BASE_URL_DETAIL}`, orderDetailData)
        return response.data;

    } catch (error: any) {
        console.log("Error add product into order detail", error);
        throw error;
    }
}

export const updateProductToOrderDetail = async (orderDetailData: { orderDetailId: number, quantity: number }) => {
    try {
        const response = await axiosInstance.put(`${BASE_URL_DETAIL}`, orderDetailData)
        return response.data;

    } catch (error: any) {
        console.log("Error add product into order detail", error);
        throw error;
    }
}

export const updateOrderSuccess = async (id: number | string) => {
    const { data } = await axiosInstance({
        method: 'GET',
        url: `${BASE_API}/api/v1/orders/store/${id}`
    })
    return data
}

export const updateOrderAtStore = async (id: number, orderUpdateData: OrderUpdateData) => {
    try {
        const response = await axiosInstance.put(`${BASE_URL}/store/${id}`, orderUpdateData)
        return response.data;
    } catch (error: any) {
        console.log("Error update order ", error);
        throw error;
    }
}

export const exportOrder = async (idOrder: number | string) => {
    const { data } = await axiosInstance({
        method: 'GET',
        url: `${BASE_URL}/export-pdf/${idOrder}`
    })
    return data
}