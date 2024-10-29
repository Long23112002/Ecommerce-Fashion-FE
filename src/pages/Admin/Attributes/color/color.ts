
export interface Color {
    id?: number;
    code?: string;
    name?: string;
    createdAt?: Date;
    updatedAt?: Date;
    createBy?:number;
    updateBy?: number;
    code: string;
}

export interface ColorRequest {
    name: string;
    code: string;
}