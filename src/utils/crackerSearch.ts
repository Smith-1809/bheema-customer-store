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
  'Pipe': '🎇 Sparkles',
  'Wala': '🧨 Garlands (Wala)',
  'Rocket': '🚀 Rockets',
  'T-Star / Thread': '🧵 Thread Stars',
  'Fancy': '✨ Fancy Novelties',
  'Other / Unclassified': '📦 Other',
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
  'Pipe': 'Sparkles',
  'Wala': 'Garland (Wala)',
  'Rocket': 'Rocket',
  'T-Star / Thread': 'Thread Star',
  'Fancy': 'Fancy Novelty',
  'Other / Unclassified': 'Other',
};

/**
 * Comprehensive Multilingual Festive Synonym Dictionary
 * Maps English, Telugu (Romanized & Script), and Hindi (Romanized & Devanagari)
 * terms to cracker categories and product classifications.
 */
export const CATEGORY_SEARCH_SYNONYMS: Record<string, string[]> = {
  'FP': [
    // English
    'flower', 'flowerpot', 'flowerpots', 'pot', 'pots', 'fountain', 'asoka', 
    'ashoka', 'deluxe flower', 'rangoli', 'jumbo fountain', 'colour fountain',
    // Telugu (Colloquial spellings & phonetic variants)
    'chichbudi', 'chichibudi', 'chichubuddi', 'chichubudi', 'chichbuddi', 'chicbudi', 
    'chitchbudi', 'chitchboodi', 'chichu buddi', 'chichi buddi', 'chitti buddi', 
    'chinna buddi', 'pedda buddi', 'koti', 'rangoli koti', 'deluxe koti',
    'kakara puvvu', 'kakarapuvvu', 'kakara poovulu', 'kakarapoovulu', 'kakarapuvvulu', 
    'poolakundi', 'poola kundi', 'poovula kundi',
    // Telugu Native Script
    'చిచ్చుబుడ్డి', 'చిచ్చిబుడ్డి', 'చిచ్చు బుడ్డి', 'కాకరపువ్వు', 'పూలకుండీ', 'అనార్',
    // Hindi (Romanized & Devanagari)
    'anar', 'anaar', 'kothi', 'jharna', 'anar bomb', 'anaar bomb', 'anarkali',
    'अनार', 'कोठी', 'झरना'
  ],
  'GC': [
    // English
    'ground', 'chakkar', 'chakkars', 'chakra', 'chakras', 'chakri', 
    'spinner', 'spinners', 'spinning', 'wheel', 'ground chakkar', 'ground spinner',
    // Telugu (Colloquial spellings & regional names)
    'buchitra', 'buchitram', 'bhoochitra', 'bhuchitra', 'bhoochitram', 'bhuchitram', 
    'bhoo chitra', 'bhu chitra', 'buchitra chakram', 'bhoochitra chakram',
    'bhoochakra', 'bhoochakram', 'bhuchakra', 'bhuchakram', 'bhoo chakram', 'bhu chakram',
    'bhoochakralu', 'bhuchakralu', 'chakram', 'chakralu', 'giragira', 'gira gira', 
    'nelachakram', 'nela chakram', 'nelachakralu',
    // Telugu Native Script
    'భూచక్రం', 'భుచిత్ర', 'భూచిత్రం', 'భూ చక్రం', 'చక్రం', 'చక్రాలు', 'నేలచక్రం',
    // Hindi (Romanized & Devanagari)
    'chakri', 'charkhi', 'zameen chakkar', 'gol chakkar', 'ghirni', 'zameeni chakkar', 'charka',
    'चकरी', 'चरखी', 'चक्र', 'जमीन चक्कर'
  ],
  'Comet / Shot': [
    // English
    'sky', 'shot', 'shots', 'skyshot', 'skyshots', 'aerial', 'comet', 
    'night', 'night out', 'multishot', 'multi shot', 'cake', 'display', 'sky display',
    'repeater', 'star shot', 'parachutes', 'single shot', '12 shot', '30 shot',
    // Telugu (Colloquial spellings)
    'aakasabanu', 'akasabanu', 'aakasa banu', 'akasa banu', 'aakasa baanam', 'akasa baanam', 
    'aakasavaanam', 'akasavanam', 'gallo shot', 'gallo shots', 'gallo shotlu', 'gallo peladam', 
    'rangu shotlu', 'gallo velugu', 'havai gundu', 'night shotlu', 'sky shotlu',
    // Telugu Native Script
    'ఆకాశబాణం', 'ఆకాశవాణం', 'గాల్లో షాట్లు', 'స్కై షాట్', 'గగనం',
    // Hindi (Romanized & Devanagari)
    'aasman patakha', 'aasmani gola', 'asmani gola', 'hawai gola', 'gagan bhedi', 
    'multi shot cake', 'colour shot', 'single shot', 'sky shot cake',
    'आसमानी गोला', 'हवाई गोला', 'स्काई शॉट'
  ],
  'Atom / Bullet / Naraout': [
    // English
    'bomb', 'bombs', 'sound', 'sound bomb', 'sound cracker', 'atom', 'atom bomb',
    'bullet', 'bullet bomb', 'naraout', 'bijili', 'green bijili', 'pataka', 'cracker', 'loud',
    // Telugu (Colloquial spellings)
    'baambu', 'baambulu', 'bambu', 'bambulu', 'gundu', 'gundulu', 'pedda baambu', 
    'lakshmi baambu', 'atombomb', 'bulletu', 'bijili', 'bijli', 'mirchi pataka', 
    'mirapa kaayalu', 'mirapakaya', 'peludu', 'dhamaka', 'dhamaaka', 'perudu',
    // Telugu Native Script
    'బాంబు', 'బాంబులు', 'బిజిలీ', 'బుల్లెట్ బాంబు', 'లక్ష్మి బాంబు', 'గుండు',
    // Hindi (Romanized & Devanagari)
    'sutli bomb', 'sutli', 'rassi bomb', 'rassi', 'atom bomb', 'bullet bomb', 
    'mirchi bomb', 'patakha', 'pataka', 'dhamaaka', 'gola', 'bijli bomb',
    'सुतली बम', 'एटम बम', 'मिर्ची बम', 'पटाखा', 'धमाका'
  ],
  'Lakshmi / Bird / Jalli Kattu': [
    // English
    'lakshmi', 'laxmi', 'bird', 'jalli', 'jallikattu', 'traditional', 
    '2.75', '3.5', '4 inch', 'gold dlx', 'red crackers', 'foil crackers',
    // Telugu (Colloquial spellings)
    'lakshmi patakalu', 'laxmi pataka', 'lakshmi tapakayalu', 'tapakayalu', 'pitta pataka', 
    'pakshi pataka', 'kunkuma pataka', 'chinna patakalu', 'jallikattu', 'kaithalu', 'sanna patakalu',
    // Telugu Native Script
    'లక్ష్మి టపాసులు', 'టపాకాయలు', 'పిట్ట టపాసులు', 'జల్లికట్టు',
    // Hindi (Romanized & Devanagari)
    'laxmi pataka', 'murga chaap', 'murga pataka', 'chidya pataka', 'titli', 'chhoti diwali',
    'लक्ष्मी पटाखा', 'मुर्गा छाप', 'चिड़िया पटाखा'
  ],
  'Pencil': [
    // English
    'sparkler', 'sparklers', 'pencil', 'pencils', 'electric sparkler', 
    'color sparkler', '10 inch', '15 inch', 'gold sparkler', 'wire sparkler',
    // Telugu (Colloquial spellings)
    'kakara vothulu', 'kakaravothulu', 'kakara vathulu', 'kakaravathulu', 'kakara puthulu', 
    'vothulu', 'vathulu', 'puthulu', 'baddi', 'pencilu', 'mitaai', 'velugulu', 'kaddi', 'kaddilu',
    // Telugu Native Script
    'కాకరవత్తులు', 'వత్తులు', 'కడ్డీలు', 'పెన్సిల్',
    // Hindi (Romanized & Devanagari)
    'phuljhadi', 'phooljhadi', 'fuljhadi', 'fuljhari', 'phooljhari', 'chhad', 'tinka',
    'फुलझड़ी', 'फूलझड़ी'
  ],
  'Pipe': [
    // English
    'sparkles', 'sparkle', 'pipe', 'pipes', 'color pipe', 'sada pipe', 'hand pipe', 'shower pipe', 'fountain pipe',
    // Telugu (Colloquial spellings)
    'rangu pipe', 'rangula pipe', 'pipeulu', 'pothulu', 'rangu varsham', 'shower pipe', 'sparkles',
    // Telugu Native Script
    'రంగు పైపు', 'పైపులు',
    // Hindi (Romanized & Devanagari)
    'color torch', 'roshni pipe', 'shower pipe', 'mashal', 'torch',
    'कलर पाइप', 'रंग बिरंगी पाइप'
  ],
  'Wala': [
    // English
    'wala', 'valai', 'ladi', 'garland', 'garlands', '1000 wala', 
    '2000 wala', '5000 wala', '10000 wala', 'turkey', 'chain', 'garland cracker',
    // Telugu (Colloquial spellings)
    'wala', 'vala', 'ladi', 'maala', 'mala', 'danda', 'golusu', 'golusu patakalu', 
    'veyi wala', 'vela wala', 'patakala danda', 'saram', 'charam', 'pedda saram',
    // Telugu Native Script
    'వాలా', 'లడి', 'గొలుసు టపాసులు', 'దండ',
    // Hindi (Romanized & Devanagari)
    'ladi', 'chatai', 'mirchi ladi', '1000 ladi', 'patti', 'mala', 'larhi',
    'लड़ी', 'चटाई', 'माला'
  ],
  'Rocket': [
    // English
    'rocket', 'rockets', 'bomb rocket', 'lunar rocket', 'space rocket', 'whistling rocket',
    // Telugu (Colloquial spellings)
    'rocket', 'rokketu', 'rokketlu', 'baanam', 'baanalu', 'pilli baanam', 'thupaki baanam', 'roket',
    // Telugu Native Script
    'రాకెట్', 'బాణం',
    // Hindi (Romanized & Devanagari)
    'rocket', 'bamb rocket', 'seeti rocket', 'misail', 'missile',
    'रॉकेट'
  ],
  'T-Star / Thread': [
    // English
    'star', 'tstar', 't-star', 'thread', 'loose', 'twinkling star', 'thread star',
    // Telugu (Colloquial spellings)
    'dhaaram chukkalu', 'daram chukkalu', 'chukkalu', 'thaaralu', 'taaralu', 'dhaaram pataka',
    // Telugu Native Script
    'దారం చుక్కలు', 'తారలు',
    // Hindi (Romanized & Devanagari)
    'taare', 'tara', 'sitara', 'sitaare', 'twinkling star', 'dhaaga',
    'तारे', 'सितारे'
  ],
  'Fancy': [
    // English
    'fancy', 'novelty', 'novelties', 'whistle', 'magic', 'snake', 'snake tablet', 'pop pop',
    // Telugu (Colloquial spellings)
    'paamu gulla', 'paamu matha', 'paamugulla', 'pillanagrovi', 'magic pops', 'whistle bomb',
    // Telugu Native Script
    'పాము బిళ్ళలు', 'విజిల్',
    // Hindi (Romanized & Devanagari)
    'saanp ki goli', 'snake tablet', 'pop pop', 'chutput', 'magic pop',
    'सांप की गोली'
  ],
  'Other / Unclassified': [
    'other', 'others', 'special', 'unclassified', 'gift', 'gifts', 'bijili', 'pop pop', 'sarajini',
    'migilina', 'migilinavi', 'itaram'
  ],
};

