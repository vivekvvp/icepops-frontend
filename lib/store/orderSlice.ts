import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface OrderItem {
  product: {
    _id: string;
    name: string;
    slug: string;
    images: string[];
  };
  quantity: number;
  price: number;
  selectedVariant?: {
    size?: string;
    color?: string;
  };
}

interface Order {
  _id: string;
  orderNumber: string;
  user: string;
  items: OrderItem[];
  shippingAddress: {
    fullName: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    pinCode: string;
    country: string;
  };
  billingAddress: {
    fullName: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    pinCode: string;
    country: string;
  };
  paymentMethod: 'COD' | 'ONLINE' | 'CARD' | 'UPI' | 'NETBANKING' | 'WALLET';
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
  orderStatus: 'PENDING' | 'CONFIRMED' | 'PACKED' | 'SHIPPED' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED';
  subtotal: number;
  discount: number;
  shippingCharges: number;
  tax: number;
  total: number;
  couponCode?: string;
  createdAt: string;
  updatedAt: string;
}

interface OrderState {
  orders: Order[];
  currentOrder: Order | null;
  isLoading: boolean;
  error: string | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalOrders: number;
  };
}

const initialState: OrderState = {
  orders: [],
  currentOrder: null,
  isLoading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalOrders: 0,
  },
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    setOrders: (state, action: PayloadAction<{ orders: Order[]; pagination: typeof initialState.pagination }>) => {
      state.orders = action.payload.orders;
      state.pagination = action.payload.pagination;
    },
    setCurrentOrder: (state, action: PayloadAction<Order | null>) => {
      state.currentOrder = action.payload;
    },
    addOrder: (state, action: PayloadAction<Order>) => {
      state.orders.unshift(action.payload);
    },
    updateOrderStatus: (state, action: PayloadAction<{ orderId: string; status: Order['orderStatus'] }>) => {
      const order = state.orders.find(o => o._id === action.payload.orderId);
      if (order) {
        order.orderStatus = action.payload.status;
      }
      if (state.currentOrder && state.currentOrder._id === action.payload.orderId) {
        state.currentOrder.orderStatus = action.payload.status;
      }
    },
    setOrderLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setOrderError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearOrders: (state) => {
      state.orders = [];
      state.currentOrder = null;
      state.error = null;
      state.pagination = initialState.pagination;
    },
  },
});

export const {
  setOrders,
  setCurrentOrder,
  addOrder,
  updateOrderStatus,
  setOrderLoading,
  setOrderError,
  clearOrders,
} = orderSlice.actions;

export default orderSlice.reducer;
