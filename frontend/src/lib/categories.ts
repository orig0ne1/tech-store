import client from "./api";
import type { PageResponse } from "@/types/api";
import type { Category } from "@/types/category";
import type { ProductSummary } from "@/types/product";
import type { ProductQuery } from "./products";
import { stripUndefined } from "./utils";

export async function getCategories(): Promise<Category[]> {
  const { data } = await client.get<Category[]>("/categories");
  return data;
}

export async function getCategory(slug: string): Promise<Category> {
  const { data } = await client.get<Category>(`/categories/${slug}`);
  return data;
}

export async function getCategoryProducts(
  slug: string,
  query: Omit<ProductQuery, "category"> = {}
): Promise<PageResponse<ProductSummary>> {
  const params = stripUndefined(query);
  const { data } = await client.get<PageResponse<ProductSummary>>(
    `/categories/${slug}/products`,
    { params }
  );
  return data;
}
