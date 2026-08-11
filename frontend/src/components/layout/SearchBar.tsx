"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

export function SearchBar({ autoFocus = false }: { autoFocus?: boolean }) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    router.push(q ? `/products?search=${encodeURIComponent(q)}` : "/products");
  };

  return (
    <form onSubmit={onSubmit} role="search" className="relative w-full">
      <Search className="pointer-events-none absolute inset-y-0 left-3.5 my-auto size-4 text-muted-foreground" />
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        autoFocus={autoFocus}
        placeholder="Поиск товаров..."
        aria-label="Поиск товаров"
        className="h-10 w-full rounded-lg border border-border bg-muted pl-10 pr-3.5 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus:border-transparent focus:bg-card focus:outline-none focus:ring-2 focus:ring-primary/40"
      />
    </form>
  );
}
