import Link from "next/link";
import { SearchX } from "lucide-react";

export function NotFoundState({
  title = "Ничего не найдено",
  description = "Запрошенная страница не существует или была перемещена.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-border bg-card px-6 py-16 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <SearchX className="size-6" />
      </div>
      <div>
        <h1 className="text-xl font-semibold">{title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
      <Link
        href="/"
        className="inline-flex h-11 items-center justify-center rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground transition-all hover:brightness-110"
      >
        На главную
      </Link>
    </div>
  );
}
