export default function ProductDetailLoading() {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 h-4 w-72 animate-pulse rounded bg-muted" />
      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        <div className="aspect-square animate-pulse rounded-2xl bg-muted" />
        <div className="flex flex-col gap-4">
          <div className="h-4 w-24 animate-pulse rounded bg-muted" />
          <div className="h-9 w-3/4 animate-pulse rounded bg-muted" />
          <div className="h-6 w-24 animate-pulse rounded bg-muted" />
          <div className="h-10 w-40 animate-pulse rounded bg-muted" />
          <div className="mt-4 h-4 w-full animate-pulse rounded bg-muted" />
          <div className="h-4 w-full animate-pulse rounded bg-muted" />
          <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
          <div className="mt-4 flex gap-3">
            <div className="h-12 w-48 animate-pulse rounded-lg bg-muted" />
            <div className="h-12 w-48 animate-pulse rounded-lg bg-muted" />
          </div>
        </div>
      </div>
    </div>
  );
}
