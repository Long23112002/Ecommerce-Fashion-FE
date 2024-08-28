import {LoginRequest} from "../types/login/request/loginRequest.ts";

import axios from 'axios';
import {BASE_API} from "../constants/BaseApi.ts";
import Cookies from "js-cookie";

export const handleLogin = async (loginRequest: LoginRequest): Promise<LoginResponse> => {

    try {
        const url = `${BASE_API}/api/v1/auth/login`;
        const response = await axios.post(url, loginRequest);
        return response.data as LoginResponse;
    } catch (error) {
        console.error("Error fetching roles:", error);
    }
}



export const storeUserData = (data: LoginResponse) => {
    const { id, email, fullName, phoneNumber, birth, gender, avatar, roles } = data.userResponse;

    localStorage.setItem('userId', id.toString());
    localStorage.setItem('email', email);
    localStorage.setItem('fullName', fullName);
    localStorage.setItem('phoneNumber', phoneNumber);
    localStorage.setItem('birth', birth);
    localStorage.setItem('gender', gender);
    localStorage.setItem('avatar', avatar ? avatar : '');
    localStorage.setItem('roles', roles ? JSON.stringify(roles) : '');

    Cookies.set('accessToken', data.authResponse.accessToken);
    Cookies.set('refreshToken', data.authResponse.refreshToken);
};
