// src/utils/paginationConfig.ts

// Define a type for the pagination configuration to be used
export interface PaginationState {
    current: number;
    pageSize: number;
    total: number;
    totalPage: number;
}

const createPaginationConfig = (
    pagination: PaginationState,
    setPagination: React.Dispatch<React.SetStateAction<PaginationState>>
): {
    current: number;
    total: number;
    pageSizeOptions: string[];
    onChange: (page: number, pageSize?: number) => void;
    showTotal: (total: number) => string;
    pageSize: number;
    onShowSizeChange: (current: number, size: number) => void;
    showQuickJumper: boolean;
    showSizeChanger: boolean
} => ({
    current: pagination.current,
    pageSize: pagination.pageSize,
    total: pagination.total,
    showSizeChanger: true,
    pageSizeOptions: ['5', '10', '20'],
    onChange: (page: number, pageSize?: number) => {
        setPagination(prev => ({
            ...prev,
            current: page,
            pageSize: pageSize || prev.pageSize
        }));
    },
    onShowSizeChange: (current: number, size: number) => {
        setPagination(prev => ({
            ...prev,
            current: 1,
            pageSize: size
        }));
    },
    showTotal: (total: number) => "",
    showQuickJumper: true
});

export default createPaginationConfig;
