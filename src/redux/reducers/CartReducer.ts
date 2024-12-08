import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Cart, CartValues } from '../../types/Cart';

const initialState: CartValues[] = []

const CartReducer = createSlice({
  initialState: initialState,
  name: 'cart',
  reducers: {
    setCart: (_, action: PayloadAction<CartValues[]>) => {
      return action.payload.filter(c => c.quantity > 0);
    },
    clearCart: () => {
      return []
    }
  }
});

export const cartSelector = (state: { cart: CartValues[] }) => state.cart;
export const totalCartSelector = (state: { cart: CartValues[] }) => {
  return state.cart
    .map(cart => cart.quantity)
    .reduce((total, quantity) => total += quantity, 0);
}
export const { setCart, clearCart } = CartReducer.actions
export default CartReducer.reducer;
