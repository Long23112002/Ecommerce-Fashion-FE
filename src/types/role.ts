import {Permission} from "../api/PermissionApi.ts";

export interface Role {

    id: number
    name: string
    permissions: Permission[]

}