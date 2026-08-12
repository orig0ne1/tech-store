import type { Metadata } from "next";
import { Suspense } from "react";
import { Bell } from "lucide-react";
import { AvailabilityForm } from "@/components/forms/AvailabilityForm";
import { PageSkeleton } from "@/components/ui/PageSkeleton";
import { getDictionary } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";

export async function generateMetadata(): Promise<Metadata> {
  const t = getDictionary(await getLocale());
  return {
    title: t.availability.title,
    description: t.availability.description,
    alternates: { canonical: "/availability" },
  };
}

export default async function AvailabilityPage() {
  const t = getDictionary(await getLocale());
  return (
    <div className="container mx-auto max-w-xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col items-center text-center">
        <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Bell className="size-6" />
        </div>
        <h1 className="font-display text-3xl font-bold tracking-tight">
          {t.availability.title}
        </h1>
        <p className="mt-2 text-muted-foreground">
          {t.availability.subtitle}
        </p>
      </div>
      <div className="glass-card rounded-2xl p-6 sm:p-8">
        <Suspense fallback={<PageSkeleton />}>
          <AvailabilityForm />
        </Suspense>
      </div>
    </div>
  );
}
