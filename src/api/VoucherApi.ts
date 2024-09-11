import axios from 'axios';
import { BASE_API } from "../constants/BaseApi.ts";

const BASE_URL = `${BASE_API}/api/v1/voucher`; // Adjust the base URL according to your backend API

// Fetch all vouchers with optional pagination parameters
export const fetchAllVouchers = async (page: number = 0, size: number = 20) => {
    try {
        const response = await axios.get(`${BASE_URL}`, {
            params: { page, size }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching vouchers:', error);
        throw error;
    }
};

// Create a new voucher
export const createVoucher = async (voucherData: any, token: string) => {
    try {
        const response = await axios.post(`${BASE_URL}`, voucherData, {
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

// Update an existing voucher
export const updateVoucher = async (id: number, voucherData: any, token: string) => {
    try {
        const response = await axios.put(`${BASE_URL}/${id}`, voucherData, {
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

// Delete a voucher
export const deleteVoucher = async (id: number, token: string) => {
    try {
        const response = await axios.delete(`${BASE_URL}/${id}`, {
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
