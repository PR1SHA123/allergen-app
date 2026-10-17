// ============================================================
// ALLERGEN DICTIONARY
// The 9 major US allergens, with the words that reveal them in
// English (including "hidden" names), Hindi, Chinese, and Korean.
//
//   words   -> if any of these appear on the label, the allergen is present
//   exclude -> phrases that LOOK like a match but aren't
//              (e.g. "cocoa butter" has no milk, "shellfish" is not "fish")
//
// To add a word: put it in quotes inside the right list, followed by a comma.
// ============================================================

const ALLERGENS = [
  {
    id: "milk", name: "Milk", emoji: "🥛",
    words: {
      en: ["milk", "whey", "casein", "caseinate", "butter", "cream", "cheese", "lactose",
           "ghee", "yogurt", "yoghurt", "curd", "buttermilk", "lactalbumin"],
      hi: ["दूध", "दुग्ध", "घी", "मक्खन", "पनीर", "दही", "मलाई", "खोया", "छाछ"],
      zh: ["牛奶", "奶粉", "奶油", "乳粉", "乳清", "乳糖", "炼乳", "煉乳", "黄油", "黃油",
           "芝士", "奶酪", "酪蛋白", "乳制品", "乳製品"],
      ko: ["우유", "유청", "카제인", "버터", "치즈", "분유", "유당", "크림"]
    },
    exclude: ["cocoa butter", "shea butter", "peanut butter", "nut butter", "cream of tartar"]
  },
  {
    id: "egg", name: "Egg", emoji: "🥚",
    words: {
      en: ["egg", "eggs", "albumin", "albumen", "ovalbumin", "lysozyme", "mayonnaise", "meringue"],
      hi: ["अंडा", "अंडे", "अण्डा"],
      zh: ["鸡蛋", "雞蛋", "蛋黄", "蛋黃", "蛋清", "全蛋", "蛋"],
      ko: ["계란", "달걀", "난류", "난백", "난황"]
    },
    // 蛋白质 = "protein", not egg. lactalbumin is milk, not egg.
    exclude: ["lactalbumin", "蛋白质", "蛋白質", "浓缩蛋白", "濃縮蛋白"]
  },
  {
    id: "wheat", name: "Wheat / Gluten", emoji: "🌾",
    words: {
      en: ["wheat", "flour", "semolina", "durum", "spelt", "farina", "gluten", "bulgur",
           "couscous", "seitan"],
      hi: ["गेहूं", "गेहूँ", "मैदा", "सूजी", "रवा", "आटा"],
      zh: ["小麦", "小麥", "面粉", "麵粉", "面筋", "麵筋", "麸质", "麩質"],
      ko: ["밀가루", "소맥", "글루텐", "밀"]
    },
    exclude: ["rice flour", "corn flour", "almond flour", "coconut flour", "chickpea flour",
              "gluten-free", "gluten free", "चावल का आटा"]
  },
  {
    id: "peanut", name: "Peanut", emoji: "🥜",
    words: {
      en: ["peanut", "peanuts", "groundnut", "arachis"],
      hi: ["मूंगफली", "मूँगफली"],
      zh: ["花生", "落花生"],
      ko: ["땅콩"]
    },
    exclude: []
  },
  {
    id: "treenut", name: "Tree Nuts", emoji: "🌰",
    words: {
      en: ["tree nut", "tree nuts", "almond", "almonds", "cashew", "cashews", "walnut", "walnuts",
           "pecan", "pecans", "pistachio", "pistachios", "hazelnut", "hazelnuts", "macadamia",
           "brazil nut", "pine nut", "praline", "marzipan"],
      hi: ["बादाम", "काजू", "अखरोट", "पिस्ता", "मेवा"],
      zh: ["坚果", "堅果", "杏仁", "核桃", "腰果", "榛子", "开心果", "開心果", "碧根果", "夏威夷果"],
      ko: ["호두", "아몬드", "캐슈", "피스타치오", "헤이즐넛", "견과"]
    },
    exclude: []
  },
  {
    id: "soy", name: "Soy", emoji: "🫘",
    words: {
      en: ["soy", "soya", "soybean", "soybeans", "edamame", "tofu", "miso", "tempeh"],
      hi: ["सोया", "सोयाबीन"],
      zh: ["大豆", "黄豆", "黃豆", "酱油", "醬油", "豆腐"],
      ko: ["대두", "콩", "두부", "간장"]
    },
    // 땅콩 (peanut) contains 콩 but is not soy
    exclude: ["땅콩"]
  },
  {
    id: "fish", name: "Fish", emoji: "🐟",
    words: {
      en: ["fish", "anchovy", "anchovies", "salmon", "tuna", "cod", "tilapia", "sardine",
           "sardines", "mackerel"],
      hi: ["मछली"],
      zh: ["鱼", "魚"],
      ko: ["생선", "어류", "고등어", "연어", "참치", "멸치"]
    },
    // "shellfish" contains the word "fish" but is its own allergen
    exclude: ["shellfish", "鱿鱼", "魷魚"]
  },
  {
    id: "shellfish", name: "Shellfish", emoji: "🦐",
    words: {
      en: ["shellfish", "shrimp", "prawn", "prawns", "crab", "lobster", "crayfish", "krill",
           "clam", "clams", "mussel", "mussels", "oyster", "oysters", "scallop", "scallops"],
      hi: ["झींगा"],
      zh: ["虾", "蝦", "蟹", "贝", "貝", "蚝", "蠔", "鱿鱼", "魷魚"],
      ko: ["새우", "게살", "꽃게", "랍스터", "조개", "굴", "홍합", "오징어"]
    },
    exclude: []
  },
  {
    id: "sesame", name: "Sesame", emoji: "⚪",
    words: {
      en: ["sesame", "tahini", "benne"],
      hi: ["तिल"],
      zh: ["芝麻", "麻油", "胡麻"],
      ko: ["참깨", "들깨", "참기름"]
    },
    exclude: []
  }
];

// Phrases that mean "MAY contain" (cross-contamination warning), not "contains"
const MAY_CONTAIN_MARKERS = [
  // English
  "may contain", "may also contain", "traces", "facility", "shared equipment",
  "same equipment", "manufactured in", "processed in", "produced in", "made on",
  // Hindi
  "हो सकता", "हो सकते", "हो सकती",
  // Chinese
  "可能含", "生产线", "生產線", "工厂", "工廠", "设备", "設備", "微量",
  // Korean
  "제조시설", "혼입", "함유할수"
];
