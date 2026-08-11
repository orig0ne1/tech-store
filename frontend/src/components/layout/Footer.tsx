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
import type { Company } from "@/types/company";

const WEEK_DAYS: Array<{ key: keyof Company["contacts"]["workingHours"]; label: string }> = [
  { key: "monday", label: "Пн" },
  { key: "tuesday", label: "Вт" },
  { key: "wednesday", label: "Ср" },
  { key: "thursday", label: "Чт" },
  { key: "friday", label: "Пт" },
  { key: "saturday", label: "Сб" },
  { key: "sunday", label: "Вс" },
];

const DAY_LABELS: Record<string, string> = {
  monday: "Понедельник",
  tuesday: "Вторник",
  wednesday: "Среда",
  thursday: "Четверг",
  friday: "Пятница",
  saturday: "Суббота",
  sunday: "Воскресенье",
};

const SOCIAL_ICONS: Record<string, LucideIcon> = {
  telegram: Send,
  vk: MessagesSquare,
  instagram: Camera,
  youtube: Play,
  website: Globe,
};

export function Footer() {
  const { company, config } = useSite();
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
    <footer className="border-t border-border bg-muted">
      <div className="container mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div>
          <p className="text-lg font-bold">{company.name}</p>
          {company.description && (
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
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
                  className="inline-flex size-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:text-primary"
                >
                  <social.icon className="size-4" />
                </a>
              ))}
            </div>
          )}
        </div>

        <nav aria-label="Навигация в подвале">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Разделы
          </h2>
          <ul className="space-y-2 text-sm">
            {catalogEnabled && (
              <>
                <li>
                  <Link href="/products" className="transition-colors hover:text-primary">
                    Каталог
                  </Link>
                </li>
                <li>
                  <Link href="/categories" className="transition-colors hover:text-primary">
                    Категории
                  </Link>
                </li>
              </>
            )}
            <li>
              <Link href="/about" className="transition-colors hover:text-primary">
                О компании
              </Link>
            </li>
            <li>
              <Link href="/request" className="transition-colors hover:text-primary">
                Задать вопрос
              </Link>
            </li>
          </ul>
        </nav>

        <div id="contacts">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Контакты
          </h2>
          <ul className="space-y-3 text-sm">
            {company.contacts?.phone && (
              <li className="flex items-center gap-2.5">
                <Phone className="size-4 shrink-0 text-muted-foreground" />
                <a href={`tel:${company.contacts.phone}`} className="transition-colors hover:text-primary">
                  {company.contacts.phone}
                </a>
              </li>
            )}
            {company.contacts?.email && (
              <li className="flex items-center gap-2.5">
                <Mail className="size-4 shrink-0 text-muted-foreground" />
                <a href={`mailto:${company.contacts.email}`} className="transition-colors hover:text-primary">
                  {company.contacts.email}
                </a>
              </li>
            )}
            {company.contacts?.address && (
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                <span>{company.contacts.address}</span>
              </li>
            )}
          </ul>
        </div>

        {days.length > 0 && (
          <div>
            <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              <Clock className="size-4" />
              Часы работы
            </h2>
            <ul className="space-y-1.5 text-sm">
              {days.map((day) => (
                <li key={day.key} className="flex justify-between gap-4">
                  <span className="text-muted-foreground">{DAY_LABELS[day.key]}</span>
                  <span className="capitalize">{day.value}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <div className="border-t border-border">
        <div className="container mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 px-4 py-4 text-xs text-muted-foreground sm:px-6 lg:px-8">
          <p>
            © {new Date().getFullYear()} {company.name}. Все права защищены.
          </p>
          <Link href="/" className="transition-colors hover:text-primary">
            {company.name}
          </Link>
        </div>
      </div>
    </footer>
  );
}
