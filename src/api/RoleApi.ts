import axios from "axios";
import { BASE_API } from "../constants/BaseApi.ts";
import {ResponseData} from "../types/responseApi.ts";
import {Role} from "../types/role.ts";


export const fetchAllRole = async (
    keyword: string = '',
    size: number = 10,
    page: number = 0
): Promise<ResponseData> => {
    try {
        const url = `${BASE_API}/api/v1/role?page=${page}&size=${size}`;
        const response = await axios.get<{ data: Role[], total: number }>(url);
        return response.data as ResponseData;
    } catch (error) {
        console.error("Error fetching roles:", error);
        throw error;
    }
};
