import {GenderEnum} from "../enum/GenderEnum.ts";

export type User = {
    fullName: string,
    userName: string,
    avatar: string
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