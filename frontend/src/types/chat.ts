export type ChatStatus = "OPEN" | "CLOSED";
export type ChatSender = "CUSTOMER" | "MANAGER";

export interface Chat {
  id: string;
  name: string;
  email: string;
  status: ChatStatus;
  createdAt: string;
}

export interface ChatMessage {
  id: number;
  sender: ChatSender;
  text: string;
  createdAt: string;
}
