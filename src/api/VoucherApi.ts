import { BASE_API } from "../constants/BaseApi.ts";
import axiosInstance from './AxiosInstance.ts';
import Cookies from 'js-cookie';
const BASE_URL = `${BASE_API}/api/v1/voucher`;


export const fetchAllVouchers = async (
    pageSize: number,
    page: number) => {
    try {
        const response = await axiosInstance.get(`${BASE_URL}`, {
            params: {
                size: pageSize,
                page: page
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching vouchers:', error);
        throw error;
    }
};

export const createVoucher = async (voucherData: any, token: string) => {
    try {
        const response = await axiosInstance.post(`${BASE_URL}`, voucherData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error creating voucher:', error);
        throw error;
    }
};

export const updateVoucher = async (id: number, voucherData: any, token: string) => {
    try {
        const response = await axiosInstance.put(`${BASE_URL}/${id}`, voucherData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error updating voucher:', error);
        throw error;
    }
};

export const deleteVoucher = async (id: number, token: string) => {
    try {
        const response = await axiosInstance.delete(`${BASE_URL}/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error deleting voucher:', error);
        throw error;
    }
};
export const getVoucherById = async (id: number) => {
    const token = Cookies.get("accessToken");
    const config = {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', }
    };
    try {
        const response = await axiosInstance.get(`${BASE_URL}/${id}`, config);
        return response.data;
    } catch (error) {
        console.error("Error fetching voucher by ID", error);
        throw error;
    }
};
