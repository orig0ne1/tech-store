import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound, redirect } from "next/navigation";
import { getCategory, getCategoryProducts } from "@/lib/categories";
import { getConfig } from "@/lib/config";
import { ApiError } from "@/lib/api";
import { ProductCard } from "@/components/ui/ProductCard";
import { ProductGrid } from "@/components/ui/ProductGrid";
import { Pagination } from "@/components/ui/Pagination";
import { ErrorState } from "@/components/ui/ErrorState";
import { ProductsFilters } from "@/components/product/ProductsFilters";
import { getCategories } from "@/lib/categories";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function readParam(value: string | string[] | undefined): string {
  return typeof value === "string" ? value : "";
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const category = await getCategory(slug);
    return {
      title: category.name,
      description: `Товары категории «${category.name}»`,
      alternates: { canonical: `/categories/${slug}` },
      openGraph: {
        title: category.name,
        images: category.image ? [{ url: category.image }] : undefined,
      },
    };
  } catch {
    return {};
  }
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const sp = await searchParams;
  const search = readParam(sp.search);
  const sort = readParam(sp.sort) || "id,asc";
  const requestedPage = parseInt(readParam(sp.page), 10);
  const page =
    Number.isFinite(requestedPage) && requestedPage > 0 ? requestedPage : 0;

  const category = await getCategory(slug).catch((error: unknown) => {
    if (error instanceof ApiError && error.status === 404) {
      return null;
    }
    return undefined;
  });

  if (category === undefined) {
    return (
      <div className="container mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <ErrorState message="Не удалось загрузить категорию" />
      </div>
    );
  }
  if (category === null) {
    notFound();
  }

  const config = await getConfig().catch(() => null);
  const defaultSize = config?.pagination.defaultSize ?? 20;

  const [pageData, allCategories] = await Promise.all([
    getCategoryProducts(slug, {
      page,
      size: defaultSize,
      search: search || undefined,
      sort,
    }).catch(() => null),
    getCategories().catch(() => []),
  ]);

  if (pageData === null) {
    return (
      <div className="container mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <ErrorState message="Не удалось загрузить товары категории" />
      </div>
    );
  }

  if (page > 0 && pageData.totalPages > 0 && page >= pageData.totalPages) {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (sort && sort !== "id,asc") params.set("sort", sort);
    redirect(`/categories/${slug}?${params.toString()}`);
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">{category.name}</h1>
        {category.image && (
          <div className="mt-4 overflow-hidden rounded-xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={category.image}
              alt={category.name}
              className="h-40 w-full object-cover sm:h-56"
            />
          </div>
        )}
        <p className="mt-3 text-muted-foreground">
          Найдено товаров: {pageData.totalElements}
        </p>
      </header>

      <Suspense
        fallback={
          <div className="mb-6 h-11 animate-pulse rounded-lg bg-muted" />
        }
      >
        <ProductsFilters
          categories={allCategories}
          search={search}
          category={slug}
          sort={sort}
        />
      </Suspense>

      <div className="mt-6">
        {pageData.content.length === 0 ? (
          <div className="rounded-xl border border-border bg-card px-6 py-16 text-center">
            <p className="font-medium">Ничего не найдено</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Попробуйте изменить запрос
            </p>
          </div>
        ) : (
          <ProductGrid>
            {pageData.content.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                showCategory
                categoryName={category.name}
              />
            ))}
          </ProductGrid>
        )}
      </div>

      <Suspense fallback={null}>
        <Pagination page={pageData.page} totalPages={pageData.totalPages} />
      </Suspense>
    </div>
  );
}
