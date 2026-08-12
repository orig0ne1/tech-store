"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useSite } from "@/context/SiteProvider";
import { useLocale } from "@/context/LocaleProvider";
import { Logo } from "./Logo";
import { NavLinks } from "./NavLinks";
import { SearchSuggest } from "./SearchSuggest";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { ThemeToggle } from "./ThemeToggle";
import { CartButton } from "../cart/CartButton";
import { cn } from "@/lib/utils";

export function Header() {
  const { config } = useSite();
  const { t } = useLocale();
  const [menuOpen, setMenuOpen] = useState(false);

  const ordersEnabled = config?.features.orders ?? true;

  return (
    <header className="sticky top-0 z-30">
      <div className="h-1 bg-primary" />
      <div className="glass border-x-0 border-t-0">
        <div className="container mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:gap-4 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? t.common.closeMenu : t.common.openMenu}
            aria-expanded={menuOpen}
            className="inline-flex size-10 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-muted lg:hidden"
          >
            {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>

          <Logo />

          <nav
            className="ml-4 hidden lg:block"
            aria-label={t.common.mainNavAria}
          >
            <NavLinks />
          </nav>

          <div className="ml-auto w-full max-w-xs flex-1 sm:max-w-sm md:ml-4 lg:ml-6">
            <SearchSuggest />
          </div>

          <ThemeToggle className="hidden sm:inline-flex" />

          {ordersEnabled && <CartButton />}

          <LocaleSwitcher className="hidden sm:inline-flex" />
        </div>
      </div>

      <div
        className={cn(
          "glass overflow-hidden border-x-0 transition-all duration-200 lg:hidden",
          menuOpen ? "max-h-96" : "max-h-0 border-y-0"
        )}
      >
        <div className="container mx-auto flex flex-col gap-4 px-4 py-4">
          <div className="flex gap-3">
            <div className="flex-1">
              <SearchSuggest autoFocus={menuOpen} />
            </div>
            <ThemeToggle />
          </div>
          <NavLinks
            className="flex-col items-stretch gap-1"
            onNavigate={() => setMenuOpen(false)}
          />
          <LocaleSwitcher className="self-start" />
        </div>
      </div>
    </header>
  );
}
