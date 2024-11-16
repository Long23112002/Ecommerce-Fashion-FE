import Cookies from 'js-cookie';
import { BASE_API } from '../constants/BaseApi';
import axiosInstance from './AxiosInstance';
import { jwtDecode } from 'jwt-decode';
import { ResponseData } from "../types/responseApi.ts";
import { CartRequest } from '../types/Cart.ts';

const CART_API_URL = `${BASE_API}/api/v1/carts`;

// Fetch cart by user ID
export const fetchCartByUserId = async (token: string) => {
    if (!token) {
        throw new Error("Token không hợp lệ hoặc không có");
    }

    const decodedToken: { userId: number } = jwtDecode(token);
    const userId = decodedToken.userId;

    const config = {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
    };

    try {
        const response = await axiosInstance.get(`${CART_API_URL}/${userId}`, config);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi lấy giỏ hàng theo ID người dùng", error);
        throw error;
    }
};

// Create a new cart
export const createCart = async (cartData: { items: any[] }) => {
    const token = Cookies.get("accessToken");
    const config = {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
    };
    try {
        const response = await axiosInstance.post(CART_API_URL, cartData, config);
        return response.data;
    } catch (error) {
        console.error("Error creating cart", error);
        throw error;
    }
};

// Update existing cart
export const updateCart = async (req: CartRequest, token: string) => {
    const config = {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
    };
    try {
        const response = await axiosInstance.put(CART_API_URL, req, config);
        return response.data;
    } catch (error) {
        console.error("Error updating cart", error);
        throw error;
    }
};

// Delete cart
export const deleteCart = async () => {
    const token = Cookies.get("accessToken");
    const config = {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
    };
    try {
        await axiosInstance.delete(CART_API_URL, config);
    } catch (error) {
        console.error("Error deleting cart", error);
        throw error;
    }
};
