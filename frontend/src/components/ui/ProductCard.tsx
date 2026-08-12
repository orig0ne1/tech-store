"use client";

import Link from "next/link";
import { Bell, Eye, ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartProvider";
import { useLocale } from "@/context/LocaleProvider";
import { formatPrice } from "@/lib/utils";
import type { ProductSummary } from "@/types/product";
import { ProductImage } from "./ProductImage";
import { Highlight } from "../product/Highlight";

interface ProductCardProps {
  product: ProductSummary;
  showCategory?: boolean;
  categoryName?: string;
  priority?: boolean;
  highlight?: string;
}

export function ProductCard({
  product,
  showCategory = false,
  categoryName,
  priority = false,
  highlight,
}: ProductCardProps) {
  const { addItem } = useCart();
  const { t, locale } = useLocale();
  const { id, name, slug, price, currency, image, available } = product;

  return (
    <article className="glass-card group flex flex-col overflow-hidden rounded-xl transition-all duration-200 hover:-translate-y-1 hover:shadow-lift">
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
          {available ? t.common.inStock : t.common.outOfStock}
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
            <Highlight text={name} query={highlight} />
          </Link>
        </h3>
        {highlight && (
          <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
            <Highlight text={product.description} query={highlight} />
          </p>
        )}
        <p className="mt-auto pt-2 text-lg font-bold">
          {formatPrice(price, currency, locale)}
        </p>
        <div className="flex gap-2">
          <Link
            href={`/products/${slug}`}
            className="inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-lg glass text-sm font-medium transition-colors hover:bg-muted"
          >
            <Eye className="size-4" />
            {t.common.viewDetails}
          </Link>
          {available ? (
            <button
              type="button"
              onClick={() =>
                addItem({ productId: id, name, slug, price, currency, image })
              }
              className="glass-primary inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-lg text-sm font-medium transition-all active:scale-[0.97]"
            >
              <ShoppingCart className="size-4" />
              {t.common.addToCart}
            </button>
          ) : (
            <Link
              href={`/availability?productId=${id}`}
              className="inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-lg glass text-sm font-medium transition-colors hover:bg-muted"
            >
              <Bell className="size-4" />
              {t.common.notifyMe}
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
