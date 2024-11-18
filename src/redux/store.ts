import { configureStore } from '@reduxjs/toolkit';
import UserReducer from './reducers/UserReducer';
import ChatReducer from './reducers/ChatReducer';
import CartSlice from './reducers/CartReducer';
import LoadingScreenReducer from './reducers/LoadingScreenReducer';
const store = configureStore({
    reducer: {
        user: UserReducer,
        chat: ChatReducer,
        cart: CartSlice,
        loadingScreen: LoadingScreenReducer
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
