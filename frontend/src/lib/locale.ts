import { cookies } from "next/headers";
import {
  defaultLocale,
  LOCALE_COOKIE,
  locales,
  type Locale,
} from "@/lib/i18n";

export async function getLocale(): Promise<Locale> {
  try {
    const store = await cookies();
    const value = store.get(LOCALE_COOKIE)?.value;
    return (locales as readonly string[]).includes(value as string)
      ? (value as Locale)
      : defaultLocale;
  } catch {
    return defaultLocale;
  }
}
