import axios, { AxiosError } from "axios";
import { authStorage } from "@/shared/lib/auth";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://api.jarabiz.com/api",
});

export const LOGIN_PATH = '/auth/v1/login'

api.interceptors.request.use((config) => {
  const token = authStorage.getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const isLoginRequest = error.config?.url?.includes(LOGIN_PATH)
    if (error.response?.status === 401 && !isLoginRequest) {
      authStorage.logout();
    }
    return Promise.reject(error);
  },
);

export interface ApiError {
  code?: string;
  message: string;
  status?: number;
}

/** Normalizes any thrown error into a displayable message. */
export function getApiError(error: unknown): ApiError {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as Partial<ApiError> | undefined;
    return {
      code: data?.code,
      message:
        data?.message ??
        (error.response
          ? "Something went wrong"
          : "Network error. Check your connection."),
      status: error.response?.status,
    };
  }
  return { message: "Something went wrong" };
}
