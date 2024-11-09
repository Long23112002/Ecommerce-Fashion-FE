import Cookies from 'js-cookie';
import { BASE_API } from '../constants/BaseApi';
import axiosInstance from './AxiosInstance';

const API_BASE_URL = `${BASE_API}/api/v1/brand`;

export const fetchAllBrands = async (pageSize: number = 15, page: number = 0, searchName?: string) => {
    const token = Cookies.get("accessToken");
    const config = {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', },
        params: {
            size: pageSize,
            page: page,
            ...(searchName && { name: searchName }) // Include searchName if provided
        }
    };
    try {
        const response = await axiosInstance.get(`${API_BASE_URL}`, config);
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
