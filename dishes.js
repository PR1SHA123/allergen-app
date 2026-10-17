// ============================================================
// DISH GUIDE
// Common dishes, which allergens they USUALLY or SOMETIMES contain,
// WHY (a short reason for each), and diet info.
//
// These are typical recipes, not guarantees. Every cook is different,
// so the app always tells people to ask.
//
//   names     -> what people might type (first one is shown)
//   usually   -> allergens in the normal recipe
//   sometimes -> allergens in many versions, or in sauces/toppings
//   why       -> one short reason per allergen
//   diet      -> u = usually, s = sometimes:
//                meat, pork, beef, alcohol, onion (onion/garlic/root vegetables, for Jain diets)
//
// Allergen ids: milk, egg, wheat, peanut, treenut, soy, fish, shellfish, sesame
// ============================================================

const DISHES = [
  // ---------- American / European ----------
  { names: ["Pizza"], usually: ["wheat", "milk"], sometimes: ["soy", "egg"],
    why: { wheat: "The crust is made from wheat flour", milk: "Mozzarella cheese is dairy",
           soy: "Some crusts and sauces use soybean oil", egg: "Some doughs and toppings use egg" },
    diet: { meat: "s", pork: "s", onion: "s" } },
  { names: ["Pasta with tomato sauce", "spaghetti", "pasta", "marinara"], usually: ["wheat"], sometimes: ["milk", "egg"],
    why: { wheat: "Pasta is made from wheat", milk: "Often topped with parmesan cheese", egg: "Fresh pasta is often made with egg" },
    diet: { meat: "s", onion: "u", alcohol: "s" } },
  { names: ["Pesto pasta", "pesto"], usually: ["wheat", "milk", "treenut"], sometimes: [],
    why: { wheat: "Pasta is made from wheat", milk: "Pesto has parmesan cheese", treenut: "Pesto is made with pine nuts (sometimes walnuts)" },
    diet: { onion: "u" } },
  { names: ["Mac and cheese", "macaroni and cheese", "macaroni"], usually: ["wheat", "milk"], sometimes: ["egg"],
    why: { wheat: "Macaroni is wheat pasta", milk: "The sauce is cheese, milk, and butter", egg: "Some baked versions add egg" },
    diet: {} },
  { names: ["Burger", "hamburger", "cheeseburger"], usually: ["wheat"], sometimes: ["milk", "egg", "sesame", "soy"],
    why: { wheat: "The bun is wheat bread", milk: "Cheese, or butter on the bun", egg: "Mayonnaise and some buns have egg",
           sesame: "Many buns have sesame seeds", soy: "Buns and sauces often contain soy" },
    diet: { meat: "u", beef: "u", pork: "s", onion: "s" } },
  { names: ["Fried chicken"], usually: ["wheat"], sometimes: ["egg", "milk", "soy"],
    why: { wheat: "The breading is wheat flour", egg: "Often dipped in egg before breading",
           milk: "Often soaked in buttermilk", soy: "Often fried in soybean oil" },
    diet: { meat: "u", onion: "s" } },
  { names: ["Chicken nuggets", "nuggets"], usually: ["wheat"], sometimes: ["egg", "milk", "soy"],
    why: { wheat: "The coating is wheat breadcrumbs", egg: "Egg helps the coating stick",
           milk: "Some coatings have milk", soy: "Often fried in soybean oil" },
    diet: { meat: "u" } },
  { names: ["Sandwich", "sub"], usually: ["wheat"], sometimes: ["milk", "egg", "soy", "sesame"],
    why: { wheat: "Bread is made from wheat", milk: "Cheese or butter", egg: "Mayonnaise is made from egg",
           soy: "Many breads and spreads contain soy", sesame: "Some breads have sesame seeds" },
    diet: { meat: "s", pork: "s", beef: "s", onion: "s" } },
  { names: ["Pancakes", "pancake"], usually: ["wheat", "milk", "egg"], sometimes: ["soy"],
    why: { wheat: "The batter is wheat flour", milk: "The batter uses milk and butter", egg: "The batter uses egg",
           soy: "Some mixes contain soy" },
    diet: {} },
  { names: ["Waffles", "waffle"], usually: ["wheat", "milk", "egg"], sometimes: ["soy"],
    why: { wheat: "The batter is wheat flour", milk: "The batter uses milk and butter", egg: "The batter uses egg",
           soy: "Some mixes contain soy" },
    diet: {} },
  { names: ["Omelet", "omelette", "scrambled eggs"], usually: ["egg"], sometimes: ["milk"],
    why: { egg: "Made from eggs", milk: "Often has milk, butter, or cheese" },
    diet: { meat: "s", pork: "s", onion: "s" } },
  { names: ["Caesar salad"], usually: ["fish", "egg", "milk", "wheat"], sometimes: [],
    why: { fish: "The dressing has anchovies", egg: "The dressing has egg yolk", milk: "Topped with parmesan cheese",
           wheat: "Croutons are bread" },
    diet: { meat: "s", onion: "u" } },
  { names: ["Potato salad", "egg salad", "coleslaw"], usually: ["egg"], sometimes: ["milk"],
    why: { egg: "Mayonnaise is made from egg", milk: "Some versions use sour cream" },
    diet: { onion: "u" } },
  { names: ["Fish and chips"], usually: ["fish", "wheat"], sometimes: ["milk", "egg"],
    why: { fish: "The main ingredient is fish", wheat: "The batter is wheat flour",
           milk: "Some batters use milk", egg: "Some batters use egg" },
    diet: { alcohol: "s", onion: "u" } },
  { names: ["Clam chowder", "chowder"], usually: ["shellfish", "milk", "wheat"], sometimes: [],
    why: { shellfish: "Made with clams", milk: "The soup is made with milk or cream", wheat: "Flour thickens the soup" },
    diet: { pork: "s", onion: "u" } },
  { names: ["Ice cream", "gelato"], usually: ["milk"], sometimes: ["egg", "treenut", "peanut", "soy", "wheat"],
    why: { milk: "Made from milk and cream", egg: "Many recipes use egg yolks",
           treenut: "Some flavors have nuts, or share equipment with them", peanut: "Some flavors have peanuts, or share equipment",
           soy: "Some brands use soy lecithin", wheat: "Cones and mix-ins like cookie dough have wheat" },
    diet: {} },
  { names: ["Cake", "cupcake", "birthday cake"], usually: ["wheat", "milk", "egg"], sometimes: ["soy", "treenut"],
    why: { wheat: "Made with wheat flour", milk: "Butter, milk, and frosting are dairy", egg: "Eggs hold the cake together",
           soy: "Many cake mixes contain soy", treenut: "Some cakes have nuts or almond flour" },
    diet: {} },
  { names: ["Cookies", "cookie"], usually: ["wheat", "milk", "egg"], sometimes: ["peanut", "treenut", "soy"],
    why: { wheat: "Made with wheat flour", milk: "Butter is dairy", egg: "Most cookie doughs use egg",
           peanut: "Some cookies have peanuts or peanut butter", treenut: "Some have nuts", soy: "Chocolate chips often have soy lecithin" },
    diet: {} },
  { names: ["Brownie", "brownies"], usually: ["wheat", "milk", "egg"], sometimes: ["treenut", "soy"],
    why: { wheat: "Made with wheat flour", milk: "Butter and chocolate are dairy", egg: "The batter uses eggs",
           treenut: "Some have walnuts", soy: "Chocolate often has soy lecithin" },
    diet: {} },
  { names: ["Granola bar", "granola", "energy bar"], usually: [], sometimes: ["peanut", "treenut", "soy", "milk", "wheat"],
    why: { peanut: "Often made with peanuts or peanut butter", treenut: "Often made with nuts like almonds",
           soy: "Often has soy protein or soy lecithin", milk: "Some have chocolate or yogurt coatings",
           wheat: "Some have wheat, or are made on shared lines" },
    diet: {} },
  { names: ["Baklava"], usually: ["wheat", "treenut", "milk"], sometimes: [],
    why: { wheat: "Phyllo dough is wheat", treenut: "Filled with walnuts or pistachios", milk: "The layers are brushed with butter" },
    diet: {} },

  // ---------- Mexican / Middle Eastern ----------
  { names: ["Tacos", "taco"], usually: [], sometimes: ["wheat", "milk"],
    why: { wheat: "Flour tortillas are made from wheat (corn ones usually aren't)", milk: "Cheese and sour cream are dairy" },
    diet: { meat: "u", beef: "s", pork: "s", onion: "u" } },
  { names: ["Burrito"], usually: ["wheat", "milk"], sometimes: [],
    why: { wheat: "The tortilla is made from wheat flour", milk: "Cheese and sour cream are dairy" },
    diet: { meat: "s", beef: "s", pork: "s", onion: "u" } },
  { names: ["Hummus"], usually: ["sesame"], sometimes: [],
    why: { sesame: "Made with tahini, a sesame paste" },
    diet: { onion: "u" } },
  { names: ["Falafel"], usually: [], sometimes: ["sesame", "wheat"],
    why: { sesame: "Often served with tahini (sesame) sauce", wheat: "Some recipes add flour, and pita bread is wheat" },
    diet: { onion: "u" } },

  // ---------- Indian ----------
  { names: ["Samosa"], usually: ["wheat"], sometimes: ["treenut", "milk"],
    why: { wheat: "The pastry is wheat flour", treenut: "Some fillings have cashews", milk: "Some pastry uses ghee (butter)" },
    diet: { meat: "s", onion: "u" } },
  { names: ["Butter chicken", "chicken makhani"], usually: ["milk"], sometimes: ["treenut"],
    why: { milk: "The sauce has butter and cream", treenut: "Often thickened with cashew paste" },
    diet: { meat: "u", onion: "u" } },
  { names: ["Paneer tikka masala", "paneer", "palak paneer", "paneer butter masala"], usually: ["milk"], sometimes: ["treenut"],
    why: { milk: "Paneer is a cheese, and the sauce often has cream", treenut: "Some sauces use cashew paste" },
    diet: { onion: "u" } },
  { names: ["Chicken tikka masala", "tikka masala"], usually: ["milk"], sometimes: ["treenut"],
    why: { milk: "Yogurt marinade and cream sauce", treenut: "Some sauces use cashew paste" },
    diet: { meat: "u", onion: "u" } },
  { names: ["Korma", "navratan korma"], usually: ["milk", "treenut"], sometimes: [],
    why: { milk: "The sauce has cream or yogurt", treenut: "The sauce is made with cashews or almonds" },
    diet: { meat: "s", onion: "u" } },
  { names: ["Biryani"], usually: ["milk"], sometimes: ["treenut"],
    why: { milk: "Often made with yogurt and ghee", treenut: "Often topped with cashews or almonds" },
    diet: { meat: "s", onion: "u" } },
  { names: ["Dal", "daal", "dal tadka"], usually: [], sometimes: ["milk"],
    why: { milk: "Often finished with ghee or butter" },
    diet: { onion: "u" } },
  { names: ["Naan", "garlic naan"], usually: ["wheat", "milk"], sometimes: ["egg"],
    why: { wheat: "Naan is wheat bread", milk: "The dough has yogurt or milk, and it's often brushed with butter",
           egg: "Some recipes add egg" },
    diet: { onion: "s" } },
  { names: ["Roti", "chapati", "paratha"], usually: ["wheat"], sometimes: ["milk"],
    why: { wheat: "Made from wheat flour (atta)", milk: "Often brushed with ghee" },
    diet: { onion: "s" } },
  { names: ["Dosa", "masala dosa"], usually: [], sometimes: ["milk", "peanut"],
    why: { milk: "Often cooked with ghee or butter", peanut: "Some chutneys have peanuts" },
    diet: { onion: "s" } },
  { names: ["Pani puri", "golgappa", "chaat", "bhel puri"], usually: ["wheat"], sometimes: ["peanut", "milk"],
    why: { wheat: "Puris are made from wheat or semolina", peanut: "Some chaats have peanuts", milk: "Some have yogurt" },
    diet: { onion: "u" } },
  { names: ["Gulab jamun"], usually: ["milk", "wheat"], sometimes: ["treenut"],
    why: { milk: "Made from milk solids (khoya)", wheat: "Flour holds the dough together", treenut: "Sometimes topped with nuts" },
    diet: {} },
  { names: ["Kheer", "rice pudding"], usually: ["milk"], sometimes: ["treenut"],
    why: { milk: "Made by cooking rice in milk", treenut: "Topped with nuts like almonds, cashews, or pistachios" },
    diet: {} },

  // ---------- Chinese ----------
  { names: ["Fried rice"], usually: ["soy", "egg"], sometimes: ["wheat", "shellfish", "sesame"],
    why: { soy: "Soy sauce is made from soybeans", egg: "Usually has scrambled egg", wheat: "Most soy sauce also contains wheat",
           shellfish: "Some versions have shrimp", sesame: "Sometimes has sesame oil" },
    diet: { meat: "s", pork: "s", onion: "u", alcohol: "s" } },
  { names: ["Lo mein", "chow mein", "noodles"], usually: ["wheat", "soy"], sometimes: ["egg", "shellfish", "sesame"],
    why: { wheat: "The noodles are wheat", soy: "Seasoned with soy sauce", egg: "Many noodles are made with egg",
           shellfish: "Some versions have shrimp or oyster sauce", sesame: "Often has sesame oil" },
    diet: { meat: "s", pork: "s", onion: "u", alcohol: "s" } },
  { names: ["Dumplings", "potstickers", "jiaozi", "gyoza", "momos"], usually: ["wheat", "soy"], sometimes: ["shellfish", "sesame", "egg"],
    why: { wheat: "The wrappers are wheat flour", soy: "The filling and dipping sauce use soy sauce",
           shellfish: "Some fillings have shrimp", sesame: "Often has sesame oil", egg: "Some fillings or wrappers use egg" },
    diet: { meat: "u", pork: "s", onion: "u", alcohol: "s" } },
  { names: ["Kung pao chicken", "kung pao"], usually: ["peanut", "soy", "wheat"], sometimes: ["sesame"],
    why: { peanut: "Kung pao is made with peanuts", soy: "The sauce has soy sauce", wheat: "Soy sauce usually contains wheat",
           sesame: "Sometimes has sesame oil" },
    diet: { meat: "u", onion: "u", alcohol: "s" } },
  { names: ["Orange chicken", "general tso chicken", "sweet and sour chicken"], usually: ["wheat", "soy"], sometimes: ["egg", "sesame"],
    why: { wheat: "The batter is wheat flour", soy: "The sauce has soy sauce", egg: "Egg helps the batter stick",
           sesame: "Often topped with sesame seeds" },
    diet: { meat: "u", onion: "s" } },
  { names: ["Spring rolls", "egg rolls"], usually: ["wheat"], sometimes: ["egg", "soy", "shellfish"],
    why: { wheat: "The wrappers are wheat flour", egg: "Some wrappers or fillings use egg",
           soy: "Fillings often have soy sauce", shellfish: "Some fillings have shrimp" },
    diet: { meat: "s", pork: "s", onion: "s" } },

  // ---------- Japanese ----------
  { names: ["Sushi"], usually: ["fish", "soy"], sometimes: ["shellfish", "egg", "sesame", "wheat"],
    why: { fish: "Most sushi has raw or cooked fish", soy: "Served with soy sauce",
           shellfish: "Some rolls have shrimp, crab, or imitation crab", egg: "Tamago is egg, and some sauces use egg",
           sesame: "Many rolls are topped with sesame seeds", wheat: "Soy sauce and tempura bits usually have wheat" },
    diet: { alcohol: "s" } },
  { names: ["Ramen"], usually: ["wheat", "soy"], sometimes: ["egg", "fish", "sesame", "shellfish"],
    why: { wheat: "Ramen noodles are wheat", soy: "The broth often has soy sauce or miso",
           egg: "Often topped with egg, and some noodles have egg", fish: "Many broths use fish or bonito flakes",
           sesame: "Some broths and toppings use sesame", shellfish: "Some broths use shellfish" },
    diet: { meat: "u", pork: "s", onion: "u", alcohol: "s" } },
  { names: ["Tempura", "shrimp tempura"], usually: ["wheat", "egg"], sometimes: ["shellfish", "fish"],
    why: { wheat: "The batter is wheat flour", egg: "The batter often has egg",
           shellfish: "Shrimp tempura is very common", fish: "Some tempura is fish" },
    diet: { meat: "s" } },

  // ---------- Korean ----------
  { names: ["Bibimbap"], usually: ["soy", "sesame", "egg"], sometimes: ["wheat"],
    why: { soy: "Sauces use soy sauce or gochujang", sesame: "Topped with sesame oil and seeds",
           egg: "Usually topped with a fried egg", wheat: "Gochujang and soy sauce often contain wheat" },
    diet: { meat: "s", beef: "s", onion: "u" } },
  { names: ["Kimchi"], usually: ["fish", "shellfish"], sometimes: [],
    why: { fish: "Usually made with fish sauce", shellfish: "Often made with salted shrimp" },
    diet: { onion: "u" } },
  { names: ["Bulgogi"], usually: ["soy", "sesame", "wheat"], sometimes: [],
    why: { soy: "The marinade is soy sauce", sesame: "The marinade has sesame oil", wheat: "Soy sauce usually contains wheat" },
    diet: { meat: "u", beef: "u", onion: "u", alcohol: "s" } },
  { names: ["Japchae"], usually: ["soy", "sesame"], sometimes: ["egg", "wheat"],
    why: { soy: "Seasoned with soy sauce", sesame: "Seasoned with sesame oil and seeds",
           egg: "Often topped with egg strips", wheat: "Soy sauce usually contains wheat" },
    diet: { meat: "s", beef: "s", onion: "u" } },
  { names: ["Tteokbokki", "ddeokbokki"], usually: ["wheat", "soy"], sometimes: ["fish", "egg"],
    why: { wheat: "Some rice cakes and gochujang contain wheat", soy: "The sauce uses soy sauce and gochujang",
           fish: "Often has fish cakes or anchovy broth", egg: "Often served with a boiled egg" },
    diet: { onion: "s" } },

  // ---------- Southeast Asian ----------
  { names: ["Pad thai", "phad thai"], usually: ["peanut", "egg", "fish", "shellfish", "soy"], sometimes: [],
    why: { peanut: "Topped with crushed peanuts", egg: "Has scrambled egg", fish: "The sauce uses fish sauce",
           shellfish: "Often has shrimp or dried shrimp", soy: "Often has tofu or soy sauce" },
    diet: { meat: "s", onion: "u" } },
  { names: ["Thai curry", "green curry", "red curry", "massaman curry"], usually: ["fish"], sometimes: ["shellfish", "peanut", "soy"],
    why: { fish: "Made with fish sauce", shellfish: "Curry paste often has shrimp paste",
           peanut: "Massaman curry has peanuts", soy: "Some use soy sauce or tofu" },
    diet: { meat: "s", onion: "u" } },
  { names: ["Satay", "chicken satay"], usually: ["peanut", "soy"], sometimes: ["fish"],
    why: { peanut: "Served with peanut sauce", soy: "The marinade often has soy sauce", fish: "Some marinades use fish sauce" },
    diet: { meat: "u", onion: "s" } },
  { names: ["Pho"], usually: ["fish"], sometimes: ["soy", "wheat"],
    why: { fish: "The broth is seasoned with fish sauce", soy: "Hoisin sauce on the side has soy",
           wheat: "Hoisin sauce often contains wheat" },
    diet: { meat: "u", beef: "u", onion: "u" } }
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

// ---------- Diets for a dish ----------
// Turns the dish's diet tags into diet results, with a short reason for each.
// Returns { d_vegetarian: { status: "contains" | "may", why: "..." }, ... }
function dishDiets(dish) {
  const tags = dish.diet || {};
  const out = {};
  const lvl = v => v === "u" ? 2 : v === "s" ? 1 : 0;   // 2 = usually, 1 = sometimes
  const set = (id, level, why) => {
    if (!level) return;
    if (out[id] && (out[id].status === "contains" || level === 1)) return;   // keep the stronger one
    out[id] = { status: level === 2 ? "contains" : "may", why: why };
  };
  const has = id => dish.usually.includes(id) ? 2 : dish.sometimes.includes(id) ? 1 : 0;
  const how = l => l === 2 ? "Usually made with " : "Some versions have ";

  const meat = lvl(tags.meat), seafood = Math.max(has("fish"), has("shellfish"));
  set("d_vegetarian", Math.max(meat, seafood), meat >= seafood ? how(meat) + "meat" : how(seafood) + "fish or seafood");
  set("d_vegan", Math.max(meat, seafood), how(Math.max(meat, seafood)) + "meat or seafood");
  set("d_vegan", has("milk"), how(has("milk")) + "dairy");
  set("d_vegan", has("egg"), how(has("egg")) + "egg");
  set("d_jain", Math.max(meat, seafood), how(Math.max(meat, seafood)) + "meat or seafood");
  set("d_jain", has("egg"), how(has("egg")) + "egg");
  set("d_jain", lvl(tags.onion), how(lvl(tags.onion)) + "onion, garlic, or root vegetables");
  set("d_nopork", lvl(tags.pork), how(lvl(tags.pork)) + "pork");
  set("d_nobeef", lvl(tags.beef), how(lvl(tags.beef)) + "beef");
  set("d_noalcohol", lvl(tags.alcohol), how(lvl(tags.alcohol)) + "wine or alcohol in the sauce");
  return out;
}
