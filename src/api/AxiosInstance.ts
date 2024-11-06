import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import Cookies from "js-cookie";
import { BASE_API } from "../constants/BaseApi";

export interface PageableRequest {
    page?: number,
    size?: number,
    sort?: 'ASC'|'DESC',
    sortBy?: string
}

const refreshAxiosInstance = axios.create({
    baseURL: BASE_API,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const refreshToken = async (): Promise<string> => {
    const refreshToken = Cookies.get('refreshToken');
    const response = await refreshAxiosInstance.post(`/api/v1/auth/refresh-token`, {}, {
        headers: {
            'Authorization': `Bearer ${refreshToken}`
        }
    });
    Cookies.set('accessToken', response.data.accessToken);
    Cookies.set('refreshToken', response.data.refreshToken);
};

const axiosInstance = axios.create({
    baseURL: BASE_API,
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosInstance.interceptors.request.use(
    async (config: AxiosRequestConfig) => {
        const token = Cookies.get('accessToken');
        if (token) {
            config.headers = config.headers || {};
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;
        console.log('Error response:', error.response);
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const newToken = await refreshToken();
                console.log('New Token:', newToken);
                originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
                return axiosInstance(originalRequest);
            } catch (err) {
                console.error('Failed to refresh token:', err);
            }
        }
        return Promise.reject(error);
    }
);

export const callGetInstance = async (url: string) => {
    const { data } = await axiosInstance.get(url)
    return data
}

export default axiosInstance;