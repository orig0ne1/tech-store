import type { Metadata } from "next";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { getCompany } from "@/lib/company";
import { ErrorState } from "@/components/ui/ErrorState";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "О компании",
  description: "Информация о компании и контактах",
  alternates: { canonical: "/about" },
};

const WEEK_DAYS: Array<{ key: string; label: string }> = [
  { key: "monday", label: "Понедельник" },
  { key: "tuesday", label: "Вторник" },
  { key: "wednesday", label: "Среда" },
  { key: "thursday", label: "Четверг" },
  { key: "friday", label: "Пятница" },
  { key: "saturday", label: "Суббота" },
  { key: "sunday", label: "Воскресенье" },
];

export default async function AboutPage() {
  const company = await getCompany().catch(() => null);

  if (!company) {
    return (
      <div className="container mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <ErrorState message="Не удалось загрузить информацию о компании" />
      </div>
    );
  }

  const socials = [
    { key: "telegram", label: "Telegram", href: company.socials?.telegram },
    { key: "vk", label: "ВКонтакте", href: company.socials?.vk },
    { key: "instagram", label: "Instagram", href: company.socials?.instagram },
    { key: "youtube", label: "YouTube", href: company.socials?.youtube },
    { key: "website", label: "Сайт", href: company.socials?.website },
  ].filter((s) => s.href) as Array<{ key: string; label: string; href: string }>;

  const hours = company.contacts?.workingHours;

  return (
    <div className="container mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight">О компании</h1>

      {company.logo && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={company.logo}
          alt={company.name}
          className="mt-6 h-16 w-16 rounded-xl object-contain"
        />
      )}
      <p className="mt-4 text-lg leading-relaxed text-foreground">
        {company.name}
      </p>
      {company.description && (
        <p className="mt-3 leading-relaxed text-muted-foreground">
          {company.description}
        </p>
      )}

      <div id="contacts" className="mt-10 grid gap-6 sm:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="mb-4 text-lg font-semibold">Контакты</h2>
          <ul className="space-y-3 text-sm">
            {company.contacts?.phone && (
              <li className="flex items-center gap-2.5">
                <Phone className="size-4 shrink-0 text-muted-foreground" />
                <a href={`tel:${company.contacts.phone}`} className="hover:text-primary">
                  {company.contacts.phone}
                </a>
              </li>
            )}
            {company.contacts?.email && (
              <li className="flex items-center gap-2.5">
                <Mail className="size-4 shrink-0 text-muted-foreground" />
                <a href={`mailto:${company.contacts.email}`} className="hover:text-primary">
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

        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="mb-4 text-lg font-semibold">Социальные сети</h2>
          {socials.length === 0 ? (
            <p className="text-sm text-muted-foreground">Пока не подключены</p>
          ) : (
            <ul className="space-y-2 text-sm">
              {socials.map((social) => (
                <li key={social.key}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-primary hover:underline"
                  >
                    {social.label}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        {hours && (
          <div className="rounded-2xl border border-border bg-card p-6 sm:col-span-2">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
              <Clock className="size-5 text-muted-foreground" />
              График работы
            </h2>
            <ul className="grid gap-2 text-sm sm:grid-cols-2">
              {WEEK_DAYS.map((day) => (
                <li
                  key={day.key}
                  className="flex justify-between gap-4 border-b border-border pb-2 last:border-0"
                >
                  <span className="text-muted-foreground">{day.label}</span>
                  <span className="capitalize">
                    {hours[day.key as keyof typeof hours]}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
