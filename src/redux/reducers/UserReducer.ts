import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
    fullName: string;
    email: string;
    avatar: string;
}

const initState: UserState = {
    fullName: '',
    email: '',
    avatar: ''
};

const UserReducer = createSlice({
    initialState: initState,
    name: 'User',
    reducers: {
        setUser: (state, action: PayloadAction<UserState>) => {
            state.fullName = action.payload.fullName;
            state.email = action.payload.email;
            state.avatar = action.payload.avatar;
        }
    }
});

export const { setUser } = UserReducer.actions;
export const userSelector = (state: { user: UserState }) => state.user;
export default UserReducer.reducer;
