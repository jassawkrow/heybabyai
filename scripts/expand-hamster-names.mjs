/**
 * Hamster name expander: exactly 50 seeds × 16 = 800 (50 seeds + 15 prefix passes × 50).
 * Run: node scripts/expand-hamster-names.mjs
 *
 * Seed breakdown:
 *   30 existing + 15 Indian + 5 new food = 50
 * Note: Pumpkin/Peanut/Cocoa/Caramel already in existing seeds.
 *       Tiny/Wee/Button/Squeak folded into prefix layer (they shine as modifiers).
 */

import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dir = dirname(fileURLToPath(import.meta.url));

function slug(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-hamster';
}

function longDesc(n, o, m, p) {
  return `${n} is a charming name for a hamster inspired by ${o} tradition. The name means "${m}". ` +
    `Hamsters named ${n} are often ${p}, entertaining their families with endless energy and tiny antics. ` +
    `A small name packed with big personality.`;
}

function makeRecord(name, gender, origin, meaningShort, personality, keywords, pop, vibe) {
  return {
    slug: slug(name),
    pet_type: 'hamster',
    name,
    gender,
    origin,
    meaning_short: meaningShort,
    meaning_long: longDesc(name, origin, meaningShort, personality),
    personality,
    keywords,
    popularity_score: Math.min(99, Math.max(60, pop)),
    ai_vibe_score: Math.min(99, Math.max(60, vibe)),
    starting_letter: name[0].toUpperCase(),
  };
}

// ── SEED ARRAY — exactly 50 ───────────────────────────────────────────────────

