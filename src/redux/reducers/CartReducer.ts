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
    addToCart: (state, action: PayloadAction<CartValueInfos>) => {
      
        const newItem = action.payload;

      const existingItem = state.items.find(item => item.productDetail.id === action.payload.productDetail.id);

      if (existingItem) {
        // Nếu có rồi, chỉ cần cộng thêm số lượng
        existingItem.quantity += action.payload.quantity;
      } else {
        // Nếu chưa có, thêm sản phẩm mới vào giỏ
        state.cartItems.push(action.payload);
      }

      // Cập nhật tổng số lượng sản phẩm trong giỏ
      state.totalQuantity = state.cartItems.reduce((sum, item) => sum + item.quantity, 0);
    },

    // Cập nhật số lượng sản phẩm trong giỏ
    updateQuantity: (state, action: PayloadAction<{ productDetailId: number, quantity: number }>) => {
      const item = state.cartItems.find(item => item.productDetail.id === action.payload.productDetailId);
      if (item) {
        item.quantity = action.payload.quantity;
      }

      // Cập nhật lại tổng số lượng
      state.totalQuantity = state.cartItems.reduce((sum, item) => sum + item.quantity, 0);
    },

    // Xóa sản phẩm khỏi giỏ hàng
    removeFromCart: (state, action: PayloadAction<number>) => {
      state.cartItems = state.cartItems.filter(item => item.productDetail.id !== action.payload);
      // Cập nhật lại tổng số lượng
      state.totalQuantity = state.cartItems.reduce((sum, item) => sum + item.quantity, 0);
    },

    // Xóa tất cả sản phẩm khỏi giỏ hàng
    clearCart: (state) => {
      state.cartItems = [];
      state.totalQuantity = 0;
    },
  },
});

// Export các actions
export const { addToCart, updateQuantity, removeFromCart, clearCart } = cartSlice.actions;

// Selector để lấy các thông tin giỏ hàng
export const cartItemsSelector = (state: { cart: CartState }) => state.cart.cartItems;
export const totalQuantitySelector = (state: { cart: CartState }) => state.cart.totalQuantity;

export default cartSlice.reducer;
