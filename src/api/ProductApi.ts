

import { BASE_API } from "../constants/BaseApi";
import Cookies from 'js-cookie';
import axiosInstance, { PageableRequest } from "./AxiosInstance";

const API_BASE_URL = `${BASE_API}/api/v1/product`

interface ProductData {
    name: string;
    code: string;
    description: string;
    idCategory: number;
    idBrand: number;
    idOrigin: number;
    idMaterial: number;
    image: String | null;
}

export interface ProductParams {
    keyword?: string | null,
    idBrand?: number | null,
    idOrigin?: number | null,
    idCategory?: number | null,
    idMaterial?: number | null,
    idColors?: number[] | null,
    idSizes?: number[] | null,
    maxPrice?: number | null,
    minPrice?: number | null
}

export const getAllProducts = async (query: { params?: ProductParams; pageable?: PageableRequest } = {}) => {
    const { data } = await axiosInstance({
        method: 'GET',
        url: `${BASE_API}/api/v1/product`,
        params: { ...query.params, ...query.pageable },
        paramsSerializer: {
            indexes: null,
        }
    });
    return data;
};


export const getProductById = async (id: number) => {
    const token = Cookies.get("accessToken");
    const config = {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', }
    };
    try {
        const response = await axiosInstance.get(`${API_BASE_URL}/${id}`, config);
        return response.data;
    } catch (error) {
        console.error("Error fetching product by ID", error);
        throw error;
    }
}

export const fetchAllProducts = async (
    pageSize: number,
    page: number,
    keyword?: string,
    idOrigin?: number,
    idBrand?: number,
    idMaterial?: number,
    idCategory?: number) => {
    const params = {
        size: pageSize,
        page: page,
        keyword: keyword || '',
        idOrigin: idOrigin || '',
        idBrand: idBrand || '',
        idMaterial: idMaterial || '',
        idCategory: idCategory || '',
    };
    try {
        const response = await axiosInstance.get(`${API_BASE_URL}`, { params });
        return response.data;
    } catch (error: any) {
        throw new Error(`Error fetching products: ${error.response?.data?.message || error.message}`)
    }
}

export const deleteProduct = async (productId: number) => {
    try {
        const response = await axiosInstance.delete(`${API_BASE_URL}/${productId}`)
        return response.data;
    } catch (error: any) {
        throw new Error(`Error deleting product: ${error.response?.data?.message || error.message}`);
    }
}

export const updateProduct = async (productId: number, productData: ProductData) => {
    try {
        const response = await axiosInstance.put(`${API_BASE_URL}/${productId}`, productData)
        return response.data;
    } catch (error: any) {
        console.log("Error update product ", error);
        throw error;
    }
}

export const addProduct = async (productData: ProductData) => {
    try {
        const response = await axiosInstance.post(`${API_BASE_URL}`, productData)
        return response.data;
    } catch (error: any) {
        console.log("Error add product ", error);
        throw error;
    }
}