const SEEDS = [
  // 30 existing hamster seeds
  ["Peanut",       "unisex","English",   "small but mighty",             "tiny, energetic, adorable",        "tiny,cute,energetic,small",          90,87],
  ["Nibbles",      "unisex","English",   "small bites, nibbling",        "curious, gentle, munching",        "eating,curious,gentle,small",        88,85],
  ["Nugget",       "unisex","English",   "small golden nugget",          "small, golden, precious",          "small,golden,precious,cute",         87,86],
  ["Pumpkin",      "unisex","English",   "round orange pumpkin",         "round, warm, sweet",               "round,orange,sweet,warm",            85,83],
  ["Squeaky",      "unisex","English",   "squeaking sound",              "vocal, tiny, expressive",          "vocal,tiny,expressive,sound",        84,82],
  ["Fluffy",       "unisex","English",   "soft and fluffy",              "soft, cuddly, gentle",             "fluffy,soft,cuddly,gentle",          87,82],
  ["Pompom",       "unisex","French",    "fluffy round ball",            "round, fluffy, playful",           "round,fluffy,playful,cute",          85,84],
  ["Acorn",        "unisex","English",   "small round acorn",            "small, round, earthy",             "small,round,earthy,nature",          82,82],
  ["Biscuit",      "unisex","English",   "small baked treat",            "warm, comforting, small",          "food,warm,small,comforting",         83,81],
  ["Marshmallow",  "unisex","English",   "soft white marshmallow",       "soft, sweet, fluffy",              "soft,sweet,fluffy,white",            86,84],
  ["Cocoa",        "unisex","Portuguese","chocolate cocoa",              "warm, sweet, chocolatey",          "chocolate,warm,sweet,brown",         83,82],
  ["Caramel",      "unisex","French",    "golden toffee",                "warm, sweet, golden",              "sweet,warm,golden,toffee",           82,82],
  ["Butterscotch", "unisex","English",   "buttery scotch candy",         "sweet, warm, buttery",             "sweet,buttery,warm,candy",           81,82],
  ["Hazel",        "unisex","English",   "hazel tree, nut",              "earthy, gentle, warm",             "nut,earthy,warm,nature",             80,81],
  ["Chestnut",     "unisex","English",   "brown chestnut nut",           "warm, earthy, brown",              "nut,warm,earthy,brown",              79,80],
  ["Waffle",       "unisex","English",   "crispy batter waffle",         "warm, sweet, crispy",              "food,warm,sweet,breakfast",          82,82],
  ["Pretzel",      "unisex","German",    "twisted pretzel bread",        "twisted, salty, fun",              "bread,twisted,fun,salty",            79,80],
  ["Teddy",        "unisex","English",   "teddy bear, cuddly",           "cuddly, sweet, lovable",           "teddy,cuddly,sweet,bear",            85,83],
  ["Hammy",        "male",  "English",   "little hamster, lovable",      "lovable, energetic, tiny",         "hamster,lovable,energetic,tiny",     83,81],
  ["Hamlet",       "male",  "Old English","little home, Shakespeare",    "literary, intelligent, small",     "shakespeare,literary,small,clever",  80,82],
  ["Chester",      "male",  "English",   "fortress, sturdy",             "sturdy, reliable, friendly",       "sturdy,reliable,friendly,classic",   79,80],
  ["Pip",          "unisex","English",   "tiny seed, small",             "tiny, perky, adorable",            "tiny,perky,adorable,small",          82,82],
  ["Sprout",       "unisex","English",   "new plant sprout, growing",    "growing, tiny, fresh",             "growing,tiny,fresh,plant",           80,81],
  ["Mochi",        "unisex","Japanese",  "sweet rice cake, round",       "round, soft, sweet",               "japanese,round,soft,sweet",          83,84],
  ["Gizmo",        "unisex","English",   "clever gadget, small",         "clever, curious, energetic",       "clever,curious,energetic,fun",       81,82],
  ["Tumble",       "unisex","English",   "tumbling, rolling",            "energetic, tumbling, playful",     "tumbling,energetic,playful,rolling", 80,82],
  ["Roly",         "unisex","English",   "roly poly, round and rolling", "round, rolling, playful",          "round,rolling,playful,cute",         79,80],
  ["Zippy",        "unisex","English",   "fast and zippy",               "fast, energetic, lively",          "fast,energetic,lively,zippy",        80,81],
  ["Honey",        "female","English",   "sweet golden honey",           "sweet, gentle, warm",              "sweet,gentle,warm,golden",           82,82],
  ["Cookie",       "unisex","English",   "sweet baked cookie",           "sweet, warm, lovable",             "sweet,warm,lovable,food",            82,81],
  // 15 Indian seeds
  ["Gola",         "unisex","Hindi",     "round ball, sweet ice ball",   "round, sweet, playful",            "round,sweet,playful,hindi",          81,82],
  ["Golu",         "unisex","Hindi",     "chubby, round one",            "chubby, lovable, playful",         "chubby,round,lovable,hindi",         82,83],
  ["Bunty",        "unisex","Hindi",     "little dear one",              "playful, sweet, lovable",          "little,dear,sweet,hindi",            82,82],
  ["Pinky",        "female","Hindi",     "pink, rosy sweet one",         "sweet, pink, playful",             "pink,sweet,playful,hindi",           80,81],
  ["Tinku",        "unisex","Hindi",     "tiny dear one",                "tiny, sweet, lovable",             "tiny,sweet,lovable,hindi",           80,81],
  ["Chutki",       "female","Hindi",     "tiny pinch, little one",       "tiny, small, adorable",            "tiny,small,adorable,hindi",          79,81],
  ["Motu",         "male",  "Hindi",     "chubby, fat one",              "chubby, lovable, funny",           "chubby,fat,lovable,hindi",           80,82],
  ["Chikna",       "male",  "Hindi",     "smooth, sleek, shiny",         "smooth, quick, clever",            "smooth,sleek,clever,hindi",          77,80],
  ["Laddoo",       "unisex","Hindi",     "sweet round ball, dessert",    "sweet, round, lovable",            "sweet,round,lovable,hindi",          82,83],
  ["Gulab",        "female","Hindi",     "rose, pink rose",              "sweet, fragrant, gentle",          "rose,fragrant,sweet,hindi",          80,82],
  ["Pista",        "unisex","Hindi",     "pistachio, small green nut",   "small, nutty, playful",            "pistachio,small,nutty,hindi",        79,81],
  ["Kaju",         "unisex","Hindi",     "cashew, curved nut",           "small, curved, nutty",             "cashew,small,nutty,hindi",           79,81],
  ["Badaam",       "unisex","Hindi",     "almond, wholesome nut",        "warm, nutty, gentle",              "almond,warm,nutty,hindi",            79,80],
  ["Imli",         "female","Hindi",     "tamarind, sweet-tart",         "tart, playful, unique",            "tamarind,tart,playful,hindi",        78,81],
  ["Chiku",        "unisex","Hindi",     "sapodilla, small sweet fruit", "sweet, small, gentle",             "sapodilla,sweet,small,hindi",        79,81],
  // 5 best new food seeds (not duplicating existing)
  ["Mocha",        "unisex","Arabic",    "coffee and chocolate blend",   "bold, warm, energetic",            "coffee,chocolate,bold,warm",         82,83],
  ["Toffee",       "unisex","English",   "caramelized golden candy",     "sweet, golden, warm",              "candy,sweet,golden,warm",            82,82],
  ["Fudge",        "unisex","English",   "rich chocolate fudge",         "rich, sweet, indulgent",           "chocolate,rich,sweet,indulgent",     81,82],
  ["Truffle",      "unisex","French",    "rare earthy chocolate truffle","rare, earthy, luxurious",          "chocolate,rare,earthy,french",       80,83],
  ["Jellybean",    "unisex","English",   "colorful jelly candy",         "colorful, sweet, playful",         "candy,colorful,sweet,playful",       81,82],
];

