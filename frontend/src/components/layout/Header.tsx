"use client";

import { useState } from "react";
import { Menu, MessagesSquare, X } from "lucide-react";
import { useSite } from "@/context/SiteProvider";
import { Logo } from "./Logo";
import { NavLinks } from "./NavLinks";
import { SearchBar } from "./SearchBar";
import { CartButton } from "../cart/CartButton";
import { cn } from "@/lib/utils";

function openChat() {
  window.dispatchEvent(new CustomEvent("webapp:open-chat"));
}

export function Header() {
  const { config } = useSite();
  const [menuOpen, setMenuOpen] = useState(false);

  const ordersEnabled = config?.features.orders ?? true;
  const chatEnabled = config?.features.chat ?? true;

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-card/90 backdrop-blur">
      <div className="container mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:gap-4 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"}
          aria-expanded={menuOpen}
          className="inline-flex size-10 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-muted lg:hidden"
        >
          {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>

        <Logo />

        <nav
          className="ml-4 hidden lg:block"
          aria-label="Основная навигация"
        >
          <NavLinks />
        </nav>

        <div className="ml-auto w-full max-w-xs flex-1 sm:max-w-sm md:ml-4 lg:ml-6">
          <SearchBar />
        </div>

        {ordersEnabled && <CartButton />}

        {chatEnabled && (
          <button
            type="button"
            onClick={openChat}
            aria-label="Открыть чат с менеджером"
            className="inline-flex size-10 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-muted"
          >
            <MessagesSquare className="size-5" />
          </button>
        )}
      </div>

      <div
        className={cn(
          "overflow-hidden border-t border-border transition-all duration-200 lg:hidden",
          menuOpen ? "max-h-96" : "max-h-0 border-t-0"
        )}
      >
        <div className="container mx-auto flex flex-col gap-4 px-4 py-4">
          <SearchBar autoFocus={menuOpen} />
          <NavLinks
            className="flex-col items-stretch gap-1"
            onNavigate={() => setMenuOpen(false)}
          />
        </div>
      </div>
    </header>
  );
}
