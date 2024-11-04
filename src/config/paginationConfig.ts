import { TablePaginationConfig } from 'antd';

// Interface representing the state of pagination
export interface PaginationState {
  current: number;   // Current page number
  pageSize: number;  // Number of items per page
  total: number;     // Total number of items
  totalPage: number; // Total number of pages
}

// Function to create pagination config for Ant Design Table
const createPaginationConfig = (
  pagination: PaginationState, 
  setPagination: (pagination: PaginationState) => void
): TablePaginationConfig => ({
  current: pagination.current,
  pageSize: pagination.pageSize,
  total: pagination.total,
  showSizeChanger: true,
  showQuickJumper: true,
  pageSizeOptions: ['5', '10', '20', '50'],
  onChange: (page, pageSize) => {
    setPagination({
      ...pagination,
      current: page,
      pageSize,
    });
  },
});

export default createPaginationConfig;
