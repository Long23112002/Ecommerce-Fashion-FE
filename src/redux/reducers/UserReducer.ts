import {createSlice} from "@reduxjs/toolkit";
import User from "../../types/User";

const initState: User|null = null

const UserReducer = createSlice({
    initialState: initState,
    name: 'User',
    reducers: {
        setUser: (_, action) => {
            return action.payload
        }
    }
})

export const userSelector = (state: { user: User | null }) => state.user;

export default UserReducer