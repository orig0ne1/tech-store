"use client";

import Link from "next/link";
import { Minus, Plus, ShoppingCart, Trash2, X } from "lucide-react";
import { useCart } from "@/context/CartProvider";
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

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40"
      role="dialog"
      aria-modal="true"
      aria-label="Корзина"
      onClick={closeCart}
    >
      <aside
        className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-card shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            <ShoppingCart className="size-5" />
            Корзина
          </h2>
          <button
            type="button"
            onClick={closeCart}
            aria-label="Закрыть корзину"
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
            <p className="font-medium">Корзина пуста</p>
            <p className="text-sm text-muted-foreground">
              Добавьте товары из каталога, чтобы оформить заказ
            </p>
            <Link
              href="/products"
              onClick={closeCart}
              className="mt-2 inline-flex h-11 items-center justify-center rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground transition-all hover:brightness-110"
            >
              Перейти в каталог
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
                      {formatPrice(item.price, item.currency)}
                    </span>
                    <div className="mt-auto flex items-center gap-3">
                      <div className="inline-flex items-center rounded-lg border border-border">
                        <button
                          type="button"
                          aria-label="Уменьшить количество"
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
                          aria-label="Увеличить количество"
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
                        aria-label="Удалить товар"
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
                  Итого (оценка)
                </span>
                <span className="text-lg font-bold">
                  {formatPrice(subtotal, items[0].currency)}
                </span>
              </div>
              <Link
                href="/orders"
                onClick={closeCart}
                className="inline-flex h-12 w-full items-center justify-center rounded-lg bg-primary text-sm font-medium text-primary-foreground transition-all hover:brightness-110"
              >
                Оформить заказ
              </Link>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
