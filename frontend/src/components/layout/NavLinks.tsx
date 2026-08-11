"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSite } from "@/context/SiteProvider";
import { cn } from "@/lib/utils";

export function NavLinks({
  className,
  onNavigate,
}: {
  className?: string;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const { config } = useSite();
  const catalogEnabled = config?.features.catalog ?? true;

  const links: Array<{ href: string; label: string; enabled?: boolean }> = [
    { href: "/products", label: "Каталог", enabled: catalogEnabled },
    { href: "/categories", label: "Категории", enabled: catalogEnabled },
    { href: "/about", label: "О компании" },
    { href: "/about#contacts", label: "Контакты" },
  ];

  return (
    <ul className={cn("flex items-center gap-1", className)}>
      {links
        .filter((link) => link.enabled !== false)
        .map((link) => {
          const isActive = link.href.startsWith("#")
            ? false
            : pathname === link.href ||
              (link.href !== "/about" && pathname.startsWith(link.href));
          return (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={onNavigate}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "inline-flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {link.label}
              </Link>
            </li>
          );
        })}
    </ul>
  );
}