/**
 * Normalizes user queries phonetically to handle diverse regional and dialect spellings:
 * - Collapses aspirated consonants: bh->b, ph->f, chh->ch, th->t, dh->d, sh->s, kh->k, gh->g
 * - Normalizes vowels: oo->u, ee->i, aa->a
 * - Collapses repeated letters: dd->d, kk->k, pp->p, tt->t, etc.
 * - Preserves Telugu and Devanagari native characters
 */
export function normalizePhonetic(text: string): string {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\u0C00-\u0C7F\u0900-\u097F]/g, '')
    .replace(/bh/g, 'b')
    .replace(/ph/g, 'f')
    .replace(/chh/g, 'ch')
    .replace(/th/g, 't')
    .replace(/dh/g, 'd')
    .replace(/sh/g, 's')
    .replace(/kh/g, 'k')
    .replace(/gh/g, 'g')
    .replace(/oo/g, 'u')
    .replace(/ee/g, 'i')
    .replace(/aa/g, 'a')
    .replace(/(.)\1+/g, '$1');
}

// Pre-computed normalized synonym dictionary for instant O(1) phonetic matching
const NORMALIZED_CATEGORY_SYNONYMS: Record<string, string[]> = Object.fromEntries(
  Object.entries(CATEGORY_SEARCH_SYNONYMS).map(([cat, syns]) => [
    cat,
    syns.map(normalizePhonetic).filter((s) => s.length >= 3)
  ])
);

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
 * Matches a product against a search query using multilingual, tokenized, and phonetic synonym matching
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

  // 3. Multilingual Category Synonym direct match on full query
  const directCategorySynonyms = CATEGORY_SEARCH_SYNONYMS[product.category] || [];
  if (directCategorySynonyms.some((syn) => query.includes(syn) || syn.includes(query))) {
    return true;
  }

  // 4. Phonetic Normalized match on full query
  const queryNorm = normalizePhonetic(query);
  const normCategorySynonyms = NORMALIZED_CATEGORY_SYNONYMS[product.category] || [];
  if (
    queryNorm.length >= 3 &&
    normCategorySynonyms.some((nsyn) => queryNorm.includes(nsyn) || nsyn.includes(queryNorm))
  ) {
    return true;
  }

  // 5. Split multi-token searches (e.g. "chichbudi asoka", "dpm buchitra", "muthu lakshmi")
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

    // Category Synonym Matching (Direct)
    if (directCategorySynonyms.some((syn) => syn.includes(token) || token.includes(syn))) {
      return true;
    }

    // Category Synonym Matching (Phonetic)
    const tokenNorm = normalizePhonetic(token);
    if (
      tokenNorm.length >= 3 &&
      normCategorySynonyms.some((nsyn) => tokenNorm.includes(nsyn) || nsyn.includes(tokenNorm))
    ) {
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
