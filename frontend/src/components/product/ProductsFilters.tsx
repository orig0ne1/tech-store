"use client";

import { useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import { useLocale } from "@/context/LocaleProvider";
import type { Category } from "@/types/category";
import type { SortOption } from "@/types/api";
import { Select } from "../ui/Select";

interface ProductsFiltersProps {
  categories: Category[];
  search: string;
  category: string;
  sort: string;
}

export function ProductsFilters({
  categories,
  search,
  category,
  sort,
}: ProductsFiltersProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useLocale();

  const sortOptions: SortOption[] = [
    { label: t.common.sortDefault, value: "id,asc" },
    { label: t.common.sortPriceAsc, value: "price,asc" },
    { label: t.common.sortPriceDesc, value: "price,desc" },
    { label: t.common.sortNameAsc, value: "name,asc" },
    { label: t.common.sortNewest, value: "createdAt,desc" },
  ];

  const update = useCallback(
    (patch: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(patch)) {
        if (value === "") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      }
      params.delete("page");
      const qs = params.toString();
      router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  const onSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      const params = new URLSearchParams(searchParams.toString());
      if (value === "") {
        params.delete("search");
      } else {
        params.set("search", value);
      }
      params.delete("page");
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute inset-y-0 left-3.5 my-auto size-4 text-muted-foreground" />
        <input
          type="search"
          defaultValue={search}
          onChange={onSearchChange}
          placeholder={t.common.catalogSearchPlaceholder}
          aria-label={t.common.catalogSearchAria}
          className="h-11 w-full rounded-lg border border-border bg-muted/40 pl-10 pr-10 text-sm text-foreground placeholder:text-muted-foreground backdrop-blur-sm transition-all focus:border-transparent focus:bg-card focus:outline-none focus:ring-2 focus:ring-primary/40"
        />
        {search && (
          <button
            type="button"
            aria-label={t.common.clearSearch}
            onClick={() => update({ search: "" })}
            className="absolute inset-y-0 right-2 my-auto flex size-6 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <X className="size-3.5" />
          </button>
        )}
      </div>
      <div className="flex gap-3">
        <Select
          aria-label={t.common.categoryFilterAria}
          value={category}
          onChange={(e) => update({ category: e.target.value })}
          className="min-w-40 flex-1 sm:flex-none"
        >
          <option value="">{t.common.allCategories}</option>
          {categories.map((c) => (
            <option key={c.id} value={c.slug}>
              {c.name}
            </option>
          ))}
        </Select>
        <Select
          aria-label={t.common.sortFilterAria}
          value={sort}
          onChange={(e) => update({ sort: e.target.value })}
          className="min-w-40 flex-1 sm:flex-none"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </div>
    </div>
  );
}
