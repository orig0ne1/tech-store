import type { Metadata } from "next";
import { MessageSquareText } from "lucide-react";
import { RequestForm } from "@/components/forms/RequestForm";

export const metadata: Metadata = {
  title: "Задать вопрос",
  description: "Оставьте заявку — мы свяжемся с вами",
  alternates: { canonical: "/request" },
};

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
  const defaultMessage = productName
    ? `Здравствуйте! Хочу узнать подробнее о товаре «${productName}».`
    : "";

  return (
    <div className="container mx-auto max-w-xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col items-center text-center">
        <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          <MessageSquareText className="size-6" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Задать вопрос</h1>
        <p className="mt-2 text-muted-foreground">
          Консультация, расчёт стоимости или обратный звонок — оставьте заявку
        </p>
      </div>
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <RequestForm defaultMessage={defaultMessage} />
      </div>
    </div>
  );
}
