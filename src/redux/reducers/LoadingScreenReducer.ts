import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initState: boolean = false

const LoadingScreenReducer = createSlice({
    initialState: initState,
    name: 'loadingScreen',
    reducers: {
        setLoadingScreen: (_, action: PayloadAction<boolean>) => {
            return action.payload;
        }        
    }
})

export const {setLoadingScreen} = LoadingScreenReducer.actions
export const loadingScreenSelector = (state: {loadingScreen: boolean}) => state.loadingScreen
export default LoadingScreenReducer.reducer