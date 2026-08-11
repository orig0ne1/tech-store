import type { Metadata } from "next";
import { ShoppingBag } from "lucide-react";
import { OrderForm } from "@/components/forms/OrderForm";

export const metadata: Metadata = {
  title: "Оформление заказа",
  description: "Оформите заказ, заполнив форму",
  alternates: { canonical: "/orders" },
};

export default function OrdersPage() {
  return (
    <div className="container mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="mb-4 inline-flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          <ShoppingBag className="size-6" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Оформление заказа</h1>
        <p className="mt-2 text-muted-foreground">
          Заполните контактные данные — мы свяжемся с вами для подтверждения
        </p>
      </div>
      <OrderForm />
    </div>
  );
}
