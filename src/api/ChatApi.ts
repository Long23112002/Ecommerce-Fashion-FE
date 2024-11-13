import ChatRoom from "../types/ChatRoom"
import axiosInstance from "./AxiosInstance"

export const callFindAllChatRoom = async () => {
    const { data } = await axiosInstance.get(`/api/v1/chat-room`)
    return data
}

export const callFindIdChatRoomByUserId = async (id: string | number) => {
    const { data } = await axiosInstance.get(`/api/v1/chat-room/user/${id}`)
    return data
}

export const callCreateChatRoom = async (chatRoom: ChatRoom) => {
    const { data } = await axiosInstance.post(`/api/v1/chat-room`, chatRoom)
    return data
}

export const callFindAllChatByIdChatRoom = async (id: string) => {
    const { data } = await axiosInstance.get(`/api/v1/chat-room/chats/${id}`)
    return data
}

export const callSeenAllChatByIdChatRoom = async (idRoom: string, idUser: number) => {
    await axiosInstance.patch(`/api/v1/chat-room/chats/${idRoom}/${idUser}`)
}

export const callDeleteRoomById = async (id: string) => {
    await axiosInstance.delete(`/api/v1/chat-room/${id}`)
}

export const callFindChatsUntilTarget = async (id: string) => {
    const { data } = await axiosInstance.get(`/api/v1/chat-room/chats/before-target/${id}`)
    return data
}