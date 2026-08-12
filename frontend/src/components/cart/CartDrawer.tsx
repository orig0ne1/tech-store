"use client";

import Link from "next/link";
import { Minus, Plus, ShoppingCart, Trash2, X } from "lucide-react";
import { useCart } from "@/context/CartProvider";
import { useLocale } from "@/context/LocaleProvider";
import { formatPrice } from "@/lib/utils";
import { ProductImage } from "../ui/ProductImage";

export function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    updateQuantity,
    removeItem,
    subtotal,
  } = useCart();
  const { t, locale } = useLocale();

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={t.common.cart}
      onClick={closeCart}
    >
      <aside
        className="glass-strong absolute inset-y-0 right-0 flex w-full max-w-md flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            <ShoppingCart className="size-5" />
            {t.common.cart}
          </h2>
          <button
            type="button"
            onClick={closeCart}
            aria-label={t.common.closeCart}
            className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X className="size-5" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
            <div className="flex size-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <ShoppingCart className="size-7" />
            </div>
            <p className="font-medium">{t.common.cartEmpty}</p>
            <p className="text-sm text-muted-foreground">
              {t.common.cartEmptyHint}
            </p>
            <Link
              href="/products"
              onClick={closeCart}
              className="glass-primary mt-2 inline-flex h-11 items-center justify-center rounded-lg px-5 text-sm font-medium transition-all"
            >
              {t.common.browseCatalog}
            </Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-border overflow-y-auto px-5">
              {items.map((item) => (
                <li key={item.productId} className="flex gap-4 py-4">
                  <Link
                    href={`/products/${item.slug}`}
                    onClick={closeCart}
                    className="relative block size-20 shrink-0 overflow-hidden rounded-lg bg-muted"
                  >
                    <ProductImage src={item.image} alt={item.name} />
                  </Link>
                  <div className="flex flex-1 flex-col">
                    <Link
                      href={`/products/${item.slug}`}
                      onClick={closeCart}
                      className="text-sm font-medium leading-snug hover:text-primary"
                    >
                      {item.name}
                    </Link>
                    <span className="mt-0.5 text-xs text-muted-foreground">
                      {formatPrice(item.price, item.currency, locale)}
                    </span>
                    <div className="mt-auto flex items-center gap-3">
                      <div className="glass inline-flex items-center rounded-lg">
                        <button
                          type="button"
                          aria-label={t.common.decreaseQty}
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity - 1)
                          }
                          className="flex size-8 items-center justify-center text-muted-foreground hover:text-foreground"
                        >
                          <Minus className="size-3.5" />
                        </button>
                        <span className="w-8 text-center text-sm font-medium">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          aria-label={t.common.increaseQty}
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity + 1)
                          }
                          className="flex size-8 items-center justify-center text-muted-foreground hover:text-foreground"
                        >
                          <Plus className="size-3.5" />
                        </button>
                      </div>
                      <button
                        type="button"
                        aria-label={t.common.removeItem}
                        onClick={() => removeItem(item.productId)}
                        className="ml-auto flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-danger/10 hover:text-danger"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="border-t border-border px-5 py-4">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {t.common.totalEstimate}
                </span>
                <span className="text-lg font-bold">
                  {formatPrice(subtotal, items[0].currency, locale)}
                </span>
              </div>
              <Link
                href="/orders"
                onClick={closeCart}
                className="glass-primary inline-flex h-12 w-full items-center justify-center rounded-lg text-sm font-medium transition-all"
              >
                {t.orders.placeOrder}
              </Link>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
