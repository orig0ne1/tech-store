import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { SiteProvider } from "@/context/SiteProvider";
import { CartProvider } from "@/context/CartProvider";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { ChatWidgetGate } from "@/components/chat/ChatWidgetGate";

export const metadata: Metadata = {
  title: {
    default: "Магазин",
    template: "%s",
  },
  description: "Интернет-магазин",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru" className="h-full">
      <body className="flex min-h-full flex-col">
        <SiteProvider>
          <CartProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <CartDrawer />
            <ChatWidgetGate />
          </CartProvider>
        </SiteProvider>
      </body>
    </html>
  );
}
