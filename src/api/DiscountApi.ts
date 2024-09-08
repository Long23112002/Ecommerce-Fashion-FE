import { BASE_API } from "../constants/BaseApi";
import { ResponseData } from "../types/responseApi";
import { UserData } from "./AuthApi";
import axiosInstance from "./AxiosInstance";


export interface Condition {
    min_purchase: number;
    category: string;
}

export enum TypeDiscount {
    PERCENTAGE = 'PERCENTAGE',
    FIXED_AMOUNT = 'FIXED_AMOUNT'
}

export enum StatusDiscount {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE'
}

export interface DiscountResponse {
    id: number;
    code: string;
    name: string;
    condition: Condition;
    type: TypeDiscount;
    value: number;
    maxValue: number;
    startDate: number;
    endDate: number;
    discountStatus: StatusDiscount;
    createAt: number;
    updateAt: number;
    createBy: UserData | null; 
    updateBy: UserData | null; 
    deleted: boolean;
}


export interface DiscountPram {
   
}




export const fetchAllDiscount = async (params: DiscountPram) : Promise<ResponseData>  => {
   // eslint-disable-next-line no-useless-catch
   try {
     
     const url = `${BASE_API}/api/v1/discount`;
     const response = await axiosInstance.get(url , {params});
     return response.data as ResponseData
   } catch (error) {
     throw error;
   }
}