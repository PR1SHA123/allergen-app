// ============================================================
// VOICE
// 1. Listening: say a dish ("Can I eat pad thai?") instead of typing.
// 2. Speaking: the app reads answers out loud, and reads the
//    Ask-the-cook card in the cook's language.
// Both use speech tools built into the phone's browser, so there
// is nothing to install and no extra cost.
// ============================================================

const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;

function canListen() { return !!Recognition; }
function canSpeak() { return "speechSynthesis" in window; }

// Listen for one sentence. Returns a promise with what was said.
// onHeard(text) is called while they're still talking, so we can show it live.
let activeListener = null;
function listenOnce(onHeard) {
  return new Promise((resolve, reject) => {
    if (!Recognition) return reject(new Error("unsupported"));
    if (activeListener) { try { activeListener.abort(); } catch (e) {} }
    const rec = new Recognition();
    activeListener = rec;
    rec.lang = "en-US";
    rec.interimResults = true;
    rec.maxAlternatives = 1;
    let finalText = "", done = false;
    rec.onresult = e => {
      let text = "";
      for (let i = 0; i < e.results.length; i++) text += e.results[i][0].transcript;
      finalText = text.trim();
      if (onHeard) onHeard(finalText);
    };
    rec.onerror = e => { done = true; activeListener = null; reject(new Error(e.error || "error")); };
    rec.onend = () => { activeListener = null; if (!done) resolve(finalText); };
    rec.start();
  });
}
function stopListening() {
  if (activeListener) { try { activeListener.stop(); } catch (e) {} }
}

// Turn a spoken question into just the dish name:
//   "Can I eat pad thai?"                   -> "pad thai"
//   "Does chicken tikka masala have nuts?"  -> "chicken tikka masala"
//   "Is there peanut in kung pao chicken"   -> "kung pao chicken"
function dishFromSpeech(said) {
  let s = String(said || "").toLowerCase().replace(/[?!.,]/g, " ").replace(/\s+/g, " ").trim();
  const art = "(?:a |an |the |some |any |this |that )?";
  let m;
  // "is there / are there / any ___ in (the) DISH"
  if ((m = s.match(new RegExp("^(?:is there|are there|is|are|any)\\b.*?\\b(?:in|inside)\\s+" + art + "(.+)$")))) s = m[1];
  // "does (the) DISH have / contain ___"
  else if ((m = s.match(new RegExp("^(?:does|do|did|will|would)\\s+" + art + "(.+?)\\s+(?:have|has|contain|contains|got|use|uses)\\b")))) s = m[1];
  else {
    // Remove the question at the start
    s = s.replace(/^(?:(?:hey|hi|ok|okay|um|uh|so|please)\s+)*/, "");
    s = s.replace(/^(?:can|could|may|should) (?:i|we|she|he|they|my \w+) (?:eat|have|try|get|order)\s+/, "")
         .replace(/^is it (?:ok|okay|safe|fine|alright) (?:for (?:me|us|her|him) )?(?:to (?:eat|have)|if i eat)\s+/, "")
         .replace(/^(?:am i|are we) (?:allowed|able) to (?:eat|have)\s+/, "")
         .replace(/^(?:what(?:'s| is) in|what does|check|look up|search(?: for)?|tell me about|show me|find)\s+/, "")
         .replace(/^(?:is|are)\s+/, "");
    s = s.replace(new RegExp("^" + art), "");
  }
  // Remove the end of the question
  s = s.replace(/\s+(?:safe|okay|ok|fine|alright)(?:\s+(?:for|to)\s+.*)?$/, "")
       .replace(/\s+(?:for (?:me|us|her|him|them|my \w+)|please|have in it|in it|made of|made with)$/, "")
       .replace(/\s+(?:safe|okay|ok)$/, "");
  return s.trim();
}

// ---------- Speaking ----------
const SPEECH_LANGS = { en: "en-US", hi: "hi-IN", "zh-s": "zh-CN", "zh-t": "zh-TW", ko: "ko-KR" };

function voiceFor(tag) {
  const voices = speechSynthesis.getVoices();
  const base = tag.split("-")[0];
  return voices.find(v => v.lang.replace("_", "-") === tag) ||
         voices.find(v => v.lang.replace("_", "-").startsWith(base + "-")) ||
         voices.find(v => v.lang === base) || null;
}

// Does this phone have a voice for this language? (null = can't tell yet)
function hasVoice(langId) {
  if (!canSpeak()) return false;
  if (!speechSynthesis.getVoices().length) return null;
  return !!voiceFor(SPEECH_LANGS[langId] || "en-US");
}

// Say some text out loud. langId is one of: en, hi, zh-s, zh-t, ko
function speak(text, langId, onEnd) {
  if (!canSpeak() || !text) return false;
  speechSynthesis.cancel();
  const tag = SPEECH_LANGS[langId] || "en-US";
  const u = new SpeechSynthesisUtterance(text);
  u.lang = tag;
  const v = voiceFor(tag);
  if (v) u.voice = v;
  u.rate = langId === "en" ? 1 : 0.9;   // a little slower for the cook
  if (onEnd) { u.onend = onEnd; u.onerror = onEnd; }
  speechSynthesis.speak(u);
  return true;
}
function stopSpeaking() { if (canSpeak()) speechSynthesis.cancel(); }
function isSpeaking() { return canSpeak() && speechSynthesis.speaking; }

// Some phones load their voice list a moment after the page opens
if (canSpeak()) { speechSynthesis.getVoices(); speechSynthesis.onvoiceschanged = () => speechSynthesis.getVoices(); }
