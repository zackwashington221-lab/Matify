const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models";

export async function getShoppingAdvice({ message, products, budget, preferences }) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw Object.assign(new Error("AI shopping is not configured. Set GEMINI_API_KEY."), { status: 503 });
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
    throw Object.assign(new Error("AI shopping is temporarily unavailable."), { status: 503 });
  }

  if (!response.ok) {
    console.error("[gemini] request failed:", response.status);
    throw Object.assign(new Error("AI shopping is temporarily unavailable."), { status: 503 });
  }

  const payload = await response.json();
  const text = payload.candidates?.[0]?.content?.parts?.map((part) => part.text || "").join("") || "";
  const result = parseJson(text);
  if (!result) {
    throw Object.assign(new Error("AI shopping returned an invalid response."), { status: 502 });
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

function parseJson(text) {
  try {
    return JSON.parse(text.replace(/^```json\s*|\s*```$/g, "").trim());
  } catch {
    return null;
  }
}
