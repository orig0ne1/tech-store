"use client";

import { cn } from "@/lib/utils";
import { locales, type Locale } from "@/lib/i18n";
import { useLocale } from "@/context/LocaleProvider";

export function LocaleSwitcher({ className }: { className?: string }) {
  const { locale, setLocale } = useLocale();

  return (
    <div
      className={cn(
        "glass inline-flex items-center overflow-hidden rounded-lg",
        className
      )}
      role="group"
      aria-label="Language"
    >
      {locales.map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => setLocale(code as Locale)}
          aria-pressed={locale === code}
          className={cn(
            "h-10 px-3 text-xs font-semibold uppercase transition-all",
            locale === code
              ? "glass-primary"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          {code}
        </button>
      ))}
    </div>
  );
}
