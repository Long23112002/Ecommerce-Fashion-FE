import {createSlice} from "@reduxjs/toolkit";
import User from "../../types/User";

const initState: User = {
    username: 'thaitranminh564@gmail.com',
    name: 'Trần Minh Thái',
    avatar: 'https://hoang-phuc.com/media/magefan_blog/2021/12/meme-cheems-1.jpg'
}

const UserReducer = createSlice({
    initialState: initState,
    name: 'User',
    reducers: {}
})

export const userSelector = (state: { user: User | null }) => state.user;

export default UserReducer