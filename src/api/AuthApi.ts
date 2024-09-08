import {LoginRequest} from "../types/login/request/loginRequest.ts";

import axios from 'axios';
import {BASE_API} from "../constants/BaseApi.ts";
import Cookies from "js-cookie";


export interface UserData {
    id: number;
    email: string;
    roles: { id: number; name: string }[];
    fullName: string;
    phoneNumber: string;
    gender: string;
    birth: string;
    avatar: string;
    isAdmin: boolean;
    accessToken?: string;
    refreshToken?: string;
}


export const handleLogin = async (loginRequest: LoginRequest): Promise<LoginResponse> => {

    try {
        const url = `${BASE_API}/api/v1/auth/login`;
        const response = await axios.post(url, loginRequest);
        return response.data as LoginResponse;
    } catch (error) {
        console.error("Error fetching roles:", error);
    }
}


export const handleLogout = async (): Promise<any> => {
    try {
        const url = `${BASE_API}/api/v1/auth/logout`;
        const response = await axios.post(url);
        clearUserData();
        return response.data;
    } catch (error) {
        console.error("Error fetching roles", error);
    }
};


export const clearUserData = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('email');
    localStorage.removeItem('fullName');
    localStorage.removeItem('phoneNumber');
    localStorage.removeItem('birth');
    localStorage.removeItem('gender');
    localStorage.removeItem('avatar');
    localStorage.removeItem('roles');

    Cookies.remove('accessToken');
    Cookies.remove('refreshToken');
    ``
};


export const storeUserData = (data: LoginResponse) => {
    const {id, email, fullName, phoneNumber, birth, gender, avatar, roles, isAdmin} = data.userResponse;

    localStorage.setItem('userId', id.toString());
    localStorage.setItem('email', email);
    localStorage.setItem('fullName', fullName);
    localStorage.setItem('phoneNumber', phoneNumber);
    localStorage.setItem('birth', birth);
    localStorage.setItem('gender', gender);
    localStorage.setItem('avatar', avatar ? avatar : '');
    localStorage.setItem('roles', roles ? JSON.stringify(roles) : '');
    localStorage.setItem("isAdmin", isAdmin)

    Cookies.set('accessToken', data.authResponse.accessToken);
    Cookies.set('refreshToken', data.authResponse.refreshToken);
};


export const getUserData = (): {
    phoneNumber: string;
    gender: string;
    roles: any;
    fullName: string;
    birth: string;
    id: string;
    avatar: string;
    isAdmin: string | null;
    accessToken: string | undefined;
    email: string;
    refreshToken: string | undefined
} => {
    const id = localStorage.getItem('userId') || '';
    const email = localStorage.getItem('email') || '';
    const fullName = localStorage.getItem('fullName') || '';
    const phoneNumber = localStorage.getItem('phoneNumber') || '';
    const birth = localStorage.getItem('birth') || '';
    const gender = localStorage.getItem('gender') || '';
    const avatar = localStorage.getItem('avatar') || '';
    const rolesString = localStorage.getItem('roles');
    const roles = rolesString ? JSON.parse(rolesString) : null;
    const isAdmin = localStorage.getItem("isAdmin");

    const accessToken = Cookies.get('accessToken');
    const refreshToken = Cookies.get('refreshToken');

    return {
        id,
        email,
        fullName,
        phoneNumber,
        birth,
        gender,
        avatar,
        roles,
        isAdmin,
        accessToken,
        refreshToken,
    };

};
