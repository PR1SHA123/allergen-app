// ============================================================
// BARCODE LOOKUP
// Looks up a product's barcode in Open Food Facts, a free, open
// database of millions of food products from around the world.
// ============================================================

// Open Food Facts writes allergens as tags like "en:milk".
// This turns them into words our checker already understands.
const OFF_TAG_TO_WORD = {
  "en:milk": "milk",
  "en:eggs": "egg",
  "en:gluten": "wheat",
  "en:peanuts": "peanut",
  "en:nuts": "tree nuts",
  "en:soybeans": "soy",
  "en:fish": "fish",
  "en:crustaceans": "shellfish",
  "en:molluscs": "shellfish",
  "en:sesame-seeds": "sesame"
};

function tagsToWords(tags) {
  return (tags || []).map(t => OFF_TAG_TO_WORD[t]).filter(Boolean);
}

// Ask Open Food Facts about one barcode
async function fetchProduct(code) {
  const url = "https://world.openfoodfacts.org/api/v2/product/" + code +
    ".json?fields=product_name,brands,ingredients_text,ingredients_text_en,allergens_tags,traces_tags";
  const response = await fetch(url);
  if (!response.ok) return null;
  const data = await response.json();
  return data.status === 1 ? data.product : null;
}

// Main function: returns { found, name, text } or { found: false }
async function lookupBarcode(code) {
  code = code.replace(/\D/g, ""); // keep digits only
  let product = await fetchProduct(code);

  // US barcodes (12 digits) are sometimes stored with an extra 0 in front, or the other way around
  if (!product && code.length === 12) product = await fetchProduct("0" + code);
  if (!product && code.length === 13 && code.startsWith("0")) product = await fetchProduct(code.slice(1));

  if (!product) return { found: false };

  // Build one block of text the checker can read:
  // the ingredients, plus the database's own allergen and "may contain" lists
  const ingredients = product.ingredients_text_en || product.ingredients_text || "";
  const contains = tagsToWords(product.allergens_tags);
  const traces = tagsToWords(product.traces_tags);

  let text = ingredients;
  if (contains.length) text += ". Contains: " + contains.join(", ");
  if (traces.length) text += ". May contain: " + traces.join(", ");

  const name = [product.brands, product.product_name].filter(Boolean).join(" – ") || "Unknown product";
  const hasData = ingredients.length > 0 || contains.length > 0 || traces.length > 0;
  return { found: true, name: name, text: text, hasData: hasData };
}
