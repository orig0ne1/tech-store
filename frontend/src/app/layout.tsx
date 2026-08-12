import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter, Unbounded } from "next/font/google";
import "./globals.css";
import { SiteProvider } from "@/context/SiteProvider";
import { CartProvider } from "@/context/CartProvider";
import { LocaleProvider } from "@/context/LocaleProvider";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { getDictionary } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-sans",
  display: "swap",
});

const unbounded = Unbounded({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "700", "800"],
  variable: "--font-display",
  display: "swap",
});

const THEME_INIT = `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}})();`;

export async function generateMetadata(): Promise<Metadata> {
  const t = getDictionary(await getLocale());
  return {
    title: {
      default: t.common.store,
      template: "%s",
    },
    description: t.common.onlineStore,
  };
}

export default async function RootLayout({ children }: { children: ReactNode }) {
  const locale = await getLocale();

  return (
    <html
      lang={locale}
      className={`${inter.variable} ${unbounded.variable} h-full`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT }} />
      </head>
      <body className="flex min-h-full flex-col">
        <div
          className="ambient-bg pointer-events-none fixed inset-0 z-0"
          aria-hidden="true"
        />
        <div className="relative z-10 flex flex-1 flex-col">
          <LocaleProvider locale={locale}>
            <SiteProvider>
              <CartProvider>
                <Header />
                <main className="flex-1">{children}</main>
                <Footer />
                <CartDrawer />
              </CartProvider>
            </SiteProvider>
          </LocaleProvider>
        </div>
      </body>
    </html>
  );
}
