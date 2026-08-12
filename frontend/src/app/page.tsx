import Link from "next/link";
import type { CSSProperties } from "react";
import {
  ArrowRight,
  BadgeCheck,
  Headphones,
  ShieldCheck,
  Sparkles,
  Truck,
} from "lucide-react";
import { getCategories } from "@/lib/categories";
import { getCompany } from "@/lib/company";
import { getConfig } from "@/lib/config";
import { getProducts } from "@/lib/products";
import { getDictionary, type Locale } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";
import { formatPrice } from "@/lib/utils";
import type { ProductSummary } from "@/types/product";
import { ProductCard } from "@/components/ui/ProductCard";
import { ProductGrid } from "@/components/ui/ProductGrid";
import { ProductImage } from "@/components/ui/ProductImage";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { CategoryGrid } from "@/components/category/CategoryGrid";
import { Reveal } from "@/components/ui/Reveal";
import { RequestForm } from "@/components/forms/RequestForm";

export const dynamic = "force-dynamic";

const TRUST_ICONS = [Truck, Headphones, ShieldCheck, BadgeCheck];

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

  const locale = await getLocale();
  const t = getDictionary(locale);
  const catalogEnabled = config?.features.catalog ?? true;

  const name = company?.name ?? t.home.fallbackName;
  const description =
    company?.description ?? t.home.fallbackDescription;

  const heroProducts = products.slice(0, 3);

  const trustBadges = [
    { title: t.home.shipping, text: t.home.shippingText },
    { title: t.home.support, text: t.home.supportText },
    { title: t.home.payment, text: t.home.paymentText },
    { title: t.home.warranty, text: t.home.warrantyText },
  ];

  const marqueeItems = catalogEnabled ? categories : [];

  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="container mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-2 lg:items-center lg:px-8">
          <div className="relative">
            <p className="animate-fade-up mb-4 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              <Sparkles className="size-3.5" />
              {t.home.welcome}
            </p>
            <h1 className="animate-fade-up font-display text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              {name}
            </h1>
            <p className="animate-fade-up-delay-1 mt-5 max-w-lg text-lg leading-relaxed text-muted-foreground">
              {description}
            </p>
            <div className="animate-fade-up-delay-2 mt-8 flex flex-wrap gap-3">
              {catalogEnabled && (
                <Link
                  href="/products"
                  className="glass-primary inline-flex h-12 items-center justify-center gap-2 rounded-lg px-7 text-base font-medium transition-all active:scale-[0.98]"
                >
                  {t.common.browseCatalog}
                  <ArrowRight className="size-4" />
                </Link>
              )}
              <Link
                href="/request"
                className="glass inline-flex h-12 items-center justify-center gap-2 rounded-lg px-7 text-base font-medium transition-colors hover:bg-muted"
              >
                {t.common.submitRequest}
              </Link>
            </div>
          </div>

          {heroProducts.length >= 2 && (
            <div
              className="animate-fade-up-delay-1 relative hidden h-[28rem] lg:block"
              aria-hidden="true"
            >
              <div
                className="animate-float absolute left-2 top-2 w-56 rotate-[-5deg]"
                style={{ "--tilt": "-5deg" } as CSSProperties}
              >
                <HeroCard product={heroProducts[0]} locale={locale} />
              </div>
              <div
                className="animate-float-delay absolute right-0 top-24 w-52 rotate-[4deg]"
                style={{ "--tilt": "4deg" } as CSSProperties}
              >
                <HeroCard product={heroProducts[1]} locale={locale} />
              </div>
              {heroProducts[2] && (
                <div
                  className="animate-float absolute bottom-0 right-10 w-48 rotate-[-3deg]"
                  style={{ "--tilt": "-3deg" } as CSSProperties}
                >
                  <HeroCard product={heroProducts[2]} locale={locale} />
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {trustBadges.length > 0 && (
        <Reveal>
          <section className="container mx-auto max-w-7xl px-4 pb-4 sm:px-6 lg:px-8">
            <div className="glass grid grid-cols-2 gap-x-4 gap-y-6 rounded-2xl px-6 py-6 md:grid-cols-4 md:py-5">
              {trustBadges.map((badge, i) => {
                const Icon = TRUST_ICONS[i] ?? Sparkles;
                return (
                  <div
                    key={badge.title}
                    className="flex items-center gap-3"
                  >
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="size-5" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold leading-tight">
                        {badge.title}
                      </p>
                      <p className="mt-0.5 truncate text-xs text-muted-foreground">
                        {badge.text}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </Reveal>
      )}

      {catalogEnabled && marqueeItems.length > 0 && (
        <Reveal>
          <section
            className="relative mt-10 overflow-hidden border-y border-border py-4"
            aria-label={t.common.categories}
          >
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-background to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-background to-transparent" />
            <div className="animate-marquee flex w-max gap-8">
              {[...marqueeItems, ...marqueeItems].map((category, i) => (
                <Link
                  key={`${category.id}-${i}`}
                  href={`/categories/${category.slug}`}
                  className="flex items-center gap-3 whitespace-nowrap text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                >
                  <span className="size-1.5 rounded-full bg-primary" />
                  {category.name}
                </Link>
              ))}
            </div>
          </section>
        </Reveal>
      )}

      {catalogEnabled && categories.length > 0 && (
        <Reveal>
          <section className="container mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
            <SectionTitle
              title={t.home.popularCategories}
              subtitle={t.home.chooseCategory}
              action={
                <Link
                  href="/categories"
                  className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                >
                  {t.common.allCategories}
                  <ArrowRight className="size-4" />
                </Link>
              }
            />
            <CategoryGrid categories={categories.slice(0, 4)} />
          </section>
        </Reveal>
      )}

      {catalogEnabled && products.length > 0 && (
        <Reveal>
          <section className="container mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
            <SectionTitle
              title={t.home.popularProducts}
              subtitle={t.home.bestSellers}
              action={
                <Link
                  href="/products"
                  className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                >
                  {t.common.viewAll}
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
        </Reveal>
      )}

      <Reveal>
        <section
          id="request"
          className="container mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8"
        >
          <div className="mx-auto max-w-xl">
            <SectionTitle
              title={t.home.anyQuestions}
              subtitle={t.home.requestCta}
              className="justify-center text-center"
            />
            <div className="glass-card rounded-2xl p-6 sm:p-8">
              <RequestForm />
            </div>
          </div>
        </section>
      </Reveal>
    </div>
  );
}

function HeroCard({
  product,
  locale,
}: {
  product: ProductSummary;
  locale: Locale;
}) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="glass-card block overflow-hidden rounded-2xl transition-transform duration-200 hover:scale-[1.03]"
    >
      <div className="relative aspect-square w-full overflow-hidden bg-muted">
        <ProductImage
          src={product.image}
          alt={product.name}
          sizes="(max-width: 1024px) 50vw, 20vw"
        />
      </div>
      <div className="p-3">
        <p className="truncate text-sm font-medium">{product.name}</p>
        <p className="mt-1 flex items-center gap-1.5 text-sm font-bold">
          {formatPrice(product.price, product.currency, locale)}
        </p>
      </div>
    </Link>
  );
}
