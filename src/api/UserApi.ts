import { BASE_API } from "../constants/BaseApi.ts";
import { GenderEnum } from "../enum/GenderEnum.ts";
import { ResponseData } from "../types/responseApi.ts";
import { UserRequest } from "../types/User.ts";
import axiosInstance from "./AxiosInstance.ts";

export interface UserAssignRole {
    email: string;
    roleIds: number[];
}

export interface UserParam {
    page: number;
    size: number;
    phone: string;
    email: string;
    fullName: string;
    gender: string;
}

export const getAllUsers = async (params: UserParam): Promise<ResponseData> => {
    try {
        const url = `${BASE_API}/api/v1/user`;

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



export const assignRoleToUser = async (assignRoleToUser: UserAssignRole): Promise<any> => {
    try {
        const url = `${BASE_API}/api/v1/user/assign-user-role`;
        const response = await axiosInstance.patch(url, assignRoleToUser);
        return response.data as ResponseData;
    } catch (error) {
        throw error;
    }
}

export const getUserById = async (userId: number): Promise<any> => {
    try {
        const url = `${BASE_API}/api/v1/user/${userId}`;
        const response = await axiosInstance.get(url);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const createUser = async (user: {
    password: any;
    phoneNumber: any;
    gender: GenderEnum;
    fullName: any;
    birth: Date;
    avatar: null;
    email: string
}): Promise<ResponseData> => {
    try {
        const url = `${BASE_API}/api/v1/user`;
        const response = await axiosInstance.post(url, user);
        return response.data as ResponseData;
    } catch (error) {
        throw error;
    }
}

export const updateUser = async (userId: number, user: UserRequest): Promise<ResponseData> => {
    try {
        const url = `${BASE_API}/api/v1/user/${userId}`;
        const response = await axiosInstance.put(url, user);
        return response.data as ResponseData;
    } catch (error) {
        throw error;
    }
}

export const deleteUser = async (userId: number): Promise<ResponseData> => {
    try {
        const url = `${BASE_API}/api/v1/user/${userId}`;
        const response = await axiosInstance.delete(url);
        return response.data as ResponseData;
    } catch (error) {
        throw error;
    }
}