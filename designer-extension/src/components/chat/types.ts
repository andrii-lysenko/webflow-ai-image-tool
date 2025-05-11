export type ChatMode = "generate" | "enhance";

export type EasterEggState = "chat" | "snake";

export type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  images?: string[];
};
