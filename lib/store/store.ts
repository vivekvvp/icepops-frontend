import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { 
  persistStore, 
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import createWebStorage from 'redux-persist/lib/storage/createWebStorage';
import { api } from '../services/api';
import authReducer from './authSlice';
import cartReducer from './cartSlice';
import wishlistReducer from './wishlistSlice';
import orderReducer from './orderSlice';
import categoryReducer from './categorySlice';
import reviewReducer from './reviewSlice';
import couponReducer from './couponSlice';

// Create a noop storage for server-side rendering
const createNoopStorage = () => {
  return {
    getItem(_key: string) {
      return Promise.resolve(null);
    },
    setItem(_key: string, value: any) {
      return Promise.resolve(value);
    },
    removeItem(_key: string) {
      return Promise.resolve();
    },
  };
};

// Use localStorage only on client side
const storage = typeof window !== 'undefined' 
  ? createWebStorage('local') 
  : createNoopStorage();

// Persist configuration for auth
const authPersistConfig = {
  key: 'auth',
  storage,
  whitelist: ['user', 'accessToken', 'refreshToken', 'isAuthenticated'], // Only persist these fields
};

// Root reducer combining all reducers
const rootReducer = combineReducers({
  [api.reducerPath]: api.reducer,
  auth: persistReducer(authPersistConfig, authReducer),
  cart: cartReducer,
  wishlist: wishlistReducer,
  order: orderReducer,
  category: categoryReducer,
  review: reviewReducer,
  coupon: couponReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(api.middleware),
  devTools: process.env.NODE_ENV !== 'production',
});

// Enable refetchOnFocus and refetchOnReconnect behaviors
setupListeners(store.dispatch);

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
