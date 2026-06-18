/**
 * Bird name expander: ~90 seeds × prefixes → 1,500 unique bird records.
 * Run: node scripts/expand-bird-names.mjs
 */

import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dir = dirname(fileURLToPath(import.meta.url));

function slug(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-bird';
}

function longDesc(n, o, m, p) {
  return `${n} is a bright, musical name for a bird rooted in ${o} tradition. The name means "${m}". ` +
    `Birds named ${n} are often ${p}, filling their home with color, song, and personality. ` +
    `A perfect name for a feathered friend who loves the spotlight.`;
}

function makeRecord(name, gender, origin, meaningShort, personality, keywords, pop, vibe) {
  return {
    slug: slug(name),
    pet_type: 'bird',
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

// ── SEED ARRAY (~90 birds) ────────────────────────────────────────────────────
// [name, gender, origin, meaning_short, personality, keywords, pop, vibe]

const SEEDS = [
  // Classic pet bird names (24 from existing)
  ["Tweety",   "unisex","English",  "sweet tweet, beloved canary","cheerful, chirpy, singing",     "classic,canary,cheerful,singing",      92,86],
  ["Polly",    "female","English",  "beloved parrot",             "chatty, sociable, clever",      "parrot,classic,chatty,clever",         90,85],
  ["Sunny",    "unisex","English",  "bright and sunny",           "bright, cheerful, warm",        "bright,cheerful,sunny,warm",           88,85],
  ["Kiwi",     "unisex","Maori",    "New Zealand bird, fruit",    "perky, curious, energetic",     "newzealand,perky,curious,fruit",       85,84],
  ["Mango",    "unisex","Hindi",    "tropical sweet mango fruit", "vibrant, tropical, cheerful",   "tropical,vibrant,colorful,sweet",      86,85],
  ["Rio",      "unisex","Spanish",  "river, free-flowing",        "free, adventurous, colorful",   "rio,free,colorful,adventurous",        84,85],
  ["Sky",      "unisex","English",  "the open sky above",         "free, open, expansive",         "sky,blue,free,open",                   85,84],
  ["Blue",     "unisex","English",  "the color of sky",           "calm, serene, beautiful",       "blue,calm,serene,color",               86,85],
  ["Robin",    "unisex","English",  "bright red-breasted bird",   "cheerful, musical, social",     "british,cheerful,musical,classic",     84,83],
  ["Jay",      "male",  "Latin",    "jaybird, joyful",            "bold, intelligent, vocal",      "bold,intelligent,vocal,blue",          82,83],
  ["Chirpy",   "unisex","English",  "cheerful chirping sound",    "cheerful, vocal, happy",        "cheerful,vocal,happy,sound",           83,82],
  ["Feather",  "unisex","English",  "light bird feather",         "light, delicate, graceful",     "light,delicate,graceful,nature",       80,83],
  ["Wing",     "unisex","English",  "bird's wing for flight",     "free, adventurous, swift",      "free,swift,flight,adventurous",        79,82],
  ["Sparrow",  "unisex","English",  "small common bird",          "small, agile, sociable",        "small,agile,sociable,nature",          82,82],
  ["Wren",     "female","English",  "tiny energetic songbird",    "tiny, energetic, musical",      "tiny,musical,energetic,songbird",      80,82],
  ["Lark",     "unisex","English",  "singing lark bird",          "joyful, singing, free",         "singing,joyful,free,classic",          81,83],
  ["Dove",     "female","English",  "peaceful dove bird",         "peaceful, gentle, loving",      "peace,gentle,loving,white",            83,84],
  ["Falcon",   "male",  "Latin",    "swift hunting falcon",       "swift, powerful, alert",        "swift,powerful,hunter,alert",          83,85],
  ["Hawk",     "male",  "English",  "keen-eyed hawk bird",        "sharp, observant, powerful",    "sharp,powerful,hunter,keen",           82,84],
  ["Eagle",    "male",  "English",  "soaring eagle",              "majestic, powerful, free",      "majestic,powerful,freedom,soaring",    84,86],
  ["Swift",    "unisex","English",  "fastest flying bird",        "swift, agile, determined",      "fast,agile,determined,flight",         82,84],
  ["Phoenix",  "unisex","Greek",    "mythical firebird, rebirth", "resilient, radiant, majestic",  "mythological,rebirth,fire,majestic",   86,90],
  ["Finch",    "unisex","English",  "small colorful finch bird",  "small, colorful, sociable",     "small,colorful,sociable,classic",      80,82],
  ["Echo",     "unisex","Greek",    "repeated sound, reflection", "vocal, musical, mythological",  "musical,vocal,greek,echo",             81,83],
  // Color-based bird names (10 from existing)
  ["Scarlet",  "female","English",  "bright red color",           "vibrant, bold, striking",       "red,vibrant,bold,striking",            84,86],
  ["Indigo",   "unisex","Greek",    "deep blue-purple color",     "deep, mysterious, colorful",    "blue,purple,deep,colorful",            83,86],
  ["Azure",    "unisex","French",   "sky blue color",             "serene, blue, beautiful",       "blue,serene,sky,beautiful",            82,85],
  ["Amber",    "female","Arabic",   "golden amber resin",         "golden, warm, radiant",         "golden,warm,radiant,gem",              83,84],
  ["Teal",     "unisex","English",  "blue-green color",           "calm, beautiful, unique",       "blue-green,calm,unique,beautiful",     82,84],
  ["Jade",     "female","Spanish",  "green precious stone",       "precious, green, elegant",      "green,precious,elegant,gem",           83,85],
  ["Cobalt",   "male",  "German",   "deep blue metallic hue",     "deep, intense, striking",       "blue,deep,intense,striking",           80,84],
  ["Pip",      "unisex","English",  "tiny seed, small sound",     "tiny, perky, adorable",         "tiny,perky,adorable,small",            83,83],
  ["Zippy",    "unisex","English",  "quick and energetic",        "quick, energetic, lively",      "quick,energetic,lively,fun",           81,82],
  ["Riff",     "male",  "English",  "musical riff, jazz",         "musical, creative, cool",       "musical,creative,cool,jazz",           78,82],
  // Indian bird names (9 from existing)
  ["Mithu",    "male",  "Hindi",    "parrot, sweet talker",       "chatty, colorful, clever",      "hindi,parrot,chatty,colorful",         88,85],
  ["Tota",     "male",  "Hindi",    "parrot, green talker",       "vocal, green, clever",          "hindi,parrot,vocal,clever",            85,83],
  ["Maina",    "female","Hindi",    "mynah bird, songbird",       "musical, vocal, social",        "mynah,musical,hindi,social",           86,84],
  ["Koel",     "female","Hindi",    "cuckoo bird, sweet singer",  "melodious, sweet, elusive",     "cuckoo,melodious,sweet,hindi",         84,84],
  ["Bulbul",   "unisex","Persian",  "nightingale, sweet singer",  "melodious, romantic, singing",  "nightingale,singing,melodious,persian",83,84],
  ["Pankhi",   "female","Hindi",    "bird, one who flies free",   "free, graceful, soaring",       "bird,free,graceful,hindi",             81,83],
  ["Garuda",   "male",  "Sanskrit", "eagle, vehicle of Vishnu",   "majestic, divine, powerful",    "eagle,divine,powerful,hindu",          82,87],
  ["Akash",    "male",  "Sanskrit", "sky, heaven",                "boundless, free, expansive",    "sky,heaven,free,infinite",             83,85],
  ["Udaan",    "unisex","Hindi",    "flight, soaring",            "free, ambitious, soaring",      "flight,free,ambitious,hindi",          80,84],
  // 25 new Indian-origin bird seeds
  ["Hirwa",    "male",  "Marathi",  "green, verdant",             "bright, colorful, lively",      "green,colorful,marathi,lively",        79,83],
  ["Titu",     "male",  "Hindi",    "small bird, dear one",       "small, sweet, playful",         "small,sweet,playful,hindi",            80,82],
  ["Neela",    "female","Hindi",    "blue, the color of sky",     "calm, beautiful, serene",       "blue,sky,calm,hindi",                  81,83],
  ["Laal",     "male",  "Hindi",    "red, bright red",            "vibrant, bold, striking",       "red,vibrant,bold,hindi",               79,82],
  ["Pilu",     "unisex","Hindi",    "miswak tree, parrot's tree", "lively, curious, colorful",     "tree,parrot,colorful,hindi",           77,81],
  ["Sampati",  "male",  "Sanskrit", "bird of Ramayana, elder eagle","noble, watchful, ancient",   "ramayana,eagle,ancient,noble",         80,86],
  ["Parewa",   "female","Hindi",    "pigeon, gentle bird",        "gentle, peaceful, loving",      "pigeon,gentle,peaceful,hindi",         79,81],
  ["Gagan",    "male",  "Sanskrit", "sky, firmament",             "boundless, free, expansive",    "sky,free,boundless,hindi",             82,84],
  ["Paro",     "female","Hindi",    "pigeon, beloved",            "gentle, loving, devoted",       "pigeon,gentle,loving,hindi",           79,82],
  ["Titli",    "female","Hindi",    "butterfly, fluttery",        "light, graceful, colorful",     "butterfly,light,colorful,hindi",       80,83],
  ["Kaga",     "male",  "Hindi",    "crow, clever messenger",     "clever, bold, adaptable",       "crow,clever,bold,hindi",               77,81],
  ["Chakor",   "male",  "Sanskrit", "partridge, moon lover",      "romantic, loyal, spirited",     "partridge,moon,romantic,hindu",        80,84],
  ["Mayur",    "male",  "Sanskrit", "peacock, pride of India",    "majestic, beautiful, proud",    "peacock,majestic,proud,indian",        83,87],
  ["Mor",      "male",  "Hindi",    "peacock, regal dancer",      "regal, beautiful, graceful",    "peacock,regal,hindi,graceful",         82,86],
  ["Muniya",   "female","Hindi",    "small munia finch",          "tiny, sweet, social",           "finch,tiny,sweet,hindi",               79,82],
  ["Sundar",   "male",  "Sanskrit", "beautiful, handsome",        "beautiful, graceful, bright",   "beautiful,graceful,bright,hindi",      81,83],
  ["Chirag",   "male",  "Hindi",    "flame, lamp, light",         "bright, warm, guiding",         "flame,bright,warm,hindi",              80,83],
  ["Neel",     "male",  "Sanskrit", "blue, sapphire",             "deep, serene, beautiful",       "blue,deep,serene,hindi",               81,84],
  ["Jatayu",   "male",  "Sanskrit", "heroic eagle of Ramayana",   "brave, noble, devoted",         "ramayana,eagle,brave,noble",           81,87],
  ["Krauncha", "unisex","Sanskrit", "curlew bird, song of grief",  "melodious, ancient, poetic",   "ancient,poetic,melodious,hindu",       76,82],
  ["Bater",    "unisex","Hindi",    "quail, small game bird",     "quick, small, alert",           "quail,quick,small,hindi",              76,80],
  ["Kabutar",  "unisex","Hindi",    "pigeon, messenger bird",     "gentle, loyal, peaceful",       "pigeon,gentle,loyal,hindi",            78,81],
  ["Teetar",   "male",  "Hindi",    "partridge, spirited bird",   "spirited, alert, bold",         "partridge,spirited,bold,hindi",        77,80],
  ["Hamsa",    "unisex","Sanskrit", "swan, vehicle of Saraswati", "graceful, wise, pure",          "swan,pure,wise,divine",                82,86],
  ["Pakshi",   "unisex","Sanskrit", "bird, winged one",           "free, soaring, graceful",       "bird,free,soaring,sanskrit",           79,83],
  // 12 new mythological bird seeds
  ["Roc",      "male",  "Arabic",   "giant mythological bird",    "powerful, massive, legendary",  "giant,mythological,powerful,arabic",   79,87],
  ["Simurgh",  "unisex","Persian",  "benevolent Persian giant bird","wise, ancient, magical",      "persian,wise,magical,mythological",    78,88],
  ["Thunderbird","male","Native American","storm spirit bird",     "powerful, spiritual, fierce",   "native-american,storm,spirit,powerful",80,88],
  ["Huma",     "unisex","Persian",  "lucky bird of paradise",     "auspicious, magical, graceful", "luck,paradise,persian,magical",        79,87],
  ["Bennu",    "male",  "Egyptian", "Egyptian phoenix, rebirth",  "divine, radiant, reborn",       "egyptian,phoenix,divine,rebirth",      78,87],
  ["Alkonost", "female","Slavic",   "bird of paradise, sorrow",   "beautiful, melodious, mystical","slavic,paradise,melodious,mystical",   74,85],
  ["Sirin",    "female","Russian",  "singing bird of paradise",   "enchanting, melodious, divine", "russian,paradise,singing,enchanting",  75,85],
  ["Ziz",      "male",  "Hebrew",   "giant bird of the skies",    "powerful, ancient, legendary",  "hebrew,giant,ancient,legendary",       72,84],
  ["Pegasus",  "male",  "Greek",    "winged divine horse-bird",   "majestic, free, divine",        "greek,winged,divine,mythological",     82,89],
  ["Chamrosh", "unisex","Persian",  "guardian bird of Persia",    "protective, watchful, noble",   "persian,guardian,watchful,noble",      74,84],
  ["Strix",    "unisex","Latin",    "screech owl, omen bird",     "wise, mysterious, nocturnal",   "owl,wise,mysterious,latin",            73,83],
  ["Caladrius", "unisex","Latin",   "healing white bird of omens","healing, pure, divine",         "healing,pure,divine,latin",            73,84],
];

// ── MODIFIER ARRAYS ───────────────────────────────────────────────────────────

const BIRD_PREFIXES = [
  { word: "Sky",     meaning: "sky-high, boundless",   keywords: "sky,high,boundless",   pop: -4, vibe: +3 },
  { word: "Cloud",   meaning: "dreamy, soft",           keywords: "cloud,dreamy,soft",    pop: -5, vibe: +2 },
  { word: "Breeze",  meaning: "gentle, free-flowing",  keywords: "breeze,gentle,free",   pop: -5, vibe: +2 },
  { word: "Song",    meaning: "melodious, musical",     keywords: "song,musical,melody",  pop: -4, vibe: +3 },
  { word: "Melody",  meaning: "sweet melody, musical",  keywords: "melody,sweet,musical", pop: -5, vibe: +3 },
  { word: "Crystal", meaning: "clear, pure, sparkling", keywords: "crystal,pure,clear",   pop: -6, vibe: +3 },
  { word: "Rainbow", meaning: "colorful, vibrant",      keywords: "rainbow,colorful,vivid",pop:-5, vibe: +3 },
  { word: "Whistle", meaning: "musical, whistling",     keywords: "whistle,musical,vocal", pop:-6, vibe: +2 },
  { word: "Soar",    meaning: "high-flying, ambitious", keywords: "soar,flight,high",     pop: -5, vibe: +3 },
  { word: "Dawn",    meaning: "first light, new day",   keywords: "dawn,morning,light",   pop: -5, vibe: +3 },
  { word: "Sunny",   meaning: "bright, warm, cheerful", keywords: "sunny,bright,warm",    pop: -4, vibe: +2 },
  { word: "Coral",   meaning: "warm coral, colorful",   keywords: "coral,warm,colorful",  pop: -6, vibe: +2 },
  { word: "Fern",    meaning: "green, natural",         keywords: "fern,green,natural",   pop: -7, vibe: +1 },
  { word: "Lemon",   meaning: "bright yellow, zesty",   keywords: "lemon,yellow,bright",  pop: -6, vibe: +2 },
  { word: "Pepper",  meaning: "spicy, bold",            keywords: "pepper,spicy,bold",    pop: -6, vibe: +2 },
];

const UNIVERSAL_PREFIXES = [
  { word: "Midnight", meaning: "dark, mysterious night",  keywords: "midnight,dark,night",  pop: -4, vibe: +4 },
  { word: "Copper",   meaning: "warm reddish metal",      keywords: "copper,warm,metal",    pop: -5, vibe: +3 },
  { word: "Crimson",  meaning: "deep red, bold",          keywords: "crimson,red,bold",     pop: -5, vibe: +3 },
  { word: "Golden",   meaning: "golden, shining",         keywords: "golden,shining",       pop: -4, vibe: +2 },
  { word: "Silver",   meaning: "silver, bright",          keywords: "silver,bright",        pop: -5, vibe: +2 },
  { word: "Wild",     meaning: "untamed, free-spirited",  keywords: "wild,untamed,free",    pop: -4, vibe: +3 },
];

const ALL_PREFIXES = [...BIRD_PREFIXES, ...UNIVERSAL_PREFIXES]; // 21 total

// ── GENERATION ────────────────────────────────────────────────────────────────

function generateBirdNames(target = 1500) {
  const slugSet = new Set();
  const results = [];

  function tryAdd(name, gender, origin, meaningShort, personality, keywords, pop, vibe) {
    if (results.length >= target) return;
    const s = slug(name);
    if (slugSet.has(s)) return;
    slugSet.add(s);
    results.push(makeRecord(name, gender, origin, meaningShort, personality, keywords, pop, vibe));
  }

  // Pass 1 — seeds (~90)
  for (const [n, g, o, m, p, k, pop, vibe] of SEEDS) {
    tryAdd(n, g, o, m, p, k, pop, vibe);
  }

  // Pass 2 — prefix + seed (21 × 90 = 1,890 potential → stop at 1,500)
  for (const pfx of ALL_PREFIXES) {
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

const birds = generateBirdNames(1500);
const slugs = birds.map(b => b.slug);
const uniqueSlugs = new Set(slugs);
const indian = birds.filter(e =>
  ['Hindi','Sanskrit','Persian','Marathi'].some(o => e.origin.includes(o))
);

console.log('─'.repeat(50));
console.log(`Total generated : ${birds.length}`);
console.log(`Unique slugs    : ${uniqueSlugs.size}`);
console.log(`Duplicates      : ${birds.length - uniqueSlugs.size}`);
console.log(`Indian-origin   : ${indian.length}`);
console.log('─'.repeat(50));
console.log('First 10:', birds.slice(0, 10).map(b => b.name).join(', '));
console.log('Last  10:', birds.slice(-10).map(b => b.name).join(', '));
console.log('─'.repeat(50));

const outPath = join(__dir, 'bird-names-1500.json');
writeFileSync(outPath, JSON.stringify(birds, null, 2));
console.log(`Saved → scripts/bird-names-1500.json (${(JSON.stringify(birds).length / 1024).toFixed(0)} KB)`);
