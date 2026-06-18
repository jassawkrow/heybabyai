/**
 * Rabbit name expander: exactly 50 seeds × 14 = 700 (50 seeds + 13 prefix passes × 50).
 * Run: node scripts/expand-rabbit-names.mjs
 */

import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dir = dirname(fileURLToPath(import.meta.url));

function slug(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-rabbit';
}

function longDesc(n, o, m, p) {
  return `${n} is a soft, whimsical name for a rabbit with ${o} roots. The name means "${m}". ` +
    `Rabbits named ${n} are often ${p}, hopping their way into every heart they meet. ` +
    `This name perfectly captures the gentle, playful nature of your bunny.`;
}

function makeRecord(name, gender, origin, meaningShort, personality, keywords, pop, vibe) {
  return {
    slug: slug(name),
    pet_type: 'rabbit',
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
// 32 existing (Bunnies→Bunny fixed, Clyde dropped) + 15 Indian + 3 soft/nature

const SEEDS = [
  // 32 existing rabbit seeds (fixed + curated)
  ["Cotton",      "unisex","English","soft white cotton",            "soft, fluffy, gentle",           "soft,fluffy,white,gentle",         92,86],
  ["Thumper",     "male",  "American","thumping feet, Disney rabbit","energetic, bouncy, lovable",     "disney,energetic,bouncy,classic",  90,86],
  ["Clover",      "female","English","lucky clover plant",           "lucky, gentle, nature-loving",   "lucky,clover,nature,gentle",       88,85],
  ["Bunny",       "unisex","English","little bunny, adorable",       "adorable, soft, playful",        "bunny,adorable,soft,playful",      86,83],
  ["Hopscotch",   "unisex","English","hopping game, playful",        "playful, energetic, bouncy",     "hopping,playful,energetic,bouncy", 85,85],
  ["Cottontail",  "unisex","English","white cottony tail",           "gentle, fluffy, classic",        "cottontail,classic,fluffy,gentle", 87,84],
  ["Petal",       "female","English","flower petal, delicate",       "delicate, sweet, gentle",        "flower,delicate,sweet,gentle",     86,85],
  ["Daisy",       "female","English","day's eye flower",             "cheerful, gentle, bright",       "flower,cheerful,gentle,bright",    87,84],
  ["Hazel",       "female","English","hazel nut tree",               "gentle, earthy, warm",           "nut,earthy,warm,gentle",           84,83],
  ["Willow",      "female","English","graceful willow tree",         "graceful, gentle, nature-loving","tree,graceful,gentle,nature",      85,84],
  ["Biscuit",     "unisex","English","small flat baked treat",       "warm, comforting, sweet",        "food,warm,sweet,comforting",       85,83],
  ["Peanut",      "unisex","English","small but mighty",             "tiny, energetic, lovable",       "tiny,lovable,energetic,small",     87,85],
  ["Caramel",     "female","French", "golden toffee sweetness",      "warm, sweet, golden",            "sweet,warm,golden,soft",           84,83],
  ["Cinnamon",    "female","English","warm aromatic spice",          "warm, spicy, comforting",        "spice,warm,comforting,aromatic",   83,83],
  ["Nutmeg",      "unisex","English","warm baking spice",            "warm, cozy, fragrant",           "spice,warm,cozy,fragrant",         81,82],
  ["Honey",       "female","English","sweet golden nectar",          "sweet, gentle, loving",          "sweet,golden,gentle,loving",       86,84],
  ["Vanilla",     "female","Spanish","sweet vanilla flavor",         "sweet, gentle, classic",         "sweet,gentle,classic,flavor",      83,82],
  ["Snowy",       "unisex","English","white as snow",                "pure, gentle, fluffy",           "white,pure,gentle,fluffy",         85,83],
  ["Fluffy",      "unisex","English","soft and fluffy fur",          "soft, cuddly, sweet",            "fluffy,soft,cuddly,sweet",         87,83],
  ["Poppy",       "female","English","bright red poppy flower",      "bright, cheerful, bold",         "flower,bright,cheerful,bold",      84,84],
  ["Meadow",      "female","English","open grassy meadow",           "open, natural, free",            "nature,open,free,grassy",          83,83],
  ["Clementine",  "female","Latin",  "mild, merciful",               "gentle, sweet, sunny",           "sweet,gentle,sunny,orange",        82,83],
  ["Rosie",       "female","English","rose flower, rosy",            "sweet, cheerful, loving",        "flower,sweet,cheerful,loving",     84,83],
  ["Buttons",     "unisex","English","round buttons, cute",          "cute, round, adorable",          "cute,round,adorable,buttons",      83,82],
  ["Binky",       "unisex","English","rabbit's joyful leap",         "joyful, bouncy, happy",          "rabbit,joyful,bounce,happy",       82,83],
  ["Dandelion",   "unisex","French", "lion's tooth flower",          "wild, cheerful, free",           "flower,wild,cheerful,free",        81,82],
  ["Flopsy",      "female","English","floppy eared rabbit",          "floppy, sweet, gentle",          "floppy,sweet,gentle,beatrix",      83,82],
  ["Mopsy",       "female","English","Mopsy, Peter Rabbit sister",   "gentle, sweet, curious",         "beatrix,gentle,sweet,curious",     81,81],
  ["Peter",       "male",  "Greek",  "rock, Peter Rabbit",           "adventurous, bold, curious",     "beatrix,adventurous,bold,classic", 85,83],
  ["Bramble",     "unisex","English","thorny wild plant",            "wild, spirited, earthy",         "wild,spirited,earthy,plant",       79,81],
  ["Acorn",       "unisex","English","small but mighty acorn",       "small, mighty, earthy",          "small,mighty,earthy,nature",       79,80],
  ["Juniper",     "female","Latin",  "juniper berry shrub",          "fresh, herby, nature-loving",    "herb,fresh,nature,plant",          80,82],
  // 15 Indian seeds
  ["Khargosh",    "unisex","Hindi",  "rabbit, the little one",       "playful, quick, lovable",        "rabbit,hindi,lovable,quick",       82,83],
  ["Safed",       "unisex","Hindi",  "white, pure white",            "pure, gentle, soft",             "white,pure,gentle,hindi",          79,81],
  ["Laal",        "male",  "Hindi",  "red, bright red",              "vibrant, bold, playful",         "red,vibrant,bold,hindi",           78,81],
  ["Chanda",      "female","Hindi",  "moon, moonbeam",               "serene, beautiful, gentle",      "moon,serene,gentle,hindi",         80,83],
  ["Tara",        "female","Sanskrit","star, shining one",           "bright, graceful, calm",         "star,bright,calm,hindu",           82,84],
  ["Sitara",      "female","Hindi",  "star, sparkle",                "sparkling, bright, playful",     "star,sparkle,playful,hindi",       81,83],
  ["Phool",       "female","Hindi",  "flower, blossom",              "gentle, fragrant, delicate",     "flower,fragrant,delicate,hindi",   80,82],
  ["Gulab",       "female","Hindi",  "rose, pink rose",              "sweet, fragrant, loving",        "rose,fragrant,sweet,hindi",        81,83],
  ["Champa",      "female","Hindi",  "champak flower, fragrant",     "fragrant, gentle, warm",         "flower,fragrant,warm,hindi",       79,82],
  ["Haldi",       "unisex","Hindi",  "turmeric, golden yellow",      "bright, warm, earthy",           "turmeric,yellow,warm,hindi",       77,80],
  ["Motu",        "male",  "Hindi",  "chubby, round one",            "chubby, lovable, playful",       "chubby,round,lovable,hindi",       79,81],
  ["Chikna",      "male",  "Hindi",  "smooth, sleek, shiny",         "smooth, quick, clever",          "smooth,sleek,clever,hindi",        77,80],
  ["Pyaru",       "unisex","Hindi",  "beloved, dear one",            "loving, gentle, affectionate",   "beloved,loving,gentle,hindi",      80,82],
  ["Gudiya",      "female","Hindi",  "little doll, precious darling","adorable, sweet, precious",      "doll,sweet,adorable,hindi",        81,83],
  ["Bunty",       "unisex","Hindi",  "little one, dear one",         "playful, sweet, lovable",        "little,dear,sweet,hindi",          82,83],
  // 3 new soft/nature seeds
  ["Marshmallow", "unisex","English","soft white confection",        "soft, sweet, squishy, gentle",   "soft,sweet,white,gentle",          84,83],
  ["Sugar",       "female","English","sweet crystalline sugar",      "sweet, gentle, lovable",         "sweet,gentle,lovable,white",       83,82],
  ["Dew",         "unisex","English","fresh morning dew drop",       "fresh, gentle, cool",            "fresh,morning,gentle,nature",      80,82],
];

// ── 13 PREFIXES — exactly fills 650 combos to reach total 700 ─────────────────

const PREFIXES = [
  // Rabbit-appropriate (8)
  { word: "Fluffy",  meaning: "soft, fluffy",          keywords: "fluffy,soft,cuddly",      pop: -4, vibe: +2 },
  { word: "Velvet",  meaning: "smooth, velvety soft",  keywords: "velvet,smooth,soft",      pop: -5, vibe: +3 },
  { word: "Bouncy",  meaning: "bouncy, energetic",     keywords: "bouncy,energetic,hoppy",  pop: -5, vibe: +2 },
  { word: "Hoppy",   meaning: "hoppy, joyful leaper",  keywords: "hoppy,joyful,leaping",    pop: -5, vibe: +2 },
  { word: "Gentle",  meaning: "gentle, tender",        keywords: "gentle,tender,sweet",     pop: -5, vibe: +2 },
  { word: "Sweet",   meaning: "sweet, lovable",        keywords: "sweet,lovable,dear",      pop: -4, vibe: +2 },
  { word: "Soft",    meaning: "soft, delicate",        keywords: "soft,delicate,gentle",    pop: -5, vibe: +2 },
  { word: "Little",  meaning: "little, tiny, small",   keywords: "little,tiny,small",       pop: -4, vibe: +1 },
  // Universal (5)
  { word: "Golden",  meaning: "golden, shining",       keywords: "golden,shining",          pop: -4, vibe: +2 },
  { word: "Silver",  meaning: "silver, bright",        keywords: "silver,bright",           pop: -5, vibe: +2 },
  { word: "Midnight",meaning: "dark, velvety night",   keywords: "midnight,dark,velvety",   pop: -4, vibe: +3 },
  { word: "Crystal", meaning: "clear, sparkling pure", keywords: "crystal,pure,sparkling",  pop: -5, vibe: +3 },
  { word: "Pearl",   meaning: "precious, luminous",    keywords: "pearl,precious,luminous", pop: -4, vibe: +3 },
];

// ── GENERATION — exact math: 50 seeds + 13×50 = 700 ──────────────────────────

function generateRabbitNames() {
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

const rabbits = generateRabbitNames();
const slugs = rabbits.map(r => r.slug);
const uniqueSlugs = new Set(slugs);
const indian = rabbits.filter(e =>
  ['Hindi','Sanskrit'].some(o => e.origin.includes(o))
);

console.log('─'.repeat(50));
console.log(`Seeds defined   : ${SEEDS.length}`);
console.log(`Prefixes defined: ${PREFIXES.length}`);
console.log(`Expected total  : ${SEEDS.length * (PREFIXES.length + 1)}`);
console.log(`Total generated : ${rabbits.length}`);
console.log(`Unique slugs    : ${uniqueSlugs.size}`);
console.log(`Duplicates      : ${rabbits.length - uniqueSlugs.size}`);
console.log(`Indian-origin   : ${indian.length}`);
console.log('─'.repeat(50));
console.log('First 10:', rabbits.slice(0, 10).map(r => r.name).join(', '));
console.log('Last  10:', rabbits.slice(-10).map(r => r.name).join(', '));
console.log('─'.repeat(50));

const outPath = join(__dir, 'rabbit-names-700.json');
writeFileSync(outPath, JSON.stringify(rabbits, null, 2));
console.log(`Saved → scripts/rabbit-names-700.json (${(JSON.stringify(rabbits).length / 1024).toFixed(0)} KB)`);
