import { TypePromotionEnum } from "../enum/TypePromotionEnum";
import { StatusPromotionEnum } from "../enum/StatusPromotionEnum";

export interface Promotion{
    
    id:number;
    startDate: string | number;
    endDate: string | number;
    typePromotionEnum: TypePromotionEnum;
    value: number;
    statusPromotionEnum: StatusPromotionEnum;
    createdAt: string | number;
    updatedAt: string | number;
    createdBy: number;
    updatedBy: number;
    deleted: boolean;
}

export interface PromotionRequest {
    startDate: string | number;
    endDate: string | number;
    typePromotionEnum: TypePromotionEnum;
    value: number;
    statusPromotionEnum?: StatusPromotionEnum; 
}