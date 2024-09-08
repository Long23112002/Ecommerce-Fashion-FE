import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import Cookies from "js-cookie";
/* eslint-disable */
const refreshAxiosInstance = axios.create({
    baseURL: 'http://localhost:8080',
    headers: {
        'Content-Type': 'application/json',
    },
});

const refreshToken = async (): Promise<string> => {
    const refreshToken = Cookies.get('refreshToken');
    const response = await refreshAxiosInstance.post(`/api/v1/auth/refresh-token`, {}, {
        headers: {
            'Authorization': `Bearer ${refreshToken}`
        }
    });
    Cookies.set('accessToken', response.data.accessToken);
    Cookies.set('refreshToken', response.data.refreshToken);
    return response.data.accessToken;
};

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8080',
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

export default axiosInstance;
