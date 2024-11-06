import { BASE_API } from "../constants/BaseApi"
import axiosInstance, { PageableRequest } from "./AxiosInstance"

export const getDetailByIdProduct = async (id: number | string, pageable?: PageableRequest) => {
    const { data } = await axiosInstance({
        method: 'GET',
        url: `${BASE_API}/api/v1/product-detail/product/${id}`,
        params: pageable
    });
    return data
}