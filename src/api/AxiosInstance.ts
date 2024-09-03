import axios, {AxiosRequestConfig, AxiosResponse} from "axios";
import Cookies from "js-cookie";


const axiosInstance = axios.create({
    baseURL: 'http://localhost:8080/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
});


const refreshToken = async (): Promise<AuthResponse> => {
    const refreshToken = Cookies.get('refreshToken');
    const response = await axios.post('/auth/refresh-token', {refreshToken});
    Cookies.set('accessToken', response.data.accessToken);
    Cookies.set('refreshToken', response.data.refreshToken);
    return response.data.accessToken;
};


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
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const newToken = await refreshToken();
            originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
            return axiosInstance(originalRequest);
        }
        return Promise.reject(error);
    }
);
