import { BASE_API } from "../constants/BaseApi";
import Cookies from 'js-cookie';
import axiosInstance from "./AxiosInstance";

const API_BASE_URL = `${BASE_API}/api/v1/product`

export const getProductById = async (id: number) => {
    const token = Cookies.get("accessToken");
    const config = {
        headers: {Authorization: `Bearer ${token}`, 'Content-Type': 'application/json',}
    };
    try {
        const response = await axiosInstance.get(`${API_BASE_URL}/${id}`, config);
        return response.data;
    } catch (error) {
        console.error("Error fetching brand by ID", error);
        throw error;
    }
}

export const fetchAllProducts = async (pageSize: number, page: number, searchName?: string) => {
    const token = Cookies.get("accessToken");
    const config = {
        he
    }
}
