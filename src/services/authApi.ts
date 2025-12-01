import axios from "axios";

// 1. Base Configuration
const api = axios.create({
  baseURL: "/api/v1",
});

// 2. Type Definitions (Interfaces)
export interface UserCreate {
  email: string;
  password: string;
  name: string;
}

export interface UserResponse {
  id: number;
  email: string;
  name: string;
  avatar_url?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface Token {
  access_token: string;
  token_type: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface Msg {
  msg: string;
}

// 3. API Functions
export const authApi = {
  signup: async (data: UserCreate): Promise<UserResponse> => {
    const response = await api.post<UserResponse>("/auth/signup", data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  },

  login: async (data: LoginCredentials): Promise<Token> => {
    const params = new URLSearchParams();
    params.append("username", data.email);
    params.append("password", data.password);

    const response = await api.post<Token>("/auth/login", params, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    return response.data;
  },

  getMe: async (token: string): Promise<UserResponse> => {
    const response = await api.get<UserResponse>("/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  forgotPassword: async (data: ForgotPasswordRequest): Promise<Msg> => {
    const response = await api.post<Msg>("/auth/forgot-password", data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  },
};

export default authApi;
