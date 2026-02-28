import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';
import type { RootState } from '../store/store';
import { logout } from '../store/authSlice';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const baseQuery = fetchBaseQuery({
  baseUrl: API_URL,
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    // Get token from Redux state
    const token = (getState() as RootState).auth.accessToken;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);

  // On 401, simply log out — no silent refresh
  if (result.error && result.error.status === 401) {
    api.dispatch(logout());
  }

  return result;
};

export const api = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['User', 'Product', 'Auth', 'Cart', 'Wishlist', 'Order', 'Category', 'Review', 'Coupon', 'Address', 'Dashboard'],
  endpoints: (builder) => ({
    // AUTH ENDPOINTS
    login: builder.mutation({
      query: (credentials) => ({ url: '/auth/login', method: 'POST', body: credentials }),
      invalidatesTags: ['Auth', 'User'],
    }),
    register: builder.mutation({
      query: (userData) => ({ url: '/auth/register', method: 'POST', body: userData }),
      invalidatesTags: ['Auth', 'User'],
    }),
    logout: builder.mutation<any, void>({
      query: () => ({ url: '/auth/logout', method: 'POST' }),
      invalidatesTags: ['Auth', 'User', 'Cart', 'Wishlist', 'Order'],
    }),
    googleAuth: builder.mutation({
      query: (token) => ({ url: '/auth/google', method: 'POST', body: { token } }),
      invalidatesTags: ['Auth', 'User'],
    }),
    forgotPassword: builder.mutation({
      query: (email) => ({ url: '/auth/forgot-password', method: 'POST', body: { email } }),
    }),
    resetPassword: builder.mutation({
      query: ({ token, newPassword }) => ({ url: '/auth/reset-password', method: 'POST', body: { token, newPassword } }),
    }),
    changePassword: builder.mutation({
      query: (passwords) => ({ url: '/auth/change-password', method: 'POST', body: passwords }),
    }),
    getProfile: builder.query({
      query: () => '/users/profile',
      providesTags: ['User'],
    }),

    // PRODUCT ENDPOINTS
    getProducts: builder.query({
      query: (params) => ({ url: '/products', params }),
      providesTags: ['Product'],
    }),
    getProductById: builder.query({
      query: (id) => `/products/${id}`,
      providesTags: (result, error, id) => [{ type: 'Product', id }],
    }),
    createProduct: builder.mutation({
      query: (product) => ({ url: '/products', method: 'POST', body: product }),
      invalidatesTags: ['Product'],
    }),
    updateProduct: builder.mutation({
      query: ({ id, ...product }) => ({ url: `/products/${id}`, method: 'PUT', body: product }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Product', id }, 'Product'],
    }),
    deleteProduct: builder.mutation({
      query: (id) => ({ url: `/products/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Product'],
    }),
    getLatestProducts: builder.query({
      query: () => '/products/latest',
      providesTags: ['Product'],
    }),
    getFeaturedProducts: builder.query({
      query: () => '/products/featured',
      providesTags: ['Product'],
    }),
    getRelatedProducts: builder.query({
      query: (id) => `/products/${id}/related`,
      providesTags: ['Product'],
    }),

    // CART ENDPOINTS
    getCart: builder.query({
      query: () => '/cart',
      providesTags: ['Cart'],
    }),
    addToCart: builder.mutation({
      query: (item) => ({ url: '/cart', method: 'POST', body: item }),
      invalidatesTags: ['Cart'],
    }),
    updateCartItem: builder.mutation({
      query: ({ productId, quantity }) => ({ url: `/cart/${productId}`, method: 'PUT', body: { quantity } }),
      invalidatesTags: ['Cart'],
    }),
    removeFromCart: builder.mutation({
      query: (productId) => ({ url: `/cart/${productId}`, method: 'DELETE' }),
      invalidatesTags: ['Cart'],
    }),
    clearCart: builder.mutation({
      query: () => ({ url: '/cart', method: 'DELETE' }),
      invalidatesTags: ['Cart'],
    }),
    applyCoupon: builder.mutation({
      query: (couponCode) => ({ url: '/cart/coupon', method: 'POST', body: { couponCode } }),
      invalidatesTags: ['Cart'],
    }),
    removeCoupon: builder.mutation({
      query: () => ({ url: '/cart/coupon', method: 'DELETE' }),
      invalidatesTags: ['Cart'],
    }),

    // WISHLIST ENDPOINTS
    getWishlist: builder.query({
      query: () => '/wishlist',
      providesTags: ['Wishlist'],
    }),
    addToWishlist: builder.mutation({
      query: (productId) => ({ url: `/wishlist/${productId}`, method: 'POST' }),
      invalidatesTags: ['Wishlist'],
    }),
    removeFromWishlist: builder.mutation({
      query: (productId) => ({ url: `/wishlist/${productId}`, method: 'DELETE' }),
      invalidatesTags: ['Wishlist'],
    }),
    getRecentlyViewed: builder.query({
      query: () => '/wishlist/recently-viewed',
      providesTags: ['Wishlist'],
    }),
    addToRecentlyViewed: builder.mutation({
      query: (productId) => ({ url: `/wishlist/recently-viewed/${productId}`, method: 'POST' }),
      invalidatesTags: ['Wishlist'],
    }),

    // ORDER ENDPOINTS
    createOrder: builder.mutation({
      query: (orderData) => ({ url: '/orders', method: 'POST', body: orderData }),
      invalidatesTags: ['Order', 'Cart'],
    }),
    getUserOrders: builder.query({
      query: (params) => ({ url: '/orders/my-orders', params }),
      providesTags: ['Order'],
    }),
    getOrderById: builder.query({
      query: (id) => `/orders/${id}`,
      providesTags: (result, error, id) => [{ type: 'Order', id }],
    }),
    cancelOrder: builder.mutation({
      query: (id) => ({ url: `/orders/${id}/cancel`, method: 'PATCH' }),
      invalidatesTags: (result, error, id) => [{ type: 'Order', id }, 'Order'],
    }),
    getAllOrders: builder.query({
      query: (params) => ({ url: '/orders/all', params }),
      providesTags: ['Order'],
    }),
    updateOrderStatus: builder.mutation({
      query: ({ id, status, trackingNumber }) => ({ url: `/orders/${id}/status`, method: 'PATCH', body: { status, trackingNumber } }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Order', id }, 'Order', 'Dashboard'],
    }),
    getOrderStats: builder.query({
      query: () => '/orders/admin/stats',
      providesTags: ['Dashboard'],
    }),

    // CATEGORY ENDPOINTS
    getAllCategories: builder.query({
      query: (includeInactive) => ({ url: '/categories', params: { includeInactive } }),
      providesTags: ['Category'],
    }),
    getCategoryTree: builder.query({
      query: () => '/categories/tree',
      providesTags: ['Category'],
    }),
    getCategoryById: builder.query({
      query: (id) => `/categories/${id}`,
      providesTags: (result, error, id) => [{ type: 'Category', id }],
    }),
    getCategoryBySlug: builder.query({
      query: (slug) => `/categories/slug/${slug}`,
      providesTags: ['Category'],
    }),
    createCategory: builder.mutation({
      query: (category) => ({ url: '/categories', method: 'POST', body: category }),
      invalidatesTags: ['Category'],
    }),
    updateCategory: builder.mutation({
      query: ({ id, ...category }) => ({ url: `/categories/${id}`, method: 'PUT', body: category }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Category', id }, 'Category'],
    }),
    deleteCategory: builder.mutation({
      query: (id) => ({ url: `/categories/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Category'],
    }),

    // REVIEW ENDPOINTS
    getProductReviews: builder.query({
      query: ({ productId, ...params }) => ({ url: `/reviews/product/${productId}`, params }),
      providesTags: ['Review'],
    }),
    createReview: builder.mutation({
      query: (review) => ({ url: '/reviews', method: 'POST', body: review }),
      invalidatesTags: ['Review', 'Product'],
    }),
    updateReview: builder.mutation({
      query: ({ id, ...review }) => ({ url: `/reviews/${id}`, method: 'PUT', body: review }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Review', id }, 'Review'],
    }),
    deleteReview: builder.mutation({
      query: (id) => ({ url: `/reviews/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Review', 'Product'],
    }),
    getUserReviews: builder.query({
      query: () => '/reviews/user',
      providesTags: ['Review'],
    }),
    getAllReviews: builder.query({
      query: (params) => ({ url: '/reviews/all', params }),
      providesTags: ['Review'],
    }),
    moderateReview: builder.mutation({
      query: ({ id, status }) => ({ url: `/reviews/${id}/moderate`, method: 'PATCH', body: { status } }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Review', id }, 'Review', 'Product'],
    }),
    deleteReviewAdmin: builder.mutation({
      query: (id) => ({ url: `/reviews/${id}/admin`, method: 'DELETE' }),
      invalidatesTags: ['Review', 'Product'],
    }),

    // COUPON ENDPOINTS
    getActiveCoupons: builder.query({
      query: () => '/coupons/active',
      providesTags: ['Coupon'],
    }),
    validateCoupon: builder.mutation({
      query: ({ code, cartTotal }) => ({ url: '/coupons/validate', method: 'POST', body: { code, cartTotal } }),
    }),
    getAllCoupons: builder.query({
      query: (params) => ({ url: '/coupons', params }),
      providesTags: ['Coupon'],
    }),
    getCouponById: builder.query({
      query: (id) => `/coupons/${id}`,
      providesTags: (result, error, id) => [{ type: 'Coupon', id }],
    }),
    createCoupon: builder.mutation({
      query: (coupon) => ({ url: '/coupons', method: 'POST', body: coupon }),
      invalidatesTags: ['Coupon'],
    }),
    updateCoupon: builder.mutation({
      query: ({ id, ...coupon }) => ({ url: `/coupons/${id}`, method: 'PUT', body: coupon }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Coupon', id }, 'Coupon'],
    }),
    deleteCoupon: builder.mutation({
      query: (id) => ({ url: `/coupons/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Coupon'],
    }),
    toggleCouponStatus: builder.mutation({
      query: (id) => ({ url: `/coupons/${id}/toggle-status`, method: 'PATCH' }),
      invalidatesTags: (result, error, id) => [{ type: 'Coupon', id }, 'Coupon'],
    }),

    // ADDRESS ENDPOINTS
    getAllAddresses: builder.query({
      query: () => '/addresses',
      providesTags: ['Address'],
    }),
    getAddressById: builder.query({
      query: (id) => `/addresses/${id}`,
      providesTags: (result, error, id) => [{ type: 'Address', id }],
    }),
    createAddress: builder.mutation({
      query: (address) => ({ url: '/addresses', method: 'POST', body: address }),
      invalidatesTags: ['Address'],
    }),
    updateAddress: builder.mutation({
      query: ({ id, ...address }) => ({ url: `/addresses/${id}`, method: 'PUT', body: address }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Address', id }, 'Address'],
    }),
    deleteAddress: builder.mutation({
      query: (id) => ({ url: `/addresses/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Address'],
    }),
    setDefaultAddress: builder.mutation({
      query: (id) => ({ url: `/addresses/${id}/default`, method: 'PATCH' }),
      invalidatesTags: ['Address'],
    }),

    // DASHBOARD & ADMIN ENDPOINTS
    getDashboardStats: builder.query({
      query: () => '/dashboard/stats',
      providesTags: ['Dashboard'],
    }),
    getRevenueChart: builder.query({
      query: (period) => ({ url: '/dashboard/revenue', params: { period } }),
      providesTags: ['Dashboard'],
    }),
    getTopProducts: builder.query({
      query: (limit) => ({ url: '/dashboard/top-products', params: { limit } }),
      providesTags: ['Dashboard'],
    }),
    getLowStockProducts: builder.query({
      query: (threshold) => ({ url: '/dashboard/low-stock', params: { threshold } }),
      providesTags: ['Product', 'Dashboard'],
    }),
    getAllUsers: builder.query({
      query: (params) => ({ url: '/users', params }),
      providesTags: ['User'],
    }),
    getUserById: builder.query({
      query: (id) => `/users/${id}`,
      providesTags: (result, error, id) => [{ type: 'User', id }],
    }),
    toggleBlockUser: builder.mutation({
      query: (id) => ({ url: `/users/${id}/block`, method: 'PATCH' }),
      invalidatesTags: (result, error, id) => [{ type: 'User', id }, 'User'],
    }),
    getUserOrdersByUserId: builder.query({
      query: (userId) => `/users/${userId}/orders`,
      providesTags: ['Order'],
    }),
  }),
});

// Export hooks for usage in components
export const {
  // Auth
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useGoogleAuthMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useChangePasswordMutation,
  useGetProfileQuery,
  // Products
  useGetProductsQuery,
  useGetProductByIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetLatestProductsQuery,
  useGetFeaturedProductsQuery,
  useGetRelatedProductsQuery,
  // Cart
  useGetCartQuery,
  useAddToCartMutation,
  useUpdateCartItemMutation,
  useRemoveFromCartMutation,
  useClearCartMutation,
  useApplyCouponMutation,
  useRemoveCouponMutation,
  // Wishlist
  useGetWishlistQuery,
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
  useGetRecentlyViewedQuery,
  useAddToRecentlyViewedMutation,
  // Orders
  useCreateOrderMutation,
  useGetUserOrdersQuery,
  useGetUserOrdersByUserIdQuery,
  useGetOrderByIdQuery,
  useCancelOrderMutation,
  useGetAllOrdersQuery,
  useUpdateOrderStatusMutation,
  useGetOrderStatsQuery,
  // Categories
  useGetAllCategoriesQuery,
  useGetCategoryTreeQuery,
  useGetCategoryByIdQuery,
  useGetCategoryBySlugQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  // Reviews
  useGetProductReviewsQuery,
  useCreateReviewMutation,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
  useGetUserReviewsQuery,
  useGetAllReviewsQuery,
  useModerateReviewMutation,
  useDeleteReviewAdminMutation,
  // Coupons
  useGetActiveCouponsQuery,
  useValidateCouponMutation,
  useGetAllCouponsQuery,
  useGetCouponByIdQuery,
  useCreateCouponMutation,
  useUpdateCouponMutation,
  useDeleteCouponMutation,
  useToggleCouponStatusMutation,
  // Address
  useGetAllAddressesQuery,
  useGetAddressByIdQuery,
  useCreateAddressMutation,
  useUpdateAddressMutation,
  useDeleteAddressMutation,
  useSetDefaultAddressMutation,
  // Dashboard & Admin
  useGetDashboardStatsQuery,
  useGetRevenueChartQuery,
  useGetTopProductsQuery,
  useGetLowStockProductsQuery,
  useGetAllUsersQuery,
  useGetUserByIdQuery,
  useToggleBlockUserMutation,
} = api;
