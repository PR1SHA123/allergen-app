// ============================================================
// PEOPLE & GROUPS
// Who the app is checking food for.
//
//   A group is a family or a class/party. Each group has members,
//   and each member has their own allergies.
//   Everything is saved ONLY on this phone (no accounts, no server).
//   A group can be copied to another phone with a share link / QR code.
// ============================================================

// Short letters for each allergen, to keep share codes small
const ALLERGEN_CODES = {
  milk: "m", egg: "e", wheat: "w", peanut: "p", treenut: "t",
  soy: "s", fish: "f", shellfish: "c", sesame: "z"
};

function newId() {
  return Math.random().toString(36).slice(2, 9);
}

// ---------- Load & save ----------
function loadPeople() {
  let state = null;
  try { state = JSON.parse(localStorage.getItem("people")); } catch (e) {}
  if (state && Array.isArray(state.groups)) return state;

  // First time with this version: turn the old single allergy list into "Me"
  state = { groups: [], activeId: null };
  let old = [];
  try { old = JSON.parse(localStorage.getItem("myAllergies")) || []; } catch (e) {}
  if (old.length) {
    const g = { id: newId(), type: "family", name: "Just me", members: [{ id: newId(), name: "Me", allergies: old }] };
    state.groups.push(g);
    state.activeId = g.id;
  }
  return state;
}

function savePeople(state) {
  try { localStorage.setItem("people", JSON.stringify(state)); } catch (e) {}
}

function activeGroup(state) {
  return state.groups.find(g => g.id === state.activeId) || state.groups[0] || null;
}

// Every allergen AND diet anyone in the group has (no repeats)
function groupAllergies(group) {
  if (!group) return [];
  const all = new Set();
  group.members.forEach(m => {
    m.allergies.forEach(a => all.add(a));
    (m.diets || []).forEach(d => all.add(d));
  });
  const standard = ALLERGENS.map(a => a.id).filter(id => all.has(id)); // keep the standard order
  const custom = groupCustoms(group).map(c => c.id).filter(id => all.has(id));
  const diets = DIETS.map(d => d.id).filter(id => all.has(id));
  return standard.concat(custom, diets);
}

// ---------- How serious is each allergy? ----------
//   mild     -> intolerance: "contains" = careful, "may contain" is ignored
//   normal   -> allergy (default): "contains" = not safe, "may contain" = careful
//   severe   -> even traces: "contains" OR "may contain" = not safe
//   airborne -> like severe, AND they can react to it nearby (smell, steam, touch)
const SEVERITY = [
  { id: "mild",     label: "Mild" },
  { id: "normal",   label: "Allergy" },
  { id: "severe",   label: "Severe" },
  { id: "airborne", label: "Airborne" }
];
function levelOf(person, id) {
  return (person.levels && person.levels[id]) || "normal";
}

// ---------- Checking one person ----------
// found = { allergenOrDietId: { status: "contains" | "may" } }
// Returns the worst level for this person:
//   "danger" (not safe), "warn" (careful), "diet" (doesn't fit their diet), or "safe"
// plus the lists that explain why.
function personStatus(person, found) {
  const danger = [], warn = [], diet = [], airborne = [];
  for (const id of person.allergies) {
    const f = found[id];
    if (!f) continue;
    const lvl = levelOf(person, id);
    if (lvl === "airborne") airborne.push(id);
    if (lvl === "severe" || lvl === "airborne") danger.push(id);
    else if (lvl === "mild") { if (f.status === "contains") warn.push(id); }
    else if (f.status === "contains") danger.push(id);
    else warn.push(id);
  }
  for (const id of person.diets || []) {
    // Labels: only "contains" counts ("may contain traces" is fine for a diet).
    // Dishes: "some versions have meat" also counts, since it's worth asking.
    if (found[id] && (found[id].status === "contains" || found[id].fromDish)) diet.push(id);
  }
  const level = danger.length ? "danger" : warn.length ? "warn" : diet.length ? "diet" : "safe";
  return { level: level, danger: danger, warn: warn, diet: diet, airborne: airborne };
}

// A dish uses "usually" / "sometimes" instead of "contains" / "may".
// Each entry also carries a short reason ("why"), and the dish's diet info is added too.
function dishAsFound(dish) {
  const found = {};
  const why = dish.why || {};
  dish.sometimes.forEach(id => found[id] = { status: "may", why: why[id] });
  dish.usually.forEach(id => found[id] = { status: "contains", why: why[id] });
  const diets = typeof dishDiets === "function" ? dishDiets(dish) : {};
  for (const id of Object.keys(diets)) found[id] = Object.assign({ fromDish: true }, diets[id]);
  return found;
}

