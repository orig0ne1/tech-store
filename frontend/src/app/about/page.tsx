import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Clock,
  ExternalLink,
  Mail,
  MapPin,
  Phone,
  Send,
  type LucideIcon,
} from "lucide-react";
import { getCompany } from "@/lib/company";
import { dictionaries, getDictionary } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";
import { cn } from "@/lib/utils";
import type { Company } from "@/types/company";
import { ErrorState } from "@/components/ui/ErrorState";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Reveal } from "@/components/ui/Reveal";
import { PhotoScroller } from "@/components/about/PhotoScroller";
import { SocialLink } from "@/components/about/SocialLink";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const t = getDictionary(await getLocale());
  return {
    title: t.about.title,
    description: t.about.description,
    alternates: { canonical: "/about" },
  };
}

const SOCIAL_LABELS: Record<
  string,
  keyof (typeof dictionaries)["en"]["about"]
> = {
  telegram: "socialTelegram",
  vk: "socialVk",
  instagram: "socialInstagram",
  youtube: "socialYoutube",
  website: "socialWebsite",
};

const SOCIAL_STYLES: Record<string, string> = {
  telegram: "text-[#229ED9] bg-[#229ED9]/10 hover:bg-[#229ED9]/20",
  vk: "text-[#0077FF] bg-[#0077FF]/10 hover:bg-[#0077FF]/20",
  instagram: "text-[#E1306C] bg-[#E1306C]/10 hover:bg-[#E1306C]/20",
  youtube: "text-[#FF0000] bg-[#FF0000]/10 hover:bg-[#FF0000]/20",
  website: "text-primary bg-primary/10 hover:bg-primary/20",
};

const DAY_KEYS: Array<keyof Company["contacts"]["workingHours"]> = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

const HOURS_RE = /(\d{1,2}):(\d{2})\s*[-–—]\s*(\d{1,2}):(\d{2})/;

function parseHours(value: string | undefined): {
  start: number;
  end: number;
} | null {
  if (!value) return null;
  const m = HOURS_RE.exec(value);
  if (!m) return null;
  const start = Number(m[1]) * 60 + Number(m[2]);
  let end = Number(m[3]) * 60 + Number(m[4]);
  if (end <= start) end += 24 * 60;
  return { start, end };
}

