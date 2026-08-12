import type { Metadata } from "next";
import { MessageSquareText } from "lucide-react";
import { RequestForm } from "@/components/forms/RequestForm";
import { getDictionary, tpl } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";

export async function generateMetadata(): Promise<Metadata> {
  const t = getDictionary(await getLocale());
  return {
    title: t.request.title,
    description: t.request.description,
    alternates: { canonical: "/request" },
  };
}

function readParam(value: string | string[] | undefined): string {
  return typeof value === "string" ? value : "";
}

export default async function RequestPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const productName = readParam(sp.product);
  const t = getDictionary(await getLocale());
  const defaultMessage = productName
    ? tpl(t.request.defaultMessage, { name: productName })
    : "";

  return (
    <div className="container mx-auto max-w-xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col items-center text-center">
        <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          <MessageSquareText className="size-6" />
        </div>
        <h1 className="font-display text-3xl font-bold tracking-tight">{t.request.title}</h1>
        <p className="mt-2 text-muted-foreground">
          {t.request.subtitle}
        </p>
      </div>
      <div className="glass-card rounded-2xl p-6 sm:p-8">
        <RequestForm defaultMessage={defaultMessage} />
      </div>
    </div>
  );
}
