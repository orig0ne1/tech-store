"use client";

import {
  Camera,
  Globe,
  MessagesSquare,
  Play,
  QrCode as QrIcon,
  Send,
  type LucideIcon,
} from "lucide-react";
import { useState } from "react";
import { useLocale } from "@/context/LocaleProvider";
import { cn } from "@/lib/utils";
import { QrCode } from "./QrCode";

const SOCIAL_ICONS: Record<string, LucideIcon> = {
  telegram: Send,
  vk: MessagesSquare,
  instagram: Camera,
  youtube: Play,
  website: Globe,
};

interface SocialLinkProps {
  iconName: string;
  label: string;
  href: string;
  style: string;
}

export function SocialLink({
  iconName,
  label,
  href,
  style,
}: SocialLinkProps) {
  const { t } = useLocale();
  const [showQr, setShowQr] = useState(false);
  const Icon = SOCIAL_ICONS[iconName] ?? Globe;

  return (
    <li className="glass-card overflow-hidden rounded-xl transition-colors hover:border-primary/40">
      <div className="flex items-center gap-2 py-1 pl-1 pr-2">
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="flex min-w-0 flex-1 items-center gap-3 rounded-xl px-2 py-2 text-sm font-medium transition-colors hover:bg-muted"
        >
          <span
            className={cn(
              "inline-flex size-9 shrink-0 items-center justify-center rounded-lg transition-colors",
              style
            )}
          >
            <Icon className="size-4" />
          </span>
          <span className="truncate">{label}</span>
        </a>
        <button
          type="button"
          onClick={() => setShowQr((v) => !v)}
          aria-expanded={showQr}
          aria-label={`${t.about.scanToOpen} — ${label}`}
          className={cn(
            "inline-flex size-9 shrink-0 items-center justify-center rounded-lg transition-colors",
            showQr
              ? "bg-primary/15 text-primary"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          <QrIcon className="size-4" />
        </button>
      </div>
      {showQr && (
        <div className="border-t border-border px-4 py-4">
          <QrCode href={href} label={label} />
        </div>
      )}
    </li>
  );
}
