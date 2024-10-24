
export interface Material {
    id?: number;
    name?: string;
    createdAt?: Date;
    updatedAt?: Date;
    createBy?:number;
    updateBy?: number;
}

export interface MaterialRequest {
    name: string;
}