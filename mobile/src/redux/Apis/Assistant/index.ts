import { createApi } from "@reduxjs/toolkit/query/react";
import type { ShoppingAdvice } from "../../../helpers/types";
import { baseQuery } from "../baseQuery";

type ShopperRequest = { message: string; budget?: number };

export const assistantApi = createApi({
  reducerPath: "assistantApi",
  baseQuery,
  endpoints: (builder) => ({
    askShopper: builder.mutation<ShoppingAdvice, ShopperRequest>({
      queryFn: async (body, api, extraOptions) => {
        return baseQuery({ url: "/ai/shopper", method: "POST", body: { ...body, budget: body.budget ?? budgetFromMessage(body.message) } }, api, extraOptions) as Promise<{ data: ShoppingAdvice }>;
      },
    }),
  }),
});

function budgetFromMessage(message: string) {
  const match = message.match(/(?:under|within|budget(?:\s+of)?)\s*\$?\s*(\d+(?:\.\d{1,2})?)|for\s*\$\s*(\d+(?:\.\d{1,2})?)/i);
  return match ? Number(match[1] || match[2]) : undefined;
}

export const { useAskShopperMutation } = assistantApi;
