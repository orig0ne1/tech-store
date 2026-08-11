import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Headset,
  RefreshCcw,
  Truck,
} from "lucide-react";
import { getCategories } from "@/lib/categories";
import { getCompany } from "@/lib/company";
import { getConfig } from "@/lib/config";
import { getProducts } from "@/lib/products";
import { ProductCard } from "@/components/ui/ProductCard";
import { ProductGrid } from "@/components/ui/ProductGrid";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { CategoryGrid } from "@/components/category/CategoryGrid";
import { RequestForm } from "@/components/forms/RequestForm";

export const dynamic = "force-dynamic";

const BENEFITS = [
  {
    icon: BadgeCheck,
    title: "Гарантия качества",
    description: "Только проверенные товары от надёжных поставщиков",
  },
  {
    icon: Truck,
    title: "Быстрая доставка",
    description: "Доставка по всей стране в кратчайшие сроки",
  },
  {
    icon: Headset,
    title: "Поддержка 24/7",
    description: "Менеджеры готовы ответить на любой вопрос",
  },
  {
    icon: RefreshCcw,
    title: "Простой возврат",
    description: "Лёгкий возврат и обмен в течение 14 дней",
  },
];

export default async function HomePage() {
  const [configResult, companyResult, categoriesResult, productsResult] =
    await Promise.allSettled([
      getConfig(),
      getCompany(),
      getCategories(),
      getProducts({ size: 8 }),
    ]);

  const config = configResult.status === "fulfilled" ? configResult.value : null;
  const company =
    companyResult.status === "fulfilled" ? companyResult.value : null;
  const categories =
    categoriesResult.status === "fulfilled" ? categoriesResult.value : [];
  const products =
    productsResult.status === "fulfilled" ? productsResult.value.content : [];

  const catalogEnabled = config?.features.catalog ?? true;

  const name = company?.name ?? "Интернет-магазин";
  const description =
    company?.description ??
    "Современные товары по честным ценам. Удобный каталог, быстрая доставка и профессиональная поддержка.";

  return (
    <div>
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-br from-accent via-background to-background">
        <div className="container mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-2 lg:items-center lg:px-8">
          <div>
            <p className="animate-fade-up mb-3 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              <span className="size-1.5 rounded-full bg-primary" />
              Мы рады приветствовать вас
            </p>
            <h1 className="animate-fade-up text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              {name}
            </h1>
            <p className="animate-fade-up-delay-1 mt-4 max-w-lg text-lg leading-relaxed text-muted-foreground">
              {description}
            </p>
            <div className="animate-fade-up-delay-2 mt-8 flex flex-wrap gap-3">
              {catalogEnabled && (
                <Link
                  href="/products"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-primary px-7 text-base font-medium text-primary-foreground transition-all hover:brightness-110"
                >
                  Перейти в каталог
                  <ArrowRight className="size-4" />
                </Link>
              )}
              <Link
                href="/request"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-border bg-card px-7 text-base font-medium transition-colors hover:bg-muted"
              >
                Оставить заявку
              </Link>
            </div>
          </div>
          <div
            className="animate-fade-up-delay-1 relative hidden aspect-[4/3] overflow-hidden rounded-2xl lg:block"
            aria-hidden="true"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/25 via-primary/10 to-transparent" />
            <div className="absolute -left-10 top-1/3 size-48 rounded-full bg-primary/20 blur-3xl" />
            <div className="absolute right-0 top-10 size-40 rounded-full bg-accent blur-2xl" />
          </div>
        </div>
      </section>

      {catalogEnabled && categories.length > 0 && (
        <section className="container mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <SectionTitle
            title="Популярные категории"
            subtitle="Выберите интересующую категорию"
            action={
              <Link
                href="/categories"
                className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
              >
                Все категории
                <ArrowRight className="size-4" />
              </Link>
            }
          />
          <CategoryGrid categories={categories.slice(0, 4)} />
        </section>
      )}

      {catalogEnabled && products.length > 0 && (
        <section className="container mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
          <SectionTitle
            title="Популярные товары"
            subtitle="То, что выбирают чаще всего"
            action={
              <Link
                href="/products"
                className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
              >
                Смотреть все
                <ArrowRight className="size-4" />
              </Link>
            }
          />
          <ProductGrid>
            {products.slice(0, 8).map((product, i) => (
              <ProductCard
                key={product.id}
                product={product}
                priority={i < 4}
              />
            ))}
          </ProductGrid>
        </section>
      )}

      <section className="border-y border-border bg-muted">
        <div className="container mx-auto grid max-w-7xl gap-6 px-4 py-14 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
          {BENEFITS.map((benefit) => (
            <div key={benefit.title} className="flex flex-col gap-3">
              <div className="flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <benefit.icon className="size-5" />
              </div>
              <h3 className="font-semibold">{benefit.title}</h3>
              <p className="text-sm text-muted-foreground">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section
        id="request"
        className="container mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-xl">
          <SectionTitle
            title="Остались вопросы?"
            subtitle="Оставьте заявку — мы свяжемся с вами в ближайшее время"
            className="justify-center text-center"
          />
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
            <RequestForm />
          </div>
        </div>
      </section>
    </div>
  );
}
