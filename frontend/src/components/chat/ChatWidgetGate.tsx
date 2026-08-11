"use client";

import { useSite } from "@/context/SiteProvider";
import { ChatWidget } from "./ChatWidget";

export function ChatWidgetGate() {
  const { config } = useSite();
  if (!(config?.features.chat ?? true)) return null;
  return <ChatWidget />;
}
