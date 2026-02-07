import { api } from './api';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  profileImage?: string;
  phone?: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation<AuthResponse, RegisterRequest>({
      query: (credentials) => ({
        url: '/auth/register',
        method: 'POST',
        body: credentials,
      }),
      transformResponse: (response: { data: AuthResponse }) => response.data,
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          // Store token in localStorage
          if (data.accessToken) {
            localStorage.setItem('accessToken', data.accessToken);
          }
        } catch (error) {
          // Handle error
        }
      },
      invalidatesTags: ['Auth'],
    }),
    
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      transformResponse: (response: { data: AuthResponse }) => response.data,
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          // Store token in localStorage
          if (data.accessToken) {
            localStorage.setItem('accessToken', data.accessToken);
          }
        } catch (error) {
          // Handle error
        }
      },
      invalidatesTags: ['Auth'],
    }),
    
    logout: builder.mutation<void, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } finally {
          // Always remove token on logout
          localStorage.removeItem('accessToken');
        }
      },
      invalidatesTags: ['Auth', 'User'],
    }),
    
    getCurrentUser: builder.query<User, void>({
      query: () => '/auth/me',
      transformResponse: (response: { data: User }) => response.data,
      providesTags: ['User'],
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
  useGetCurrentUserQuery,
} = authApi;
