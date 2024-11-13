import { BASE_API } from "../constants/BaseApi";
import axiosInstance from "./AxiosInstance";


// Base URL cho API
const API_BASE_URL = `${BASE_API}/api/v1/origin`;

// Lấy tất cả các origin với phân trang và lọc theo tên
export const fetchAllOrigins = async (pageSize: number = 15, page: number = 0, name: string = '') => {
    const response = await axiosInstance.get(`${API_BASE_URL}`, {
        params: {
            size: pageSize,
            page: page,
            name: name,
        },
    });
    return response.data;
};

// Tạo mới một origin
export const createOrigin = async (data: { name: string }, token: string) => {
    const response = await axiosInstance.post(`${API_BASE_URL}`, data, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });
    return response.data;
};

// Cập nhật một origin theo ID
export const updateOrigin = async (id: number, data: { name: string }, token: string) => {
    const response = await axiosInstance.put(`${API_BASE_URL}/${id}`, data, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });
    return response.data;
};

// Xóa một origin theo ID
export const deleteOrigin = async (id: number, token: string) => {
    const response = await axiosInstance.delete(`${API_BASE_URL}/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });
    return response.data;
};

// Lấy thông tin chi tiết về một origin theo ID
export const getOriginById = async (id: number) => {
    const response = await axiosInstance.get(`${API_BASE_URL}/${id}`);
    return response.data;
};

export const getOrigins = async (pageSize: number, pageIndex: number, searchName: string) => {
    const params = {
      size: pageSize,
      page: pageIndex,
      name: searchName || '',
    };
  
    try {
      const response = await axiosInstance.get(`${API_BASE_URL}`, { params });
      return response.data;
    } catch (error: any) {
      throw new Error(`Error fetching categories: ${error.response?.data?.message || error.message}`);
    }
  };