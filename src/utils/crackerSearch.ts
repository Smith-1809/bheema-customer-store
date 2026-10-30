import { Product } from '../data/products';

/**
 * Friendly Category Display Names
 * Used across the top navbar, category pills, product cards, and modals
 */
export const CATEGORY_DISPLAY_NAMES: Record<string, string> = {
  'All': '🌟 All Crackers',
  'FP': '🌸 Flower Pots',
  'GC': '🌀 Ground Chakkars',
  'Comet / Shot': '🚀 Sky Shots',
  'Atom / Bullet / Naraout': '💥 Sound Bombs',
  'Lakshmi / Bird / Jalli Kattu': '🪔 Traditional Crackers',
  'Pencil': '✨ Pencil Sparklers',
  'Pipe': '🎇 Color Pipes',
  'Wala': '🧨 Garlands (Wala)',
  'Rocket': '🚀 Rockets',
  'T-Star / Thread': '🧵 Thread Stars',
  'Fancy': '✨ Fancy Novelties',
  'Other / Unclassified': '📦 Gift Items',
};

/**
 * Compact Category Badges for product cards
 */
export const CATEGORY_CARD_TAGS: Record<string, string> = {
  'All': 'All Crackers',
  'FP': 'Flower Pot',
  'GC': 'Ground Chakkar',
  'Comet / Shot': 'Sky Shot',
  'Atom / Bullet / Naraout': 'Sound Cracker',
  'Lakshmi / Bird / Jalli Kattu': 'Traditional',
  'Pencil': 'Pencil Sparkler',
  'Pipe': 'Color Pipe',
  'Wala': 'Garland (Wala)',
  'Rocket': 'Rocket',
  'T-Star / Thread': 'Thread Star',
  'Fancy': 'Fancy Novelty',
  'Other / Unclassified': 'Special Cracker',
};

/**
 * Comprehensive Festive Synonym Dictionary
 * Maps common search terms to categories and product classifications
 */
const CATEGORY_SEARCH_SYNONYMS: Record<string, string[]> = {
  'FP': [
    'flower', 'flowerpot', 'flowerpots', 'pot', 'pots', 'anar', 'anaar', 
    'koti', 'fountain', 'asoka', 'deluxe flower', 'rangoli'
  ],
  'GC': [
    'ground', 'chakkar', 'chakkars', 'chakra', 'chakras', 'chakri', 
    'zameen', 'spinner', 'spinners', 'spinning', 'wheel', 'ground chakkar'
  ],
  'Comet / Shot': [
    'sky', 'shot', 'shots', 'skyshot', 'skyshots', 'aerial', 'comet', 
    'night', 'night out', 'multishot', 'multi shot', 'cake', 'display', 'sky display'
  ],
  'Atom / Bullet / Naraout': [
    'bomb', 'bombs', 'sound', 'sound bomb', 'sound cracker', 'atom', 
    'bullet', 'naraout', 'bijili', 'green bijili', 'pataka', 'cracker', 'loud'
  ],
  'Lakshmi / Bird / Jalli Kattu': [
    'lakshmi', 'laxmi', 'bird', 'jalli', 'jallikattu', 'traditional', 
    '2.75', '3.5', '4 inch', 'gold dlx'
  ],
  'Pencil': [
    'sparkler', 'sparklers', 'pencil', 'pencils', 'phooljhadi', 
    'electric sparkler', 'color sparkler', '10 inch', '15 inch'
  ],
  'Pipe': [
    'pipe', 'pipes', 'color pipe', 'sada pipe', 'hand pipe', 'shower pipe'
  ],
  'Wala': [
    'wala', 'valai', 'ladi', 'garland', 'garlands', '1000 wala', 
    '2000 wala', '5000 wala', 'turkey', 'chain'
  ],
  'Rocket': [
    'rocket', 'rockets', 'bomb rocket', 'lunar rocket', 'space rocket'
  ],
  'T-Star / Thread': [
    'star', 'tstar', 't-star', 'thread', 'loose', 'twinkling star'
  ],
  'Fancy': [
    'fancy', 'novelty', 'novelties', 'whistle', 'magic', 'snake'
  ],
};

/**
 * Brand & Manufacturer Synonyms
 * Maps colloquial brand names to product name prefixes/keywords
 */
const BRAND_SYNONYMS: Record<string, string[]> = {
  'MU': ['muthu', 'muthu fireworks', 'mu fireworks', 'muthu brand'],
  'DPM': ['dpm', 'dpm fireworks', 'd.p.m'],
  'W.G': ['wg', 'w.g', 'wani', 'winner', 'western', 'standard'],
  'VML': ['vml', 'vml fireworks'],
  'JRB': ['jrb', 'jrb fireworks'],
  'CAT': ['cat', 'black cat', 'cat brand', 'cat bomb'],
  'INDHU': ['indhu', 'indu', 'indhu fireworks'],
  'SV': ['sv', 'sri vijay', 'vijay fireworks'],
  'R.G': ['rg', 'r.g', 'rg fireworks'],
  'Lord': ['lord', 'lord fireworks', 'lord brand'],
  'Kamadhenu': ['kamadhenu', 'kamadhenu fireworks'],
};

/**
 * Matches a product against a search query using smart tokenized synonym matching
 */
export function matchProductSearch(product: Product, searchQuery: string): boolean {
  const query = searchQuery.trim().toLowerCase();
  if (!query) return true;

  const productName = product.name.toLowerCase();
  const productCategory = product.category.toLowerCase();
  const productSerial = product.serialNo.toString();
  const productId = product.id.toLowerCase();
  const displayCategory = (CATEGORY_DISPLAY_NAMES[product.category] || '').toLowerCase();
  const cardTag = (CATEGORY_CARD_TAGS[product.category] || '').toLowerCase();

  // 1. Direct sub-string match on standard fields
  if (
    productName.includes(query) ||
    productCategory.includes(query) ||
    displayCategory.includes(query) ||
    cardTag.includes(query) ||
    productSerial === query ||
    `#${productSerial}` === query ||
    productId.includes(query)
  ) {
    return true;
  }

  // 2. Direct match against product aliases
  if (product.aliases && product.aliases.some((alias) => alias.toLowerCase().includes(query))) {
    return true;
  }

  // Split multi-token searches (e.g. "muthu lakshmi", "dpm flower pot")
  const tokens = query.split(/\s+/).filter(Boolean);

  // Check if every token matches the product in some way
  const allTokensMatch = tokens.every((token) => {
    // Direct matches
    if (
      productName.includes(token) ||
      productCategory.includes(token) ||
      displayCategory.includes(token) ||
      cardTag.includes(token) ||
      productSerial === token ||
      `#${productSerial}` === token ||
      (product.aliases && product.aliases.some((a) => a.toLowerCase().includes(token)))
    ) {
      return true;
    }

    // Category Synonym Matching (e.g. query contains "flower" -> matches category "FP")
    const categorySynonyms = CATEGORY_SEARCH_SYNONYMS[product.category] || [];
    if (categorySynonyms.some((syn) => syn.includes(token) || token.includes(syn))) {
      return true;
    }

    // Brand Synonym Matching (e.g. query contains "muthu" -> matches "MU" products)
    for (const [brandCode, brandAliases] of Object.entries(BRAND_SYNONYMS)) {
      if (productName.includes(brandCode.toLowerCase())) {
        if (brandAliases.some((alias) => alias.includes(token) || token.includes(alias))) {
          return true;
        }
      }
    }

    return false;
  });

  return allTokensMatch;
}
