import Cookies from 'js-cookie';
import { BASE_API } from '../constants/BaseApi';
import axiosInstance from './AxiosInstance';

const API_BASE_URL = `${BASE_API}/api/v1/brand`;


export const fetchAllBrands = async (pageSize: number = 15, page: number = 0, searchName?: string) => {
    const config = {
        params: {
            size: pageSize,
            page: page,
            ...(searchName && { name: searchName })
        }
    };
    try {
        const response = await axiosInstance.get(`${API_BASE_URL}`, config);
        console.log(response)
        return response.data;
    } catch (error) {
        console.error("Error fetching brands", error);
        throw error;
    }
};

// Get brand details by ID
export const getBrandById = async (id: number) => {
    const token = Cookies.get("accessToken");
    const config = {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', }
    };
    try {
        const response = await axiosInstance.get(`${API_BASE_URL}/${id}`, config);
        return response.data;
    } catch (error) {
        console.error("Error fetching brand by ID", error);
        throw error;
    }
};

// Create a new brand
export const createBrand = async (brandData: { name: string }, token: string) => {
    const config = {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', }
    };
    try {
        const response = await axiosInstance.post(`${API_BASE_URL}`, brandData, config);
        return response.data;
    } catch (error) {
        console.error("Error creating brand", error);
        throw error;
    }
};

// Update an existing brand
export const updateBrand = async (id: number, brandData: { name: string }, token: string) => {
    const config = {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', }
    };
    try {
        const response = await axiosInstance.put(`${API_BASE_URL}/${id}`, brandData, config);
        return response.data;
    } catch (error) {
        console.error("Error updating brand", error);
        throw error;
    }
};

// Delete a brand by ID
export const deleteBrand = async (id: number, token: string) => {
    const config = {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', }
    };
    try {
        const response = await axiosInstance.delete(`${API_BASE_URL}/${id}`, config);
        return response.data;
    } catch (error) {
        console.error("Error deleting brand", error);
        throw error;
    }
};
export const fetchBrandsByIds = async (ids: number[]) => {
    const token = Cookies.get("accessToken");
    try {
        const responses = await Promise.all(
            ids.map(id =>
                axiosInstance.get(`${API_BASE_URL}/${id}`, {
                    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
                }).then(res => res.data)
            )
        );
        return responses;
    } catch (error) {
        console.error("Error fetching brands by IDs", error);
        throw error;
    }
};
export const fetchProductsByIds = async (ids: number[]) => {
    const token = Cookies.get("accessToken");
    try {
        const responses = await Promise.all(
            ids.map(id =>
                axiosInstance.get(`http://localhost:8888/api/v1/product/${id}`, {
                    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
                }).then(res => res.data)
            )
        );
        return responses;
    } catch (error) {
        console.error("Error fetching Product by IDs", error);
        throw error;
    }
};
export const fetchProductDetailsByIds = async (ids: number[]) => {
    const token = Cookies.get("accessToken");
    try {
        const responses = await Promise.all(
            ids.map(id =>
                axiosInstance.get(`http://localhost:8888/api/v1/product-detail/${id}`, {
                    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
                }).then(res => res.data)
            )
        );
        return responses;
    } catch (error) {
        console.error("Error fetching Product by IDs", error);
        throw error;
    }
};
export const fetchAllProductDetails = async (pageSize: number, page: number, searchName?: string) => {
    const token = Cookies.get('accessToken');
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        params: {
            size: pageSize,
            page: page,
            ...(searchName && { name: searchName }),
        },
    };

    try {
        const response = await axiosInstance.get(`http://localhost:8888/api/v1/product-detail`, config);
        return response.data;
    } catch (error) {
        console.error('Error fetching product details:', error);
        throw error;
    }
};
