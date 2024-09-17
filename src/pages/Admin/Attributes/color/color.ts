
export interface Color {
    id: number;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    createBy:number;
    updateBy: number;
}

export interface ColorRequest {
    name: string;
}

export interface ColorParam{
    page: number;
    size: number;
    name: string;
}