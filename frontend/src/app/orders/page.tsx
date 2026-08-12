import type { Metadata } from "next";
import { ShoppingBag } from "lucide-react";
import { OrderForm } from "@/components/forms/OrderForm";
import { getDictionary } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";

export async function generateMetadata(): Promise<Metadata> {
  const t = getDictionary(await getLocale());
  return {
    title: t.orders.title,
    description: t.orders.description,
    alternates: { canonical: "/orders" },
  };
}

export default async function OrdersPage() {
  const t = getDictionary(await getLocale());
  return (
    <div className="container mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="mb-4 inline-flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          <ShoppingBag className="size-6" />
        </div>
        <h1 className="font-display text-3xl font-bold tracking-tight">{t.orders.title}</h1>
        <p className="mt-2 text-muted-foreground">
          {t.orders.subtitle}
        </p>
      </div>
      <OrderForm />
    </div>
  );
}
