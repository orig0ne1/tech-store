"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, ImageOff, Maximize2 } from "lucide-react";
import { useLocale } from "@/context/LocaleProvider";
import { tpl } from "@/lib/i18n";
import { ZoomableImage } from "./ZoomableImage";
import { ProductImage } from "../ui/ProductImage";
import { Modal } from "../ui/Modal";
import { cn } from "@/lib/utils";

interface ProductGalleryProps {
  images: string[];
  name: string;
}

export function ProductGallery({ images, name }: ProductGalleryProps) {
  const { t } = useLocale();
  const list = images.filter(Boolean);
  const [active, setActive] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const current = list[active];

  const prev = () => setActive((i) => (i - 1 + list.length) % list.length);
  const next = () => setActive((i) => (i + 1) % list.length);
  const onSwipe = (direction: 1 | -1) => (direction === 1 ? next() : prev());

  if (!current) {
    return (
      <div className="flex aspect-square w-full items-center justify-center rounded-2xl border border-border bg-muted text-muted-foreground">
        <ImageOff className="size-10 opacity-40" />
      </div>
    );
  }

  const zoomable = (
    <ZoomableImage
      key={current}
      src={current}
      alt={name}
      sizes="(max-width: 768px) 100vw, 50vw"
      priority
      allowSwipe={list.length > 1}
      controls
      onSwipe={onSwipe}
      className="h-full w-full"
    />
  );

  return (
    <div className="flex flex-col gap-3">
      <div className="group relative">
        <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-border bg-muted">
          {zoomable}
        </div>

        {list.length > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              aria-label={t.common.prevPhoto}
              className="absolute left-2 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white opacity-0 transition-opacity hover:bg-black/60 focus-visible:opacity-100 group-hover:opacity-100"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label={t.common.nextPhoto}
              className="absolute right-2 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white opacity-0 transition-opacity hover:bg-black/60 focus-visible:opacity-100 group-hover:opacity-100"
            >
              <ChevronRight className="size-5" />
            </button>
          </>
        )}

        <button
          type="button"
          onClick={() => setFullscreen(true)}
          aria-label={t.common.openFullscreen}
          title={t.common.fullscreenTitle}
          className="absolute bottom-3 right-3 flex size-9 items-center justify-center rounded-lg bg-black/40 text-white transition-colors hover:bg-black/60"
        >
          <Maximize2 className="size-4" />
        </button>
      </div>

      {list.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {list.map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              onClick={() => setActive(index)}
              aria-label={tpl(t.common.imageLabel, { n: index + 1 })}
              aria-current={index === active}
              className={cn(
                "relative size-20 shrink-0 overflow-hidden rounded-lg border bg-muted transition-colors",
                index === active
                  ? "border-primary ring-2 ring-primary/40"
                  : "border-border hover:border-primary/50"
              )}
            >
              <ProductImage
                src={image}
                alt={tpl(t.common.photoAlt, { name, n: index + 1 })}
              />
            </button>
          ))}
        </div>
      )}

      <Modal
        open={fullscreen}
        onClose={() => setFullscreen(false)}
        title={name}
        className="sm:max-w-4xl"
      >
        <div className="relative aspect-square w-full overflow-hidden rounded-xl border border-border bg-muted">
          <ZoomableImage
            key={current}
            src={current}
            alt={name}
            allowSwipe={list.length > 1}
            controls
            onSwipe={onSwipe}
            className="h-full w-full"
          />
        </div>
      </Modal>
    </div>
  );
}
