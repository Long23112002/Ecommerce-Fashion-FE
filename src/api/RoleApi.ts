import {BASE_API} from "../constants/BaseApi.ts";
import {ResponseData} from "../types/responseApi.ts";
import {Role} from "../types/role.ts";
import axiosInstance from "./AxiosInstance.ts";
/* eslint-disable */



export interface RoleRequest {
    name: string;
    permissionIds: number[];
}

export const fetchAllRole = async (
    keyword: string = '',
    size: number = 10,
    page: number = 0
): Promise<ResponseData> => {
    try {
        const url = `${BASE_API}/api/v1/role?page=${page}&size=${size}`;
        const response = await axiosInstance.get<{ data: Role[], total: number }>(url);
        return response.data as unknown as ResponseData;
    } catch (error) {
        throw error;
    }
};

export const createRole = async (role: RoleRequest, token: string): Promise<ResponseData> => {
    try {
        const modifiedRole: RoleRequest = {
            name: `ROLE_${role.name.toUpperCase()}`,
            permissionIds: role.permissionIds
        };

        const url = `${BASE_API}/api/v1/role`;
        const auth = {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        };
        const response = await axiosInstance.post<Role>(url, modifiedRole, auth);
        return response.data as unknown as ResponseData;
    } catch (error) {
        throw error;
    }
};

export const deleteRole = async (roleId: number, token: string): Promise<ResponseData> => {
    try {
        const url = `${BASE_API}/api/v1/role/${roleId}`;
        const auth = {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        };
        const response = await axiosInstance.delete(url, auth);
        return response as unknown as ResponseData;
    } catch (error) {
        console.error("Error deleting role:", error);
        throw error;
    }
}

export const getRoleById = async (roleId: number): Promise<Role> => {
    try {
        const url = `${BASE_API}/api/v1/role/${roleId}`;
        const response = await axiosInstance.get<Role>(url);
        return response.data as Role;
    } catch (error) {
        throw error;
    }
};

export const updateRole = async (roleId: number, role: RoleRequest, token: string | undefined): Promise<ResponseData> => {
    try {
        const roleNameWithPrefix = role.name.startsWith('ROLE_')
            ? `ROLE_${role.name.slice(5).toUpperCase()}`
            : `ROLE_${role.name.toUpperCase()}`;

        const modifiedRole: RoleRequest = {
            name: roleNameWithPrefix,
            permissionIds: role.permissionIds
        };

        const auth = {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        };

        const url = `${BASE_API}/api/v1/role/${roleId}`;
        const response = await axiosInstance.put<Role>(url, modifiedRole, auth);
        return response.data as ResponseData;
    } catch (error) {
        throw error;
    }
};
