// ============================================================
// DIETS
// Not allergies, but things people choose or need to avoid.
// They're checked like allergens, but the result says
// "doesn't fit your diet" instead of "not safe".
//
// Note: the app can't confirm halal or kosher certification,
// so it only checks ingredients (for example "No pork", "No alcohol").
// ============================================================

// Words that mean meat or fish is in the food (any language)
const MEAT_WORDS = {
  en: ["meat", "chicken", "beef", "pork", "lamb", "mutton", "goat", "veal", "turkey", "duck",
       "bacon", "ham", "sausage", "pepperoni", "salami", "prosciutto", "chorizo", "lard", "tallow",
       "gelatin", "gelatine", "anchovy", "anchovies", "fish", "tuna", "salmon", "shrimp", "prawn",
       "crab", "lobster", "oyster sauce", "fish sauce", "chicken broth", "beef broth", "chicken stock",
       "beef stock", "bone broth", "carmine", "rennet"],
  hi: ["मांस", "माँस", "चिकन", "मटन", "गोश्त", "मछली", "झींगा"],
  zh: ["肉", "鸡", "雞", "猪", "豬", "鱼", "魚", "虾", "蝦", "蟹", "鸭", "鴨", "明胶", "明膠", "蚝油", "蠔油", "鱼露", "魚露"],
  ko: ["고기", "닭", "돼지", "소고기", "쇠고기", "양고기", "생선", "새우", "게살", "젤라틴", "멸치", "액젓", "굴소스"]
};

// Look-alikes that are NOT meat
const MEAT_EXCLUDE = ["coconut meat", "plant-based meat", "plant based meat", "meatless", "meat-free",
  "meat free", "vegetable broth", "vegetable stock", "fishless", "肉桂", "肉豆蔻", "果肉"];   // 肉桂 = cinnamon

// 鸡蛋 = egg, but it has 鸡 ("chicken") in it. Egg is fine for vegetarians,
// so only the vegetarian diet ignores it (vegan and Jain still catch egg).
const EGG_LOOKALIKES = ["鸡蛋", "雞蛋", "鸡蛋粉"];

