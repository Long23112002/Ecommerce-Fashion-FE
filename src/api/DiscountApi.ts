import axiosInstance from './AxiosInstance';
import { BASE_API } from "../constants/BaseApi.ts";
const BASE_URL = `${BASE_API}/api/v1/discount`;

// Hàm lấy danh sách khuyến mãi với phân trang và tìm kiếm theo tên
export const fetchAllDiscounts = async (pageSize: number, page: number, searchName: string) => {
  const response = await axiosInstance.get(`${BASE_URL}`, {
    params: {
      page,
      size: pageSize,
      name: searchName
    }
  });
  return response.data;
};

// Hàm lấy chi tiết một khuyến mãi theo ID
export const getDiscountById = async (id: number) => {
  const response = await axiosInstance.get(`${BASE_URL}/${id}`);
  return response.data;
};

// Hàm tạo một khuyến mãi mới
export const createDiscount = async (discountData: { name: string; value: number; maxValue: number }, token: string) => {
  const response = await axiosInstance.post(`${BASE_URL}`, discountData, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

// Hàm cập nhật khuyến mãi theo ID
export const updateDiscount = async (id: number, discountData: { name: string; value: number; maxValue: number }, token: string) => {
  const response = await axiosInstance.put(`${BASE_URL}/${id}`, discountData, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

// Hàm xóa khuyến mãi theo ID
export const deleteDiscount = async (id: number, token: string) => {
  const response = await axiosInstance.delete(`${BASE_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};
