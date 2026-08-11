import axios, { AxiosError } from "axios";
import type { ErrorResponse } from "@/types/api";

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

const CLIENT_ERROR_MESSAGES: Record<string, string> = {
  PRODUCT_NOT_FOUND: "Товар не найден",
  CATEGORY_NOT_FOUND: "Категория не найдена",
  ORDER_NOT_FOUND: "Заказ не найден",
  CHAT_NOT_FOUND: "Чат не найден",
  AVAILABILITY_REQUEST_NOT_FOUND: "Заявка не найдена",
  CUSTOMER_REQUEST_NOT_FOUND: "Заявка не найдена",
  ORDER_ALREADY_CANCELLED: "Заказ уже отменён",
  INVALID_SORT: "Недопустимая сортировка",
  VALIDATION_ERROR: "Проверьте правильность заполнения формы",
  BAD_REQUEST: "Некорректный запрос",
  NOT_FOUND: "Не найдено",
  CONFLICT: "Конфликт данных",
  INTERNAL_ERROR: "Произошла ошибка на сервере",
};

export function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    return CLIENT_ERROR_MESSAGES[error.code] ?? error.message;
  }
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return "Произошла непредвиденная ошибка";
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
      return Promise.reject(
        new ApiError(408, "TIMEOUT", "Сервер не ответил вовремя")
      );
    }
    return Promise.reject(
      new ApiError(
        error.response?.status ?? 0,
        "NETWORK_ERROR",
        "Не удалось связаться с сервером"
      )
    );
  }
);

export default client;
