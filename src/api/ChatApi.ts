import axiosInstance from "./AxiosInstance"

export const callFindIdChatRoomByUserId = async (id: string | number) => {
    const { data } = await axiosInstance.get(`/api/v1/chat_room/user/${id}`)
    return data
}

export const callFindAllChatByIdChatRoom = async (id: string) => {
    const { data } = await axiosInstance.get(`/api/v1/chat_room/chats/${id}`)
    console.log(data)
    return data
}