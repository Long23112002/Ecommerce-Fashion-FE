<<<<<<< HEAD
import { BASE_API } from "../constants/BaseApi";
import Cookies from 'js-cookie';
import axiosInstance from "./AxiosInstance";
=======

import { BASE_API } from "../constants/BaseApi";
import Cookies from 'js-cookie';
import axiosInstance, { PageableRequest } from "./AxiosInstance";
>>>>>>> 8dc1d42804196e8fa5575a6b6389fa852f9e38b9
import { UploadFile } from "antd";

const API_BASE_URL = `${BASE_API}/api/v1/product-detail`

export interface FileImage<T = any> extends UploadFile {
    url: string;
}

interface ProductDetailData {
    price: number;
    quantity: number;
    images: String[] | null;
    idProduct: number;
    idSize: number;
    idColor: number;
}

<<<<<<< HEAD
=======
export const getDetailByIdProduct = async (id: number | string, pageable?: PageableRequest) => {
    const { data } = await axiosInstance({
        method: 'GET',
        url: `${BASE_API}/api/v1/product-detail/product/${id}`,
        params: pageable
    });
    return data
}

>>>>>>> 8dc1d42804196e8fa5575a6b6389fa852f9e38b9
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
    const params = {
        size: pageSize,
        page: page,
    };
    try {
<<<<<<< HEAD
        const response = await axiosInstance.get(`${API_BASE_URL}/product/${id}`, {params});
=======
        const response = await axiosInstance.get(`${API_BASE_URL}/product/${id}`, { params });
>>>>>>> 8dc1d42804196e8fa5575a6b6389fa852f9e38b9
        return response.data;
    } catch (error) {
        console.error("Error fetching product detail by id product", error);
        throw error;
    }
}

export const deleteProductDetail = async (productDetailId: number) => {
    try {
        const response = await axiosInstance.delete(`${API_BASE_URL}/${productDetailId}`)
        return response.data;
    } catch (error: any) {
        throw new Error(`Error deleting product detail: ${error.response?.data?.message || error.message}`);
    }
}

export const getProductDetailById = async (productDetailId: number) => {
    try {
        const response = await axiosInstance.get(`${API_BASE_URL}/${productDetailId}`)
        return response.data;
    } catch (error: any) {
        throw new Error(`Error getting product detail: ${error.response?.data?.message || error.message}`);
    }
}