"use client";

import { ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartProvider";
import { useLocale } from "@/context/LocaleProvider";
import type { ProductSummary } from "@/types/product";

interface AddToCartButtonProps {
  product: ProductSummary;
  label?: string;
  size?: "md" | "lg";
  className?: string;
}

export function AddToCartButton({
  product,
  label,
  size = "md",
  className = "",
}: AddToCartButtonProps) {
  const { addItem, openCart } = useCart();
  const { t } = useLocale();
  const resolvedLabel = label ?? t.common.addToCart;
  const height = size === "lg" ? "h-12 px-7 text-base" : "h-11 px-5 text-sm";

  return (
    <button
      type="button"
      onClick={() => {
        addItem({
          productId: product.id,
          name: product.name,
          slug: product.slug,
          price: product.price,
          currency: product.currency,
          image: product.image,
        });
        openCart();
      }}
      className={`glass-primary inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all active:scale-[0.98] ${height} ${className}`}
    >
      <ShoppingCart className="size-4" />
      {resolvedLabel}
    </button>
  );
}
