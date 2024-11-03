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
                ...pagination, // spread operator, sao chép tất cả các thuộc tính hiện có của đối tượng pagination vào một đối tượng mới
                current: page,
                pageSize: pageSize || pagination.pageSize
            })
        },
        showSizeChange: true,
        pageSizeOptions: ['5', '10', '20', '50'],
        showQuickJumper: true,
    }
}

export default createPaginationConfig;