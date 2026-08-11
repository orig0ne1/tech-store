"use client";

import { ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartProvider";

export function CartButton() {
  const { count, openCart } = useCart();

  return (
    <button
      type="button"
      onClick={openCart}
      aria-label={`Корзина, товаров: ${count}`}
      className="relative inline-flex size-10 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-muted"
    >
      <ShoppingCart className="size-5" />
      {count > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-xs font-semibold text-primary-foreground">
          {count}
        </span>
      )}
    </button>
  );
}
