import type { Metadata } from "next";
import { Suspense } from "react";
import { Bell } from "lucide-react";
import { AvailabilityForm } from "@/components/forms/AvailabilityForm";
import { PageSkeleton } from "@/components/ui/PageSkeleton";

export const metadata: Metadata = {
  title: "Сообщить о поступлении",
  description: "Оставьте заявку, и мы сообщим, когда товар появится в наличии",
  alternates: { canonical: "/availability" },
};

export default function AvailabilityPage() {
  return (
    <div className="container mx-auto max-w-xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col items-center text-center">
        <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Bell className="size-6" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">
          Сообщить о поступлении
        </h1>
        <p className="mt-2 text-muted-foreground">
          Выберите товар — мы напишем вам, как только он появится в наличии
        </p>
      </div>
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <Suspense fallback={<PageSkeleton />}>
          <AvailabilityForm />
        </Suspense>
      </div>
    </div>
  );
}