// ---------- Share codes ----------
// A group becomes a short text code that fits in a link or QR code:
//   {"v":1,"t":"c","n":"Room 12","m":[["Arjun","mp"],["Mia","e"]]}  ->  base64 text
function toBase64Url(text) {
  const b64 = btoa(unescape(encodeURIComponent(text)));          // works with any language
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
function fromBase64Url(code) {
  let b64 = code.replace(/-/g, "+").replace(/_/g, "/");
  while (b64.length % 4) b64 += "=";
  return decodeURIComponent(escape(atob(b64)));
}

function encodeGroup(group) {
  const data = {
    v: 1,
    t: group.type === "class" ? "c" : "f",
    n: group.name,
    m: group.members.map(p => {
      const custom = (p.custom || []).filter(c => p.allergies.includes(c.id));
      const levels = {};
      for (const id of p.allergies) if (levelOf(p, id) !== "normal") levels[ALLERGEN_CODES[id] || id] = levelOf(p, id)[0]; // m / s / a
      const row = [
        p.name,
        p.allergies.filter(id => ALLERGEN_CODES[id]).map(id => ALLERGEN_CODES[id]).join(""),
        custom.length ? custom.map(c => [c.name].concat(c.words.filter(w => w !== c.name.toLowerCase()))) : 0,
        Object.keys(levels).length ? levels : 0,
        (p.diets || []).length ? p.diets.map(id => DIETS.find(d => d.id === id).short) : 0
      ];
      while (row.length > 2 && row[row.length - 1] === 0) row.pop();   // keep codes short
      return row;
    })
  };
  return toBase64Url(JSON.stringify(data));
}

// Returns a new group, or null if the code is broken
function decodeGroup(code) {
  try {
    const data = JSON.parse(fromBase64Url(code.trim()));
    if (!data || !Array.isArray(data.m)) return null;
    const byLetter = {};
    Object.keys(ALLERGEN_CODES).forEach(id => byLetter[ALLERGEN_CODES[id]] = id);
    return {
      id: newId(),
      type: data.t === "c" ? "class" : "family",
      name: String(data.n || "Shared group").slice(0, 30),
      members: data.m.slice(0, 60).map(([name, letters, customList, levelMap, dietList]) => {
        const custom = (Array.isArray(customList) ? customList : []).slice(0, 20)
          .map(c => makeCustom(String(c[0] || "").slice(0, 30), c.slice(1).map(String).join(",")))
          .filter(c => c.name);
        const allergies = [...new Set(String(letters || "").split("").map(l => byLetter[l]).filter(Boolean))].concat(custom.map(c => c.id));
        const levels = {};
        const fullLevel = { m: "mild", s: "severe", a: "airborne" };
        if (levelMap && typeof levelMap === "object") {
          for (const [key, v] of Object.entries(levelMap)) {
            const id = byLetter[key] || key;
            if (allergies.includes(id) && fullLevel[v]) levels[id] = fullLevel[v];
          }
        }
        const diets = (Array.isArray(dietList) ? dietList : [])
          .map(sh => DIETS.find(d => d.short === sh)).filter(Boolean).map(d => d.id);
        return {
          id: newId(),
          name: String(name || "Someone").slice(0, 20),
          allergies: allergies, custom: custom, levels: levels, diets: diets
        };
      })
    };
  } catch (e) {
    return null;
  }
}

// Pulls the code out of a full link (…#join=CODE) or returns the text as-is
function codeFromText(text) {
  const m = String(text).match(/join=([A-Za-z0-9_-]+)/);
  return m ? m[1] : String(text).trim();
}

// ============================================================
// CUSTOM ALLERGIES
// For anything not in the main list (kiwi, mustard, coconut, red dye 40…).
// Each person can have their own:
//   { id: "c_kiwi", name: "Kiwi", words: ["kiwi", "kiwifruit", "猕猴桃"], names: {} }
//   words = every name it might go by on a label (any language)
//   names = translations for the Ask-the-cook card, e.g. { hi: "कीवी" } (filled in by AI later)
// ============================================================

function slugify(text) {
  return String(text).toLowerCase().trim().replace(/\s+/g, "-").replace(/[^\p{L}\p{N}-]/gu, "").slice(0, 30) || newId();
}

// Turns "Kiwi" + "kiwifruit, chinese gooseberry" into a custom allergy
function makeCustom(name, wordsText) {
  const words = [name].concat(String(wordsText || "").split(/[,，、\n]/))
    .map(w => w.trim().toLowerCase())
    .filter(w => w.length >= 2);
  return { id: "c_" + slugify(name), name: name.trim(), words: [...new Set(words)], names: {} };
}

// Converts a custom allergy into the same shape as the built-in ALLERGENS,
// so checkLabel() can use it exactly like milk or peanut.
function customAsAllergen(c) {
  const en = [], other = [];
  for (const w of c.words) {
    if (/^[\x00-\x7F]+$/.test(w)) {
      en.push(w);
      if (!w.endsWith("s")) en.push(w + "s", w + "es");   // kiwi -> kiwis, mango -> mangoes
    } else {
      other.push(w);
    }
  }
  return { id: c.id, name: c.name, emoji: "⭐", words: { en: en, other: other }, exclude: [], custom: true };
}

// Every custom allergy anyone in the group has (no repeats)
function groupCustoms(group) {
  const seen = {};
  if (group) group.members.forEach(m => (m.custom || []).forEach(c => { if (!seen[c.id]) seen[c.id] = c; }));
  return Object.values(seen);
}
