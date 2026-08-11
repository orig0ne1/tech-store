export type OrderStatus =
  | "CREATED"
  | "PROCESSED"
  | "COMPLETED"
  | "CANCELLED";

export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: number;
  number: string;
  status: OrderStatus;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  comment: string;
  total: number;
  createdAt: string;
  items: OrderItem[];
}

export interface CreateOrderCustomer {
  name: string;
  email: string;
  phone?: string;
}

export interface CreateOrderItem {
  productId: number;
  quantity: number;
}

export interface CreateOrderPayload {
  customer: CreateOrderCustomer;
  items: CreateOrderItem[];
  comment?: string;
}
