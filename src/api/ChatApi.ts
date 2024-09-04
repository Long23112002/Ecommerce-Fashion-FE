import axios from "axios"
import { BASE_API } from "../constants/BaseApi"
import Cookies from "js-cookie"

export const callFindIdChatRoomByUserId = async (id: string|number) => {
    const {data} = await axios({
        url: `${BASE_API}/api/v1/chat_room/user/${id}`,
        headers: {
            Authorization: `Bearer ${Cookies.get('accessToken')}`
        }
    })
    return data
}