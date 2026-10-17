// ============================================================
// THE BUDDY
// A little food character drawn with SVG. Its face changes with the result:
//   "happy"  -> smiling (nothing to worry about)
//   "unsure" -> worried (may contain)
//   "stop"   -> wide eyes + hand up (not safe)
//   "wave"   -> waving hello (home screen)
//
// The user picks a character, an accessory, and a name.
// Every character uses the same face, so all moods work for all of them.
// ============================================================

const INK = "#2B2320";   // eyes and mouth
const LINE = "#4A3B35";  // cartoon outline

// ---------- Characters ----------
//   top   = how high the head goes (so hats sit in the right place)
//   skin  = color of the arms
//   armL / armR = where the arms attach (most use 17 and 87)
const BUDDIES = {
  strawberry: {
    label: "Strawberry", top: 24, skin: "#FF7A85",
    body: `<path d="M52 30 C30 16 8 34 15 56 C21 76 40 92 52 93 C64 92 83 76 89 56 C96 34 74 16 52 30 Z"
                 fill="#FF7A85" stroke="${LINE}" stroke-width="3.5" stroke-linejoin="round"/>
           <g fill="#FFE27A"><ellipse cx="30" cy="44" rx="1.6" ry="2.4"/><ellipse cx="74" cy="44" rx="1.6" ry="2.4"/>
             <ellipse cx="24" cy="60" rx="1.6" ry="2.4"/><ellipse cx="80" cy="60" rx="1.6" ry="2.4"/>
             <ellipse cx="38" cy="82" rx="1.6" ry="2.4"/><ellipse cx="66" cy="82" rx="1.6" ry="2.4"/><ellipse cx="52" cy="86" rx="1.6" ry="2.4"/></g>
           <path d="M52 30 c-6 -2 -16 -2 -20 2 c6 4 14 4 20 -2 z M52 30 c6 -2 16 -2 20 2 c-6 4 -14 4 -20 -2 z M52 30 c-4 -6 -4 -12 0 -14 c4 2 4 8 0 14 z"
                 fill="#6CC46C" stroke="${LINE}" stroke-width="2.6" stroke-linejoin="round"/>`
  },
  dumpling: {
    label: "Dumpling", top: 34, skin: "#FFF4E0",
    body: `<path d="M10 76 C10 52 30 36 52 36 C74 36 94 52 94 76 C94 86 80 90 52 90 C24 90 10 86 10 76 Z"
                 fill="#FFF4E0" stroke="${LINE}" stroke-width="3.5"/>
           <path d="M22 46 q4 -9 9 -3 q4 -9 9 -3 q4 -9 9 -3 q4 -9 9 -3 q4 -9 9 -3 q4 -9 9 -3"
                 fill="none" stroke="${LINE}" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/>`
  },
  boba: {
    label: "Boba", top: 26, skin: "#E8C9A0", armL: 22, armR: 82,
    body: `<path d="M34 30 L24 6" stroke="${LINE}" stroke-width="10" stroke-linecap="round"/>
           <path d="M34 30 L24 6" stroke="#FF8FB1" stroke-width="5" stroke-linecap="round"/>
           <path d="M18 36 H86 L78 90 H26 Z" fill="#E8C9A0" stroke="${LINE}" stroke-width="3.5" stroke-linejoin="round"/>
           <rect x="13" y="26" width="78" height="12" rx="6" fill="#FFFFFF" stroke="${LINE}" stroke-width="3.5"/>
           <g fill="#4A3027"><circle cx="34" cy="83" r="3.6"/><circle cx="44" cy="85" r="3.6"/><circle cx="56" cy="84" r="3.6"/>
             <circle cx="67" cy="83" r="3.6"/><circle cx="40" cy="78" r="3.2"/><circle cx="62" cy="78" r="3.2"/></g>`
  },
  onigiri: {
    label: "Onigiri", top: 20, skin: "#FFFFFF",
    body: `<path d="M52 20 C62 20 92 66 90 80 C88 90 16 90 14 80 C12 66 42 20 52 20 Z"
                 fill="#FFFFFF" stroke="${LINE}" stroke-width="3.5" stroke-linejoin="round"/>
           <circle cx="40" cy="44" r="1.6" fill="#E3E3E3"/><circle cx="62" cy="40" r="1.6" fill="#E3E3E3"/><circle cx="70" cy="52" r="1.6" fill="#E3E3E3"/>
           <path d="M34 76 h36 v12 c-12 2 -24 2 -36 0 z" fill="#2F3B2F"/>`
  },
  mango: {
    label: "Mango", top: 24, skin: "#FFB547",
    body: `<path d="M52 24 C78 22 94 46 88 70 C84 86 66 92 50 90 C28 88 12 72 14 52 C16 36 30 25 52 24 Z"
                 fill="#FFB547" stroke="${LINE}" stroke-width="3.5"/>
           <path d="M70 32 C84 40 88 56 84 70 C80 60 74 44 70 32 Z" fill="#FF8A3D" opacity=".55"/>
           <path d="M54 24 q2 -6 0 -10" stroke="${LINE}" stroke-width="3" fill="none" stroke-linecap="round"/>
           <path d="M55 16 c6 -8 18 -8 20 -2 c-6 6 -14 6 -20 2 z" fill="#6CC46C" stroke="${LINE}" stroke-width="2.6" stroke-linejoin="round"/>`
  },
  samosa: {
    label: "Samosa", top: 16, skin: "#F4C46A",
    body: `<path d="M52 16 C58 16 94 74 90 82 C86 90 18 90 14 82 C10 74 46 16 52 16 Z"
                 fill="#F4C46A" stroke="${LINE}" stroke-width="3.5" stroke-linejoin="round"/>
           <path d="M22 84 q4 -4 8 0 q4 -4 8 0 q4 -4 8 0 q4 -4 8 0 q4 -4 8 0 q4 -4 8 0 q4 -4 8 0" stroke="#C99536" stroke-width="2.4" fill="none" stroke-linecap="round"/>
           <circle cx="44" cy="40" r="1.8" fill="#D9A441"/><circle cx="60" cy="46" r="1.8" fill="#D9A441"/><circle cx="36" cy="76" r="1.8" fill="#D9A441"/>`
  },
  avocado: {
    label: "Avocado", top: 16, skin: "#7FAE4E",
    body: `<path d="M52 16 C64 16 70 30 76 42 C90 56 92 76 80 86 C70 94 34 94 24 86 C12 76 14 56 28 42 C34 30 40 16 52 16 Z"
                 fill="#5E8C3A" stroke="${LINE}" stroke-width="3.5"/>
           <path d="M52 22 C61 22 66 34 71 44 C83 57 85 74 75 82 C66 89 38 89 29 82 C19 74 21 57 33 44 C38 34 43 22 52 22 Z"
                 fill="#D6EB94"/>
           <circle cx="52" cy="81" r="6.5" fill="#A0663A" stroke="${LINE}" stroke-width="2.4"/>`
  },
  cookie: {
    label: "Cookie", top: 20, skin: "#E3A867",
    body: `<circle cx="52" cy="57" r="37" fill="#E3A867" stroke="${LINE}" stroke-width="3.5"/>
           <g fill="#5A3A28"><ellipse cx="38" cy="32" rx="4" ry="3"/><ellipse cx="64" cy="30" rx="3.5" ry="2.6"/>
             <ellipse cx="24" cy="48" rx="3" ry="2.4"/><ellipse cx="80" cy="46" rx="3.5" ry="2.8"/>
             <ellipse cx="34" cy="80" rx="3.5" ry="2.6"/><ellipse cx="70" cy="80" rx="4" ry="3"/><ellipse cx="52" cy="86" rx="3" ry="2.2"/></g>`
  },
  taco: {
    label: "Taco", top: 40, skin: "#F5C95C",
    body: `<path d="M16 50 q4 -6 9 -2 q4 -6 9 -2 q4 -6 9 -2 q4 -6 9 -2 q4 -6 9 -2 q4 -6 9 -2 q4 -6 9 -2 q4 -5 6 2 L88 54 H16 Z"
                 fill="#7FCB5B" stroke="${LINE}" stroke-width="2.8" stroke-linejoin="round"/>
           <circle cx="34" cy="46" r="4.5" fill="#FF6B5E" stroke="${LINE}" stroke-width="2.4"/>
           <circle cx="70" cy="46" r="4.5" fill="#FF6B5E" stroke="${LINE}" stroke-width="2.4"/>
           <path d="M10 50 A42 42 0 0 0 94 50 Z" fill="#F5C95C" stroke="${LINE}" stroke-width="3.5" stroke-linejoin="round"/>
           <g fill="#E0A93D"><circle cx="24" cy="62" r="1.8"/><circle cx="80" cy="64" r="1.8"/><circle cx="40" cy="84" r="1.8"/><circle cx="66" cy="84" r="1.8"/></g>`
  },
  pizza: {
    label: "Pizza", top: 20, skin: "#FFD36B", armL: 30, armR: 74,
    body: `<path d="M6 30 H98 L52 100 Z" fill="#FFD36B" stroke="${LINE}" stroke-width="3.5" stroke-linejoin="round"/>
           <rect x="2" y="20" width="100" height="14" rx="7" fill="#E8A05C" stroke="${LINE}" stroke-width="3.5"/>
           <g fill="#E8574B" stroke="${LINE}" stroke-width="2"><circle cx="20" cy="42" r="4.5"/><circle cx="84" cy="42" r="4.5"/><circle cx="52" cy="88" r="4"/></g>`
  },
  tofu: {
    label: "Tofu", top: 30, skin: "#FFF8EA",
    body: `<rect x="15" y="30" width="74" height="60" rx="16" fill="#FFF8EA" stroke="${LINE}" stroke-width="3.5"/>
           <path d="M26 38 h30" stroke="#FFFFFF" stroke-width="5" stroke-linecap="round"/>`
  }
};

