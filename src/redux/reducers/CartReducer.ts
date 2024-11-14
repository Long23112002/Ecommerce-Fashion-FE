import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Cart, CartValueInfos, CartValues } from '../../types/Cart';

const initialState: Cart = {
  id: -1,
  userId: -1,
  cartValueInfos: [],
  cartValues: [],
};

const CartReducer = createSlice({
  initialState: initialState,
  name: 'cart',
  reducers: {
    setCart: (state, action: PayloadAction<Cart>) => {
      const { payload } = action
      if (!payload || payload.id == -1) return
      state.id = action.payload.id;
      state.userId = action.payload.userId;
      state.cartValueInfos = action.payload.cartValueInfos;
      state.cartValues = action.payload.cartValues;
    },
    addItemToCart: (state, action: PayloadAction<CartValues>) => {
      const newItem = action.payload
      const item = state.cartValues.find(cart => cart.productDetailId == newItem.productDetailId)
      const { cartValues } = state
      if (item) {
        item.quantity += newItem.quantity
      } else {
        cartValues.push(newItem)
      }
    },
    setItemInCart: (state, action: PayloadAction<CartValues>) => {
      const newItem = action.payload
      const item = state.cartValues.find(cart => cart.productDetailId == newItem.productDetailId)
      if (item) {
        item.quantity = newItem.quantity
      }
    },
    setCartValues: (state, action: PayloadAction<CartValues[]>) => {
      const newItems = action.payload
      state.cartValues = newItems
    }
  }
});

export const cartSelector = (state: { cart: Cart }) => state.cart;
export const totalCartSelector = (state: { cart: Cart }) => {
  return state.cart.cartValues
    .map(cart => cart.quantity)
    .reduce((total, quantity) => total += quantity, 0);
}
export const { addItemToCart, setCart, setItemInCart, setCartValues } = CartReducer.actions
export default CartReducer.reducer;
