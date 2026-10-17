// ============================================================
// DISH GUIDE
// Common dishes and the allergens they USUALLY or SOMETIMES contain.
// Used for food with no label: restaurants, parties, potlucks.
//
// These are typical recipes, not guarantees. Every cook is different,
// so the app always tells people to ask.
//
//   names     -> what people might type (first one is shown)
//   usually   -> allergens in the normal recipe
//   sometimes -> allergens in many versions, or in sauces/toppings
//
// Allergen ids: milk, egg, wheat, peanut, treenut, soy, fish, shellfish, sesame
// ============================================================

const DISHES = [
  // ---------- American / European ----------
  { names: ["Pizza"], usually: ["wheat", "milk"], sometimes: ["soy", "egg"] },
  { names: ["Pasta with tomato sauce", "spaghetti", "pasta", "marinara"], usually: ["wheat"], sometimes: ["milk", "egg"] },
  { names: ["Pesto pasta", "pesto"], usually: ["wheat", "milk", "treenut"], sometimes: [] },
  { names: ["Mac and cheese", "macaroni and cheese", "macaroni"], usually: ["wheat", "milk"], sometimes: ["egg"] },
  { names: ["Burger", "hamburger", "cheeseburger"], usually: ["wheat"], sometimes: ["milk", "egg", "sesame", "soy"] },
  { names: ["Fried chicken"], usually: ["wheat"], sometimes: ["egg", "milk", "soy"] },
  { names: ["Chicken nuggets", "nuggets"], usually: ["wheat"], sometimes: ["egg", "milk", "soy"] },
  { names: ["Sandwich", "sub"], usually: ["wheat"], sometimes: ["milk", "egg", "soy", "sesame"] },
  { names: ["Pancakes", "pancake"], usually: ["wheat", "milk", "egg"], sometimes: ["soy"] },
  { names: ["Waffles", "waffle"], usually: ["wheat", "milk", "egg"], sometimes: ["soy"] },
  { names: ["Omelet", "omelette", "scrambled eggs"], usually: ["egg"], sometimes: ["milk"] },
  { names: ["Caesar salad"], usually: ["fish", "egg", "milk", "wheat"], sometimes: [] },
  { names: ["Potato salad", "egg salad", "coleslaw"], usually: ["egg"], sometimes: ["milk"] },
  { names: ["Fish and chips"], usually: ["fish", "wheat"], sometimes: ["milk", "egg"] },
  { names: ["Clam chowder", "chowder"], usually: ["shellfish", "milk", "wheat"], sometimes: [] },
  { names: ["Ice cream", "gelato"], usually: ["milk"], sometimes: ["egg", "treenut", "peanut", "soy", "wheat"] },
  { names: ["Cake", "cupcake", "birthday cake"], usually: ["wheat", "milk", "egg"], sometimes: ["soy", "treenut"] },
  { names: ["Cookies", "cookie"], usually: ["wheat", "milk", "egg"], sometimes: ["peanut", "treenut", "soy"] },
  { names: ["Brownie", "brownies"], usually: ["wheat", "milk", "egg"], sometimes: ["treenut", "soy"] },
  { names: ["Granola bar", "granola", "energy bar"], usually: [], sometimes: ["peanut", "treenut", "soy", "milk", "wheat"] },
  { names: ["Baklava"], usually: ["wheat", "treenut", "milk"], sometimes: [] },

  // ---------- Mexican / Middle Eastern ----------
  { names: ["Tacos", "taco"], usually: [], sometimes: ["wheat", "milk"] },
  { names: ["Burrito"], usually: ["wheat", "milk"], sometimes: [] },
  { names: ["Hummus"], usually: ["sesame"], sometimes: [] },
  { names: ["Falafel"], usually: [], sometimes: ["sesame", "wheat"] },

  // ---------- Indian ----------
  { names: ["Samosa"], usually: ["wheat"], sometimes: ["treenut", "milk"] },
  { names: ["Butter chicken", "chicken makhani"], usually: ["milk"], sometimes: ["treenut"] },
  { names: ["Paneer tikka masala", "paneer", "palak paneer", "paneer butter masala"], usually: ["milk"], sometimes: ["treenut"] },
  { names: ["Chicken tikka masala", "tikka masala"], usually: ["milk"], sometimes: ["treenut"] },
  { names: ["Korma", "navratan korma"], usually: ["milk", "treenut"], sometimes: [] },
  { names: ["Biryani"], usually: ["milk"], sometimes: ["treenut"] },
  { names: ["Dal", "daal", "dal tadka"], usually: [], sometimes: ["milk"] },
  { names: ["Naan", "garlic naan"], usually: ["wheat", "milk"], sometimes: ["egg"] },
  { names: ["Roti", "chapati", "paratha"], usually: ["wheat"], sometimes: ["milk"] },
  { names: ["Dosa", "masala dosa"], usually: [], sometimes: ["milk", "peanut"] },
  { names: ["Pani puri", "golgappa", "chaat", "bhel puri"], usually: ["wheat"], sometimes: ["peanut", "milk"] },
  { names: ["Gulab jamun"], usually: ["milk", "wheat"], sometimes: ["treenut"] },
  { names: ["Kheer", "rice pudding"], usually: ["milk"], sometimes: ["treenut"] },

  // ---------- Chinese ----------
  { names: ["Fried rice"], usually: ["soy", "egg"], sometimes: ["wheat", "shellfish", "sesame"] },
  { names: ["Lo mein", "chow mein", "noodles"], usually: ["wheat", "soy"], sometimes: ["egg", "shellfish", "sesame"] },
  { names: ["Dumplings", "potstickers", "jiaozi", "gyoza", "momos"], usually: ["wheat", "soy"], sometimes: ["shellfish", "sesame", "egg"] },
  { names: ["Kung pao chicken", "kung pao"], usually: ["peanut", "soy", "wheat"], sometimes: ["sesame"] },
  { names: ["Orange chicken", "general tso chicken", "sweet and sour chicken"], usually: ["wheat", "soy"], sometimes: ["egg", "sesame"] },
  { names: ["Spring rolls", "egg rolls"], usually: ["wheat"], sometimes: ["egg", "soy", "shellfish"] },

  // ---------- Japanese ----------
  { names: ["Sushi"], usually: ["fish", "soy"], sometimes: ["shellfish", "egg", "sesame", "wheat"] },
  { names: ["Ramen"], usually: ["wheat", "soy"], sometimes: ["egg", "fish", "sesame", "shellfish"] },
  { names: ["Tempura", "shrimp tempura"], usually: ["wheat", "egg"], sometimes: ["shellfish", "fish"] },

  // ---------- Korean ----------
  { names: ["Bibimbap"], usually: ["soy", "sesame", "egg"], sometimes: ["wheat"] },
  { names: ["Kimchi"], usually: ["fish", "shellfish"], sometimes: [] },
  { names: ["Bulgogi"], usually: ["soy", "sesame", "wheat"], sometimes: [] },
  { names: ["Japchae"], usually: ["soy", "sesame"], sometimes: ["egg", "wheat"] },
  { names: ["Tteokbokki", "ddeokbokki"], usually: ["wheat", "soy"], sometimes: ["fish", "egg"] },

  // ---------- Southeast Asian ----------
  { names: ["Pad thai", "phad thai"], usually: ["peanut", "egg", "fish", "shellfish", "soy"], sometimes: [] },
  { names: ["Thai curry", "green curry", "red curry", "massaman curry"], usually: ["fish"], sometimes: ["shellfish", "peanut", "soy"] },
  { names: ["Satay", "chicken satay"], usually: ["peanut", "soy"], sometimes: ["fish"] },
  { names: ["Pho"], usually: ["fish"], sometimes: ["soy", "wheat"] }
];

// Find a dish by what the user typed (ignores capitals and extra spaces)
function findDish(typed) {
  const t = typed.toLowerCase().trim();
  if (!t) return null;
  // 1. Exact name match
  for (const d of DISHES) {
    if (d.names.some(n => n.toLowerCase() === t)) return d;
  }
  // 2. The typed text contains a dish name ("chicken pad thai" finds "pad thai").
  //    If several match, pick the longest name, since it's the most specific.
  let best = null, bestLen = 0;
  for (const d of DISHES) {
    for (const n of d.names) {
      const name = n.toLowerCase();
      if (t.includes(name) && name.length > bestLen) { best = d; bestLen = name.length; }
    }
  }
  if (best) return best;
  // 3. The user typed the start of a name ("biry" finds "biryani")
  if (t.length >= 4) {
    for (const d of DISHES) {
      if (d.names.some(n => n.toLowerCase().startsWith(t))) return d;
    }
  }
  return null;
}
