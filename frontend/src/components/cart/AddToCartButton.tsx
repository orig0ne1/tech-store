"use client";

import { ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartProvider";
import type { ProductSummary } from "@/types/product";

interface AddToCartButtonProps {
  product: ProductSummary;
  label?: string;
  size?: "md" | "lg";
  className?: string;
}

export function AddToCartButton({
  product,
  label = "В корзину",
  size = "md",
  className = "",
}: AddToCartButtonProps) {
  const { addItem, openCart } = useCart();
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
      className={`inline-flex items-center justify-center gap-2 rounded-lg bg-primary font-medium text-primary-foreground transition-all hover:brightness-110 ${height} ${className}`}
    >
      <ShoppingCart className="size-4" />
      {label}
    </button>
  );
}
