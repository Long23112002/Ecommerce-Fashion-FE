// Định nghĩa type cho trạng thái phân trang
export interface PaginationState {
    current: number;   // Trang hiện tại
    pageSize: number;  // Số lượng bản ghi trên mỗi trang
    total: number;     // Tổng số bản ghi
    totalPage: number; // Tổng số trang
  }
  
  // Hàm tạo cấu hình phân trang cho bảng dữ liệu
  const createPaginationConfig = (
    pagination: PaginationState,
    setPagination: (pagination: PaginationState) => void
  ) => {
    return {
      current: pagination.current,         // Trang hiện tại
      pageSize: pagination.pageSize,       // Số lượng bản ghi mỗi trang
      total: pagination.total,             // Tổng số bản ghi
      showSizeChanger: true,               // Cho phép thay đổi số bản ghi trên mỗi trang
      pageSizeOptions: ["5", "10", "20"],  // Các tùy chọn số bản ghi mỗi trang
      onChange: (page: number, pageSize: number) => {
        setPagination({ ...pagination, current: page, pageSize: pageSize });
      },
    };
  };
  
  export default createPaginationConfig;
  