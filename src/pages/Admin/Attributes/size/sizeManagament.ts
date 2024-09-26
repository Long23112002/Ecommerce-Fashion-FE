import {BASE_API} from "../../../../constants/BaseApi.ts";
import { ResponseData } from "../../../../types/responseApi.ts";
import { Size, SizeRequest } from "./size.ts";
import axiosInstance from "../../../../api/AxiosInstance.ts";

export const fetchAllSizes = async (
    name: string = '',
    size: number = 10,
    page: number = 0
): Promise<ResponseData> => {
    try {
        const url = `${BASE_API}/api/v1/size?page=${page}&size=${size}&name=${name}`;
        const response = await axiosInstance.get<{ data: Size[], total: number }>(url);
        console.log(response.data);
        return response.data as ResponseData;
    } catch (error) {
        throw error;
    }
};

export const createSize = async (size: SizeRequest, token: string): Promise<ResponseData> => {
    try {
        const url = `${BASE_API}/api/v1/size`;
        const auth = {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        };
        const response = await axiosInstance.post<Size>(url, size, auth);
        return response.data as ResponseData;
    } catch (error) {
        throw error;
    }
};

export const deleteSize = async (sizeId: number, token: string): Promise<ResponseData> => {
    try {
        const url = `${BASE_API}/api/v1/size/${sizeId}`;
        const auth = {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        };
        const response = await axiosInstance.delete(url, auth);
        return response as ResponseData;
    } catch (error) {
        console.error("Error deleting size:", error);
        throw error;
    }
};

export const getSizeById = async (sizeId: number): Promise<Size> => {
    try {
        const url = `${BASE_API}/api/v1/size/${sizeId}`;
        const response = await axiosInstance.get<Size>(url);
        return response.data as Size;
    } catch (error) {
        throw error;
    }
};

export const updateSize= async (sizeId: number, size: SizeRequest, token: string): Promise<ResponseData> => {
    try {
        const url = `${BASE_API}/api/v1/size/${sizeId}`;
        const auth = {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        };
        const response = await axiosInstance.put<Size>(url, size, auth);
        return response.data as ResponseData;
    } catch (error) {
        throw error;
    }
};