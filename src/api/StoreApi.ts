import { BASE_API } from "../constants/BaseApi";
import axiosInstance from "./AxiosInstance";

const BASE_URL = `${BASE_API}/api/v1/orders`;
const BASE_URL_DETAIL = `${BASE_API}/api/v1/order-detail`;

interface OrderDetailData {
    idOrder: number;
    idProductDetail: number;
    quantity: number;
}


export const getAllOrderPendingAtStore = async () => {
    try {
        const response = await axiosInstance.get(`${BASE_URL}/list-pending`);
        return response;
    } catch (error) {
        console.error("Error fetching orders status PENDING_AT_STORE:", error);
        throw error;
    }
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

export const getOrderDetailByIdOrder = async (idOrder: number | string) => {
    const { data } = await axiosInstance({
        method: 'GET',
        url: `${BASE_URL_DETAIL}/${idOrder}`
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

export const updateOrderSuccess = async (id: number | string) => {
    const { data } = await axiosInstance({
        method: 'GET',
        url: `${BASE_API}/api/v1/orders/store/${id}`
    })
    return data
}