import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { FormEvent, useEffect, useRef, useState } from "react";
import { Check, Plus, Send, Sparkles } from "lucide-react";
import { StoreLayout } from "@/components/store/StoreLayout";
import { api, type ShoppingAdvice } from "@/lib/api-client";
import type { Product } from "@/lib/mock-data";
import { useCart } from "@/lib/store-cart";
import { useCustomerSession } from "@/lib/customer-session";
import { readChatHistory, saveChatHistory } from "@/lib/chat-history";
import { InlineLoader } from "@/components/store/LoadingState";

export const Route = createFileRoute("/assistant")({
  head: () => ({
    meta: [
      { title: "AI concierge — Martify" },
      {
        name: "description",
        content:
          "Chat with your Martify AI for meal plans, budget-friendly picks, and recipe ideas.",
      },
    ],
  }),
  component: Assistant,
});

type Message = { role: "user" | "ai"; text: string; advice?: ShoppingAdvice };

function toStoreProduct(product: ShoppingAdvice["recommendations"][number]["product"]): Product {
  return {
    id: product.slug,
    backendId: product._id,
    name: product.name,
    brand: product.brand || "Martify",
    price: product.price,
    compareAt: product.compareAt,
    unit: product.unit || "each",
    emoji: product.emoji || "🛒",
    gradient: product.gradient || "from-emerald-100 to-lime-100",
    category: product.category || "other",
    rating: product.rating || 0,
    reviews: product.reviews || 0,
    aiTag: product.aiTag,
    organic: product.organic,
    stock: product.stock || 0,
  };
}

function Assistant() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "ai",
      text: "Hi! Tell me what you want to cook or buy, and include a budget if you have one.",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const { add } = useCart();
  const { user, loading: sessionLoading } = useCustomerSession();
  const historyLoadedFor = useRef<string | null>(null);
  const navigate = useNavigate();
  const suggestions = [
    "5 healthy dinners under $60",
    "Build a breakfast basket",
    "Cheaper alternatives",
    "Vegetarian meal plan",
  ];

  useEffect(() => {
    if (!user || historyLoadedFor.current === user.id) return;
    readChatHistory<Message[]>(user.id)
      .then((history) => {
        if (history?.length) setMessages(history);
        historyLoadedFor.current = user.id;
      })
      .catch(() => {
        historyLoadedFor.current = user.id;
      });
  }, [user?.id]);
  useEffect(() => {
    if (user && historyLoadedFor.current === user.id)
      void saveChatHistory(user.id, messages).catch(() => undefined);
  }, [messages, user?.id]);

  async function send(event?: FormEvent) {
    event?.preventDefault();
    const message = input.trim();
    if (!message || loading) return;
    if (sessionLoading) return;
    if (!user) {
      setShowLoginPrompt(true);
      return;
    }
    setInput("");
    setMessages((current) => [...current, { role: "user", text: message }]);
    setLoading(true);
    try {
      const { data } = await api.ai.shopper(message);
      setMessages((current) => [...current, { role: "ai", text: data.reply, advice: data }]);
    } catch (error) {
      const text =
        error instanceof Error ? error.message : "The assistant is unavailable right now.";
      setMessages((current) => [
        ...current,
        {
          role: "ai",
          text:
            text === "AI shopping is not configured. Set GEMINI_API_KEY."
              ? "The shopping assistant is being set up. Please try again shortly."
              : text,
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <StoreLayout>
      <div className="mx-auto max-w-3xl px-4 lg:px-8 py-8 pb-32">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div className={`max-w-[90%] ${message.role === "user" ? "" : "space-y-2"}`}>
                <div
                  className={`px-4 py-3 text-[14px] leading-relaxed ${message.role === "user" ? "bg-primary text-primary-foreground rounded-3xl rounded-br-md" : "bg-card border border-border rounded-3xl rounded-bl-md"}`}
                >
                  {message.role === "ai" && (
                    <Sparkles className="mr-2 inline size-4 text-primary" />
                  )}
                  {message.text}
                </div>
                {message.advice?.recommendations.length ? (
                  <AdviceCard advice={message.advice} add={add} />
                ) : null}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex items-center gap-2">
              <InlineLoader label="Building your basket" />
              <span
                className="size-2 rounded-full bg-primary/50 animate-pulse"
                aria-hidden="true"
              />
            </div>
          )}
        </div>

        <div className="mt-6 flex gap-2 overflow-x-auto no-scrollbar">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => setInput(suggestion)}
              className="shrink-0 rounded-full bg-card border border-border px-3 py-1.5 text-xs font-medium"
            >
              {suggestion}
            </button>
          ))}
        </div>
        <form onSubmit={send} className="fixed bottom-5 inset-x-0 z-30 pointer-events-none">
          <div className="mx-auto max-w-3xl px-4 lg:px-8 pointer-events-auto">
            <div className="flex items-center gap-2 rounded-full bg-card border border-border pl-5 pr-2 py-2 shadow-pop">
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Ask anything about groceries…"
                className="min-w-0 flex-1 bg-transparent outline-none text-sm"
                disabled={loading || sessionLoading}
              />
              <button
                type="submit"
                disabled={!input.trim() || loading || sessionLoading}
                className="grid size-10 place-items-center rounded-full bg-primary text-primary-foreground disabled:opacity-50"
              >
                <Send className="size-4" />
              </button>
            </div>
          </div>
        </form>
        {showLoginPrompt && (
          <div className="fixed inset-0 z-50 grid place-items-center bg-foreground/30 p-4">
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="login-required-title"
              className="w-full max-w-sm rounded-3xl border border-border bg-card p-6 shadow-pop"
            >
              <Sparkles className="size-6 text-primary" />
              <h2 id="login-required-title" className="mt-4 font-display text-xl font-bold">
                Sign in to use Martify AI
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Your account lets the assistant create a basket and keep your preferences secure.
              </p>
              <div className="mt-6 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowLoginPrompt(false)}
                  className="h-10 rounded-xl px-4 text-sm font-semibold hover:bg-secondary"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => navigate({ to: "/auth" })}
                  className="h-10 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground"
                >
                  OK, sign in
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </StoreLayout>
  );
}

