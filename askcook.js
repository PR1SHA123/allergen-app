// ============================================================
// ASK THE COOK
// A card to show restaurant staff or a host, in their language,
// asking whether the food contains the user's allergens.
//
// Ask a native speaker to check each translation before the demo!
// ============================================================

const COOK_LANGUAGES = [
  {
    id: "en", label: "English",
    before: "I have a serious food allergy. Does this food contain any of these?",
    after: "Even a small amount can make me very sick. Thank you!",
    severe: "Even a tiny amount, or food made with the same pans or oil, can be dangerous.",
    airborne: "I can react just from the smell or steam while it cooks.",
    dietIntro: "I also don't eat:",
    joiner: ", ",
    names: { milk: "milk / dairy", egg: "egg", wheat: "wheat / flour", peanut: "peanuts",
             treenut: "tree nuts (almond, cashew, walnut…)", soy: "soy", fish: "fish (incl. fish sauce)",
             shellfish: "shellfish (shrimp, crab…)", sesame: "sesame" }
  },
  {
    id: "hi", label: "हिन्दी",
    before: "मुझे गंभीर खाद्य एलर्जी है। क्या इस खाने में इनमें से कुछ है?",
    after: "थोड़ी सी मात्रा से भी मेरी तबीयत बहुत खराब हो सकती है। धन्यवाद!",
    severe: "थोड़ी सी मात्रा, या उसी बर्तन या तेल में बना खाना भी खतरनाक हो सकता है।",
    airborne: "पकाते समय इसकी भाप या गंध से भी मुझे एलर्जी हो सकती है।",
    dietIntro: "कृपया इनका भी ध्यान रखें, मैं ये नहीं खाता/खाती:",
    joiner: ", ",
    names: { milk: "दूध / घी / पनीर", egg: "अंडा", wheat: "गेहूं / मैदा / आटा", peanut: "मूंगफली",
             treenut: "मेवे (बादाम, काजू, अखरोट)", soy: "सोया", fish: "मछली",
             shellfish: "झींगा / केकड़ा", sesame: "तिल" }
  },
  {
    id: "zh-s", label: "中文 简体",
    before: "我有严重的食物过敏。请问这道菜里有以下成分吗？",
    after: "即使一点点也会让我病得很严重。谢谢！",
    severe: "即使一点点，或用同一个锅或油做的食物，也可能很危险。",
    airborne: "烹饪时的气味或蒸汽也会让我过敏。",
    dietIntro: "另外我不吃：",
    joiner: "、",
    names: { milk: "牛奶/乳制品", egg: "鸡蛋", wheat: "小麦/面粉", peanut: "花生",
             treenut: "坚果（杏仁、腰果、核桃）", soy: "大豆/黄豆", fish: "鱼（包括鱼露）",
             shellfish: "虾蟹贝类", sesame: "芝麻" }
  },
  {
    id: "zh-t", label: "中文 繁體",
    before: "我有嚴重的食物過敏。請問這道菜裡有以下成分嗎？",
    after: "即使一點點也會讓我病得很嚴重。謝謝！",
    severe: "即使一點點，或用同一個鍋或油做的食物，也可能很危險。",
    airborne: "烹飪時的氣味或蒸氣也會讓我過敏。",
    dietIntro: "另外我不吃：",
    joiner: "、",
    names: { milk: "牛奶/乳製品", egg: "雞蛋", wheat: "小麥/麵粉", peanut: "花生",
             treenut: "堅果（杏仁、腰果、核桃）", soy: "大豆/黃豆", fish: "魚（包括魚露）",
             shellfish: "蝦蟹貝類", sesame: "芝麻" }
  },
  {
    id: "ko", label: "한국어",
    before: "저는 심한 음식 알레르기가 있습니다. 이 음식에 다음 재료가 들어 있나요?",
    after: "아주 조금만 먹어도 크게 아플 수 있습니다. 감사합니다!",
    severe: "아주 소량이나 같은 냄비·기름으로 만든 음식도 위험할 수 있습니다.",
    airborne: "요리할 때 나는 냄새나 김만으로도 반응할 수 있습니다.",
    dietIntro: "그리고 다음은 먹지 않습니다:",
    joiner: ", ",
    names: { milk: "우유/유제품", egg: "계란", wheat: "밀/밀가루", peanut: "땅콩",
             treenut: "견과류(아몬드, 캐슈, 호두)", soy: "대두/콩", fish: "생선(액젓 포함)",
             shellfish: "새우·게·조개류", sesame: "참깨" }
  }
];

// Build the card text for a language and a list of allergen ids
// customName(id) gives the name of a custom allergy (used when there's no translation)
// extras = { severe: true/false, airborne: true/false, diets: ["d_vegetarian", ...] }
function cookCardText(langId, allergenIds, customName, extras) {
  extras = extras || {};
  const lang = COOK_LANGUAGES.find(l => l.id === langId) || COOK_LANGUAGES[0];
  const list = allergenIds.map(id => lang.names[id] || (customName ? customName(id, langId) : id)).join(lang.joiner);
  const notes = [];
  if (extras.severe) notes.push(lang.severe);
  if (extras.airborne) notes.push(lang.airborne);
  const diets = (extras.diets || []).map(id => {
    const d = typeof DIETS !== "undefined" ? DIETS.find(x => x.id === id) : null;
    return d ? (d.cook[lang.id] || d.cook.en) : id;
  });
  return {
    before: allergenIds.length ? lang.before : "",
    list: list,
    notes: notes,
    dietIntro: diets.length ? lang.dietIntro : "",
    diets: diets,
    after: lang.after
  };
}
