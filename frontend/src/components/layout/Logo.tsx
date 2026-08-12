"use client";

import Link from "next/link";
import { useSite } from "@/context/SiteProvider";
import { useLocale } from "@/context/LocaleProvider";

export function Logo({ className = "" }: { className?: string }) {
  const { company } = useSite();
  const { t } = useLocale();
  const name = company?.name ?? t.common.store;

  return (
    <Link href="/" className={`flex items-center gap-2.5 ${className}`}>
      {company?.logo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={company.logo}
          alt={name}
          className="size-9 rounded-xl object-contain p-1 ring-1 ring-border"
        />
      ) : (
        <span className="flex size-9 items-center justify-center rounded-2xl bg-primary text-sm font-bold text-primary-foreground shadow-sm">
          {name.charAt(0).toUpperCase()}
        </span>
      )}
      <span className="font-display text-base font-bold tracking-tight text-foreground sm:text-lg">
        {name}
      </span>
    </Link>
  );
}
