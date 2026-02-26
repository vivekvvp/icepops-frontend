import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from './store';
import { api } from '../services/api';
import { REHYDRATE } from 'redux-persist';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
  isBlocked?: boolean;
  createdAt?: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  _isRehydrated: boolean;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  _isRehydrated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; accessToken: string; refreshToken?: string }>
    ) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      if (action.payload.refreshToken) {
        state.refreshToken = action.payload.refreshToken;
      }
      state.isAuthenticated = true;
      state.isLoading = false;
      state.error = null;
    },
    updateAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Handle redux-persist rehydration
    builder.addCase(REHYDRATE, (state, action: any) => {
      if (action.payload?.auth) {
        return {
          ...state,
          ...action.payload.auth,
          _isRehydrated: true,
        };
      }
      return {
        ...state,
        _isRehydrated: true,
      };
    });

    // Listen to RTK Query mutations for auth
    builder
      .addMatcher(api.endpoints.login.matchFulfilled, (state, action) => {
        if (action.payload.data) {
          state.user = action.payload.data.user;
          state.accessToken = action.payload.data.accessToken;
          state.isAuthenticated = true;
          state.error = null;
        }
      })
      .addMatcher(api.endpoints.register.matchFulfilled, (state, action) => {
        if (action.payload.data) {
          state.user = action.payload.data.user;
          state.accessToken = action.payload.data.accessToken;
          state.isAuthenticated = true;
          state.error = null;
        }
      })
      .addMatcher(api.endpoints.googleAuth.matchFulfilled, (state, action) => {
        if (action.payload.data) {
          state.user = action.payload.data.user;
          state.accessToken = action.payload.data.accessToken;
          state.isAuthenticated = true;
          state.error = null;
        }
      })
      .addMatcher(api.endpoints.logout.matchFulfilled, (state) => {
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addMatcher(api.endpoints.login.matchRejected, (state, action) => {
        state.error = action.error.message || 'Login failed';
      })
      .addMatcher(api.endpoints.register.matchRejected, (state, action) => {
        state.error = action.error.message || 'Registration failed';
      });
  },
});

export const { 
  setCredentials, 
  updateAccessToken,
  setLoading, 
  setError,
  logout 
} = authSlice.actions;

export default authSlice.reducer;

// Selectors
export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
export const selectAccessToken = (state: RootState) => state.auth.accessToken;
export const selectAuthError = (state: RootState) => state.auth.error;
export const selectAuthLoading = (state: RootState) => state.auth.isLoading;
