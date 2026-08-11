import client from "./api";
import type { CreateOrderPayload, Order } from "@/types/order";

export async function createOrder(payload: CreateOrderPayload): Promise<Order> {
  const { data } = await client.post<Order>("/orders", payload);
  return data;
}

export async function getOrder(id: string | number): Promise<Order> {
  const { data } = await client.get<Order>(`/orders/${id}`);
  return data;
}

export async function cancelOrder(id: string | number): Promise<Order> {
  const { data } = await client.post<Order>(`/orders/${id}/cancel`);
  return data;
}
