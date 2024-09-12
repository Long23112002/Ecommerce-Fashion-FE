
import { CategoryRequest, CategoryData } from '../types/Category.ts';
import {BASE_API} from "../constants/BaseApi.ts";
import axiosInstance from './AxiosInstance.ts';
// Define the base URL for the categories API
const BASE_URL = `${BASE_API}/api/v1/category`;

// Get all categories with pagination and optional filters
export const getAllCategories = async (params: { page: number; size: number; name?: string }) => {
  try {
    const response = await axiosInstance.get<{ data: CategoryData[]; metaData: { page: number; size: number; total: number; totalPage: number } }>(`${BASE_URL}`, {
      params,
    });
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch categories: ${error.response?.data?.message || error.message}`);
  }
};

// Create a new category
export const createCategory = async (category: CategoryRequest) => {
  try {
    const response = await axiosInstance.post<CategoryData>(`${BASE_URL}`, category);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to create category: ${error.response?.data?.message || error.message}`);
  }
};

// Update an existing category
export const updateCategory = async (id: number, category: CategoryRequest) => {
  try {
    const response = await axiosInstance.put<CategoryData>(`${BASE_URL}/${id}`, category);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to update category: ${error.response?.data?.message || error.message}`);
  }
};

// Delete a category by ID
export const deleteCategory = async (id: number) => {
  try {
    const response = await axiosInstance.delete(`${BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to delete category: ${error.response?.data?.message || error.message}`);
  }
};
