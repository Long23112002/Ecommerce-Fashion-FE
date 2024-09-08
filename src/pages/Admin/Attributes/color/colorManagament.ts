import {BASE_API} from "../../../../constants/BaseApi.ts";
import { ResponseData } from "../../../../types/responseApi.ts";
import { Color, ColorRequest } from "./color.ts";
import axiosInstance from "../../../../api/AxiosInstance.ts";

export const fetchAllColors = async (
    name: string = '',
    size: number = 10,
    page: number = 0
): Promise<ResponseData> => {
    try {
        const url = `${BASE_API}/api/v1/color?page=${page}&size=${size}&name=${name}`;
        const response = await axiosInstance.get<{ data: Color[], total: number }>(url);
        console.log(response.data);
        return response.data as ResponseData;
    } catch (error) {
        throw error;
    }
};

export const createColor = async (color: ColorRequest, token: string): Promise<ResponseData> => {
    try {
        const url = `${BASE_API}/api/v1/color`;
        const auth = {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        };
        const response = await axiosInstance.post<Color>(url, color, auth);
        return response.data as ResponseData;
    } catch (error) {
        throw error;
    }
};

export const deleteColor = async (colorId: number, token: string): Promise<ResponseData> => {
    try {
        const url = `${BASE_API}/api/v1/color/${colorId}`;
        const auth = {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        };
        const response = await axiosInstance.delete(url, auth);
        return response as ResponseData;
    } catch (error) {
        console.error("Error deleting color:", error);
        throw error;
    }
};

export const getColorById = async (colorId: number): Promise<Color> => {
    try {
        const url = `${BASE_API}/api/v1/color/${colorId}`;
        const response = await axiosInstance.get<Color>(url);
        return response.data as Color;
    } catch (error) {
        throw error;
    }
};

export const updateColor = async (colorId: number, color: ColorRequest, token: string): Promise<ResponseData> => {
    try {
        const url = `${BASE_API}/api/v1/color/${colorId}`;
        const auth = {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        };
        const response = await axiosInstance.put<Color>(url, color, auth);
        return response.data as ResponseData;
    } catch (error) {
        throw error;
    }
};