import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Review {
  _id: string;
  product: string;
  user: {
    _id: string;
    name: string;
  };
  rating: number;
  comment: string;
  isVerifiedPurchase: boolean;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  updatedAt: string;
}

interface ReviewState {
  reviews: Review[];
  productReviews: Review[];
  userReviews: Review[];
  isLoading: boolean;
  error: string | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalReviews: number;
  };
}

const initialState: ReviewState = {
  reviews: [],
  productReviews: [],
  userReviews: [],
  isLoading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalReviews: 0,
  },
};

const reviewSlice = createSlice({
  name: 'review',
  initialState,
  reducers: {
    setReviews: (state, action: PayloadAction<{ reviews: Review[]; pagination: typeof initialState.pagination }>) => {
      state.reviews = action.payload.reviews;
      state.pagination = action.payload.pagination;
    },
    setProductReviews: (state, action: PayloadAction<{ reviews: Review[]; pagination: typeof initialState.pagination }>) => {
      state.productReviews = action.payload.reviews;
      state.pagination = action.payload.pagination;
    },
    setUserReviews: (state, action: PayloadAction<Review[]>) => {
      state.userReviews = action.payload;
    },
    addReview: (state, action: PayloadAction<Review>) => {
      state.productReviews.unshift(action.payload);
      state.userReviews.unshift(action.payload);
    },
    updateReview: (state, action: PayloadAction<Review>) => {
      const updateInArray = (array: Review[]) => {
        const index = array.findIndex(r => r._id === action.payload._id);
        if (index !== -1) {
          array[index] = action.payload;
        }
      };
      updateInArray(state.reviews);
      updateInArray(state.productReviews);
      updateInArray(state.userReviews);
    },
    deleteReview: (state, action: PayloadAction<string>) => {
      state.reviews = state.reviews.filter(r => r._id !== action.payload);
      state.productReviews = state.productReviews.filter(r => r._id !== action.payload);
      state.userReviews = state.userReviews.filter(r => r._id !== action.payload);
    },
    setReviewLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setReviewError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setReviews,
  setProductReviews,
  setUserReviews,
  addReview,
  updateReview,
  deleteReview,
  setReviewLoading,
  setReviewError,
} = reviewSlice.actions;

export default reviewSlice.reducer;
