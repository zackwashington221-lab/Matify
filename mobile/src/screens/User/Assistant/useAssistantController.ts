import { useState } from "react";

type Message = { role: "ai" | "user"; text: string };

export default function useAssistantController() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { role: "ai", text: "Hi! I can plan your groceries, find healthier swaps, and stay within your budget." },
  ]);
  const send = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    setMessages((current) => current.concat([
      { role: "user", text: trimmed },
      { role: "ai", text: "I have added that to your plan. Want a healthier alternative too?" },
    ]));
    setInput("");
  };
  return { values: { input, messages }, functions: { send, setInput } };
}
