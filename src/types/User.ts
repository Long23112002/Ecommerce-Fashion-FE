
import {GenderEnum} from "../enum/GenderEnum.ts";

export type User = {
    id: number,
    username: string,
    name: string,
    avatar: string,
    isAdmin: boolean
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