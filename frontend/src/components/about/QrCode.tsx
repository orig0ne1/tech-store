"use client";

import Image from "next/image";
import { useState } from "react";
import { useLocale } from "@/context/LocaleProvider";
import { cn } from "@/lib/utils";

interface QrCodeProps {
  href: string;
  label: string;
  className?: string;
}

export function QrCode({ href, label, className }: QrCodeProps) {
  const { t } = useLocale();
  const [failed, setFailed] = useState(false);

  if (failed) return null;

  const src = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&margin=14&data=${encodeURIComponent(
    href
  )}`;

  return (
    <div
      className={cn(
        "flex flex-col items-center gap-3 text-center",
        className
      )}
    >
      <div className="glass rounded-xl p-2">
        <Image
          src={src}
          alt={t.about.scanToOpen}
          width={160}
          height={160}
          unoptimized
          className="h-32 w-32 rounded-lg bg-white sm:h-40 sm:w-40"
          onError={() => setFailed(true)}
        />
      </div>
      <p className="text-xs text-muted-foreground">
        {t.about.scanToOpen}
      </p>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="max-w-full truncate text-xs font-semibold text-primary hover:underline"
      >
        {label}
      </a>
    </div>
  );
}