function AdviceCard({
  advice,
  add,
}: {
  advice: ShoppingAdvice;
  add: (id: string, qty?: number) => void;
}) {
  const [added, setAdded] = useState(false);
  const addAll = () => {
    advice.recommendations.forEach((item) => add(item.product.slug, item.qty));
    setAdded(true);
  };
  return (
    <div className="rounded-3xl bg-card border border-border p-4 shadow-soft">
      <div className="flex items-center justify-between">
        <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
          AI basket
        </span>
        <span className="font-semibold">${advice.total.toFixed(2)}</span>
      </div>
      <div className="mt-3 space-y-2">
        {advice.recommendations.map((item) => (
          <div key={item.product._id} className="flex items-center gap-3">
            <Link
              to="/product/$id"
              params={{ id: item.product.slug }}
              className={`grid size-10 place-items-center rounded-xl bg-gradient-to-br ${item.product.gradient || "from-emerald-100 to-lime-100"}`}
            >
              {item.product.emoji || "🛒"}
            </Link>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold truncate">
                {item.product.name} × {item.qty}
              </div>
              <div className="text-xs text-muted-foreground truncate">{item.reason}</div>
            </div>
            <button
              type="button"
              onClick={() => add(item.product.slug, item.qty)}
              className="text-xs font-semibold text-primary"
            >
              Add
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={addAll}
        className="mt-4 flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-primary text-sm font-semibold text-primary-foreground"
      >
        {added ? <Check className="size-4" /> : <Plus className="size-4" />}
        {added ? "Basket added" : "Add basket to cart"}
      </button>
    </div>
  );
}
