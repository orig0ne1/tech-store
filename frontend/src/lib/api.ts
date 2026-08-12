import axios, { AxiosError } from "axios";
import type { ErrorResponse } from "@/types/api";
import type { Dictionary } from "@/lib/i18n";

export const API_URL: string =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";

export class ApiError extends Error {
  status: number;
  code: string;
  path?: string;

  constructor(status: number, code: string, message: string, path?: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.path = path;
  }
}

export function getErrorMessage(error: unknown, t: Dictionary): string {
  if (error instanceof ApiError) {
    return t.errors[error.code as keyof typeof t.errors] ?? error.message;
  }
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return t.errors.UNEXPECTED;
}

const client = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

client.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ErrorResponse>) => {
    if (error.response?.data) {
      const { status, code, message, path } = error.response.data;
      return Promise.reject(new ApiError(status, code, message, path));
    }
    if (error.code === "ECONNABORTED") {
      return Promise.reject(new ApiError(408, "TIMEOUT", ""));
    }
    return Promise.reject(
      new ApiError(
        error.response?.status ?? 0,
        "NETWORK_ERROR",
        ""
      )
    );
  }
);

export default client;
