// ============================================================
// AI MIDDLEMAN (runs on Cloudflare Workers, not on the phone)
//
// The app sends a question here. This code adds the secret
// Gemini key, asks Google's AI, checks the answer, and sends
// it back. The key never appears in the app or on GitHub.
//
// It answers three kinds of questions:
//   "allergy" -> other names for an allergy, plus translations
//   "dish"    -> which allergens a dish usually has
//   "photo"   -> what's in a photo: a dish (and its usual allergens),
//                or a food label (and the ingredient text, copied out + in English)
//   "translate" -> the Ask-the-cook card in any language
// ============================================================

// Only these websites are allowed to use this middleman
const ALLOWED_ORIGINS = [
  "https://pr1sha123.github.io",
  "http://127.0.0.1:5500",     // VS Code Live Server, for testing
  "http://localhost:5500"
];

// Google's AI models, tried in order (if the first is unavailable, try the next)
const MODELS = ["gemini-3.5-flash-lite", "gemini-3.8-flash"];

// The 9 allergens the app knows (the AI must use these exact ids)
const ALLERGEN_IDS = ["milk", "egg", "wheat", "peanut", "treenut", "soy", "fish", "shellfish", "sesame"];
const LANGS = ["en", "hi", "zh-s", "zh-t", "ko"];
const DIET_TAGS = ["meat", "pork", "beef", "alcohol", "onion"];

// Extra rules shared by the dish and photo questions
const WHY_AND_DIET_RULES =
`- "why": for EVERY allergen you listed, one short plain reason (under 12 words) saying which ingredient causes it,
  for example {"wheat": "Flour tortillas are made from wheat", "milk": "Cheese and sour cream are dairy"}.
- "diet": how often the dish has these, using "u" (usually) or "s" (sometimes); leave out ones it doesn't have:
  "meat" (any meat or poultry), "pork", "beef", "alcohol" (wine, beer, mirin, cooking wine),
  "onion" (onion, garlic, potato, or other root vegetables).
  Example: {"meat": "u", "beef": "s", "onion": "u"}.`;

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    const cors = {
      "Access-Control-Allow-Origin": ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0],
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Vary": "Origin"
    };

    // Browsers check permission first with an OPTIONS request
    if (request.method === "OPTIONS") return new Response(null, { headers: cors });
    if (request.method !== "POST") return reply({ error: "The AI helper is running. The app talks to it with POST." }, 200, cors);
    if (!ALLOWED_ORIGINS.includes(origin)) return reply({ error: "Not allowed" }, 403, cors);
    if (!env.GEMINI_KEY) return reply({ error: "The GEMINI_KEY secret is missing in Cloudflare." }, 500, cors);

    // Reject huge uploads (photos are shrunk on the phone first)
    if (Number(request.headers.get("Content-Length") || 0) > 3_000_000) return reply({ error: "Photo too large" }, 413, cors);

    let body;
    try { body = await request.json(); } catch (e) { return reply({ error: "Bad request" }, 400, cors); }

    try {
      if (body.task === "allergy") return reply(await allergyTask(body, env), 200, cors);
      if (body.task === "dish")    return reply(await dishTask(body, env), 200, cors);
      if (body.task === "photo")   return reply(await photoTask(body, env), 200, cors);
      if (body.task === "translate") return reply(await translateTask(body, env), 200, cors);
      return reply({ error: "Unknown task" }, 400, cors);
    } catch (e) {
      return reply({ error: "The AI didn't answer. Try again in a minute." }, 502, cors);
    }
  }
};

