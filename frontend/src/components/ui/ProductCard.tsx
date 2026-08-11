"use client";

import Link from "next/link";
import { Bell, Eye, ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartProvider";
import { formatPrice } from "@/lib/utils";
import type { ProductSummary } from "@/types/product";
import { ProductImage } from "./ProductImage";

interface ProductCardProps {
  product: ProductSummary;
  showCategory?: boolean;
  categoryName?: string;
  priority?: boolean;
}

export function ProductCard({
  product,
  showCategory = false,
  categoryName,
  priority = false,
}: ProductCardProps) {
  const { addItem } = useCart();
  const { id, name, slug, price, currency, image, available } = product;

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <Link
        href={`/products/${slug}`}
        className="relative block aspect-square w-full overflow-hidden bg-muted"
        aria-label={name}
      >
        <ProductImage
          src={image}
          alt={name}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          priority={priority}
          imageClassName="transition-transform duration-300 group-hover:scale-105"
        />
        <span
          className={`absolute left-3 top-3 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${
            available
              ? "bg-success/10 text-success"
              : "bg-muted text-muted-foreground"
          }`}
        >
          <span
            className={`size-1.5 rounded-full ${
              available ? "bg-success" : "bg-muted-foreground"
            }`}
          />
          {available ? "В наличии" : "Нет в наличии"}
        </span>
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-4">
        {showCategory && categoryName && (
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            {categoryName}
          </p>
        )}
        <h3 className="line-clamp-2 text-sm font-semibold leading-snug">
          <Link
            href={`/products/${slug}`}
            className="transition-colors hover:text-primary"
          >
            {name}
          </Link>
        </h3>
        <p className="mt-auto pt-2 text-lg font-bold">
          {formatPrice(price, currency)}
        </p>
        <div className="flex gap-2">
          <Link
            href={`/products/${slug}`}
            className="inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-lg border border-border bg-transparent text-sm font-medium transition-colors hover:bg-muted"
          >
            <Eye className="size-4" />
            Подробнее
          </Link>
          {available ? (
            <button
              type="button"
              onClick={() =>
                addItem({ productId: id, name, slug, price, currency, image })
              }
              className="inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-lg bg-primary text-sm font-medium text-primary-foreground transition-all hover:brightness-110"
            >
              <ShoppingCart className="size-4" />
              В корзину
            </button>
          ) : (
            <Link
              href={`/availability?productId=${id}`}
              className="inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-lg bg-accent text-sm font-medium text-foreground transition-colors hover:bg-border"
            >
              <Bell className="size-4" />
              Сообщить о поступлении
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
