import { BASE_API } from '../constants/BaseApi';
import axiosInstance from './AxiosInstance';

// Define the base URL for the API
const API_BASE_URL = `${BASE_API}/api/v1/category`;

// Define types for category data
interface CategoryData {
  name: string;
  parentId?: number;
}

// Fetch all categories with pagination and optional search parameters
export const fetchAllCategories = async (pageSize: number, pageIndex: number, searchName: string) => {
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

// Create a new category
export const createCategory = async (categoryData: CategoryData) => {
  try {
    const response = await axiosInstance.post(`${API_BASE_URL}`, categoryData);
    return response.data;
  } catch (error: any) {
    console.error("Error creating Category", error);
    throw error;
  }
};

// Update an existing category by ID
export const updateCategory = async (categoryId: number, categoryData: CategoryData) => {
  try {
    const response = await axiosInstance.put(`${API_BASE_URL}/${categoryId}`, categoryData);
    return response.data;
  } catch (error: any) {
    console.error("Error Update Category", error);
    throw error;
  }
};

// Delete a category by ID
export const deleteCategory = async (categoryId: number) => {
  try {
    const response = await axiosInstance.delete(`${API_BASE_URL}/${categoryId}`);
    return response.data;
  } catch (error: any) {
    throw new Error(`Error deleting category: ${error.response?.data?.message || error.message}`);
  }
};

// Get details of a single category by ID
export const getCategoryById = async (categoryId: number) => {
  try {
    const response = await axiosInstance.get(`${API_BASE_URL}/${categoryId}`);
    return response.data;
  } catch (error: any) {
    throw new Error(`Error fetching category details: ${error.response?.data?.message || error.message}`);
  }
};

// Select
export const getAllCategories = async (pageSize: number, pageIndex: number, searchName: string) => {
  const params = {
    size: pageSize,
    page: pageIndex,
    name: searchName || '',
  };

  try {
    const response = await axiosInstance.get(`${API_BASE_URL}/select`, { params });
    return response.data;
  } catch (error: any) {
    throw new Error(`Error fetching categories: ${error.response?.data?.message || error.message}`);
  }
};
