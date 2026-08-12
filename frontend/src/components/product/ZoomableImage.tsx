"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Minus, Plus, RotateCcw } from "lucide-react";
import { useLocale } from "@/context/LocaleProvider";
import { cn } from "@/lib/utils";

const MAX_SCALE = 4;

interface Point {
  x: number;
  y: number;
}

interface ZoomableImageProps {
  src: string;
  alt: string;
  sizes?: string;
  priority?: boolean;
  allowSwipe?: boolean;
  controls?: boolean;
  onSwipe?: (direction: 1 | -1) => void;
  className?: string;
  imageClassName?: string;
}

export function ZoomableImage({
  src,
  alt,
  sizes,
  priority,
  allowSwipe,
  controls,
  onSwipe,
  className,
  imageClassName,
}: ZoomableImageProps) {
  const { t } = useLocale();
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState<Point>({ x: 0, y: 0 });

  const scaleRef = useRef(1);
  const translateRef = useRef<Point>({ x: 0, y: 0 });
  const pointers = useRef(new Map<number, Point>());
  const gestureRef = useRef({
    startDistance: 0,
    startScale: 1,
    startTranslate: { x: 0, y: 0 },
    startPoint: { x: 0, y: 0 },
    swipeStart: { x: 0, y: 0 },
    lastTap: undefined as { x: number; y: number; t: number } | undefined,
  });

  const updateTransform = useCallback((nextScale: number, nextTranslate: Point) => {
    scaleRef.current = nextScale;
    translateRef.current = nextTranslate;
    setScale(nextScale);
    setTranslate(nextTranslate);
  }, []);

  const containerSize = useCallback(() => {
    const el = containerRef.current;
    return el ? { w: el.clientWidth, h: el.clientHeight } : { w: 1, h: 1 };
  }, []);

  const clampScale = useCallback((value: number) => {
    return Math.max(1, Math.min(MAX_SCALE, value));
  }, []);

  const clampTranslate = useCallback(
    (value: number, t: Point) => {
      const { w, h } = containerSize();
      const maxX = ((value - 1) * w) / 2;
      const maxY = ((value - 1) * h) / 2;
      return {
        x: Math.max(-maxX, Math.min(maxX, t.x)),
        y: Math.max(-maxY, Math.min(maxY, t.y)),
      };
    },
    [containerSize]
  );

  const zoomAt = useCallback(
    (targetScale: number, clientX: number, clientY: number) => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const s1 = scaleRef.current;
      const s2 = clampScale(targetScale);
      const factor = s2 / s1;
      const px = clientX - cx;
      const py = clientY - cy;
      updateTransform(
        s2,
        clampTranslate(s2, {
          x: translateRef.current.x * factor + (1 - factor) * px,
          y: translateRef.current.y * factor + (1 - factor) * py,
        })
      );
    },
    [clampScale, clampTranslate, updateTransform]
  );

  const reset = useCallback(() => {
    updateTransform(1, { x: 0, y: 0 });
  }, [updateTransform]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const factor = Math.exp(-e.deltaY * 0.0015);
      const target = clampScale(scaleRef.current * factor);
      if (target !== scaleRef.current) zoomAt(target, e.clientX, e.clientY);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [clampScale, zoomAt]);

  const distance = (a: Point, b: Point) => Math.hypot(a.x - b.x, a.y - b.y);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const gesture = gestureRef.current;
    if (pointers.current.size === 1) {
      gesture.swipeStart = { x: e.clientX, y: e.clientY };
      gesture.startPoint = { x: e.clientX, y: e.clientY };
      gesture.startTranslate = { ...translateRef.current };
    } else if (pointers.current.size === 2) {
      const [p1, p2] = [...pointers.current.values()];
      gesture.startDistance = distance(p1, p2);
      gesture.startScale = scaleRef.current;
      gesture.startTranslate = { ...translateRef.current };
    }
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!pointers.current.has(e.pointerId)) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const gesture = gestureRef.current;
    if (pointers.current.size >= 2) {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const [p1, p2] = [...pointers.current.values()];
      const mid = { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };
      const nextScale = clampScale(
        gesture.startScale * (distance(p1, p2) / gesture.startDistance)
      );
      const factor = nextScale / gesture.startScale;
      updateTransform(
        nextScale,
        clampTranslate(nextScale, {
          x: gesture.startTranslate.x * factor + (1 - factor) * (mid.x - rect.left - rect.width / 2),
          y: gesture.startTranslate.y * factor + (1 - factor) * (mid.y - rect.top - rect.height / 2),
        })
      );
    } else if (pointers.current.size === 1 && scaleRef.current > 1) {
      const cur = pointers.current.get(e.pointerId)!;
      updateTransform(
        scaleRef.current,
        clampTranslate(scaleRef.current, {
          x: gesture.startTranslate.x + (cur.x - gesture.startPoint.x),
          y: gesture.startTranslate.y + (cur.y - gesture.startPoint.y),
        })
      );
    }
  };

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size > 0) return;
    const gesture = gestureRef.current;
    const cur = { x: e.clientX, y: e.clientY };
    const dx = cur.x - gesture.swipeStart.x;
    const dy = cur.y - gesture.swipeStart.y;
    if (Math.hypot(dx, dy) < 8) {
      const now = Date.now();
      const prev = gesture.lastTap;
      gesture.lastTap = { x: cur.x, y: cur.y, t: now };
      if (
        prev &&
        now - prev.t < 300 &&
        Math.hypot(cur.x - prev.x, cur.y - prev.y) < 30
      ) {
        gesture.lastTap = undefined;
        if (scaleRef.current > 1) reset();
        else zoomAt(2.5, cur.x, cur.y);
      }
    } else if (
      allowSwipe &&
      scaleRef.current <= 1 &&
      Math.abs(dx) > 50 &&
      Math.abs(dx) > Math.abs(dy) * 1.5
    ) {
      onSwipe?.(dx < 0 ? 1 : -1);
    }
  };

  const onPointerCancel = (e: React.PointerEvent<HTMLDivElement>) => {
    pointers.current.delete(e.pointerId);
  };

  const zoomBy = (factor: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    zoomAt(scaleRef.current * factor, rect.left + rect.width / 2, rect.top + rect.height / 2);
  };

  const zoomed = scale > 1;

  const controlClass =
    "flex size-8 items-center justify-center rounded-lg bg-black/50 text-white transition-colors hover:bg-black/70";

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative overflow-hidden touch-none select-none bg-muted",
        zoomed ? "cursor-grab active:cursor-grabbing" : "cursor-zoom-in",
        className
      )}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerCancel}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes ?? "(max-width: 768px) 100vw, 50vw"}
        priority={priority}
        draggable={false}
        className={cn("object-cover", imageClassName)}
        style={{
          transform: `translate(${translate.x}px, ${translate.y}px) scale(${scale})`,
          transition: !zoomed ? "transform 0.15s ease" : undefined,
        }}
      />

      {controls && (
        <>
          {!zoomed && (
            <span className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-black/50 px-3 py-1 text-[11px] text-white">
              {t.common.zoomHint}
            </span>
          )}
          <div className="absolute right-3 top-3 flex flex-col gap-1.5">
            <button
              type="button"
              onClick={() => zoomBy(1.5)}
              aria-label={t.common.zoomIn}
              title={t.common.zoomIn}
              className={controlClass}
            >
              <Plus className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => zoomBy(1 / 1.5)}
              aria-label={t.common.zoomOut}
              title={t.common.zoomOut}
              className={controlClass}
            >
              <Minus className="size-4" />
            </button>
            <button
              type="button"
              onClick={reset}
              aria-label={t.common.resetZoom}
              title={t.common.resetZoom}
              className={controlClass}
            >
              <RotateCcw className="size-4" />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
