import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../../types/User";

const initState: User = {
    id: 0,
    email: '',
    roles: [],
    fullName: '',
    phoneNumber: '',
    gender: 'OTHER',
    birth: '',
    avatar: '',
    isAdmin: false,
    accessToken: undefined,
    refreshToken: undefined,
};

const UserReducer = createSlice({
    initialState: initState,
    name: 'User',
    reducers: {
        setUser: (state, action: PayloadAction<User>) => {
            state.id = action.payload.id;
            state.fullName = action.payload.fullName;
            state.email = action.payload.email;
            state.avatar = action.payload.avatar;
            state.isAdmin = action.payload.isAdmin;
            state.phoneNumber = action.payload.phoneNumber;
            state.gender = action.payload.gender;
            state.birth = action.payload.birth;
        },
        clearUser: () => {
            return initState;
        }
    }
});

export const { setUser } = UserReducer.actions;
export const { clearUser } = UserReducer.actions;
export const userSelector = (state: { user: User }) => state.user;
export default UserReducer.reducer;