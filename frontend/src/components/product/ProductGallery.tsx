"use client";

import { useState } from "react";
import { ProductImage } from "../ui/ProductImage";
import { cn } from "@/lib/utils";

interface ProductGalleryProps {
  images: string[];
  name: string;
}

export function ProductGallery({ images, name }: ProductGalleryProps) {
  const list = images.filter(Boolean);
  const [active, setActive] = useState(0);
  const current = list[active];

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-border bg-muted">
        <ProductImage
          src={current}
          alt={name}
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
      </div>
      {list.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {list.map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`Изображение ${index + 1}`}
              aria-current={index === active}
              className={cn(
                "relative size-20 shrink-0 overflow-hidden rounded-lg border bg-muted transition-colors",
                index === active
                  ? "border-primary ring-2 ring-primary/40"
                  : "border-border hover:border-primary/50"
              )}
            >
              <ProductImage src={image} alt={`${name} — фото ${index + 1}`} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
