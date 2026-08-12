import type { Locale } from "@/lib/i18n";

export function cn(
  ...classes: Array<string | false | null | undefined>
): string {
  return classes.filter(Boolean).join(" ");
}

export function formatPrice(
  value: number,
  currency: string,
  locale: Locale = "en"
): string {
  const intl = locale === "ru" ? "ru-RU" : "en-US";
  try {
    return new Intl.NumberFormat(intl, {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(value);
  } catch {
    return `${value.toLocaleString(intl)} ${currency}`;
  }
}

export function stripUndefined(
  params: object
): Record<string, string | number> {
  const clean: Record<string, string | number> = {};
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") {
      clean[key] = value;
    }
  }
  return clean;
}

export function initials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}
