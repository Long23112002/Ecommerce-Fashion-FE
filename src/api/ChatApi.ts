import ChatRoom from "../types/ChatRoom"
import axiosInstance from "./AxiosInstance"

export const callFindAllChatRoom = async () => {
    const { data } = await axiosInstance.get(`/api/v1/chat_room`)
    return data
}

export const callFindIdChatRoomByUserId = async (id: string | number) => {
    const { data } = await axiosInstance.get(`/api/v1/chat_room/user/${id}`)
    return data
}

export const callCreateChatRoom = async (chatRoom: ChatRoom) => {
    const { data } = await axiosInstance.post(`/api/v1/chat_room`, chatRoom)
    return data
}

export const callFindAllChatByIdChatRoom = async (id: string) => {
    const { data } = await axiosInstance.get(`/api/v1/chat_room/chats/${id}`)
    return data
}

export const callSeenAllChatByIdChatRoom = async (id: string) => {
    await axiosInstance.patch(`/api/v1/chat_room/chats/${id}`)
}
