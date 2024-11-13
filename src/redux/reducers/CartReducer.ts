import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartValueInfos, CartValues } from '../../types/Cart';

interface CartState {
    cartValues: CartValues[];
    totalPrice: number;
    totalQuantity: number;
  }
  
  const initialState: CartState = {
    cartValues: [],
    totalPrice: 0,
    totalQuantity: 0,
  };


const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItemToCart(state,action){
      const newItem = action.payload;
      const existingItem = state.cartValues.find(item => item.productDetailId === newItem.productDetail.id);
      state.totalQuantity = state.totalQuantity + 1;
      if(existingItem){
        existingItem.quantity += newItem.quantity;
        state.totalQuantity += newItem.quantity;
      } else {
        state.cartValues.push(newItem);
        state.totalQuantity += newItem.quantity;
      }
      
      state.totalPrice += newItem.productDetail.price * newItem.quantity;
    }
  }
});
export default cartSlice.reducer;
