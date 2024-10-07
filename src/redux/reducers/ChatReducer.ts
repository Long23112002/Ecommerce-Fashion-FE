import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initState: boolean = false;

const ChatReducer = createSlice({
    initialState: initState,
    name: 'Chat',
    reducers: {
        setNewChat: (_, action: PayloadAction<boolean>) => {
            return action.payload;
        }
    }
});

export const { setNewChat } = ChatReducer.actions;
export const chatSelector = (state: { chat: boolean }) =>  state.chat;
export default ChatReducer.reducer;
