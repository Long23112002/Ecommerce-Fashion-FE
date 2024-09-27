import {configureStore} from '@reduxjs/toolkit';
import UserReducer from './reducers/UserReducer';
import ChatReducer from './reducers/ChatReducer';

const store = configureStore({
    reducer: {
        user: UserReducer,
        chat: ChatReducer
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
