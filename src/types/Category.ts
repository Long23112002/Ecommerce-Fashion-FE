import { UserData } from "../api/AuthApi"

// CategoryData represents the structure of a category object returned from the API
export interface CategoryData {
  id: number;
  name: string;
  lever: number;
  createAt: string; // Timestamps as strings (ISO format)
  updateAt: string;
  createBy: UserData | null; // Can be null if not set
  updateBy: UserData | null;
  deleted: boolean;
  parentCategory: CategoryData | null; // Can be null for top-level categories
  children: CategoryData[]; // Nested subcategories
}

// CategoryRequest represents the structure of a category object to be sent to the API
export interface CategoryRequest {
  name: string;
  createBy: UserData | null; // The ID of the creator (can be null)
  parentCategoryId?: number | null; // Optional, for setting the parent category
}
