import axiosInstance from './AxiosInstance';
import { BASE_API } from "../constants/BaseApi.ts";
const BASE_URL = `${BASE_API}/api/v1/discount`;

export const fetchAllDiscounts = async (
  pageSize: number,
  page: number,
  name: string,
  type?: string,
  status?: string,
  idProductDetail?: number[],
  prices?: number) => {
  const response = await axiosInstance.get(`${BASE_URL}`, {
    params: {
      page,
      size: pageSize,
      name,
      type,
      status,
      idProductDetail,
      prices
    },
    paramsSerializer: {
      indexes: null,
    }
  });
  return response.data;
};

export const getDiscountById = async (id: number) => {
  try {
    const response = await axiosInstance.get(`${BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching discount:", error);
  }
};
export const createDiscount = async (discountRequest: any, token: string) => {
  try {
    const response = await axiosInstance.post(
      `${BASE_URL}`,
      discountRequest,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response;
  } catch (error) {
    console.error('Lỗi khi thêm khuyến mãi:', error);
    throw error
  }
};


export const updateDiscount = async (id: number, discountRequest: any, token: string) => {
  try {
    const response = await axiosInstance.put(`${BASE_URL}/${id}`, discountRequest, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });
    return response;
  } catch (error: any) {
    console.error('Lỗi khi update khuyến mãi:', error);
    throw error
  }
};

export const deleteDiscount = async (id: number, token: string) => {
  const response = await axiosInstance.delete(`${BASE_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

export const getAllDiscount = async (pageSize: number, pageIndex: number) => {
  const params = {
    size: pageSize,
    page: pageIndex,
  };

  try {
    const response = await axiosInstance.get(`${BASE_URL}/select`, { params });
    return response.data;
  } catch (error: any) {
    throw new Error(`Error fetching Discount: ${error.response?.data?.message || error.message}`);
  }
};