// ---------- Accessories ----------
// t = top of the head, L = where the left hand is
const ACCESSORIES = {
  none:    { label: "None",     draw: () => "" },
  chef:    { label: "Chef hat", draw: t => `
      <path d="M38 ${t + 2} h28 v-10 h-28 z" fill="#fff" stroke="${LINE}" stroke-width="3"/>
      <path d="M36 ${t - 8} c-10 -2 -10 -18 2 -18 c2 -10 26 -10 28 0 c12 0 12 16 2 18 z" fill="#fff" stroke="${LINE}" stroke-width="3" stroke-linejoin="round"/>` },
  bow:     { label: "Bow",      draw: t => `
      <path d="M66 ${t + 4} l-12 -8 v16 z M66 ${t + 4} l12 -8 v16 z" fill="#FF8FB1" stroke="${LINE}" stroke-width="2.6" stroke-linejoin="round"/>
      <circle cx="66" cy="${t + 4}" r="3.6" fill="#FF8FB1" stroke="${LINE}" stroke-width="2.4"/>` },
  fork:    { label: "Fork",     draw: (t, L, skin) => `
      <rect x="${L - 10}" y="50" width="5" height="40" rx="2.5" fill="#D5DCE4" stroke="${LINE}" stroke-width="2.4"/>
      <path d="M${L - 14} 40 v10 q0 6 6.5 6 q6.5 0 6.5 -6 v-10" fill="none" stroke="${LINE}" stroke-width="2.4" stroke-linecap="round"/>
      <path d="M${L - 14} 40 v10 M${L - 7.5} 40 v12 M${L - 1} 40 v10" stroke="#D5DCE4" stroke-width="2" stroke-linecap="round"/>
      <path d="M${L - 14} 40 v10 M${L - 7.5} 40 v12 M${L - 1} 40 v10" stroke="${LINE}" stroke-width="1" stroke-linecap="round" opacity=".5"/>
      <circle cx="${L - 7.5}" cy="78" r="5.5" fill="${skin}" stroke="${LINE}" stroke-width="2.6"/>` },
  glasses: { label: "Glasses",  draw: () => `
      <circle cx="38" cy="58" r="8.5" fill="rgba(255,255,255,.35)" stroke="${LINE}" stroke-width="2.6"/>
      <circle cx="62" cy="58" r="8.5" fill="rgba(255,255,255,.35)" stroke="${LINE}" stroke-width="2.6"/>
      <path d="M46.5 57 q5.5 -3 11 0" stroke="${LINE}" stroke-width="2.6" fill="none"/>` },
  sprout:  { label: "Sprout",   draw: t => `
      <path d="M52 ${t} v-12" stroke="${LINE}" stroke-width="3" stroke-linecap="round"/>
      <path d="M52 ${t - 10} c-4 -10 -16 -10 -18 -4 c6 6 14 6 18 4 z" fill="#8BD17C" stroke="${LINE}" stroke-width="2.6" stroke-linejoin="round"/>
      <path d="M52 ${t - 12} c4 -10 16 -10 18 -4 c-6 6 -14 6 -18 4 z" fill="#8BD17C" stroke="${LINE}" stroke-width="2.6" stroke-linejoin="round"/>` }
};

