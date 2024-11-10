
import { BASE_API } from "../constants/BaseApi";
import Cookies from 'js-cookie';
import axiosInstance, { PageableRequest } from "./AxiosInstance";
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

export const getDetailByIdProduct = async (id: number | string, pageable?: PageableRequest) => {
    const { data } = await axiosInstance({
        method: 'GET',
        url: `${BASE_API}/api/v1/product-detail/product/${id}`,
        params: pageable
    });
    return data
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
    const params = {
        size: pageSize,
        page: page,
    };
    try {
        const response = await axiosInstance.get(`${API_BASE_URL}/product/${id}`, { params });
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

export const updateProductDetail = async (productDetailId: number, productData: ProductDetailData) => {
    try {
        const response = await axiosInstance.put(`${API_BASE_URL}/${productDetailId}`, productData)
        return response.data;
    } catch (error: any) {
        console.log("Error update product detail", error);
        throw error;
    }
}