import type { CategoryRef } from "./category";

export interface ProductSummary {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  currency: string;
  image: string;
  available: boolean;
}

export interface Product extends ProductSummary {
  images: string[];
  attributes: Record<string, string>;
  category: CategoryRef;
}
