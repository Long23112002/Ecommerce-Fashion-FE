
export interface PaginationState {
    current: number;
    pageSize: number;
    total: number;
    totalPage: number;
}
const createPaginationConfig = (pagination: PaginationState, setPagination: (pagination: PaginationState) => void) => {
    return {
        current: pagination.current,
        pageSize: pagination.pageSize,
        total: pagination.total,
        onChange: (page: number, pageSize?: number) => {
            setPagination({
                ...pagination,
                current: page,
                pageSize: pageSize || pagination.pageSize,
            });
        },
        showSizeChanger: true,  // Option to change the number of items per page
        pageSizeOptions: ['5', '10', '20', '50'],  // Page size options
    };
};

export default createPaginationConfig;