// ---------- The user's saved choice ----------
const DEFAULT_BUDDY = { body: "dumpling", acc: "none", name: "Dumpy" };
function getBuddy() {
  let saved = null;
  try { saved = JSON.parse(localStorage.getItem("buddy")); } catch (e) {}
  const b = Object.assign({}, DEFAULT_BUDDY, saved || {});
  if (!BUDDIES[b.body]) b.body = DEFAULT_BUDDY.body;
  if (!ACCESSORIES[b.acc]) b.acc = "none";
  return b;
}
function setBuddy(b) {
  try { localStorage.setItem("buddy", JSON.stringify(b)); } catch (e) {}
}

// ---------- Drawing ----------
function buddySvg(mood, size, choice) {
  size = size || 96;
  choice = choice || getBuddy();
  const B = BUDDIES[choice.body] || BUDDIES.dumpling;
  const acc = ACCESSORIES[choice.acc] || ACCESSORIES.none;
  const skin = B.skin, L = B.armL || 17, R = B.armR || 87;

  // Eyes
  let eyes = `<circle cx="38" cy="58" r="4.2" fill="${INK}"/><circle cx="62" cy="58" r="4.2" fill="${INK}"/>`;
  if (mood === "happy" || mood === "wave") {
    eyes = `<path d="M33 59 q5 -6 10 0" stroke="${INK}" stroke-width="3.2" fill="none" stroke-linecap="round"/>
            <path d="M57 59 q5 -6 10 0" stroke="${INK}" stroke-width="3.2" fill="none" stroke-linecap="round"/>`;
  }
  if (mood === "stop") {
    eyes = `<circle cx="38" cy="57" r="5.5" fill="#fff" stroke="${INK}" stroke-width="2.4"/><circle cx="38" cy="57" r="2.4" fill="${INK}"/>
            <circle cx="62" cy="57" r="5.5" fill="#fff" stroke="${INK}" stroke-width="2.4"/><circle cx="62" cy="57" r="2.4" fill="${INK}"/>`;
  }
  const brows = mood === "unsure"
    ? `<path d="M32 51 l10 -4" stroke="${INK}" stroke-width="2.6" stroke-linecap="round"/>
       <path d="M68 51 l-10 -4" stroke="${INK}" stroke-width="2.6" stroke-linecap="round"/>`
    : "";
  const mouths = {
    happy:  `<path d="M43 67 q7 7 14 0" stroke="${INK}" stroke-width="3" fill="none" stroke-linecap="round"/>`,
    wave:   `<path d="M43 66 q7 8 14 0 z" fill="${INK}"/>`,
    unsure: `<path d="M42 70 q4 -4 8 0 q4 4 8 0" stroke="${INK}" stroke-width="2.8" fill="none" stroke-linecap="round"/>`,
    stop:   `<ellipse cx="50" cy="70" rx="4.5" ry="5.5" fill="${INK}"/>`
  };

  // Arms: a thick dark line with a thinner skin-colored line on top = an outlined arm
  const arm = d => `<path d="${d}" stroke="${LINE}" stroke-width="11" fill="none" stroke-linecap="round"/>
                    <path d="${d}" stroke="${skin}" stroke-width="6" fill="none" stroke-linecap="round"/>`;
  const leftArm = arm(`M${L} 72 q-6 4 -4 10`);
  let rightArm = arm(`M${R} 72 q6 4 4 10`);
  if (mood === "wave") rightArm = `<g class="bao-wave" style="transform-box:view-box; transform-origin:${R}px 66px">${arm(`M${R} 66 q10 -6 10 -18`)}</g>`;
  if (mood === "stop") rightArm = arm(`M${R} 70 q8 -4 9 -16`) +
    `<rect x="${R + 2}" y="34" width="15" height="17" rx="6" fill="${skin}" stroke="${LINE}" stroke-width="3"/>`;

  return `<svg class="bao" width="${size}" height="${size}" viewBox="-8 -14 120 118" aria-hidden="true">
    ${leftArm}${rightArm}
    ${B.body}
    <ellipse cx="30" cy="66" rx="5.5" ry="3.5" fill="#FFB3B3" opacity=".8"/>
    <ellipse cx="70" cy="66" rx="5.5" ry="3.5" fill="#FFB3B3" opacity=".8"/>
    ${brows}${eyes}${mouths[mood] || mouths.happy}
    ${acc.draw(B.top, L, skin)}
  </svg>`;
}

// Older code calls baoSvg(): it draws whichever buddy the user picked
function baoSvg(mood, size) { return buddySvg(mood, size); }