const DIETS = [
  {
    id: "d_vegetarian", name: "Vegetarian", short: "veg",
    words: MEAT_WORDS, exclude: MEAT_EXCLUDE.concat(EGG_LOOKALIKES),
    cook: { en: "meat or fish (vegetarian)", hi: "मांस या मछली (शाकाहारी)", "zh-s": "肉类或鱼（素食）",
            "zh-t": "肉類或魚（素食）", ko: "고기나 생선 (채식)" }
  },
  {
    id: "d_vegan", name: "Vegan", short: "vgn",
    words: null,   // filled in below: meat + milk + egg + honey
    exclude: MEAT_EXCLUDE.concat(["cocoa butter", "shea butter", "peanut butter", "nut butter", "coconut milk",
      "almond milk", "soy milk", "oat milk", "rice milk", "cream of tartar"]),
    cook: { en: "any animal products, like meat, dairy, eggs, or honey (vegan)", hi: "कोई भी पशु उत्पाद, जैसे मांस, दूध, अंडा या शहद (वीगन)",
            "zh-s": "任何动物制品，如肉、奶、蛋或蜂蜜（纯素）", "zh-t": "任何動物製品，如肉、奶、蛋或蜂蜜（純素）",
            ko: "고기, 유제품, 달걀, 꿀 등 모든 동물성 식품 (비건)" }
  },
  {
    id: "d_jain", name: "Jain", short: "jain",
    words: null,   // filled in below: meat + egg + onion, garlic, root vegetables
    exclude: MEAT_EXCLUDE,
    cook: { en: "meat, fish, egg, onion, garlic, or root vegetables (Jain)",
            hi: "मांस, मछली, अंडा, प्याज, लहसुन या ज़मीन के नीचे उगने वाली सब्ज़ियाँ (जैन)",
            "zh-s": "肉、鱼、蛋、洋葱、大蒜或根茎类蔬菜（耆那教饮食）", "zh-t": "肉、魚、蛋、洋蔥、大蒜或根莖類蔬菜（耆那教飲食）",
            ko: "고기, 생선, 달걀, 양파, 마늘, 뿌리채소 (자이나교 식단)" }
  },
  {
    id: "d_nopork", name: "No pork", short: "pork",
    words: {
      en: ["pork", "bacon", "ham", "lard", "pepperoni", "prosciutto", "pancetta", "chorizo", "salami", "gelatin", "gelatine"],
      hi: ["सूअर"],
      zh: ["猪", "豬", "叉烧", "叉燒"],
      ko: ["돼지", "베이컨", "햄", "라드", "젤라틴"]
    },
    exclude: ["hamburger", "graham", "hamachi", "햄버거"],
    cook: { en: "pork", hi: "सूअर का मांस", "zh-s": "猪肉", "zh-t": "豬肉", ko: "돼지고기" }
  },
  {
    id: "d_nobeef", name: "No beef", short: "beef",
    words: {
      en: ["beef", "veal", "tallow", "suet", "gelatin", "gelatine", "pastrami", "brisket"],
      hi: ["गोमांस", "बीफ"],
      zh: ["牛肉", "牛骨", "牛腩", "牛筋"],
      ko: ["소고기", "쇠고기", "우육", "젤라틴"]
    },
    exclude: [],
    cook: { en: "beef", hi: "गोमांस", "zh-s": "牛肉", "zh-t": "牛肉", ko: "소고기" }
  },
  {
    id: "d_noalcohol", name: "No alcohol", short: "alc",
    words: {
      en: ["alcohol", "wine", "beer", "rum", "brandy", "sake", "mirin", "liqueur", "vodka", "whiskey", "whisky", "bourbon", "sherry", "cooking wine"],
      hi: ["शराब"],
      zh: ["酒", "料酒", "米酒", "黄酒", "黃酒"],
      ko: ["맛술", "청주", "와인", "맥주", "소주", "요리술"]
    },
    exclude: ["sugar alcohol", "sugar alcohols", "benzyl alcohol", "cetyl alcohol", "rum flavor", "wine vinegar", "酒石酸"],
    cook: { en: "alcohol, including cooking wine", hi: "शराब (खाना पकाने वाली भी)", "zh-s": "酒（包括料酒）",
            "zh-t": "酒（包括料酒）", ko: "술 (요리술 포함)" }
  }
];

// Build the vegan and Jain word lists from the others
(function buildDietWords() {
  const byId = id => ALLERGENS.find(a => a.id === id);
  const merge = (...lists) => {
    const out = { en: [], hi: [], zh: [], ko: [] };
    for (const l of lists) for (const k of Object.keys(out)) out[k] = out[k].concat(l[k] || []);
    for (const k of Object.keys(out)) out[k] = [...new Set(out[k])];
    return out;
  };
  const extraVegan = { en: ["honey", "beeswax", "shellac", "casein", "whey"], hi: ["शहद"], zh: ["蜂蜜"], ko: ["꿀"] };
  const rootVeg = {
    en: ["onion", "onions", "garlic", "potato", "potatoes", "carrot", "carrots", "beetroot", "radish", "ginger", "shallot", "leek"],
    hi: ["प्याज", "प्याज़", "लहसुन", "आलू", "गाजर", "चुकंदर", "मूली", "अदरक"],
    zh: ["洋葱", "洋蔥", "大蒜", "蒜", "葱", "蔥", "土豆", "马铃薯", "馬鈴薯", "胡萝卜", "胡蘿蔔", "姜", "薑"],
    ko: ["양파", "마늘", "대파", "감자", "당근", "생강"]
  };
  DIETS.find(d => d.id === "d_vegan").words = merge(MEAT_WORDS, byId("milk").words, byId("egg").words, extraVegan);
  DIETS.find(d => d.id === "d_jain").words = merge(MEAT_WORDS, byId("egg").words, rootVeg);
})();

// Diets look like allergens to checkLabel()
function dietAsAllergen(d) {
  return { id: d.id, name: d.name, emoji: "🥗", words: d.words, exclude: d.exclude, diet: true };
}
