import client from "./api";
import type { Chat, ChatMessage } from "@/types/chat";

export interface CreateChatPayload {
  name: string;
  email: string;
}

export async function createChat(payload: CreateChatPayload): Promise<Chat> {
  const { data } = await client.post<Chat>("/chats", payload);
  return data;
}

export async function getChat(chatId: string): Promise<Chat> {
  const { data } = await client.get<Chat>(`/chats/${chatId}`);
  return data;
}

export async function getChatMessages(chatId: string): Promise<ChatMessage[]> {
  const { data } = await client.get<ChatMessage[]>(`/chats/${chatId}/messages`);
  return data;
}

export async function sendChatMessage(
  chatId: string,
  text: string
): Promise<ChatMessage> {
  const { data } = await client.post<ChatMessage>(`/chats/${chatId}/messages`, {
    text,
  });
  return data;
}
