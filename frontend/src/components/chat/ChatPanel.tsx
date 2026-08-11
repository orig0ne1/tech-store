"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";
import { Headphones, Send, X } from "lucide-react";
import {
  createChat,
  getChatMessages,
  sendChatMessage,
} from "@/lib/chats";
import { getErrorMessage } from "@/lib/api";
import type { ChatMessage } from "@/types/chat";
import { Spinner } from "../ui/Spinner";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "webapp-chat-id";
const POLL_INTERVAL = 5000;

export function ChatPanel({
  className,
  onClose,
}: {
  className?: string;
  onClose?: () => void;
}) {
  const [chatId, setChatId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [text, setText] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    // Restore previous chat session from localStorage.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (stored) setChatId(stored);
  }, []);

  const scrollToBottom = useCallback(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, []);

  const loadMessages = useCallback(async () => {
    if (!chatId) return;
    try {
      const msgs = await getChatMessages(chatId);
      setMessages(msgs);
      scrollToBottom();
    } catch {
      // keep existing messages if polling fails
    }
  }, [chatId, scrollToBottom]);

  useEffect(() => {
    if (!chatId) return;
    // Load messages and poll for new ones (no WebSocket in v1).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadMessages();
    const interval = setInterval(loadMessages, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [chatId, loadMessages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const startChat = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const chat = await createChat({ name, email });
      setChatId(chat.id);
      window.localStorage.setItem(STORAGE_KEY, chat.id);
      const msgs = await getChatMessages(chat.id);
      setMessages(msgs);
      scrollToBottom();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async (e: FormEvent) => {
    e.preventDefault();
    if (!chatId || !text.trim() || sending) return;
    const trimmed = text.trim();
    setText("");
    setSending(true);
    try {
      const message = await sendChatMessage(chatId, trimmed);
      setMessages((prev) => [...prev, message]);
      scrollToBottom();
    } catch (err) {
      setError(getErrorMessage(err));
      setText(trimmed);
    } finally {
      setSending(false);
    }
  };

  return (
    <div
      className={cn("flex flex-col bg-card", className)}
      role="dialog"
      aria-modal="false"
      aria-label="Чат с менеджером"
    >
      <div className="flex items-center gap-3 border-b border-border px-4 py-3">
        <div className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Headphones className="size-5" />
        </div>
        <div>
          <p className="text-sm font-semibold">Онлайн-менеджер</p>
          <p className="text-xs text-success">Отвечаем быстро</p>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Закрыть чат"
            className="ml-auto rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X className="size-5" />
          </button>
        )}
      </div>

      {!chatId ? (
        <form
          onSubmit={startChat}
          className="flex flex-1 flex-col justify-center gap-3 px-5"
        >
          <p className="text-center text-sm text-muted-foreground">
            Представьтесь, чтобы мы могли ответить
          </p>
          <input
            type="text"
            required
            minLength={2}
            placeholder="Ваше имя"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-11 rounded-lg border border-border bg-card px-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
          <input
            type="email"
            required
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-11 rounded-lg border border-border bg-card px-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
          {error && (
            <p className="rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary text-sm font-medium text-primary-foreground transition-all hover:brightness-110 disabled:opacity-50"
          >
            {loading && <Spinner className="size-4" />}
            Начать чат
          </button>
        </form>
      ) : (
        <>
          <div
            ref={listRef}
            className="flex-1 space-y-3 overflow-y-auto px-4 py-4"
          >
            {messages.length === 0 && (
              <p className="pt-8 text-center text-sm text-muted-foreground">
                Напишите свой вопрос — менеджер ответит в ближайшее время.
              </p>
            )}
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "max-w-[80%] rounded-2xl px-3.5 py-2 text-sm",
                  message.sender === "CUSTOMER"
                    ? "ml-auto rounded-br-sm bg-primary text-primary-foreground"
                    : "rounded-bl-sm bg-muted text-foreground"
                )}
              >
                <p className="whitespace-pre-wrap break-words">
                  {message.text}
                </p>
                <p
                  className={cn(
                    "mt-1 text-[10px]",
                    message.sender === "CUSTOMER"
                      ? "text-primary-foreground/70"
                      : "text-muted-foreground"
                  )}
                >
                  {new Date(message.createdAt).toLocaleTimeString("ru-RU", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            ))}
          </div>
          {error && (
            <p className="mx-4 mb-2 rounded-lg bg-danger/10 px-3 py-2 text-xs text-danger">
              {error}
            </p>
          )}
          <form
            onSubmit={handleSend}
            className="flex items-center gap-2 border-t border-border p-3"
          >
            <input
              type="text"
              placeholder="Написать..."
              aria-label="Текст сообщения"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="h-11 flex-1 rounded-lg border border-border bg-card px-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
            <button
              type="submit"
              disabled={!text.trim() || sending}
              aria-label="Отправить сообщение"
              className="inline-flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Send className="size-4" />
            </button>
          </form>
        </>
      )}
    </div>
  );
}
