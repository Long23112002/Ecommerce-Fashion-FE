import axiosInstance from "./AxiosInstance"

export const callFindAllNotiByUserId = async (id: string | number) => {
    const { data } = await axiosInstance.get(`/api/v1/notification/user/${id}`)
    return data
}

export const callFindAllUnSeenNotiByUserId = async (id: string | number) => {
    const { data } = await axiosInstance.get(`/api/v1/notification/unseen/user/${id}`)
    return data
}

export const callMarkSeenAllByIdUser = async (id: string | number) => {
    const { data } = await axiosInstance.patch(`/api/v1/notification/seen/user/${id}`)
    return data
}

export const callMarkSeenByIdNoti = async (id: string) => {
    const { data } = await axiosInstance.patch(`/api/v1/notification/seen/${id}`)
    return data
}

export const callDeleteByIdNoti = async (id: string) => {
    const { data } = await axiosInstance.delete(`/api/v1/notification/${id}`)
    return data
}