// ── 15 PREFIXES — exactly fills 750 combos to reach total 800 ─────────────────

const PREFIXES = [
  // Hamster-appropriate (10)
  { word: "Tiny",   meaning: "tiny, miniature",         keywords: "tiny,miniature,small",    pop: -4, vibe: +2 },
  { word: "Wee",    meaning: "wee, very small",         keywords: "wee,small,little",        pop: -5, vibe: +2 },
  { word: "Fuzzy",  meaning: "fuzzy, soft fur",         keywords: "fuzzy,soft,fur",          pop: -4, vibe: +2 },
  { word: "Round",  meaning: "round, chubby",           keywords: "round,chubby,cute",       pop: -5, vibe: +2 },
  { word: "Chubby", meaning: "chubby, plump",           keywords: "chubby,plump,cute",       pop: -5, vibe: +2 },
  { word: "Speedy", meaning: "speedy, quick runner",    keywords: "speedy,quick,energetic",  pop: -5, vibe: +2 },
  { word: "Zippy",  meaning: "zippy, fast",             keywords: "zippy,fast,lively",       pop: -5, vibe: +2 },
  { word: "Sweet",  meaning: "sweet, lovable",          keywords: "sweet,lovable,gentle",    pop: -4, vibe: +2 },
  { word: "Little", meaning: "little, tiny",            keywords: "little,tiny,small",       pop: -4, vibe: +1 },
  { word: "Plump",  meaning: "plump, round",            keywords: "plump,round,cute",        pop: -6, vibe: +2 },
  // Universal (5)
  { word: "Golden", meaning: "golden, shining",         keywords: "golden,shining",          pop: -4, vibe: +2 },
  { word: "Honey",  meaning: "honey-sweet, warm",       keywords: "honey,sweet,warm",        pop: -4, vibe: +2 },
  { word: "Sugar",  meaning: "sugary sweet",            keywords: "sugar,sweet,gentle",      pop: -4, vibe: +2 },
  { word: "Velvet", meaning: "velvety smooth soft",     keywords: "velvet,smooth,soft",      pop: -5, vibe: +3 },
  { word: "Crystal",meaning: "crystal clear, pure",    keywords: "crystal,pure,clear",      pop: -5, vibe: +3 },
];

// ── GENERATION — exact math: 50 seeds + 15×50 = 800 ──────────────────────────

function generateHamsterNames() {
  const slugSet = new Set();
  const results = [];

  function tryAdd(name, gender, origin, meaningShort, personality, keywords, pop, vibe) {
    const s = slug(name);
    if (slugSet.has(s)) return;
    slugSet.add(s);
    results.push(makeRecord(name, gender, origin, meaningShort, personality, keywords, pop, vibe));
  }

  for (const [n, g, o, m, p, k, pop, vibe] of SEEDS) {
    tryAdd(n, g, o, m, p, k, pop, vibe);
  }

  for (const pfx of PREFIXES) {
    for (const [n, g, o, m, p, k, pop, vibe] of SEEDS) {
      tryAdd(
        `${pfx.word} ${n}`, g, o,
        `${pfx.meaning} ${m}`, p,
        k + ',' + pfx.keywords,
        pop + pfx.pop, vibe + pfx.vibe,
      );
    }
  }

  return results;
}

// ── RUN ───────────────────────────────────────────────────────────────────────

const hamsters = generateHamsterNames();
const slugs = hamsters.map(h => h.slug);
const uniqueSlugs = new Set(slugs);
const indian = hamsters.filter(e =>
  ['Hindi','Sanskrit'].some(o => e.origin.includes(o))
);

console.log('─'.repeat(50));
console.log(`Seeds defined   : ${SEEDS.length}`);
console.log(`Prefixes defined: ${PREFIXES.length}`);
console.log(`Expected total  : ${SEEDS.length * (PREFIXES.length + 1)}`);
console.log(`Total generated : ${hamsters.length}`);
console.log(`Unique slugs    : ${uniqueSlugs.size}`);
console.log(`Duplicates      : ${hamsters.length - uniqueSlugs.size}`);
console.log(`Indian-origin   : ${indian.length}`);
console.log('─'.repeat(50));
console.log('First 10:', hamsters.slice(0, 10).map(h => h.name).join(', '));
console.log('Last  10:', hamsters.slice(-10).map(h => h.name).join(', '));
console.log('─'.repeat(50));

const outPath = join(__dir, 'hamster-names-800.json');
writeFileSync(outPath, JSON.stringify(hamsters, null, 2));
console.log(`Saved → scripts/hamster-names-800.json (${(JSON.stringify(hamsters).length / 1024).toFixed(0)} KB)`);
