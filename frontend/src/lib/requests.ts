import client from "./api";

export interface CreateAvailabilityRequestPayload {
  productId: number;
  name: string;
  email: string;
  phone?: string;
}

export async function createAvailabilityRequest(
  payload: CreateAvailabilityRequestPayload
): Promise<{ id: number; status: string }> {
  const { data } = await client.post<{ id: number; status: string }>(
    "/availability-requests",
    payload
  );
  return data;
}

export interface CreateCustomerRequestPayload {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

export async function createCustomerRequest(
  payload: CreateCustomerRequestPayload
): Promise<{ id: number; status: string }> {
  const { data } = await client.post<{ id: number; status: string }>(
    "/requests",
    payload
  );
  return data;
}
