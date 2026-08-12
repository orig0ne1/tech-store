"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { ArrowRight, ShoppingCart } from "lucide-react";
import { z } from "zod";
import { useCart } from "@/context/CartProvider";
import { createOrder } from "@/lib/orders";
import { getErrorMessage } from "@/lib/api";
import { useLocale } from "@/context/LocaleProvider";
import { tpl } from "@/lib/i18n";
import { formatPrice } from "@/lib/utils";
import {
  createCommentSchema,
  createEmailSchema,
  createNameSchema,
  createPhoneSchema,
} from "@/lib/schemas";
import type { Dictionary } from "@/lib/i18n";
import type { Order } from "@/types/order";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { ProductImage } from "../ui/ProductImage";
import { SuccessState } from "../ui/SuccessState";

type OrderFormValues = z.infer<ReturnType<typeof buildSchema>>;

function buildSchema(t: Dictionary) {
  return z.object({
    name: createNameSchema(t),
    email: createEmailSchema(t),
    phone: createPhoneSchema(t),
    comment: createCommentSchema(t),
  });
}

const STATUS_KEYS: Record<string, string> = {
  CREATED: "statusCreated",
  PROCESSED: "statusProcessing",
  COMPLETED: "statusCompleted",
  CANCELLED: "statusCancelled",
};

export function OrderForm() {
  const { items, subtotal, clear } = useCart();
  const { t, locale } = useLocale();
  const orderSchema = useMemo(() => buildSchema(t), [t]);
  const [created, setCreated] = useState<Order | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<OrderFormValues>({
    resolver: zodResolver(orderSchema),
    defaultValues: { name: "", email: "", phone: "", comment: "" },
  });

  const onSubmit = async (values: OrderFormValues) => {
    setServerError(null);
    if (items.length === 0) {
      setServerError(t.orders.cartEmptyError);
      return;
    }
    try {
      const order = await createOrder({
        customer: {
          name: values.name,
          email: values.email,
          phone: values.phone || undefined,
        },
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
        comment: values.comment || undefined,
      });
      setCreated(order);
      clear();
    } catch (error) {
      setServerError(getErrorMessage(error, t));
    }
  };

  if (created) {
    const statusLabel =
      t.orders[STATUS_KEYS[created.status] as keyof typeof t.orders] ??
      created.status;
    return (
      <SuccessState
        title={t.orders.successTitle}
        description={tpl(t.orders.successDescription, {
          number: created.number,
          status: statusLabel,
        })}
        action={
          <Link
            href="/products"
            className="glass-primary inline-flex h-11 items-center justify-center gap-2 rounded-lg px-5 text-sm font-medium transition-all"
          >
            {t.orders.continueShopping}
            <ArrowRight className="size-4" />
          </Link>
        }
      />
    );
  }

  const currency = items[0]?.currency ?? "RUB";

  return (
    <div className="grid gap-8 lg:grid-cols-5">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 lg:col-span-3"
        noValidate
      >
        <Input
          label={t.common.name}
          placeholder={t.common.namePlaceholder}
          autoComplete="name"
          {...register("name")}
          error={errors.name?.message}
        />
        <Input
          label={t.common.email}
          type="email"
          placeholder={t.common.emailPlaceholder}
          autoComplete="email"
          {...register("email")}
          error={errors.email?.message}
        />
        <Input
          label={t.common.phone}
          type="tel"
          placeholder={t.common.phonePlaceholder}
          autoComplete="tel"
          {...register("phone")}
          error={errors.phone?.message}
        />
        <div>
          <label
            htmlFor="order-comment"
            className="mb-1.5 block text-sm font-medium text-foreground"
          >
            {t.common.comment}
          </label>
          <textarea
            id="order-comment"
            rows={3}
            placeholder={t.common.commentPlaceholder}
            className="w-full resize-none rounded-lg border border-border bg-muted/40 px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground backdrop-blur-sm transition-all focus:border-transparent focus:bg-card focus:outline-none focus:ring-2 focus:ring-primary/40"
            {...register("comment")}
          />
          {errors.comment && (
            <p className="mt-1.5 text-xs text-danger">
              {errors.comment.message}
            </p>
          )}
        </div>
        {serverError && (
          <p className="rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">
            {serverError}
          </p>
        )}
        <Button type="submit" size="lg" loading={isSubmitting}>
          {t.orders.placeOrder}
        </Button>
        <p className="text-xs text-muted-foreground">{t.orders.totalNote}</p>
      </form>

      <div className="lg:col-span-2">
        <div className="glass-card rounded-xl p-5">
          <h2 className="mb-4 flex items-center gap-2 font-semibold">
            <ShoppingCart className="size-5" />
            {t.orders.summary}
          </h2>
          {items.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              {t.orders.cartEmpty}{" "}
              <Link href="/products" className="text-primary hover:underline">
                {t.common.browseCatalog}
              </Link>
            </p>
          ) : (
            <>
              <ul className="divide-y divide-border">
                {items.map((item) => (
                  <li key={item.productId} className="flex items-center gap-3 py-3">
                    <div className="relative block size-14 shrink-0 overflow-hidden rounded-lg bg-muted">
                      <ProductImage src={item.image} alt={item.name} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{item.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.quantity} ×{" "}
                        {formatPrice(item.price, item.currency, locale)}
                      </p>
                    </div>
                    <span className="text-sm font-semibold">
                      {formatPrice(item.price * item.quantity, item.currency, locale)}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
                <span className="text-sm text-muted-foreground">
                  {t.common.totalEstimate}
                </span>
                <span className="text-lg font-bold">
                  {formatPrice(subtotal, currency, locale)}
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
