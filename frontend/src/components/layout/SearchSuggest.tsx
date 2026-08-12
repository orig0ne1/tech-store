"use client";

import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, Search } from "lucide-react";
import { useLocale } from "@/context/LocaleProvider";
import { getProducts } from "@/lib/products";
import { tpl } from "@/lib/i18n";
import { cn, formatPrice } from "@/lib/utils";
import type { ProductSummary } from "@/types/product";
import { ProductImage } from "../ui/ProductImage";
import { Highlight } from "../product/Highlight";

const MIN_QUERY = 2;
const MAX_SUGGESTIONS = 6;
const DEBOUNCE_MS = 300;

type SuggestionState =
  | { phase: "idle" }
  | { phase: "loading" }
  | { phase: "error" }
  | { phase: "ready"; query: string; items: ProductSummary[]; total: number };

interface PanelPosition {
  top: number;
  left: number;
  width: number;
}

export function SearchSuggest({ autoFocus = false }: { autoFocus?: boolean }) {
  const router = useRouter();
  const { t, locale } = useLocale();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<SuggestionState>({ phase: "idle" });
  const [activeIndex, setActiveIndex] = useState(-1);
  const [panelPosition, setPanelPosition] = useState<PanelPosition | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const trimmed = query.trim();
  const searching = trimmed.length >= MIN_QUERY;

  let status: "idle" | "loading" | "ready" | "error" = "idle";
  let items: ProductSummary[] = [];
  let total = 0;
  if (searching) {
    if (state.phase === "error") {
      status = "error";
    } else if (state.phase === "ready" && state.query === trimmed) {
      status = "ready";
      items = state.items;
      total = state.total;
    } else {
      status = "loading";
    }
  }

  const active = items.length ? Math.min(activeIndex, items.length - 1) : -1;
  const showPanel =
    open && searching && (status === "loading" || status === "ready");

  useEffect(() => {
    if (!searching) return;
    const handle = window.setTimeout(async () => {
      setState({ phase: "loading" });
      try {
        const res = await getProducts({ search: trimmed, size: MAX_SUGGESTIONS });
        setState({
          phase: "ready",
          query: trimmed,
          items: res.content,
          total: res.totalElements,
        });
        setActiveIndex(-1);
      } catch {
        setState({ phase: "error" });
      }
    }, DEBOUNCE_MS);
    return () => window.clearTimeout(handle);
  }, [trimmed, searching]);

  useEffect(() => {
    function onOutsideClick(e: MouseEvent | TouchEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    function onViewportChange() {
      setOpen(false);
    }
    document.addEventListener("mousedown", onOutsideClick);
    document.addEventListener("touchstart", onOutsideClick);
    window.addEventListener("scroll", onViewportChange, true);
    window.addEventListener("resize", onViewportChange);
    return () => {
      document.removeEventListener("mousedown", onOutsideClick);
      document.removeEventListener("touchstart", onOutsideClick);
      window.removeEventListener("scroll", onViewportChange, true);
      window.removeEventListener("resize", onViewportChange);
    };
  }, []);

  const openPanel = () => {
    const el = containerRef.current;
    if (el) {
      const rect = el.getBoundingClientRect();
      setPanelPosition({
        top: rect.bottom + 6,
        left: rect.left,
        width: rect.width,
      });
    }
    setOpen(true);
  };

  const goToProduct = (slug: string) => {
    setOpen(false);
    setQuery("");
    router.push(`/products/${slug}`);
  };

  const submitSearch = (e: FormEvent) => {
    e.preventDefault();
    if (active >= 0 && items[active]) {
      goToProduct(items[active].slug);
      return;
    }
    setOpen(false);
    const q = trimmed;
    router.push(q ? `/products?search=${encodeURIComponent(q)}` : "/products");
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!showPanel) return;
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      const count = Math.max(items.length, 1);
      setActiveIndex((i) =>
        e.key === "ArrowDown" ? (i + 1) % count : (i - 1 + count) % count
      );
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <form onSubmit={submitSearch} role="search" className="relative">
        <Search className="pointer-events-none absolute inset-y-0 left-3.5 my-auto size-4 text-muted-foreground" />
        <input
          type="search"
          value={query}
          onChange={(e) => {
            const value = e.target.value;
            setQuery(value);
            if (value.trim().length >= MIN_QUERY) openPanel();
          }}
          onFocus={() => {
            if (searching) openPanel();
          }}
          onKeyDown={onKeyDown}
          autoFocus={autoFocus}
          autoComplete="off"
          role="combobox"
          aria-expanded={showPanel}
          aria-controls="search-suggestions"
          aria-activedescendant={
            active >= 0 ? `search-option-${items[active]?.id}` : undefined
          }
          aria-autocomplete="list"
          placeholder={t.common.searchPlaceholder}
          aria-label={t.common.searchAria}
          className="h-10 w-full rounded-lg border border-border bg-muted pl-10 pr-3.5 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus:border-transparent focus:bg-card focus:outline-none focus:ring-2 focus:ring-primary/40"
        />
      </form>

      {showPanel &&
        panelPosition &&
        createPortal(
          <div
            id="search-suggestions"
            role="listbox"
            aria-label={t.common.searchAria}
            style={{
              position: "fixed",
              top: panelPosition.top,
              left: panelPosition.left,
              width: panelPosition.width,
            }}
            className="glass-strong z-50 animate-fade-up overflow-hidden rounded-2xl shadow-lift"
          >
            {status === "loading" ? (
              <div className="flex items-center gap-2 px-4 py-3 text-sm text-muted-foreground">
                <Loader2 className="size-4 animate-spin" />
                <span>{t.common.searching}</span>
              </div>
            ) : items.length === 0 ? (
              <p className="px-4 py-4 text-sm text-muted-foreground">
                {tpl(t.common.noResultsFor, { query: trimmed })}
              </p>
            ) : (
              <>
                <ul className="max-h-80 overflow-y-auto py-1">
                  {items.map((product, i) => (
                    <li key={product.id}>
                      <button
                        type="button"
                        id={`search-option-${product.id}`}
                        role="option"
                        aria-selected={active === i}
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => goToProduct(product.slug)}
                        className={cn(
                          "flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors",
                          active === i ? "bg-muted" : "hover:bg-muted"
                        )}
                      >
                        <span className="relative size-10 shrink-0 overflow-hidden rounded-md bg-muted">
                          <ProductImage src={product.image} alt={product.name} />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="line-clamp-1 text-sm font-medium">
                            <Highlight text={product.name} query={trimmed} />
                          </span>
                          <span className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                            <span
                              className={cn(
                                "size-1.5 rounded-full",
                                product.available
                                  ? "bg-success"
                                  : "bg-muted-foreground"
                              )}
                            />
                            {product.available
                              ? t.common.inStock
                              : t.common.outOfStock}
                          </span>
                        </span>
                        <span className="shrink-0 text-sm font-semibold">
                          {formatPrice(product.price, product.currency, locale)}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/products?search=${encodeURIComponent(trimmed)}`}
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between gap-2 border-t border-border bg-muted/50 px-4 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-muted"
                >
                  {t.common.viewAllResults}
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                    {total}
                  </span>
                </Link>
              </>
            )}
          </div>,
          document.body
        )}
    </div>
  );
}
