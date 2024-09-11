import axiosInstance from './AxiosInstance';  // Sử dụng axios instance đã cấu hình sẵn
import { ResponseData } from '../types/responseApi';  // Định nghĩa phản hồi API
import { Discount } from '../types/discount.ts';  // Định nghĩa kiểu Discount
import { AxiosResponse } from 'axios';
import { BASE_API } from "../constants/BaseApi.ts";
/* eslint-disable */
export interface DiscountParams {
  type?: string;
  status?: string;
  name?: string;
}
export enum TypeDiscount {
  PERCENTAGE = 'PERCENTAGE', // Giảm giá theo phần trăm
  FIXED_AMOUNT = 'FIXED_AMOUNT' // Giảm giá số tiền cố định
}

export enum StatusDiscount {
  ACTIVE = 'ACTIVE', // Giảm giá đang hoạt động
  INACTIVE = 'INACTIVE', // Giảm giá không hoạt động
  EXPIRED = 'EXPIRED'
}
// Hàm lấy tất cả các chương trình giảm giá
export const fetchAllDiscount = async (
  params: DiscountParams = {},
  size: number,
  page: number
): Promise<AxiosResponse<ResponseData>> => {
  const url = `${BASE_API}/api/v1/discount`;
  const response = await axiosInstance.get(url, {
    params: { ...params, size, page: page }
  });
  return response.data;
};

// Hàm lấy thông tin chi tiết của giảm giá theo ID
export const getDiscountById = async (discountId: number): Promise<Discount> => {
  try {
    const url = `${BASE_API}/api/v1/discount/${discountId}`;
    const response = await axiosInstance.get(url);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Hàm tạo mới một chương trình giảm giá
export const createDiscount = async (data: Discount, token: string): Promise<Discount> => {
  const url = `${BASE_API}/api/v1/discount`;
  const response = await axiosInstance.post(url, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  });
  return response.data;
};

// Hàm cập nhật giảm giá theo ID
export const updateDiscount = async (discountId: number, data: Discount, token: string): Promise<Discount> => {
  const url = `${BASE_API}/api/v1/discount/${discountId}`;
  const response = await axiosInstance.put(url, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  });
  return response.data;
};

// Hàm xóa một chương trình giảm giá theo ID
export const deleteDiscount = async (discountId: number, token: string): Promise<void> => {
  const url = `${BASE_API}/api/v1/discount/${discountId}`;
  await axiosInstance.delete(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  });
};
