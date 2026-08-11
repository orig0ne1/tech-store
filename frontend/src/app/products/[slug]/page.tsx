import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Bell, ChevronRight, ShoppingCart } from "lucide-react";
import { getCompany } from "@/lib/company";
import { getProduct, getProductAvailability, getRelatedProducts } from "@/lib/products";
import { formatPrice } from "@/lib/utils";
import { ApiError } from "@/lib/api";
import { ProductCard } from "@/components/ui/ProductCard";
import { ProductGrid } from "@/components/ui/ProductGrid";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { ProductGallery } from "@/components/product/ProductGallery";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { ErrorState } from "@/components/ui/ErrorState";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const [product, company] = await Promise.all([
      getProduct(slug),
      getCompany().catch(() => null),
    ]);
    const siteName = company?.name ?? "Магазин";
    const title = `${product.name} — ${siteName}`;
    return {
      title,
      description:
        product.description?.slice(0, 160) ??
        `Купить ${product.name} по цене ${formatPrice(product.price, product.currency)}`,
      openGraph: {
        title,
        description: product.description?.slice(0, 160) ?? undefined,
        images: product.image ? [{ url: product.image }] : undefined,
        type: "website",
      },
      alternates: { canonical: `/products/${slug}` },
    };
  } catch {
    return {};
  }
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;

  const product = await getProduct(slug).catch((error: unknown) => {
    if (error instanceof ApiError && error.status === 404) {
      return null;
    }
    return undefined;
  });

  if (product === undefined) {
    return (
      <div className="container mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <ErrorState message="Не удалось загрузить товар" />
      </div>
    );
  }

  if (product === null) {
    notFound();
  }

  const [relatedResult, availabilityResult] = await Promise.allSettled([
    getRelatedProducts(slug),
    getProductAvailability(slug),
  ]);

  const related =
    relatedResult.status === "fulfilled" ? relatedResult.value : [];
  const available =
    availabilityResult.status === "fulfilled"
      ? availabilityResult.value
      : product.available;

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <nav aria-label="Хлебные крошки" className="mb-6">
        <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
          <li>
            <Link href="/products" className="transition-colors hover:text-primary">
              Каталог
            </Link>
          </li>
          <li aria-hidden="true">
            <ChevronRight className="size-3.5" />
          </li>
          <li>
            <Link
              href={`/categories/${product.category.slug}`}
              className="transition-colors hover:text-primary"
            >
              {product.category.name}
            </Link>
          </li>
          <li aria-hidden="true">
            <ChevronRight className="size-3.5" />
          </li>
          <li aria-current="page" className="truncate text-foreground">
            {product.name}
          </li>
        </ol>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        <ProductGallery images={product.images} name={product.name} />

        <div className="flex flex-col">
          <p className="text-sm text-muted-foreground">
            <Link
              href={`/categories/${product.category.slug}`}
              className="transition-colors hover:text-primary"
            >
              {product.category.name}
            </Link>
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            {product.name}
          </h1>

          <div className="mt-3">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
                available
                  ? "bg-success/10 text-success"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              <span
                className={`size-1.5 rounded-full ${
                  available ? "bg-success" : "bg-muted-foreground"
                }`}
              />
              {available ? "В наличии" : "Нет в наличии"}
            </span>
          </div>

          <p className="mt-6 text-3xl font-bold sm:text-4xl">
            {formatPrice(product.price, product.currency)}
          </p>

          <p className="mt-6 leading-relaxed text-muted-foreground">
            {product.description}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            {available ? (
              <AddToCartButton product={product} size="lg" />
            ) : (
              <Link
                href={`/availability?productId=${product.id}`}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-primary px-7 text-base font-medium text-primary-foreground transition-all hover:brightness-110"
              >
                <Bell className="size-4" />
                Сообщить о поступлении
              </Link>
            )}
            <Link
              href={`/request?product=${encodeURIComponent(product.name)}`}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-border bg-card px-7 text-base font-medium transition-colors hover:bg-muted"
            >
              <ShoppingCart className="size-4" />
              Задать вопрос
            </Link>
          </div>

          {product.attributes && Object.keys(product.attributes).length > 0 && (
            <div className="mt-8">
              <h2 className="mb-3 text-lg font-semibold">Характеристики</h2>
              <dl className="divide-y divide-border rounded-xl border border-border">
                {Object.entries(product.attributes).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex items-center justify-between gap-4 px-4 py-2.5 text-sm"
                  >
                    <dt className="text-muted-foreground">{key}</dt>
                    <dd className="font-medium">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <SectionTitle title="Похожие товары" />
          <ProductGrid>
            {related.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </ProductGrid>
        </section>
      )}
    </div>
  );
}
