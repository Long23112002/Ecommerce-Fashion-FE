/* eslint-disable */
import {BASE_API} from "../constants/BaseApi.ts";
import {ResponseData} from "../types/responseApi.ts";
import axiosInstance from "./AxiosInstance.ts";

export interface Permission {
    id: number;
    name: string;
}

export interface PermissionParam {
    page: number;
    size: number;
}

export interface PermissionAssign {
    roleId: number;
    permissionIds: number[];
}

export const fetchAllPermission = async (params: PermissionParam): Promise<ResponseData> => {
    try {
        const url = `${BASE_API}/api/v1/permission`;
        const response = await axiosInstance.get(url, {params});
        return response.data as ResponseData;
    } catch (error) {
        console.error("Error fetching permissions:", error);
        throw error;
    }
}


export const assignPermissionToRole = async (permissionAssign: PermissionAssign): Promise<any> => {
    try {
        const url = `${BASE_API}/api/v1/permission/assign-permission-to-role`;
        const response = await axiosInstance.patch(url, permissionAssign);
        console.log(response);
        return response.data;
    } catch (error) {
        console.error("Error assigning permission:", error);
        throw error;
    }
}

