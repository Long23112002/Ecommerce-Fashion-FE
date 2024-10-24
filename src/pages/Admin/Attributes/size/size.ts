export interface Size {
    id?: number;
    name?: string;
    createdAt?: Date;
    updatedAt?: Date;
    createBy?:number;
    updateBy?: number;
}

export interface SizeRequest {
    name: string;
}