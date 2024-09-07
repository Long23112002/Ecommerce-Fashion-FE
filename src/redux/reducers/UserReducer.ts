import {createSlice, PayloadAction} from "@reduxjs/toolkit";

interface UserState {
    id: number,
    fullName: string;
    email: string;
    avatar: string;
    isAdmin: boolean;
}

const initState: UserState = {
    id: -1,
    fullName: '',
    email: '',
    avatar: '',
    isAdmin: false
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
            state.isAdmin = action.payload.isAdmin;
        }
    }
});

export const {setUser} = UserReducer.actions;
export const userSelector = (state: { user: UserState }) => state.user;
export default UserReducer.reducer;