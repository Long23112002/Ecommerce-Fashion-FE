import { StatusPromotionEnum } from "../enum/StatusPromotionEnum";
import { TypePromotionEnum } from "../enum/TypePromotionEnum";
import {BASE_API} from "../constants/BaseApi.ts";
import axiosInstance from "./AxiosInstance.ts";
import {ResponseData} from "../types/responseApi.ts";
import { PromotionRequest } from "../types/Promotion.ts";

export interface PromotionParam{
    startDate: string | number;
    endDate: string | number;
    typePromotionEnum: TypePromotionEnum;
    statusPromotionEnum: StatusPromotionEnum;
    valueMin: number;
    valueMax: number;
    page: number;
    size: number;
}

export const getAllPromotions = async (params: PromotionParam): Promise<ResponseData> => {
    try {
        const url = `${BASE_API}/api/v1/promotion`;

        const { page, size, ...filterParams } = params;
        const filteredParams = Object.fromEntries(
            Object.entries(filterParams).filter(([_, value]) => value !== '' && value !== null && value !== undefined)
        );

        const encodedParams = Object.fromEntries(
            Object.entries(filteredParams).map(([key, value]) => [key, encodeURIComponent(value as string)])
        );

        const finalParams = { page, size, ...encodedParams };

        const response = await axiosInstance.get(url, { params: finalParams });
        return response.data as ResponseData;
    } catch (error) {
        throw error;
    }
}

export const createPromotion = async (promotion: PromotionRequest,token: string): Promise<ResponseData> => {
    try {
        const url = `${BASE_API}/api/v1/promotion`;
        const auth = {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        };
        const response = await axiosInstance.post(url, promotion, auth);
        return response.data as ResponseData;
    } catch (error) {
        throw error;
    }
}

export const updatePromotion = async (promotionId: number, promotion: PromotionRequest,token:string): Promise<ResponseData> => {
    try {
        const url = `${BASE_API}/api/v1/promotion/${promotionId}`;
        const auth = {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        };
        const response = await axiosInstance.put(url, promotion, auth);
        return response.data as ResponseData;
    } catch (error) {
        throw error;
    }
}

export const deletePromotion = async (promotionId: number,token:string): Promise<ResponseData> => {
    try {
        const url = `${BASE_API}/api/v1/promotion/${promotionId}`;
        const auth = {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        };
        const response = await axiosInstance.delete(url, auth);
        return response.data as ResponseData;
    } catch (error) {
        throw error;
    }
}

export const getPromotionById = async (promotionId: number): Promise<any> => {
    try {
        const url = `${BASE_API}/api/v1/promotion/${promotionId}`;
        const response = await axiosInstance.get(url);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const isAnyPromotionActive = async (): Promise<boolean> => {
    try {
        const url = `${BASE_API}/api/v1/promotion/any_active`;
        const response:boolean = await axiosInstance.get(url);
        return response;
    } catch (error) {
        throw error;
    }
}