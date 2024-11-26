import { BASE_API } from "../constants/BaseApi";
import PaymentMethodEnum from "../enum/PaymentMethodEnum";
import { OrderDetailValue, OrderUpdateRequest } from "../types/Order";
import axiosInstance from "./AxiosInstance";
import Cookies from "js-cookie";

const BASE_URL = `${BASE_API}/api/v1/orders`;

export interface OrderParam {
    userId?: string;
    status?: string;
    phoneNumber?: string;
    keyword?: string;
    day?: number|string;
    month?: number|string;
    year?: number|string;
}

export interface OrderAddressUpdate {
    provinceID: number;
    provinceName: string;
    districtID: number;
    districtName: string;
    wardCode: string;
    wardName: string;
}

export interface TransactionRequest {
    orderId: string | number;
    confirmationCode: string;
    status: string | number;
    paymentMethod: PaymentMethodEnum;
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

export const getOrderById = async (id: number | string) => {
    const { data } = await axiosInstance({
        method: 'GET',
        url: `${BASE_API}/api/v1/orders/${id}`
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
        data: { ...request }
    })
    return data
}

export const updateDiscountOrder = async (discountId: number | string) => {
    const orderId = Cookies.get('orderId')
    if (!orderId) {
        throw Error('Người dùng không có đơn hàng')
    }
    const { data } = await axiosInstance({
        method: 'PUT',
        url: `${BASE_API}/api/v1/orders/update-discount/${orderId}`,
        params: {
            discountId: discountId
        }
    })
    return data
}

export const payOrder = async (request: OrderUpdateRequest) => {
    const orderId = Cookies.get('orderId')
    if (!orderId) {
        throw Error('Người dùng không có đơn hàng')
    }
    const { data } = await axiosInstance({
        method: 'PUT',
        url: `${BASE_API}/api/v1/orders/payment/${orderId}`,
        data: { ...request }
    })
    return data
}

export const confirmOrder = async (request: TransactionRequest) => {
    const { data } = await axiosInstance({
        method: 'PUT',
        url: `${BASE_API}/api/v1/orders/confirm`,
        data: request
    })
    return data
}

export const fetchAllOrders = async (param: OrderParam, page: number = 0, size: number = 15) => {
    try {
        const response = await axiosInstance.get(`${BASE_URL}`, {
            params: {
                userId: param.userId || null,
                status: param.status || null,
                phoneNumber: param.phoneNumber || null,
                keyword: param.keyword || null,
                day: param.day,
                month: param.month,
                year: param.year,
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

export const updateStateOrder = async (id: number, orderChangeState: any) => {
    try {
        const response = await axiosInstance.put(`${BASE_URL}/${id}`, orderChangeState);
        return response.data;
    } catch (error) {
        console.error('Error updating order state:', error);
        throw error;
    }
};

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

export  const checkSumPayment = async (amount:number , description:string) =>{
    try {
        const response = await  axiosInstance.get(`${BASE_URL}/checksum`, {
            params: {
                amount: amount,
                description: description
            }
        })
        return response.data
    }catch (error) {
        console.error('Lỗi khi xóa đơn hàng:', error);
        throw error;
    }
}
export const downloadOrderPdf = async (orderId:number) => {
    try {
      const response = await axiosInstance.get(`${BASE_URL}/export-pdf/${orderId}`, {
        responseType: "blob", 
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `order_${orderId}.pdf`); 
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Lỗi khi tải PDF:", error);
      throw error;
    }
  };
