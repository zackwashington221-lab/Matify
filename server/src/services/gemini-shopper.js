const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models";

export async function getShoppingAdvice({ message, products, budget, preferences }) {
  if (!isMartifyShoppingQuestion(message, products)) {
    return {
      reply: "I’m Martify’s shopping assistant, so I can only help with products in this store, baskets, budgets, grocery planning, and delivery. What would you like to shop for?",
      recommendations: [],
      total: 0,
      budget,
    };
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw assistantUnavailable();
  }

  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash-lite";
  const catalog = products.map((product) => ({
    id: String(product._id),
    name: product.name,
    brand: product.brand,
    price: product.price,
    unit: product.unit,
    category: product.category,
    description: product.description,
    tags: product.tags || [],
  }));
  const prompt = [
    "You are Martify's in-store shopping assistant.",
    "Only handle Martify catalogue, product discovery, basket planning, grocery shopping, budgets, swaps, availability, and delivery questions. Refuse all unrelated requests in one sentence and invite the customer to shop Martify products.",
    "When recommending products, choose only exact IDs from the catalog and respect the stated budget. For a basket request with a budget, aim for a useful, varied basket worth roughly 80–100% of that budget unless the customer asks for only a few specific items. Never invent products, prices, discounts, or availability.",
    "Return valid JSON only in this exact shape:",
    '{"reply":"string","recommendations":[{"productId":"string","qty":1,"reason":"string"}]}',
    "Use an empty recommendations array for general questions.",
    `User budget: ${budget == null ? "not specified" : `$${budget.toFixed(2)}`}`,
    `Customer preferences: ${JSON.stringify(preferences || {})}`,
    `Catalog: ${JSON.stringify(catalog)}`,
    `User message: ${message}`,
  ].join("\n\n");

  let response;
  try {
    response = await fetch(`${GEMINI_API_URL}/${model}:generateContent?key=${encodeURIComponent(apiKey)}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.25, responseMimeType: "application/json" },
      }),
      signal: AbortSignal.timeout(20_000),
    });
  } catch {
    throw assistantUnavailable();
  }

  if (!response.ok) {
    console.error("[gemini] request failed:", response.status);
    throw assistantUnavailable();
  }

  const payload = await response.json();
  const text = payload.candidates?.[0]?.content?.parts?.map((part) => part.text || "").join("") || "";
  const result = parseJson(text);
  if (!result) {
    throw assistantUnavailable();
  }

  const byId = new Map(products.map((product) => [String(product._id), product]));
  let total = 0;
  const recommendations = [];
  for (const recommendation of Array.isArray(result.recommendations) ? result.recommendations : []) {
    const product = byId.get(String(recommendation.productId));
    const qty = Math.max(1, Math.min(20, Math.floor(Number(recommendation.qty) || 1)));
    if (!product || (budget != null && total + product.price * qty > budget + 0.001)) continue;
    total += product.price * qty;
    recommendations.push({
      product,
      qty,
      reason: typeof recommendation.reason === "string" ? recommendation.reason.slice(0, 180) : "A good match for your basket.",
    });
  }

  return {
    reply: typeof result.reply === "string" ? result.reply.slice(0, 1_500) : "Here are some options from the catalog.",
    recommendations,
    total: Math.round(total * 100) / 100,
    budget,
  };
}

function assistantUnavailable() {
  const error = new Error("Martify AI is temporarily unavailable. Please try again in a moment.");
  error.status = 503;
  return error;
}

function isMartifyShoppingQuestion(message, products) {
  const normalized = message.toLowerCase();
  const storeTerms = /\b(martify|grocery|groceries|product|products|basket|cart|shop|shopping|buy|order|delivery|deliver|budget|price|deal|swap|ingredient|ingredients|meal|meals|dinner|dinners|lunch|lunches|breakfast|breakfasts|recipe|recipes|healthy|health|produce|bakery|dairy|eggs|meat|seafood|pantry|snack|snacks|beverage|drink|drinks|frozen|organic|vegan|vegetarian)\b/;
  if (storeTerms.test(normalized)) return true;
  return products.some((product) => String(product.name || "").toLowerCase().split(/\s+/).some((word) => word.length >= 4 && normalized.includes(word.replace(/s$/, ""))));
}

function parseJson(text) {
  try {
    return JSON.parse(text.replace(/^```json\s*|\s*```$/g, "").trim());
  } catch {
    return null;
  }
}
