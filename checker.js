// ============================================================
// ALLERGEN CHECKER
// Takes the text read from a label and works out which allergens
// it CONTAINS and which it MAY contain.
// ============================================================

// Remove all spaces. The reader often puts spaces between Chinese/Korean
// characters (小 麦 instead of 小麦), so we compare without spaces.
function compact(s) {
  return s.replace(/\s+/g, "");
}

// Escape characters that have special meaning in a search pattern
function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Does this piece of text contain this word?
// English words must match as whole words ("buckwheat" should NOT count as "wheat").
// Other languages don't use spaces the same way, so we just look for the characters.
function hasWord(segment, word, lang) {
  if (lang === "en") {
    return new RegExp("\\b" + escapeRegex(word) + "\\b").test(segment);
  }
  return compact(segment).includes(compact(word));
}

// Is this sentence a "may contain" warning?
function isMayContain(segment) {
  return MAY_CONTAIN_MARKERS.some(m => segment.includes(m) || compact(segment).includes(compact(m)));
}

// Main function: returns { allergenId: { status: "contains" | "may", words: [...] } }
function checkLabel(rawText) {
  // 1. Clean up: lowercase, and join the lines back together
  //    (a sentence often wraps across two lines on the label)
  let text = rawText.toLowerCase().replace(/\s+/g, " ");

  // English labels often start a new section without a period
  // ("...Baobab powder)  May contain: Peanuts"), so treat these headings as a new sentence
  for (const heading of ["may contain", "contains:", "contains ", "ingredients"]) {
    text = text.split(heading).join(". " + heading);
  }

  // 2. Split into sentences, so we know which ones are "may contain" warnings
  //    Sentence endings: .  。 (Chinese)  । (Hindi)  ! ?
  const segments = text.split(/[.。।!?！？]/).map(s => s.trim()).filter(s => s.length > 0);

  const results = {};

  for (const allergen of ALLERGENS) {
    for (let segment of segments) {
      // 3. Blank out look-alike phrases first (e.g. "cocoa butter" is not milk)
      for (const ex of allergen.exclude) {
        if (/^[\x00-\x7F]+$/.test(ex)) {
          // English phrase: remove it as-is
          segment = segment.split(ex.toLowerCase()).join(" ");
        } else if (compact(segment).includes(compact(ex))) {
          // Chinese/Korean/Hindi phrase: remove it ignoring spaces
          segment = compact(segment).split(compact(ex)).join(" ");
        }
      }

      // 4. Look for every word, in every language
      for (const lang of Object.keys(allergen.words)) {
        for (const word of allergen.words[lang]) {
          if (!hasWord(segment, word.toLowerCase(), lang)) continue;

          const status = isMayContain(segment) ? "may" : "contains";
          if (!results[allergen.id]) {
            results[allergen.id] = { status: status, words: [] };
          }
          // "contains" beats "may": if it's in the ingredients, it's definitely there
          if (status === "contains") results[allergen.id].status = "contains";
          if (!results[allergen.id].words.includes(word)) results[allergen.id].words.push(word);
        }
      }
    }
  }
  return results;
}
