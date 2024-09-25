export interface PaginationState {
    current: number;
    pageSize: number;
    total: number;
    totalPage: number;
}

const createPaginationConfig = (
    pagination: PaginationState,
    setPagination: (pagination: PaginationState) => void
) => {
    return {
        current: pagination.current,
        pageSize: pagination.pageSize,
        total: pagination.total,
        showSizeChanger: true,
        pageSizeOptions: ["5", "10", "20"],
        onChange: (page: number, pageSize: number) => {
            setPagination({...pagination, current: page, pageSize: pageSize});
        },
    };
};

export default createPaginationConfig;
  