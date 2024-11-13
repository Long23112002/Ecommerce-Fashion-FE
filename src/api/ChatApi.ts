import ChatRoom from "../types/ChatRoom"
import axiosInstance from "./AxiosInstance"

const CHAT_ROOM_API = '/api/v1/chat-room'

export const callFindAllChatRoom = async () => {
    const { data } = await axiosInstance.get(CHAT_ROOM_API)
    return data
}

export const callFindIdChatRoomByUserId = async (id: string | number) => {
    const { data } = await axiosInstance.get(`${CHAT_ROOM_API}/user/${id}`)
    return data
}

export const callCreateChatRoom = async (chatRoom: ChatRoom) => {
    const { data } = await axiosInstance.post(`${CHAT_ROOM_API}`, chatRoom)
    return data
}

export const callFindAllChatByIdChatRoom = async (id: string) => {
    const { data } = await axiosInstance.get(`${CHAT_ROOM_API}/chats/${id}`)
    return data
}

export const callSeenAllChatByIdChatRoom = async (idRoom: string, idUser: number) => {
    await axiosInstance.patch(`${CHAT_ROOM_API}/chats/${idRoom}/${idUser}`)
}

export const callDeleteRoomById = async (id: string) => {
    await axiosInstance.delete(`${CHAT_ROOM_API}/${id}`)
}

export const callFindChatsUntilTarget = async (id: string) => {
    const { data } = await axiosInstance.get(`${CHAT_ROOM_API}/chats/before-target/${id}`)
    return data
}