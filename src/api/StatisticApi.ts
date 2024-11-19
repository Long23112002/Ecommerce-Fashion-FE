import { BASE_API } from "../constants/BaseApi";
import axiosInstance from "./AxiosInstance";

const API = `${BASE_API}/api/v1/statistic`

export const getCurrentDayRevenue = async () => {
    const {data} = await axiosInstance({
        method: 'GET',
        url: `${API}/current-day`
    })
    return data
}

export const getYearRevenueData = async (year?: string|number) => {
    const {data} = await axiosInstance({
        method: 'GET',
        url: `${API}/year`,
        params: {
            year: year
        }
    })
    return data
}

export const getMonthRevenueData = async (year?: string|number, month?: string|number) => {
    const {data} = await axiosInstance({
        method: 'GET',
        url: `${API}/month`,
        params: {
            year: year,
            month: month
        }
    })
    return data
}

export const getSoldProducts = async (year?: string|number, month?: string|number) => {
    const {data} = await axiosInstance({
        method: 'GET',
        url: `${API}/sold-product`,
        params: {
            year: year,
            month: month
        }
    })
    return data
}