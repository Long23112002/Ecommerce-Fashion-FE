import {BASE_API} from "../../../../constants/BaseApi.ts";
import { ResponseData } from "../../../../types/responseApi.ts";
import { Material , MaterialRequest } from "./material.ts";
import axiosInstance from "../../../../api/AxiosInstance.ts";

export const fetchAllMaterials = async (
    name: string = '',
    size: number = 10,
    page: number = 0
): Promise<ResponseData> => {
    try {
        const url = `${BASE_API}/api/v1/material?page=${page}&size=${size}&name=${name}`;
        const response = await axiosInstance.get<{ data: Material[], total: number }>(url);
        console.log(response.data);
        return response.data as ResponseData;
    } catch (error) {
        throw error;
    }
};

export const createMaterial = async (color: MaterialRequest, token: string): Promise<ResponseData> => {
    try {
        const url = `${BASE_API}/api/v1/material`;
        const auth = {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        };
        const response = await axiosInstance.post<Material>(url, color, auth);
        return response.data as ResponseData;
    } catch (error) {
        throw error;
    }
};

export const deleteMaterial = async (materialId: number, token: string): Promise<ResponseData> => {
    try {
        const url = `${BASE_API}/api/v1/material/${materialId}`;
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

export const getMaterialById = async (materialId: number): Promise<Material> => {
    // eslint-disable-next-line no-useless-catch
    try {
        const url = `${BASE_API}/api/v1/material/${materialId}`;
        const response = await axiosInstance.get<Material>(url);
        return response.data as Material;
    } catch (error) {
        throw error;
    }
};

export const updateMaterial = async (materialId: number, material: MaterialRequest, token: string): Promise<ResponseData> => {
    // eslint-disable-next-line no-useless-catch
    try {
        const url = `${BASE_API}/api/v1/material/${materialId}`;
        const auth = {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        };
        const response = await axiosInstance.put<Material>(url, material, auth);
        return response.data as ResponseData;
    } catch (error) {
        throw error;
    }
};