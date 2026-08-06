import { useState } from "react";
import { useAskShopperMutation } from "../../../redux/Apis/Assistant";
import type { ShoppingRecommendation } from "../../../helpers/types";
import { useAppDispatch } from "../../../redux/hook/hook";
import { addToCart } from "../../../redux/slice/cartSlice";

type Message = { role: "ai" | "user"; text: string; recommendations?: ShoppingRecommendation[]; total?: number };

export default function useAssistantController() {
  const dispatch = useAppDispatch();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { role: "ai", text: "Hi! Ask me a grocery question, or tell me what you want to buy and your budget." },
  ]);
  const [askShopper, { isLoading }] = useAskShopperMutation();
  const send = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    setInput("");
    setMessages((current) => current.concat({ role: "user", text: trimmed }));
    try {
      const advice = await askShopper({ message: trimmed }).unwrap();
      setMessages((current) => current.concat({
        role: "ai",
        text: advice.reply,
        recommendations: advice.recommendations,
        total: advice.total,
      }));
    } catch {
      setMessages((current) => current.concat({ role: "ai", text: "I couldn't reach the shopping assistant right now. Please try again in a moment." }));
    }
  };
  const addRecommendation = (recommendation: ShoppingRecommendation) => dispatch(addToCart({ product: recommendation.product, qty: recommendation.qty }));
  const addBasket = (recommendations: ShoppingRecommendation[]) => recommendations.forEach((recommendation) => addRecommendation(recommendation));
  return { values: { input, messages, isLoading }, functions: { send, setInput, addRecommendation, addBasket } };
}
