import client from "./api";
import type { PageResponse } from "@/types/api";
import type { Product, ProductSummary } from "@/types/product";
import { stripUndefined } from "./utils";

export interface ProductQuery {
  page?: number;
  size?: number;
  search?: string;
  category?: string;
  sort?: string;
}

export async function getProducts(
  query: ProductQuery = {}
): Promise<PageResponse<ProductSummary>> {
  const params = stripUndefined(query);
  const { data } = await client.get<PageResponse<ProductSummary>>("/products", {
    params,
  });
  return data;
}

export async function getProduct(slug: string): Promise<Product> {
  const { data } = await client.get<Product>(`/products/${slug}`);
  return data;
}

export async function getRelatedProducts(
  slug: string
): Promise<ProductSummary[]> {
  const { data } = await client.get<ProductSummary[]>(`/products/${slug}/related`);
  return data;
}

export async function getProductAvailability(slug: string): Promise<boolean> {
  const { data } = await client.get<{ available: boolean }>(
    `/products/${slug}/availability`
  );
  return data.available;
}
