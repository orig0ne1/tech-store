import Image from "next/image";

export function PhotoScroller({ photos }: { photos: string[] }) {
  if (photos.length === 0) return null;

  const items = [...photos, ...photos];

  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-background to-transparent sm:w-24" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-background to-transparent sm:w-24" />
      <div className="animate-marquee flex w-max gap-4 py-2">
        {items.map((src, i) => (
          <div
            key={`${src}-${i}`}
            className="glass-card relative h-44 w-64 shrink-0 overflow-hidden rounded-2xl sm:h-52 sm:w-80"
          >
            <Image
              src={src}
              alt=""
              fill
              sizes="(max-width: 640px) 256px, 320px"
              className="object-cover"
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
