"use client";

import Link from "next/link";
import { useSite } from "@/context/SiteProvider";

export function Logo({ className = "" }: { className?: string }) {
  const { company } = useSite();
  const name = company?.name ?? "Магазин";

  return (
    <Link href="/" className={`flex items-center gap-2.5 ${className}`}>
      {company?.logo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={company.logo}
          alt={name}
          className="size-8 rounded-lg object-contain"
        />
      ) : (
        <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
          {name.charAt(0).toUpperCase()}
        </span>
      )}
      <span className="text-base font-bold tracking-tight sm:text-lg">
        {name}
      </span>
    </Link>
  );
}