// ---------- Task 1: other names for any allergy ----------
async function allergyTask(body, env) {
  const name = cleanText(body.name, 40);
  if (!name) return { error: "Type an allergy first" };

  const prompt =
`Someone has a food allergy or intolerance to: "${name}".
Return JSON only, in this exact shape:
{"valid": true, "words": ["..."], "names": {"en": "", "hi": "", "zh-s": "", "zh-t": "", "ko": ""}, "note": ""}

Rules:
- "valid": false if "${name}" is not a food, food ingredient, or food additive.
- "words": every word or short phrase that could appear in an ingredient list and means this ingredient is present:
  common names, plural forms, scientific names, hidden or derived ingredients, and the name in
  Hindi (Devanagari), Simplified Chinese, Traditional Chinese, and Korean. Lowercase for English.
  Only include words that clearly mean this specific ingredient. Do not include broad words like "spices" or "flavoring".
  Maximum 30 words.
- "names": a short name for the allergy in each language, for a card shown to a cook.
- "note": one short sentence of anything important (for example a related allergy to ask a doctor about), or "".`;

  const out = await askGemini(env, [{ text: prompt }]);
  return {
    valid: out.valid !== false,
    words: cleanList(out.words, 30, 40),
    names: Object.fromEntries(LANGS.map(l => [l, cleanText(out.names && out.names[l], 40)])),
    note: cleanText(out.note, 200)
  };
}

// ---------- Task 2: allergens in any dish ----------
async function dishTask(body, env) {
  const name = cleanText(body.name, 60);
  if (!name) return { error: "Type a dish first" };

  const prompt =
`A person is about to eat a dish called: "${name}".
Return JSON only, in this exact shape:
{"known": true, "dish": "", "usually": [], "sometimes": [], "why": {}, "diet": {}, "note": ""}

Rules:
- "known": false if you don't recognize this as a dish or food.
- "dish": the dish's common English name.
- "usually": allergens in the normal recipe. "sometimes": allergens in many versions, sauces, or toppings.
- Use ONLY these ids: ${ALLERGEN_IDS.join(", ")}. "treenut" means tree nuts. "shellfish" includes shrimp, crab, and mollusks.
${WHY_AND_DIET_RULES}
- "note": one short sentence about a hidden ingredient to ask about (for example fish sauce or peanut oil), or "".`;

  return cleanDish(await askGemini(env, [{ text: prompt }]));
}

// ---------- Task 3: what food is in a photo ----------
async function photoTask(body, env) {
  const image = String(body.image || "");
  if (!/^[A-Za-z0-9+/=]+$/.test(image) || image.length < 100) return { error: "No photo received" };

  const prompt =
`Look at this photo.
Return JSON only, in this exact shape:
{"kind": "dish", "labelText": "", "labelEnglish": "", "isFood": true, "dish": "", "confidence": "high", "usually": [], "sometimes": [], "why": {}, "diet": {}, "note": ""}

Rules:
- "kind": "label" if the photo shows a food package's ingredient list or allergen statement (in any language).
  "dish" if it shows food or a meal, or the front of a package with no ingredient list. "other" if it is not food.
- If "kind" is "label": put the ingredient list and any "contains" / "may contain" sentences in "labelText",
  copied exactly as written, in the label's own language and script (do not translate). Max 1500 characters.
  Also put an English translation of that same text in "labelEnglish": keep every ingredient and every
  "contains" / "may contain" sentence, translate word for word, do not summarize. Use "" if the label is already in English.
  Leave the dish fields empty.
- "isFood": false if the photo is not food.
- "dish": your best guess of the dish's name in English.
- "confidence": "high", "medium", or "low" for how sure you are about the dish.
- "usually": allergens in the normal recipe for this dish. "sometimes": allergens in many versions, sauces, or toppings.
- Use ONLY these ids: ${ALLERGEN_IDS.join(", ")}.
- A photo can't show hidden ingredients, so include anything commonly used.
${WHY_AND_DIET_RULES}
- "note": one short sentence about a hidden ingredient to ask about, or "".`;

  const out = await askGemini(env, [{ text: prompt }, { inline_data: { mime_type: "image/jpeg", data: image } }]);
  const dish = cleanDish({ known: out.isFood !== false, dish: out.dish, usually: out.usually, sometimes: out.sometimes,
                           why: out.why, diet: out.diet, note: out.note });
  dish.isFood = out.isFood !== false && out.kind !== "other";
  dish.kind = ["dish", "label", "other"].includes(out.kind) ? out.kind : "dish";
  dish.labelText = dish.kind === "label" ? cleanText(out.labelText, 1500) : "";
  dish.labelEnglish = dish.kind === "label" ? cleanText(out.labelEnglish, 1500) : "";
  dish.confidence = ["high", "medium", "low"].includes(out.confidence) ? out.confidence : "low";
  return dish;
}

