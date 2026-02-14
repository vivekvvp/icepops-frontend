import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Coupon {
  _id: string;
  code: string;
  description: string;
  discountType: 'PERCENTAGE' | 'FIXED';
  discountValue: number;
  minCartValue?: number;
  maxDiscount?: number;
  startDate: string;
  expiryDate: string;
  usageLimit?: number;
  usedCount: number;
  isActive: boolean;
  applicableTo: 'ALL' | 'CATEGORY' | 'PRODUCT';
  applicableCategories?: string[];
  applicableProducts?: string[];
}

interface CouponState {
  coupons: Coupon[];
  activeCoupons: Coupon[];
  appliedCoupon: Coupon | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: CouponState = {
  coupons: [],
  activeCoupons: [],
  appliedCoupon: null,
  isLoading: false,
  error: null,
};

const couponSlice = createSlice({
  name: 'coupon',
  initialState,
  reducers: {
    setCoupons: (state, action: PayloadAction<Coupon[]>) => {
      state.coupons = action.payload;
    },
    setActiveCoupons: (state, action: PayloadAction<Coupon[]>) => {
      state.activeCoupons = action.payload;
    },
    setAppliedCoupon: (state, action: PayloadAction<Coupon | null>) => {
      state.appliedCoupon = action.payload;
    },
    addCoupon: (state, action: PayloadAction<Coupon>) => {
      state.coupons.push(action.payload);
    },
    updateCoupon: (state, action: PayloadAction<Coupon>) => {
      const index = state.coupons.findIndex(c => c._id === action.payload._id);
      if (index !== -1) {
        state.coupons[index] = action.payload;
      }
    },
    deleteCoupon: (state, action: PayloadAction<string>) => {
      state.coupons = state.coupons.filter(c => c._id !== action.payload);
    },
    setCouponLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setCouponError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setCoupons,
  setActiveCoupons,
  setAppliedCoupon,
  addCoupon,
  updateCoupon,
  deleteCoupon,
  setCouponLoading,
  setCouponError,
} = couponSlice.actions;

export default couponSlice.reducer;
