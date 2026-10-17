// ============================================================
// BAO — the app's buddy
// A little bao bun drawn with SVG. Its face changes with the result:
//   "happy"  -> smiling (nothing to worry about)
//   "unsure" -> worried (may contain)
//   "stop"   -> wide eyes + hand up (not safe)
//   "wave"   -> waving hello (home screen)
// ============================================================

function baoSvg(mood, size) {
  size = size || 96;
  const ink = "#2B2320";
  const line = "#4A3B35"; // cartoon outline

  // Eyes
  let eyes = `<circle cx="38" cy="58" r="4.2" fill="${ink}"/><circle cx="62" cy="58" r="4.2" fill="${ink}"/>`;
  if (mood === "happy" || mood === "wave") {
    eyes = `<path d="M33 59 q5 -6 10 0" stroke="${ink}" stroke-width="3.2" fill="none" stroke-linecap="round"/>
            <path d="M57 59 q5 -6 10 0" stroke="${ink}" stroke-width="3.2" fill="none" stroke-linecap="round"/>`;
  }
  if (mood === "stop") {
    eyes = `<circle cx="38" cy="57" r="5.5" fill="#fff" stroke="${ink}" stroke-width="2.4"/><circle cx="38" cy="57" r="2.4" fill="${ink}"/>
            <circle cx="62" cy="57" r="5.5" fill="#fff" stroke="${ink}" stroke-width="2.4"/><circle cx="62" cy="57" r="2.4" fill="${ink}"/>`;
  }

  // Eyebrows (only when worried)
  const brows = mood === "unsure"
    ? `<path d="M32 51 l10 -4" stroke="${ink}" stroke-width="2.6" stroke-linecap="round"/>
       <path d="M68 51 l-10 -4" stroke="${ink}" stroke-width="2.6" stroke-linecap="round"/>`
    : "";

  // Mouth
  const mouths = {
    happy:  `<path d="M43 67 q7 7 14 0" stroke="${ink}" stroke-width="3" fill="none" stroke-linecap="round"/>`,
    wave:   `<path d="M43 66 q7 8 14 0 z" fill="${ink}"/>`,
    unsure: `<path d="M42 70 q4 -4 8 0 q4 4 8 0" stroke="${ink}" stroke-width="2.8" fill="none" stroke-linecap="round"/>`,
    stop:   `<ellipse cx="50" cy="70" rx="4.5" ry="5.5" fill="${ink}"/>`
  };

  // Arms
  let arms = `<path d="M17 72 q-6 4 -4 10" stroke="${line}" stroke-width="11" fill="none" stroke-linecap="round"/><path d="M17 72 q-6 4 -4 10" stroke="#F7EEDD" stroke-width="6" fill="none" stroke-linecap="round"/>
              <path d="M83 72 q6 4 4 10" stroke="${line}" stroke-width="11" fill="none" stroke-linecap="round"/><path d="M83 72 q6 4 4 10" stroke="#F7EEDD" stroke-width="6" fill="none" stroke-linecap="round"/>`;
  if (mood === "wave") {
    arms = `<path d="M17 72 q-6 4 -4 10" stroke="${line}" stroke-width="11" fill="none" stroke-linecap="round"/><path d="M17 72 q-6 4 -4 10" stroke="#F7EEDD" stroke-width="6" fill="none" stroke-linecap="round"/>
            <g class="bao-wave"><path d="M83 66 q10 -6 10 -18" stroke="${line}" stroke-width="11" fill="none" stroke-linecap="round"/><path d="M83 66 q10 -6 10 -18" stroke="#F7EEDD" stroke-width="6" fill="none" stroke-linecap="round"/></g>`;
  }
  if (mood === "stop") {
    arms = `<path d="M17 72 q-6 4 -4 10" stroke="${line}" stroke-width="11" fill="none" stroke-linecap="round"/><path d="M17 72 q-6 4 -4 10" stroke="#F7EEDD" stroke-width="6" fill="none" stroke-linecap="round"/>
            <path d="M83 70 q8 -4 9 -16" stroke="${line}" stroke-width="11" fill="none" stroke-linecap="round"/><path d="M83 70 q8 -4 9 -16" stroke="#F7EEDD" stroke-width="6" fill="none" stroke-linecap="round"/>
            <rect x="85" y="34" width="15" height="17" rx="6" fill="#F7EEDD" stroke="${line}" stroke-width="3"/>`;
  }

  return `<svg class="bao" width="${size}" height="${size}" viewBox="0 0 104 104" aria-hidden="true">
    ${arms}
    <!-- bun body -->
    <path d="M14 76 C10 48 28 26 52 26 C76 26 94 48 90 76 C88 86 76 90 52 90 C28 90 16 86 14 76 Z"
          fill="#F7EEDD" stroke="${line}" stroke-width="3.5"/>
    <!-- pleats on top -->
    <path d="M52 27 q-3 7 -10 10 M52 27 q3 7 10 10 M52 27 v9" stroke="#CDB892" stroke-width="2.6" fill="none" stroke-linecap="round"/>
    <!-- cheeks -->
    <ellipse cx="30" cy="66" rx="5.5" ry="3.5" fill="#FFB3B3" opacity=".75"/>
    <ellipse cx="70" cy="66" rx="5.5" ry="3.5" fill="#FFB3B3" opacity=".75"/>
    ${brows}${eyes}${mouths[mood] || mouths.happy}
  </svg>`;
}
