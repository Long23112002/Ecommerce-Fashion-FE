export interface MetaData {
    page: number;
    size: number;
    total: number;
    totalPage: number;
}

export interface ResponseData {
    data: any;
    metaData: MetaData;
}