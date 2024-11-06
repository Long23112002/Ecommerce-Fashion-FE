import { BASE_API } from "../constants/BaseApi"
import axiosInstance, { PageableRequest } from "./AxiosInstance"

interface ProductParams {
    code?: string,
    idBrand?: number,
    idCategory?: number,
    idMaterial?: number,
    idOrigin?: number,
    keyword?: string
}

export const getAllProduct = async (params?: ProductParams, pageable?: PageableRequest) => {
    const { data } = await axiosInstance({
        method: 'GET',
        url: `${BASE_API}/api/v1/product`,
        params: { params, ...pageable }
    });
    return data
}