import Link from "next/link";
import { SearchX } from "lucide-react";
import { getDictionary } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";

export async function NotFoundState({
  title,
  description,
}: {
  title?: string;
  description?: string;
}) {
  const t = getDictionary(await getLocale());
  return (
    <div className="glass-card flex flex-col items-center justify-center gap-4 rounded-xl px-6 py-16 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <SearchX className="size-6" />
      </div>
      <div>
        <h1 className="text-xl font-semibold">
          {title ?? t.common.nothingFound}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {description ?? t.common.notFoundDescription}
        </p>
      </div>
      <Link
        href="/"
        className="glass-primary inline-flex h-11 items-center justify-center rounded-lg px-5 text-sm font-medium transition-all"
      >
        {t.common.goHome}
      </Link>
    </div>
  );
}
