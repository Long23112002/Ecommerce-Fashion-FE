import { BASE_API } from "../constants/BaseApi";
import Cookies from 'js-cookie';
import axiosInstance from "./AxiosInstance";

const API_BASE_URL = `${BASE_API}/api/v1/product-detail`

export interface FileImage {
    url: string;
}

interface ProductDetailData {
    price: number;
    quantity: number;
    images: FileImage[] | null;
    idProduct: number;
    idSize: number;
    idColor: number;
}

export const addProductDetail = async (productDetailData: ProductDetailData) => {
    const token = Cookies.get("accessToken");
    const config = {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', }
    };
    try {
        const response = await axiosInstance.post(`${API_BASE_URL}`, productDetailData, config)
        return response.data;
    } catch (error: any) {
        console.log("Error add product detail", error);
        throw error;
    }
}


export const getProductDetailByIdProduct = async (
    id: number,
    pageSize: number,
    page: number,
) => {
    const token = Cookies.get("accessToken");
    const config = {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', }
    };
    const params = {
        size: pageSize,
        page: page,
    };
    try {
        const response = await axiosInstance.get(`${API_BASE_URL}/product/${id}`, {params});
        return response.data;
    } catch (error) {
        console.error("Error fetching product detail by id product", error);
        throw error;
    }
}