import { createApi } from "@reduxjs/toolkit/query/react";
import type { ShoppingAdvice } from "../../../helpers/types";
import { USE_MOCK_DATA } from "../../../helpers/data";
import { mockProducts } from "../../../mocks/user.mock";
import { baseQuery } from "../baseQuery";

type ShopperRequest = { message: string; budget?: number };

export const assistantApi = createApi({
  reducerPath: "assistantApi",
  baseQuery,
  endpoints: (builder) => ({
    askShopper: builder.mutation<ShoppingAdvice, ShopperRequest>({
      queryFn: async (body, api, extraOptions) => {
        if (USE_MOCK_DATA) {
          const budget = body.budget || budgetFromMessage(body.message);
          const recommendations = isShoppingRequest(body.message)
            ? selectMockProducts(budget)
            : [];
          return {
            data: {
              reply: recommendations.length
                ? "I found a balanced basket from Martify's catalog that fits your budget."
                : "I can help compare ingredients, plan meals, or build a grocery basket within a budget.",
              recommendations,
              total: recommendations.reduce((sum, item) => sum + item.product.price * item.qty, 0),
              budget,
            },
          };
        }
        return baseQuery({ url: "/ai/shopper", method: "POST", body }, api, extraOptions) as Promise<{ data: ShoppingAdvice }>;
      },
    }),
  }),
});

function budgetFromMessage(message: string) {
  const match = message.match(/(?:under|within|budget(?:\s+of)?)\s*\$?\s*(\d+(?:\.\d{1,2})?)|for\s*\$\s*(\d+(?:\.\d{1,2})?)/i);
  return match ? Number(match[1] || match[2]) : undefined;
}

function isShoppingRequest(message: string) {
  return /\b(buy|basket|cart|shop|list|recommend|need|plan|budget)\b/i.test(message);
}

function selectMockProducts(budget?: number) {
  let total = 0;
  return mockProducts.slice(0, 5).flatMap((product) => {
    if (budget != null && total + product.price > budget) return [];
    total += product.price;
    return [{ product, qty: 1, reason: "A popular, versatile choice for your basket." }];
  });
}

export const { useAskShopperMutation } = assistantApi;
