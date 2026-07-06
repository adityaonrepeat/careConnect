export type ChatRole = "user" | "assistant";

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  ts: number;
}

export interface SubmitResponse {
  ok: boolean;
  refId?: string;
  error?: string;
}

export interface ChatResponse {
  reply: string;
  
  blocked?: boolean;
  error?: string;
}
