import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface WishlistProduct {
  _id: string;
  name: string;
  slug: string;
  images: string[];
  price: number;
  comparePrice?: number;
  stock: number;
  averageRating?: number;
}

interface RecentlyViewedProduct {
  _id: string;
  name: string;
  slug: string;
  images: string[];
  price: number;
  comparePrice?: number;
}

interface WishlistState {
  items: WishlistProduct[];
  recentlyViewed: RecentlyViewedProduct[];
  isLoading: boolean;
  error: string | null;
}

const initialState: WishlistState = {
  items: [],
  recentlyViewed: [],
  isLoading: false,
  error: null,
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    setWishlist: (state, action: PayloadAction<WishlistProduct[]>) => {
      state.items = action.payload;
    },
    addToWishlist: (state, action: PayloadAction<WishlistProduct>) => {
      const exists = state.items.find(item => item._id === action.payload._id);
      if (!exists) {
        state.items.push(action.payload);
      }
    },
    removeFromWishlist: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item._id !== action.payload);
    },
    setRecentlyViewed: (state, action: PayloadAction<RecentlyViewedProduct[]>) => {
      state.recentlyViewed = action.payload;
    },
    addToRecentlyViewed: (state, action: PayloadAction<RecentlyViewedProduct>) => {
      // Remove if exists, then add to beginning
      state.recentlyViewed = state.recentlyViewed.filter(item => item._id !== action.payload._id);
      state.recentlyViewed.unshift(action.payload);
      // Keep only last 20
      if (state.recentlyViewed.length > 20) {
        state.recentlyViewed = state.recentlyViewed.slice(0, 20);
      }
    },
    setWishlistLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setWishlistError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearWishlist: (state) => {
      state.items = [];
      state.recentlyViewed = [];
      state.error = null;
    },
  },
});

export const {
  setWishlist,
  addToWishlist,
  removeFromWishlist,
  setRecentlyViewed,
  addToRecentlyViewed,
  setWishlistLoading,
  setWishlistError,
  clearWishlist,
} = wishlistSlice.actions;

export default wishlistSlice.reducer;
