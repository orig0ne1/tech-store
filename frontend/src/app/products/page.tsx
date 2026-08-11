import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getCategories } from "@/lib/categories";
import { getConfig } from "@/lib/config";
import { getProducts } from "@/lib/products";
import { ProductCard } from "@/components/ui/ProductCard";
import { ProductGrid } from "@/components/ui/ProductGrid";
import { Pagination } from "@/components/ui/Pagination";
import { ErrorState } from "@/components/ui/ErrorState";
import { ProductsFilters } from "@/components/product/ProductsFilters";

export const dynamic = "force-dynamic";

function readParam(
  value: string | string[] | undefined
): string {
  return typeof value === "string" ? value : "";
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const search = readParam(sp.search);
  const category = readParam(sp.category);
  const sort = readParam(sp.sort) || "id,asc";
  const requestedPage = parseInt(readParam(sp.page), 10);
  const page = Number.isFinite(requestedPage) && requestedPage > 0 ? requestedPage : 0;

  const [configResult, categoriesResult] = await Promise.allSettled([
    getConfig(),
    getCategories(),
  ]);

  const config = configResult.status === "fulfilled" ? configResult.value : null;
  const categories =
    categoriesResult.status === "fulfilled" ? categoriesResult.value : [];
  const defaultSize = config?.pagination.defaultSize ?? 20;

  const productsResult = await getProducts({
    page,
    size: defaultSize,
    search: search || undefined,
    category: category || undefined,
    sort,
  }).catch(() => null);

  const pageData = productsResult;

  if (!pageData) {
    return (
      <div className="container mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <ErrorState message="Не удалось загрузить каталог" />
      </div>
    );
  }

  if (page > 0 && pageData.totalPages > 0 && page >= pageData.totalPages) {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (category) params.set("category", category);
    if (sort && sort !== "id,asc") params.set("sort", sort);
    redirect(`/products?${params.toString()}`);
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Каталог</h1>
        <p className="mt-1 text-muted-foreground">
          Найдено товаров: {pageData.totalElements}
        </p>
      </header>

      <Suspense
        fallback={
          <div className="mb-6 h-11 animate-pulse rounded-lg bg-muted" />
        }
      >
        <ProductsFilters
          categories={categories}
          search={search}
          category={category}
          sort={sort}
        />
      </Suspense>

      <div className="mt-6">
        {pageData.content.length === 0 ? (
          <div className="rounded-xl border border-border bg-card px-6 py-16 text-center">
            <p className="font-medium">Ничего не найдено</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Попробуйте изменить запрос или параметры фильтра
            </p>
          </div>
        ) : (
          <ProductGrid>
            {pageData.content.map((product) => (
              <ProductCard key={product.id} product={product} />
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
