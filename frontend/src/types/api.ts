export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface ErrorResponse {
  timestamp: string;
  status: number;
  code: string;
  message: string;
  path: string;
}

export type SortField = "id" | "name" | "price" | "createdAt";
export type SortDirection = "asc" | "desc";

export interface SortOption {
  label: string;
  value: string;
}
