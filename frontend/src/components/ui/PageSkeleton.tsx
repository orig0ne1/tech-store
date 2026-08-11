import { ProductGridSkeleton } from "./ProductSkeleton";

export function PageSkeleton() {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 space-y-3">
        <div className="h-8 w-64 animate-pulse rounded bg-muted" />
        <div className="h-4 w-96 max-w-full animate-pulse rounded bg-muted" />
      </div>
      <ProductGridSkeleton count={8} />
    </div>
  );
}
