"use client";

import { useEffect, useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { ChatPanel } from "./ChatPanel";

export function ChatWidget() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener("webapp:open-chat", onOpen);
    return () => window.removeEventListener("webapp:open-chat", onOpen);
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Закрыть чат" : "Открыть чат с менеджером"}
        className="fixed bottom-5 right-5 z-40 inline-flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-all hover:brightness-110"
      >
        {open ? <X className="size-6" /> : <MessageCircle className="size-6" />}
      </button>

      {open && (
        <div className="fixed inset-0 z-40 bg-card sm:bottom-24 sm:right-5 sm:left-auto sm:top-auto sm:h-[540px] sm:max-h-[75vh] sm:w-96 sm:rounded-2xl sm:border sm:border-border sm:shadow-2xl">
          <ChatPanel
            className="h-full sm:rounded-2xl"
            onClose={() => setOpen(false)}
          />
        </div>
      )}
    </>
  );
}