export default async function AboutPage() {
  const company = await getCompany().catch(() => null);
  const t = getDictionary(await getLocale());

  if (!company) {
    return (
      <div className="container mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <ErrorState message={t.about.loadError} />
      </div>
    );
  }

  const now = new Date();
  const minutes = now.getHours() * 60 + now.getMinutes();
  const todayIndex = (now.getDay() + 6) % 7;
  const todayKey = DAY_KEYS[todayIndex];

  const hours = company.contacts?.workingHours;
  const todaySchedule = hours ? parseHours(hours[todayKey]) : null;
  const openNow =
    todaySchedule !== null &&
    minutes >= todaySchedule.start &&
    minutes < todaySchedule.end;

  const socials = Object.entries(company.socials ?? {})
    .filter(([, href]) => href)
    .map(([key, href]) => ({
      key,
      href: href as string,
      label: t.about[SOCIAL_LABELS[key]] ?? key,
      style: SOCIAL_STYLES[key] ?? SOCIAL_STYLES.website,
    }));

  const contacts = [
    {
      key: "phone",
      icon: Phone,
      label: t.common.phone,
      value: company.contacts?.phone,
      href: company.contacts?.phone
        ? `tel:${company.contacts.phone}`
        : null,
    },
    {
      key: "email",
      icon: Mail,
      label: t.common.email,
      value: company.contacts?.email,
      href: company.contacts?.email
        ? `mailto:${company.contacts.email}`
        : null,
    },
    {
      key: "address",
      icon: MapPin,
      label: t.common.address,
      value: company.contacts?.address,
      href: null,
    },
  ].filter((c) => c.value) as Array<{
    key: string;
    icon: LucideIcon;
    label: string;
    value: string;
    href: string | null;
  }>;

  const lat =
    typeof company.latitude === "number" ? company.latitude : null;
  const lng =
    typeof company.longitude === "number" ? company.longitude : null;
  const hasCoords = lat !== null && lng !== null;

  const osmOpen = hasCoords
    ? `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=16/${lat}/${lng}`
    : null;

  const osmSrc = hasCoords
    ? `https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.008},${lat - 0.006},${lng + 0.008},${lat + 0.006}&layer=mapnik&marker=${lat},${lng}`
    : null;

  const address = company.contacts?.address;

  return (
    <div className="container mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <Reveal>
        <section className="glass-card relative overflow-hidden rounded-3xl p-6 sm:p-10">
          <div
            className="absolute -right-16 -top-16 size-56 rounded-full bg-primary/15 blur-3xl"
            aria-hidden="true"
          />
          <div
            className="absolute -bottom-20 left-1/3 size-48 rounded-full bg-accent blur-3xl"
            aria-hidden="true"
          />
          <div className="relative z-10 flex flex-col items-start gap-6 sm:flex-row sm:items-start">
            {company.logo && (
              <Image
                src={company.logo}
                alt={company.name}
                width={96}
                height={96}
                unoptimized
                className="size-24 shrink-0 rounded-2xl bg-card object-contain p-2 shadow-sm ring-1 ring-border"
              />
            )}
            <div className="min-w-0 flex-1">
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium",
                  openNow
                    ? "bg-success/10 text-success"
                    : "bg-muted text-muted-foreground"
                )}
              >
                <span
                  className={cn(
                    "size-1.5 rounded-full",
                    openNow ? "bg-success" : "bg-muted-foreground"
                  )}
                />
                {openNow ? t.about.openNow : t.about.closedNow}
              </span>
              <h1 className="font-display mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                {company.name}
              </h1>
              {company.description && (
                <p className="mt-2 max-w-2xl text-lg leading-relaxed text-muted-foreground">
                  {company.description}
                </p>
              )}
              <div className="mt-6 flex flex-wrap gap-3">
                {osmOpen && (
                  <a
                    href={osmOpen}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glass-primary inline-flex h-12 items-center justify-center gap-2 rounded-lg px-7 text-base font-medium transition-all"
                  >
                    {t.about.getDirections}
                    <ExternalLink className="size-4" />
                  </a>
                )}
                <Link
                  href="/request"
                  className="glass inline-flex h-12 items-center justify-center gap-2 rounded-lg px-7 text-base font-medium transition-colors hover:bg-muted"
                >
                  {t.common.submitRequest}
                </Link>
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      {company.photos && company.photos.length > 0 && (
        <Reveal>
          <section className="mt-12">
            <SectionTitle
              title={t.about.ourPlace}
              subtitle={t.about.ourPlaceText}
            />
            <PhotoScroller photos={company.photos} />
          </section>
        </Reveal>
      )}

      <Reveal>
        <section className="mt-12 grid gap-6 lg:grid-cols-3">
          <div className="glass-card overflow-hidden rounded-2xl lg:col-span-2">
            <div className="p-6 pb-4">
              <h2 className="flex items-center gap-3 text-xl font-bold tracking-tight">
                <span className="inline-flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <MapPin className="size-5" />
                </span>
                {t.about.mapTitle}
              </h2>
            </div>
            {hasCoords ? (
              <>
                <iframe
                  title={t.about.mapTitle}
                  src={osmSrc!}
                  className="block h-72 w-full sm:h-80"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
                <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4">
                  <p className="min-w-0 text-sm text-muted-foreground">
                    {address}
                  </p>
                  <a
                    href={osmOpen!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glass-primary inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg px-4 text-sm font-medium transition-all"
                  >
                    {t.about.openInMaps}
                    <ExternalLink className="size-4" />
                  </a>
                </div>
              </>
            ) : (
              <div className="p-6 pt-0">
                <p className="text-muted-foreground">{address}</p>
                {address && (
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glass-primary mt-4 inline-flex h-10 items-center justify-center gap-2 rounded-lg px-4 text-sm font-medium transition-all"
                  >
                    {t.about.openInMaps}
                    <ExternalLink className="size-4" />
                  </a>
                )}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-4">
            {contacts.map((contact) => (
              <div
                key={contact.key}
                className="glass-card group flex items-center gap-4 rounded-2xl p-5"
              >
                <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform group-hover:scale-105">
                  <contact.icon className="size-5" />
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    {contact.label}
                  </p>
                  {contact.href ? (
                    <a
                      href={contact.href}
                      className="mt-1 block break-words text-sm font-semibold transition-colors hover:text-primary"
                    >
                      {contact.value}
                    </a>
                  ) : (
                    <p className="mt-1 break-words text-sm font-semibold">
                      {contact.value}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section className="mt-12 grid gap-6 lg:grid-cols-3">
          <div className="glass-card rounded-2xl p-6 lg:col-span-2">
            <h2 className="flex items-center gap-3 text-xl font-bold tracking-tight">
              <span className="inline-flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Clock className="size-5" />
              </span>
              {t.about.scheduleTitle}
            </h2>
            {hours && (
              <ul className="mt-5 space-y-1">
                {DAY_KEYS.map((key) => {
                  const isToday = key === todayKey;
                  const schedule = parseHours(hours[key]);
                  return (
                    <li
                      key={key}
                      className={cn(
                        "flex items-center justify-between gap-4 rounded-xl px-4 py-3 transition-colors",
                        isToday && "bg-primary/5 ring-1 ring-primary/20"
                      )}
                    >
                      <span className="flex items-center gap-3">
                        <span
                          className={cn(
                            "w-24 text-sm font-medium",
                            isToday ? "text-primary" : "text-foreground"
                          )}
                        >
                          {t.days[key]}
                        </span>
                        {isToday && (
                          <span className="glass-primary rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide">
                            {t.about.today}
                          </span>
                        )}
                      </span>
                      {schedule ? (
                        <span className="text-sm tabular-nums text-muted-foreground">
                          {hours[key]}
                        </span>
                      ) : (
                        <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                          {t.about.closed}
                        </span>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <div className="glass-card rounded-2xl p-6">
            <h2 className="flex items-center gap-3 text-xl font-bold tracking-tight">
              <span className="inline-flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Send className="size-5" />
              </span>
              {t.about.socialsTitle}
            </h2>
            {socials.length === 0 ? (
              <p className="mt-5 text-sm text-muted-foreground">
                {t.about.socialsNone}
              </p>
            ) : (
              <ul className="mt-5 space-y-2">
                {socials.map((social) => (
                  <SocialLink
                    key={social.key}
                    iconName={social.key}
                    label={social.label}
                    href={social.href}
                    style={social.style}
                  />
                ))}
              </ul>
            )}
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section className="glass-card mt-12 overflow-hidden rounded-2xl p-8 sm:p-10">
          <h2 className="font-display text-2xl font-bold tracking-tight">
            {t.about.askCtaTitle}
          </h2>
          <p className="mt-2 max-w-md text-muted-foreground">
            {t.about.askCtaText}
          </p>
          <Link
            href="/request"
            className="glass-primary mt-6 inline-flex h-12 items-center justify-center gap-2 rounded-lg px-7 text-base font-medium transition-all"
          >
            {t.common.submitRequest}
            <ArrowRight className="size-4" />
          </Link>
        </section>
      </Reveal>
    </div>
  );
}
