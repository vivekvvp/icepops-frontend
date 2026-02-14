import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CartItem {
  product: {
    _id: string;
    name: string;
    slug: string;
    images: string[];
    price: number;
    comparePrice?: number;
    stock: number;
  };
  quantity: number;
  selectedVariant?: {
    size?: string;
    color?: string;
    sku?: string;
  };
}

interface CartState {
  items: CartItem[];
  subtotal: number;
  discount: number;
  total: number;
  couponCode?: string;
  isLoading: boolean;
  error: string | null;
}

const initialState: CartState = {
  items: [],
  subtotal: 0,
  discount: 0,
  total: 0,
  couponCode: undefined,
  isLoading: false,
  error: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCart: (state, action: PayloadAction<CartState>) => {
      state.items = action.payload.items;
      state.subtotal = action.payload.subtotal;
      state.discount = action.payload.discount;
      state.total = action.payload.total;
      state.couponCode = action.payload.couponCode;
    },
    setCartLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setCartError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearCart: (state) => {
      state.items = [];
      state.subtotal = 0;
      state.discount = 0;
      state.total = 0;
      state.couponCode = undefined;
      state.error = null;
    },
    updateCartItem: (state, action: PayloadAction<{ productId: string; quantity: number }>) => {
      const item = state.items.find(item => item.product._id === action.payload.productId);
      if (item) {
        item.quantity = action.payload.quantity;
      }
    },
    removeCartItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.product._id !== action.payload);
    },
    applyCoupon: (state, action: PayloadAction<{ code: string; discount: number }>) => {
      state.couponCode = action.payload.code;
      state.discount = action.payload.discount;
      state.total = state.subtotal - action.payload.discount;
    },
    removeCoupon: (state) => {
      state.couponCode = undefined;
      state.discount = 0;
      state.total = state.subtotal;
    },
  },
});

export const {
  setCart,
  setCartLoading,
  setCartError,
  clearCart,
  updateCartItem,
  removeCartItem,
  applyCoupon,
  removeCoupon,
} = cartSlice.actions;

export default cartSlice.reducer;
