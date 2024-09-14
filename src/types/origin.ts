import { UserData } from "../api/AuthApi";

// Định nghĩa type cho Origin
export interface Origin {
    id: number;           // ID của origin (mã định danh duy nhất)
    name: string;         // Tên của origin
    createAt: number;     // Timestamp khi origin được tạo
    updateAt: number;     // Timestamp khi origin được cập nhật
    createBy: UserData | null; // Người tạo origin (nếu có)
    updateBy: UserData | null; // Người cập nhật origin (nếu có)
    deleted: boolean;     // Trạng thái đã xóa hay chưa
  }
  