import { GenderEnum } from "../enum/GenderEnum.ts";

export type User = {
    id?: number;
    email?: string;
    roles?: { id: number; name: string }[];
    fullName?: string;
    phoneNumber?: string | null;
    gender?: 'MALE' | 'FEMALE' | 'OTHER';
    birth?: string | null;
    avatar?: string | null;
    isAdmin?: boolean;
    accessToken?: string;
    refreshToken?: string;
}

export interface UserRequest {
    id: number;
    email: string;
    password: string;
    fullName: string;
    phoneNumber: string;
    birth: string;
    gender: GenderEnum,
    avatar: string;
    isCheck: boolean
}

export interface UserInfoRequest {
    fullName: string;
    phoneNumber: string | null;
    birth: Date | null;
    gender: 'MALE' | 'FEMALE' | 'OTHER';
    avatar: string | null;
}

export interface ChangePasswordRequest {
    email: string;
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
}