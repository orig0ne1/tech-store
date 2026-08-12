import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { Category } from "@/types/category";
import { ProductImage } from "../ui/ProductImage";

export function CategoryCard({ category }: { category: Category }) {
  return (
    <Link
      href={`/categories/${category.slug}`}
      className="glass-card group relative flex aspect-[4/5] flex-col justify-end overflow-hidden rounded-xl transition-all duration-200 hover:-translate-y-1 hover:shadow-lift"
    >
      <div className="absolute inset-0">
        <ProductImage
          src={category.image}
          alt={category.name}
          sizes="(max-width: 640px) 50vw, 25vw"
          imageClassName="transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />
      <div className="relative flex items-center justify-between p-4">
        <h3 className="font-display text-base font-semibold text-white sm:text-lg">
          {category.name}
        </h3>
        <span className="glass inline-flex size-8 items-center justify-center rounded-full text-white transition-transform duration-200 group-hover:translate-x-0.5">
          <ChevronRight className="size-4" />
        </span>
      </div>
    </Link>
  );
}