// ---------- Task 4: translate the Ask-the-cook card ----------
async function translateTask(body, env) {
  const lang = cleanText(body.lang, 40);
  const lines = Array.isArray(body.lines) ? body.lines.slice(0, 12).map(l => cleanText(l, 400)) : [];
  if (!lang || !lines.length) return { error: "Nothing to translate" };

  const prompt =
`These lines are a card that a person with food allergies shows to a restaurant server or cook.
Translate every line into: "${lang}".
Return JSON only, in this exact shape:
{"language": "", "code": "", "lines": []}

Rules:
- "language": the language's name in English (for example "Japanese"). If "${lang}" is not a real language, return "" and an empty "lines".
- "code": the language's BCP-47 code for text-to-speech, like "ja-JP", "es-MX", "vi-VN", "ar-SA".
- "lines": exactly ${lines.length} strings, one for each line, in the same order.
- Keep the meaning exact. Do not add, remove, or soften anything; a missed allergen could hurt someone.
- Use the everyday words a cook in that language would understand for each food (for example the local word for peanuts).
- Write it in that language's normal script.

Lines:
${JSON.stringify(lines)}`;

  const out = await askGemini(env, [{ text: prompt }]);
  const result = Array.isArray(out.lines) ? out.lines.map(l => cleanText(l, 600)) : [];
  if (!out.language || result.length !== lines.length || result.some(l => !l)) {
    return { error: "I couldn't translate into \"" + lang + "\". Check the spelling and try again." };
  }
  const code = /^[a-z]{2,3}(-[A-Za-z0-9]{2,4})?$/.test(String(out.code || "")) ? out.code : "";
  return { language: cleanText(out.language, 40), code: code, lines: result };
}

// ---------- Talking to Gemini ----------
async function askGemini(env, parts) {
  const request = {
    contents: [{ parts: parts }],
    generationConfig: { response_mime_type: "application/json", temperature: 0.2 }
  };
  let lastError = null;
  for (const model of MODELS) {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${env.GEMINI_KEY}`,
      { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(request) }
    );
    if (!res.ok) { lastError = res.status; continue; }   // try the next model
    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.map(p => p.text || "").join("") || "";
    return JSON.parse(text.replace(/^```(json)?/i, "").replace(/```$/, "").trim());
  }
  throw new Error("Gemini failed: " + lastError);
}

// ---------- Checking the AI's answer before sending it to the app ----------
function cleanText(value, max) {
  return String(value || "").replace(/[<>]/g, "").trim().slice(0, max);
}
function cleanList(list, maxItems, maxLen) {
  if (!Array.isArray(list)) return [];
  return [...new Set(list.map(w => cleanText(w, maxLen)).filter(w => w.length >= 2))].slice(0, maxItems);
}
function cleanIds(list) {
  return Array.isArray(list) ? [...new Set(list.filter(id => ALLERGEN_IDS.includes(id)))] : [];
}
function cleanDish(out) {
  const usually = cleanIds(out.usually);
  const sometimes = cleanIds(out.sometimes).filter(id => !usually.includes(id));
  const why = {};
  for (const id of usually.concat(sometimes)) {
    const reason = cleanText(out.why && out.why[id], 100);
    if (reason) why[id] = reason;
  }
  const diet = {};
  for (const tag of DIET_TAGS) {
    const v = out.diet && out.diet[tag];
    if (v === "u" || v === "s") diet[tag] = v;
  }
  return {
    known: out.known !== false,
    dish: cleanText(out.dish, 60),
    usually: usually,
    sometimes: sometimes,
    why: why,
    diet: diet,
    note: cleanText(out.note, 200)
  };
}
function reply(obj, status, cors) {
  return new Response(JSON.stringify(obj), { status: status, headers: { ...cors, "Content-Type": "application/json" } });
}
