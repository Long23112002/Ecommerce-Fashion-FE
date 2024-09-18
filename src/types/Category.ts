import { UserData } from "../api/AuthApi"

export interface SubCategory {
  id: number;
  name: string;
  lever: number;  // Level of the category (e.g., 1 for parent, 2 for subcategory)
  createAt: string | number;  // ISO date string or timestamp
  updateAt: string | number;  // ISO date string or timestamp
  createBy: UserData;  // Can be an ID or User object based on how you load data
  updateBy: UserData | null;  // Nullable if no update
  deleted: boolean;
  parentCategory: Category | null;
  subCategories: SubCategory[];  // Recursive structure for nested subcategories
}

export interface Category {
  id: number;
  name: string;
  lever: number;  // Category level (e.g., main or subcategory)
  createAt: string | number;  // ISO date string or timestamp
  updateAt: string | number;  // ISO date string or timestamp
  createBy: UserData;
  updateBy: UserData | null;  // Can be null if no updates
  deleted: boolean;
  parentCategory: Category | null;  // Nullable, points to parent category if exists
  subCategories: SubCategory[];  // List of subcategories under this category
}
