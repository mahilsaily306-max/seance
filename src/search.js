// src/search.js
// SerpApi live web search — grounds séance answers in historical facts
// about dead programming languages. Opt-in; the séance works offline without it.

async function serpApi(query) {
  const key = process.env.SERPAPI_KEY;
  if (!key) return null;
  try {
    const res = await fetch(
      "https://serpapi.com/search.json?" +
        new URLSearchParams({ q: query, api_key: key, num: 3 }),
      { signal: AbortSignal.timeout(10000) }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data.organic_results || [];
  } catch {
    return null;
  }
}

/** Enrich a séance question with a historical fact from the live web. */
export async function groundQuestion(question) {
  const results = await serpApi(`${question} programming language history`);
  if (!results || results.length === 0) return null;
  return results
    .slice(0, 3)
    .map((r) => `${r.title} — ${r.snippet || ""} (${r.link})`)
    .join("\n");
}
