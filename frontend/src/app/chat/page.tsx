import type { Metadata } from "next";
import { ChatPanel } from "@/components/chat/ChatPanel";

export const metadata: Metadata = {
  title: "Чат с менеджером",
  description: "Задайте вопрос менеджеру в чате",
  alternates: { canonical: "/chat" },
};

export default function ChatPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-3xl font-bold tracking-tight">
        Чат с менеджером
      </h1>
      <div className="overflow-hidden rounded-2xl border border-border shadow-sm">
        <ChatPanel className="h-[60vh]" />
      </div>
    </div>
  );
}
