
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