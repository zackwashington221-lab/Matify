import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { StoreLayout } from "@/components/store/StoreLayout";
import { Sparkles, Send, Mic, Plus } from "lucide-react";

export const Route = createFileRoute("/assistant")({
  head: () => ({
    meta: [
      { title: "AI concierge — Martify" },
      { name: "description", content: "Chat with your Martify AI for meal plans, budget-friendly picks, and recipe ideas." },
    ],
  }),
  component: Assistant,
});

type Msg = { role: "user" | "ai"; text: string; card?: React.ReactNode };

function Assistant() {
  const [input, setInput] = useState("");
  const [msgs] = useState<Msg[]>([
    { role: "ai", text: "Hey Alex 👋 Want me to plan this week's groceries? I'll keep it under $80 and heart-healthy based on your goals." },
    { role: "user", text: "Yes — 5 dinners for 2, quick to cook." },
    {
      role: "ai",
      text: "Here's a plan I put together. 12 items, $76.40, delivery tonight. Want to swap anything?",
      card: <MealPlanCard />,
    },
  ]);

  const suggestions = ["Cheaper alternatives", "Add breakfast", "Vegetarian swap", "Recipe for tonight"];

  return (
    <StoreLayout>
      <div className="mx-auto max-w-3xl px-4 lg:px-8 py-8">

      <div className="px-5 pt-4 pb-6 space-y-4">
        {msgs.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[85%] ${m.role === "user" ? "" : "space-y-2"}`}>
              <div
                className={`px-4 py-3 text-[14px] leading-relaxed ${
                  m.role === "user"
                    ? "bg-primary text-primary-foreground rounded-3xl rounded-br-md"
                    : "bg-card border border-border rounded-3xl rounded-bl-md"
                }`}
              >
                {m.text}
              </div>
              {m.card}
            </div>
          </div>
        ))}
      </div>

      {/* Suggestion pills */}
      <div className="px-5 pb-3 flex gap-2 overflow-x-auto no-scrollbar">
        {suggestions.map((s) => (
          <button key={s} className="shrink-0 rounded-full bg-card border border-border px-3 py-1.5 text-xs font-medium">
            {s}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="fixed bottom-24 inset-x-0 z-30 pointer-events-none">
        <div className="mx-auto max-w-md px-5 pointer-events-auto">
          <div className="flex items-center gap-2 bg-card border border-border rounded-full pl-2 pr-2 py-2 shadow-pop">
            <button className="size-9 rounded-full bg-secondary flex items-center justify-center"><Plus className="size-4" /></button>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about groceries…"
              className="flex-1 bg-transparent outline-none text-sm"
            />
            {input ? (
              <button className="size-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-emerald"><Send className="size-4" /></button>
            ) : (
              <button className="size-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-emerald"><Mic className="size-4" /></button>
            )}
          </div>
        </div>
      </div>
    </div>
    </StoreLayout>
  );
}

function MealPlanCard() {
  const items = [
    { e: "🥑", n: "Avocados" },
    { e: "🐟", n: "Salmon" },
    { e: "🍅", n: "Tomatoes" },
    { e: "🥬", n: "Kale" },
    { e: "🍝", n: "Pasta" },
    { e: "🥖", n: "Sourdough" },
  ];
  return (
    <div className="rounded-3xl bg-card border border-border p-4 shadow-soft">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">Mediterranean · 5 dinners</div>
          <div className="text-[15px] font-bold mt-0.5">$76.40 · 12 items</div>
        </div>
        <div className="rounded-full bg-primary-soft px-3 py-1 text-[11px] font-semibold text-primary">Saves $8</div>
      </div>
      <div className="mt-3 grid grid-cols-6 gap-1.5">
        {items.map((i) => (
          <div key={i.n} className="aspect-square rounded-xl bg-secondary flex items-center justify-center text-xl" title={i.n}>{i.e}</div>
        ))}
      </div>
      <div className="mt-3 flex gap-2">
        <button className="flex-1 h-10 rounded-xl bg-primary text-primary-foreground text-sm font-semibold">Add all to cart</button>
        <button className="h-10 px-4 rounded-xl bg-secondary text-sm font-medium">Swap</button>
      </div>
    </div>
  );
}
