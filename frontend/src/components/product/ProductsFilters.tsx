"use client";

import { useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import type { Category } from "@/types/category";
import type { SortOption } from "@/types/api";
import { Select } from "../ui/Select";

const SORT_OPTIONS: SortOption[] = [
  { label: "По умолчанию", value: "id,asc" },
  { label: "Сначала дешевле", value: "price,asc" },
  { label: "Сначала дороже", value: "price,desc" },
  { label: "По алфавиту", value: "name,asc" },
  { label: "Сначала новинки", value: "createdAt,desc" },
];

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
          placeholder="Поиск по каталогу..."
          aria-label="Поиск по каталогу"
          className="h-11 w-full rounded-lg border border-border bg-card pl-10 pr-10 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary/40"
        />
        {search && (
          <button
            type="button"
            aria-label="Очистить поиск"
            onClick={() => update({ search: "" })}
            className="absolute inset-y-0 right-2 my-auto flex size-6 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <X className="size-3.5" />
          </button>
        )}
      </div>
      <div className="flex gap-3">
        <Select
          aria-label="Категория"
          value={category}
          onChange={(e) => update({ category: e.target.value })}
          className="min-w-40 flex-1 sm:flex-none"
        >
          <option value="">Все категории</option>
          {categories.map((c) => (
            <option key={c.id} value={c.slug}>
              {c.name}
            </option>
          ))}
        </Select>
        <Select
          aria-label="Сортировка"
          value={sort}
          onChange={(e) => update({ sort: e.target.value })}
          className="min-w-40 flex-1 sm:flex-none"
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </div>
    </div>
  );
}
