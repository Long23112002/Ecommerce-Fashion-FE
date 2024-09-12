import { CategoryRequest, CategoryData } from '../types/Category';
import { BASE_API } from "../constants/BaseApi";
import axiosInstance from './AxiosInstance';

// Định nghĩa URL cơ bản cho API danh mục
const BASE_URL = `${BASE_API}/api/v1/category`;

// Hàm xử lý lỗi tập trung cho các cuộc gọi API
const handleApiError = (error: any) => {
  const errorMessage = error.response?.data?.message || error.message || 'Lỗi không xác định';
  throw new Error(`Lỗi API: ${errorMessage}`);
};

// Lấy tất cả danh mục với phân trang và bộ lọc tùy chọn
export const getAllCategories = async (params: { page: number; size: number; name?: string }) => {
  try {
    const response = await axiosInstance.get<{ data: CategoryData[]; metaData: { page: number; size: number; total: number; totalPage: number } }>(`${BASE_URL}`, {
      params,
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Tạo một danh mục mới
export const createCategory = async (category: CategoryRequest, token: string): Promise<CategoryData> => {
  try {
    const response = await axiosInstance.post<CategoryData>(`${BASE_URL}`, category, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Cập nhật một danh mục hiện có
export const updateCategory = async (id: number, category: CategoryRequest, token: string): Promise<CategoryData> => {
  try {
    const response = await axiosInstance.put<CategoryData>(`${BASE_URL}/${id}`, category, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Xóa một danh mục theo ID
export const deleteCategory = async (id: number, token: string): Promise<void> => {
  try {
    await axiosInstance.delete(`${BASE_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });
  } catch (error) {
    handleApiError(error);
  }
};
