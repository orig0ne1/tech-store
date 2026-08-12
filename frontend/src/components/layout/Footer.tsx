"use client";

import Link from "next/link";
import {
  Camera,
  Clock,
  Globe,
  Mail,
  MapPin,
  MessagesSquare,
  Phone,
  Play,
  Send,
  type LucideIcon,
} from "lucide-react";
import { useSite } from "@/context/SiteProvider";
import { useLocale } from "@/context/LocaleProvider";
import type { Company } from "@/types/company";

const WEEK_DAYS: Array<{ key: keyof Company["contacts"]["workingHours"] }> = [
  { key: "monday" },
  { key: "tuesday" },
  { key: "wednesday" },
  { key: "thursday" },
  { key: "friday" },
  { key: "saturday" },
  { key: "sunday" },
];

const SOCIAL_ICONS: Record<string, LucideIcon> = {
  telegram: Send,
  vk: MessagesSquare,
  instagram: Camera,
  youtube: Play,
  website: Globe,
};

export function Footer() {
  const { company, config } = useSite();
  const { t } = useLocale();
  const catalogEnabled = config?.features.catalog ?? true;

  if (!company) return null;

  const socials = Object.entries(company.socials ?? {})
    .filter(([, href]) => href)
    .map(([key, href]) => ({
      key,
      href: href as string,
      icon: SOCIAL_ICONS[key] ?? Globe,
      label: key,
    }));

  const workingHours = company.contacts?.workingHours;
  const days = workingHours ? WEEK_DAYS.map((d) => ({ ...d, value: workingHours[d.key] })) : [];

  return (
    <footer className="relative mt-16 overflow-hidden border-t border-white/10 bg-slate-950 text-slate-300">
      <div className="container relative mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div>
          <p className="font-display text-lg font-bold text-white">
            {company.name}
          </p>
          {company.description && (
            <p className="mt-2 text-sm leading-relaxed text-slate-400">
              {company.description}
            </p>
          )}
          {socials.length > 0 && (
            <div className="mt-4 flex gap-2">
              {socials.map((social) => (
                <a
                  key={social.key}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="inline-flex size-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-300 transition-all hover:border-white/25 hover:text-white"
                >
                  <social.icon className="size-4" />
                </a>
              ))}
            </div>
          )}
        </div>

        <nav aria-label={t.common.footerNavAria}>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
            {t.common.sections}
          </h2>
          <ul className="space-y-2 text-sm">
            {catalogEnabled && (
              <>
                <li>
                  <Link href="/products" className="transition-colors hover:text-white">
                    {t.common.catalog}
                  </Link>
                </li>
                <li>
                  <Link href="/categories" className="transition-colors hover:text-white">
                    {t.common.categories}
                  </Link>
                </li>
              </>
            )}
            <li>
              <Link href="/about" className="transition-colors hover:text-white">
                {t.common.about}
              </Link>
            </li>
            <li>
              <Link href="/request" className="transition-colors hover:text-white">
                {t.common.askQuestion}
              </Link>
            </li>
          </ul>
        </nav>

        <div id="contacts">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
            {t.common.contacts}
          </h2>
          <ul className="space-y-3 text-sm">
            {company.contacts?.phone && (
              <li className="flex items-center gap-2.5">
                <Phone className="size-4 shrink-0 text-slate-500" />
                <a href={`tel:${company.contacts.phone}`} className="transition-colors hover:text-white">
                  {company.contacts.phone}
                </a>
              </li>
            )}
            {company.contacts?.email && (
              <li className="flex items-center gap-2.5">
                <Mail className="size-4 shrink-0 text-slate-500" />
                <a href={`mailto:${company.contacts.email}`} className="transition-colors hover:text-white">
                  {company.contacts.email}
                </a>
              </li>
            )}
            {company.contacts?.address && (
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 size-4 shrink-0 text-slate-500" />
                <span>{company.contacts.address}</span>
              </li>
            )}
          </ul>
        </div>

        {days.length > 0 && (
          <div>
            <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
              <Clock className="size-4" />
              {t.common.workingHours}
            </h2>
            <ul className="space-y-1.5 text-sm">
              {days.map((day) => (
                <li key={day.key} className="flex justify-between gap-4">
                  <span className="text-slate-500">{t.days[day.key]}</span>
                  <span className="capitalize">{day.value}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <div className="relative border-t border-white/10">
        <div className="container mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 px-4 py-4 text-xs text-slate-500 sm:px-6 lg:px-8">
          <p>
            © {new Date().getFullYear()} {company.name}.{" "}
            {t.common.allRightsReserved}
          </p>
          <Link href="/" className="transition-colors hover:text-white">
            {company.name}
          </Link>
        </div>
      </div>
    </footer>
  );
}
