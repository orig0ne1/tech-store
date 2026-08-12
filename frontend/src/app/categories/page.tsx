import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getCategories } from "@/lib/categories";
import { getDictionary } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";
import { CategoryGrid } from "@/components/category/CategoryGrid";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { ErrorState } from "@/components/ui/ErrorState";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const t = getDictionary(await getLocale());
  return {
    title: t.categories.title,
    description: t.categories.description,
    alternates: { canonical: "/categories" },
  };
}

export default async function CategoriesPage() {
  const categories = await getCategories().catch(() => null);
  const t = getDictionary(await getLocale());

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <SectionTitle
        title={t.categories.title}
        subtitle={t.categories.chooseSubtitle}
        action={
          <Link
            href="/products"
            className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            {t.common.fullCatalog}
            <ArrowRight className="size-4" />
          </Link>
        }
      />
      {categories === null ? (
        <ErrorState message={t.categories.loadError} />
      ) : (
        <CategoryGrid categories={categories} />
      )}
    </div>
  );
}
