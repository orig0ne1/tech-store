"use client";

import { useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  page: number;
  totalPages: number;
}

function getPageWindow(current: number, total: number): number[] {
  const pages: number[] = [];
  const start = Math.max(0, current - 2);
  const end = Math.min(total - 1, current + 2);
  for (let i = start; i <= end; i++) pages.push(i);
  return pages;
}

export function Pagination({ page, totalPages }: PaginationProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const go = useCallback(
    (target: number) => {
      const params = new URLSearchParams(searchParams.toString());
      if (target <= 0) {
        params.delete("page");
      } else {
        params.set("page", String(target));
      }
      const qs = params.toString();
      router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  if (totalPages <= 1) return null;

  const window = getPageWindow(page, totalPages);

  return (
    <nav
      className="mt-8 flex items-center justify-center gap-1.5"
      aria-label="Пагинация"
    >
      <button
        type="button"
        onClick={() => go(page - 1)}
        disabled={page <= 0}
        aria-label="Предыдущая страница"
        className="inline-flex size-10 items-center justify-center rounded-lg border border-border transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ChevronLeft className="size-4" />
      </button>
      {window[0] > 0 && (
        <>
          <button
            type="button"
            onClick={() => go(0)}
            className="inline-flex size-10 items-center justify-center rounded-lg border border-border transition-colors hover:bg-muted"
          >
            1
          </button>
          {window[0] > 1 && (
            <span className="px-1 text-muted-foreground">…</span>
          )}
        </>
      )}
      {window.map((p) => (
        <button
          key={p}
          type="button"
          onClick={() => go(p)}
          aria-current={p === page ? "page" : undefined}
          className={cn(
            "inline-flex size-10 items-center justify-center rounded-lg text-sm font-medium transition-colors",
            p === page
              ? "bg-primary text-primary-foreground"
              : "border border-border hover:bg-muted"
          )}
        >
          {p + 1}
        </button>
      ))}
      {window[window.length - 1] < totalPages - 1 && (
        <>
          {window[window.length - 1] < totalPages - 2 && (
            <span className="px-1 text-muted-foreground">…</span>
          )}
          <button
            type="button"
            onClick={() => go(totalPages - 1)}
            className="inline-flex size-10 items-center justify-center rounded-lg border border-border transition-colors hover:bg-muted"
          >
            {totalPages}
          </button>
        </>
      )}
      <button
        type="button"
        onClick={() => go(page + 1)}
        disabled={page >= totalPages - 1}
        aria-label="Следующая страница"
        className="inline-flex size-10 items-center justify-center rounded-lg border border-border transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ChevronRight className="size-4" />
      </button>
    </nav>
  );
}
