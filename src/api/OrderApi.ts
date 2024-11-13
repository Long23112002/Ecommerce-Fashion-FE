import axiosInstance from './AxiosInstance';
import { BASE_API } from '../constants/BaseApi';
const BASE_URL = `${BASE_API}/api/v1/orders`;
import Cookies from 'js-cookie';
interface OrderParam {
    userId?: string;
    status?: string;
    phoneNumber?: string;
    keyword?: string;
}

export const fetchAllOrders = async (param: OrderParam, page: number, size: number) => {
    try {
        const response = await axiosInstance.get(`${BASE_URL}`, {
            params: {
                userId: param.userId || null,
                status: param.status || null,
                phoneNumber: param.phoneNumber || null,
                keyword: param.keyword || null,
                page,
                size,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching orders:", error);
        throw error;
    }
};
export const getOrderById = async (id: number) => {
    const token = Cookies.get("accessToken");
    const config = {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', }
    };
    try {
        const response = await axiosInstance.get(`${BASE_URL}/${id}`, config);
        return response.data;
    } catch (error) {
        console.error("Error fetching brand by ID", error);
        throw error;
    }
};
export const updateStateOrder = async (id: number, orderChangeState: any) => {
    try {
        const response = await axiosInstance.put(`${BASE_URL}/${id}`, orderChangeState);
        return response.data;
    } catch (error) {
        console.error('Error updating order state:', error);
        throw error;
    }
};

export default updateStateOrder;
export const deleteOrder = async (orderId: number, token: string) => {
    try {
        const response = await axiosInstance.delete(`${BASE_URL}/${orderId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Lỗi khi xóa đơn hàng:', error);
        throw error;
    }
}
