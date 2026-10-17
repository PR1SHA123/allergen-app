// ============================================================
// AI HELPER (talks to our Cloudflare middleman)
// The middleman holds the secret Gemini key. This file never sees it.
//
// The AI is a second layer: the app's own dictionary and dish guide
// are always checked first. Anything from the AI is marked
// "AI estimate" so people know to double-check it.
// ============================================================

const AI_URL = "https://allergenapp-ai.ket-kulkarni.workers.dev";

// Sends a question to the middleman. Gives up after 25 seconds.
async function askAI(payload) {
  if (!navigator.onLine) throw new Error("You're offline. AI features need internet.");
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 25000);
  try {
    const res = await fetch(AI_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || data.error) throw new Error(data.error || "The AI helper had a problem. Try again.");
    return data;
  } catch (e) {
    if (e.name === "AbortError") throw new Error("The AI took too long. Try again.");
    if (e instanceof TypeError) throw new Error("Couldn't reach the AI. Check your internet connection.");
    throw e;
  } finally {
    clearTimeout(timer);
  }
}

// "kiwi" -> { valid, words: [...], names: { en, hi, zh-s, zh-t, ko }, note }
function aiAllergy(name) {
  return askAI({ task: "allergy", name: name });
}

// "chicken 65" -> { known, dish, usually: [...], sometimes: [...], note }
function aiDish(name) {
  return askAI({ task: "dish", name: name });
}

// photo file -> { isFood, dish, confidence, usually, sometimes, note }
async function aiPhoto(file) {
  const image = await shrinkPhoto(file, 768);
  return askAI({ task: "photo", image: image });
}

// Makes the photo small (about 768 pixels) so it uploads fast,
// and returns it as base64 text without the "data:image/jpeg;base64," part
async function shrinkPhoto(file, maxSide) {
  const img = await createImageBitmap(file);
  const scale = Math.min(1, maxSide / Math.max(img.width, img.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(img.width * scale);
  canvas.height = Math.round(img.height * scale);
  canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/jpeg", 0.8).split(",")[1];
}
