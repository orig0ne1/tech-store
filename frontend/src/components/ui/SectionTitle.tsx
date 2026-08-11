import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function SectionTitle({
  title,
  subtitle,
  className,
  action,
}: {
  title: string;
  subtitle?: string;
  className?: string;
  action?: ReactNode;
}) {
  return (
    <div
      className={cn(
        "mb-6 flex flex-wrap items-end justify-between gap-3",
        className
      )}
    >
      <div>
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-1 text-muted-foreground">{subtitle}</p>
        )}
      </div>
      {action}
    </div>
  );
}
