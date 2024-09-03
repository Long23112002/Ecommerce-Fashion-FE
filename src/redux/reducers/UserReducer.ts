import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
    id: number,
    fullName: string;
    email: string;
    avatar: string;
}

const initState: UserState = {
    id: -1,
    fullName: '',
    email: '',
    avatar: ''
};

const UserReducer = createSlice({
    initialState: initState,
    name: 'User',
    reducers: {
        setUser: (state, action: PayloadAction<UserState>) => {
            state.id = action.payload.id;
            state.fullName = action.payload.fullName;
            state.email = action.payload.email;
            state.avatar = action.payload.avatar;
        }
    }
});

export const { setUser } = UserReducer.actions;
export const userSelector = (state: { user: UserState }) => state.user;
export default UserReducer.reducer;