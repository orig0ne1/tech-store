import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getCategories } from "@/lib/categories";
import { CategoryGrid } from "@/components/category/CategoryGrid";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { ErrorState } from "@/components/ui/ErrorState";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Категории",
  description: "Все категории товаров",
  alternates: { canonical: "/categories" },
};

export default async function CategoriesPage() {
  const categories = await getCategories().catch(() => null);

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <SectionTitle
        title="Категории"
        subtitle="Выберите категорию, чтобы увидеть товары"
        action={
          <Link
            href="/products"
            className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            Весь каталог
            <ArrowRight className="size-4" />
          </Link>
        }
      />
      {categories === null ? (
        <ErrorState message="Не удалось загрузить категории" />
      ) : (
        <CategoryGrid categories={categories} />
      )}
    </div>
  );
}
