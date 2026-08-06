const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models";

export async function getShoppingAdvice({ message, products, budget, preferences }) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return catalogFallback({ message, products, budget, preferences });
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
    "You are Martify's grocery-shopping assistant.",
    "Answer general grocery questions helpfully and briefly. Only recommend products when the user is explicitly shopping, planning a basket, or asking what to buy.",
    "When recommending products, choose only exact IDs from the catalog and respect the stated budget. Never invent products, prices, discounts, or availability.",
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
    return catalogFallback({ message, products, budget, preferences });
  }

  if (!response.ok) {
    console.error("[gemini] request failed:", response.status);
    return catalogFallback({ message, products, budget, preferences });
  }

  const payload = await response.json();
  const text = payload.candidates?.[0]?.content?.parts?.map((part) => part.text || "").join("") || "";
  const result = parseJson(text);
  if (!result) {
    return catalogFallback({ message, products, budget, preferences });
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

// Keeps the customer experience usable when the optional Gemini integration is unavailable.
// It only recommends products that actually exist in the active Martify catalogue.
function catalogFallback({ message, products, budget, preferences }) {
  const shoppingRequest = /\b(buy|basket|cart|shop|list|recommend|need|plan|budget|dinner|meal|breakfast|lunch)\b/i.test(message);
  if (!shoppingRequest) {
    return { reply: "I can help plan a meal, compare groceries, or build a basket from the Martify catalogue. Tell me what you need and your budget.", recommendations: [], total: 0, budget };
  }

  const healthy = /\b(healthy|vegetarian|vegan|organic|protein|heart)\b/i.test(message) || preferences?.healthySwaps;
  const terms = message.toLowerCase();
  const preferred = products.filter((product) => `${product.name} ${product.brand || ""} ${product.category || ""} ${(product.tags || []).join(" ")}`.toLowerCase().includes(terms));
  const candidates = (preferred.length ? preferred : products)
    .filter((product) => !healthy || product.organic || /produce|seafood|dairy/.test(product.category || ""))
    .sort((a, b) => (b.rating || 0) - (a.rating || 0) || (b.reviews || 0) - (a.reviews || 0));
  const recommendations = [];
  let total = 0;
  for (const product of candidates) {
    if (recommendations.length === 5) break;
    if (budget != null && total + product.price > budget + 0.001) continue;
    recommendations.push({ product, qty: 1, reason: healthy ? "A highly rated, wholesome choice from the current catalogue." : "A highly rated choice available from Martify today." });
    total += product.price;
  }
  const roundedTotal = Math.round(total * 100) / 100;
  return {
    reply: recommendations.length ? `I built a ${healthy ? "health-focused " : ""}basket with ${recommendations.length} items${budget != null ? ` within your $${budget.toFixed(2)} budget` : ""}.` : "I couldn't find a basket that fits that budget. Try increasing it slightly or ask for fewer items.",
    recommendations,
    total: roundedTotal,
    budget,
  };
}

function parseJson(text) {
  try {
    return JSON.parse(text.replace(/^```json\s*|\s*```$/g, "").trim());
  } catch {
    return null;
  }
}
