/**
 * Fish name expander: exactly 50 seeds × 19 prefixes = 950 combos + 50 seeds = 1,000.
 * No partial prefix passes — math is exact.
 * Run: node scripts/expand-fish-names.mjs
 */

import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dir = dirname(fileURLToPath(import.meta.url));

function slug(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-fish';
}

function longDesc(n, o, m, p) {
  return `${n} is a graceful name for a fish drawing from ${o} tradition. The name means "${m}". ` +
    `Fish named ${n} glide through water with ${p} energy, bringing calm and beauty to any aquarium. ` +
    `A serene name for a serene companion.`;
}

function makeRecord(name, gender, origin, meaningShort, personality, keywords, pop, vibe) {
  return {
    slug: slug(name),
    pet_type: 'fish',
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
// [name, gender, origin, meaning_short, personality, keywords, pop, vibe]

const SEEDS = [
  // 36 existing fish seeds
  ["Bubbles",   "unisex","English","air bubbles underwater",      "playful, bubbly, cheerful",         "bubbles,playful,cheerful,water",      92,86],
  ["Goldie",    "female","English","golden colored, precious",    "bright, cheerful, warm",            "gold,bright,warm,classic",            90,85],
  ["Splash",    "unisex","English","water splashing sound",       "playful, energetic, fun",           "water,playful,energetic,fun",         88,84],
  ["Nemo",      "male",  "Latin",  "nobody, brave little fish",   "brave, adventurous, cheerful",      "disney,brave,adventurous,orange",     95,88],
  ["Dory",      "female","English","forgetful blue tang fish",    "friendly, forgetful, cheerful",     "disney,friendly,blue,cheerful",       92,87],
  ["Finn",      "unisex","English","fish fin, white",             "graceful, swift, agile",            "fin,graceful,swift,agile",            88,85],
  ["Flash",     "unisex","English","bright flash of light",       "quick, bright, vivid",              "bright,quick,vivid,light",            85,85],
  ["Ripple",    "unisex","English","water ripple, gentle wave",   "gentle, fluid, graceful",           "water,gentle,fluid,graceful",         85,84],
  ["Wave",      "unisex","English","ocean wave",                  "fluid, powerful, rhythmic",         "ocean,fluid,rhythmic,powerful",       84,84],
  ["Shimmer",   "unisex","English","shimmering light on water",   "sparkling, beautiful, luminous",    "sparkle,beautiful,luminous,water",    86,86],
  ["Glitter",   "unisex","English","tiny sparkling particles",    "sparkling, cheerful, colorful",     "sparkle,colorful,cheerful,bright",    83,84],
  ["Dart",      "male",  "English","moving swiftly, dart fish",   "swift, agile, quick",               "swift,agile,quick,movement",          82,83],
  ["Coral",     "female","English","ocean coral reef",            "colorful, nurturing, beautiful",    "ocean,colorful,reef,beautiful",       87,86],
  ["Pearl",     "female","English","precious ocean gem",          "precious, elegant, serene",         "gem,ocean,precious,elegant",          88,86],
  ["Azure",     "unisex","French", "sky blue color",              "serene, beautiful, blue",           "blue,serene,beautiful,water",         83,84],
  ["Turquoise", "unisex","French", "blue-green precious stone",   "calm, beautiful, unique",           "blue-green,calm,beautiful,gem",       82,84],
  ["Sapphire",  "female","Greek",  "blue precious gemstone",      "deep, beautiful, precious",         "blue,gem,precious,deep",              83,85],
  ["Aqua",      "unisex","Latin",  "water, aqua color",           "fluid, calm, serene",               "water,calm,serene,blue",              84,83],
  ["Triton",    "male",  "Greek",  "son of Poseidon, merman",     "powerful, fluid, mythological",     "greek,ocean,powerful,mythological",   80,86],
  ["Neptune",   "male",  "Roman",  "god of the sea",              "deep, powerful, mysterious",        "ocean,powerful,roman,mythological",   81,86],
  ["Poseidon",  "male",  "Greek",  "ocean god, earth shaker",     "powerful, commanding, deep",        "greek,ocean,powerful,mythological",   79,87],
  ["Gill",      "unisex","English","fish gill, breath of water",  "steady, calm, functional",          "anatomy,calm,water,classic",          80,80],
  ["Zigzag",    "unisex","English","zigzag swimming pattern",     "energetic, playful, unpredictable", "zigzag,energetic,playful,movement",   79,82],
  ["Rainbow",   "unisex","English","rainbow of colors",           "colorful, joyful, vibrant",         "rainbow,colorful,joyful,vibrant",     85,85],
  ["Marble",    "unisex","English","marbled pattern, swirling",   "elegant, patterned, unique",        "pattern,elegant,unique,swirl",        79,82],
  ["Pebble",    "unisex","English","smooth river pebble",         "smooth, calm, earthy",              "smooth,calm,earthy,nature",           78,80],
  ["Brook",     "female","English","small flowing stream",        "gentle, flowing, serene",           "water,gentle,flowing,serene",         80,82],
  ["Tide",      "unisex","English","ocean tide, cyclic flow",     "rhythmic, powerful, cyclic",        "ocean,rhythmic,powerful,cycle",       79,82],
  ["Surf",      "male",  "English","surf, ocean waves",           "active, playful, ocean",            "ocean,active,playful,waves",          79,82],
  ["Brine",     "unisex","English","salt water of the ocean",     "salty, deep, ocean",                "salt,deep,ocean,classic",             76,79],
  ["Orca",      "unisex","Latin",  "barrel shape, killer whale",  "powerful, intelligent, bold",       "whale,powerful,intelligent,bold",     80,85],
  ["Kelp",      "unisex","English","ocean seaweed, marine plant", "wavy, green, oceanic",              "ocean,plant,green,wavy",              75,78],
  ["Sandy",     "female","English","sand colored, sandy",         "gentle, warm, earthy",              "sand,warm,earthy,gentle",             81,80],
  ["Goldfin",   "male",  "English","golden finned fish",          "bright, golden, graceful",          "gold,fin,bright,graceful",            78,81],
  ["Bluebell",  "female","English","blue bell flower, blue",      "delicate, blue, beautiful",         "blue,flower,delicate,beautiful",      79,82],
  ["Whisker",   "male",  "English","catfish whiskers, sensory",   "curious, sensitive, exploratory",   "catfish,curious,sensory,exploratory", 77,79],
  // 8 new Indian seeds
  ["Matsya",    "male",  "Sanskrit","Vishnu's fish avatar, divine fish","sacred, divine, ancient",     "vishnu,divine,sacred,hindu",          80,87],
  ["Rohu",      "unisex","Hindi",  "rohu carp, beloved river fish",    "gentle, graceful, beloved",   "carp,river,gentle,hindi",             78,80],
  ["Hilsa",     "female","Bengali","prized river herring, queen fish",  "elegant, prized, regal",      "herring,river,prized,bengali",        79,82],
  ["Jhilmil",   "female","Hindi",  "sparkling, twinkling water",        "sparkling, bright, playful",  "sparkle,bright,water,hindi",          80,83],
  ["Lehar",     "unisex","Hindi",  "wave, flowing ripple",              "fluid, gentle, rhythmic",     "wave,fluid,gentle,hindi",             79,82],
  ["Chanda",    "female","Hindi",  "moon, moonfish, silver shimmer",    "serene, beautiful, moonlit",  "moon,silver,serene,hindi",            80,83],
  ["Moti",      "unisex","Hindi",  "pearl, precious gem",               "precious, gentle, luminous",  "pearl,precious,gentle,hindi",         80,83],
  ["Heera",     "female","Hindi",  "diamond, brilliant gem",            "brilliant, precious, bright", "diamond,brilliant,precious,hindi",    80,84],
  // 6 new mythological water seeds
  ["Nereid",    "female","Greek",  "sea nymph, daughter of Nereus",     "graceful, mysterious, fluid", "sea,nymph,graceful,greek",            78,85],
  ["Varuna",    "male",  "Sanskrit","god of water and cosmic order",    "powerful, just, ancient",     "water,cosmic,divine,hindu",           79,86],
  ["Ganga",     "female","Sanskrit","sacred river, goddess Ganga",      "pure, sacred, flowing",       "river,sacred,pure,hindu",             80,86],
  ["Yamuna",    "female","Sanskrit","sacred river, sister of Yama",     "gentle, pure, sacred",        "river,sacred,gentle,hindu",           79,85],
  ["Leviathan", "male",  "Hebrew", "great sea monster, vast",           "powerful, ancient, deep",     "sea,ancient,powerful,hebrew",         78,86],
  ["Makara",    "unisex","Sanskrit","sea creature, Capricorn symbol",   "ancient, mystical, powerful", "sea,mythological,ancient,hindu",      78,85],
];

// ── 19 PREFIXES — exactly fills 950 combos to reach total 1,000 ───────────────
// None of these exact words appear as seeds (no "Prefix Prefix" combos possible)

const PREFIXES = [
  // Fish/water-specific (10)
  { word: "Crystal", meaning: "clear, pure, sparkling",   keywords: "crystal,pure,sparkling",  pop: -5, vibe: +3 },
  { word: "Marina",  meaning: "of the sea, harbour",      keywords: "marina,sea,harbour",      pop: -5, vibe: +2 },
  { word: "Bubble",  meaning: "light, bubbly, playful",   keywords: "bubble,light,playful",    pop: -5, vibe: +2 },
  { word: "Ocean",   meaning: "vast ocean, deep",         keywords: "ocean,vast,deep",         pop: -4, vibe: +3 },
  { word: "Deep",    meaning: "deep, mysterious, vast",   keywords: "deep,mysterious,vast",    pop: -5, vibe: +3 },
  { word: "Tidal",   meaning: "tidal, rhythmic, flowing", keywords: "tidal,rhythmic,flowing",  pop: -6, vibe: +2 },
  { word: "Lagoon",  meaning: "calm lagoon, tranquil",    keywords: "lagoon,calm,tranquil",    pop: -6, vibe: +2 },
  { word: "Seafoam", meaning: "soft seafoam, frothy",     keywords: "seafoam,frothy,soft",     pop: -6, vibe: +2 },
  { word: "Glimmer", meaning: "glimmering, faint glow",   keywords: "glimmer,glow,light",      pop: -6, vibe: +2 },
  { word: "Dazzle",  meaning: "dazzling, brilliant",      keywords: "dazzle,brilliant,bright", pop: -5, vibe: +3 },
  // Universal good (9)
  { word: "Golden",  meaning: "golden, shining",          keywords: "golden,shining",          pop: -4, vibe: +2 },
  { word: "Silver",  meaning: "silver, bright",           keywords: "silver,bright",           pop: -5, vibe: +2 },
  { word: "Midnight",meaning: "dark, mysterious night",   keywords: "midnight,dark,night",     pop: -4, vibe: +4 },
  { word: "Crimson", meaning: "deep red, bold",           keywords: "crimson,red,bold",        pop: -5, vibe: +3 },
  { word: "Sky",     meaning: "sky-bright, open",         keywords: "sky,bright,open",         pop: -5, vibe: +2 },
  { word: "Teal",    meaning: "teal, blue-green",         keywords: "teal,blue-green,cool",    pop: -5, vibe: +2 },
  { word: "Wild",    meaning: "untamed, free-spirited",   keywords: "wild,untamed,free",       pop: -4, vibe: +3 },
  { word: "Copper",  meaning: "warm reddish metal",       keywords: "copper,warm,metal",       pop: -5, vibe: +3 },
  { word: "Jade",    meaning: "green jade, precious",     keywords: "jade,green,precious",     pop: -5, vibe: +3 },
];

// ── GENERATION — exact math: 50 seeds + 19×50 = 1,000 ────────────────────────

function generateFishNames() {
  const slugSet = new Set();
  const results = [];

  function tryAdd(name, gender, origin, meaningShort, personality, keywords, pop, vibe) {
    const s = slug(name);
    if (slugSet.has(s)) return;
    slugSet.add(s);
    results.push(makeRecord(name, gender, origin, meaningShort, personality, keywords, pop, vibe));
  }

  // Pass 1 — all 50 seeds
  for (const [n, g, o, m, p, k, pop, vibe] of SEEDS) {
    tryAdd(n, g, o, m, p, k, pop, vibe);
  }

  // Pass 2 — 19 full prefix passes × 50 seeds = 950 combos
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

const fish = generateFishNames();
const slugs = fish.map(f => f.slug);
const uniqueSlugs = new Set(slugs);
const indian = fish.filter(e =>
  ['Hindi','Sanskrit','Bengali'].some(o => e.origin.includes(o))
);

console.log('─'.repeat(50));
console.log(`Seeds defined   : ${SEEDS.length}`);
console.log(`Prefixes defined: ${PREFIXES.length}`);
console.log(`Expected total  : ${SEEDS.length + PREFIXES.length * SEEDS.length}`);
console.log(`Total generated : ${fish.length}`);
console.log(`Unique slugs    : ${uniqueSlugs.size}`);
console.log(`Duplicates      : ${fish.length - uniqueSlugs.size}`);
console.log(`Indian-origin   : ${indian.length}`);
console.log('─'.repeat(50));
console.log('First 10:', fish.slice(0, 10).map(f => f.name).join(', '));
console.log('Last  10:', fish.slice(-10).map(f => f.name).join(', '));
console.log('─'.repeat(50));

const outPath = join(__dir, 'fish-names-1000.json');
writeFileSync(outPath, JSON.stringify(fish, null, 2));
console.log(`Saved → scripts/fish-names-1000.json (${(JSON.stringify(fish).length / 1024).toFixed(0)} KB)`);
