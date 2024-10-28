import { GenderEnum } from "../enum/GenderEnum.ts";

export type User = {
    id?: number;
    email?: string;
    roles?: { id: number; name: string }[];
    fullName?: string;
    phoneNumber?: string;
    gender?: string;
    birth?: string;
    avatar?: string;
    isAdmin?: boolean;
    accessToken?: string;
    refreshToken?: string;
}

export interface UserRequest {
    email: string;
    password: string;
    fullName: string;
    phoneNumber: string;
    birth: string;
    gender: GenderEnum,
    avatar: string;
}