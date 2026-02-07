import { apiClient } from './api';

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    profileImage?: string;
  };
  accessToken: string;
}

export const authService = {
  async register(data: RegisterData) {
    const response = await apiClient.post<AuthResponse>('/auth/register', data);
    if (response.data?.accessToken) {
      apiClient.setAuthToken(response.data.accessToken);
    }
    return response;
  },

  async login(data: LoginData) {
    const response = await apiClient.post<AuthResponse>('/auth/login', data);
    if (response.data?.accessToken) {
      apiClient.setAuthToken(response.data.accessToken);
    }
    return response;
  },

  async logout() {
    try {
      await apiClient.post('/auth/logout');
    } finally {
      apiClient.removeAuthToken();
    }
  },

  getCurrentUser() {
    const token = apiClient.getAuthToken();
    return token ? true : false;
  },

  getToken() {
    return apiClient.getAuthToken();
  }
};
