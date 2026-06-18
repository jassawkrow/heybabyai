/**
 * Hamster name cross-pollinator: 100 seeds × 50 passes = 5,000 exactly.
 * Seeds: 50 original hamster + 50 cross-type (dog/cat/bird/fish/rabbit/turtle)
 * Prefixes: 15 hamster-own + 34 cross-type = 49 total prefix passes
 * Fuzzy/Chubby/Tiny locked to hamster — not leaked to other types.
 * Run: node scripts/expand-hamster-names-5k.mjs
 */

import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dir = dirname(fileURLToPath(import.meta.url));

function slug(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-hamster';
}

function longDesc(n, o, m, p) {
  return `${n} is a delightful name for a hamster with ${o} origins. The name means "${m}". ` +
    `Hamsters named ${n} are known for their ${p} nature, scurrying about with boundless energy and curiosity. ` +
    `A perfectly tiny name for a perfectly tiny companion.`;
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

// ── 50 ORIGINAL HAMSTER SEEDS ─────────────────────────────────────────────────

const HAMSTER_SEEDS = [
  // Western food-themed & classic hamster names (35)
  ["Hammy",        "male",  "English", "hamster, the friendly one",           "friendly, energetic, classic",     "hamster,friendly,energetic,classic",    92,84],
  ["Furball",      "unisex","English", "soft furball, round and fluffy",       "fluffy, round, adorable",          "fluffy,round,adorable,fur",              86,83],
  ["Cheeks",       "unisex","English", "chubby cheeks, pouchy",                "chubby, cheerful, pouchy",         "cheeks,chubby,pouchy,cute",              88,84],
  ["Peanut",       "unisex","English", "tiny peanut, earthy small",            "tiny, earthy, cute",               "tiny,earthy,cute,nut",                   90,83],
  ["Nugget",       "unisex","English", "golden nugget, tiny precious",         "tiny, golden, precious",           "tiny,golden,precious,nugget",            88,83],
  ["Waffles",      "unisex","English", "warm sweet waffle, fun",               "warm, sweet, playful",             "warm,sweet,playful,food",                87,83],
  ["Pumpkin",      "unisex","English", "round orange pumpkin",                 "round, orange, cheerful",          "round,orange,cheerful,fall",             86,82],
  ["Butterscotch", "unisex","English", "golden butterscotch candy",            "golden, sweet, rich",              "sweet,golden,rich,butterscotch",         85,82],
  ["Caramel",      "unisex","French",  "golden toffee sweetness",              "warm, sweet, golden",              "sweet,warm,golden,caramel",              84,82],
  ["Cinnamon",     "unisex","English", "warm aromatic spice, reddish",         "warm, spicy, reddish",             "spice,warm,reddish,cinnamon",            84,82],
  ["Ginger",       "unisex","English", "pungent ginger root, earthy",          "bold, warm, earthy",               "spice,bold,earthy,warm",                 85,83],
  ["Hazel",        "unisex","English", "hazel nut, warm brown",                "warm, earthy, gentle",             "hazel,warm,earthy,nut",                  83,81],
  ["Chestnut",     "unisex","English", "brown chestnut, round earthy",         "warm, earthy, round",              "earthy,warm,round,brown",                82,81],
  ["Almond",       "unisex","English", "almond nut, pale and gentle",          "pale, earthy, gentle",             "nut,pale,earthy,gentle",                 80,80],
  ["Pretzel",      "unisex","German",  "twisted pretzel, fun and playful",     "twisted, fun, playful",            "twisted,fun,playful,food",               82,82],
  ["Biscuit",      "unisex","English", "warm baked biscuit, golden",           "warm, round, golden",              "warm,round,golden,baked",                83,81],
  ["Cookie",       "unisex","English", "sweet cookie, cheerful",               "sweet, cheerful, warm",            "sweet,cheerful,warm,cookie",             88,83],
  ["Noodle",       "unisex","English", "wiggly noodle, playful",               "wiggly, playful, funny",           "wiggly,playful,funny,food",              83,82],
  ["Dumpling",     "unisex","Chinese", "round dumpling, cute and warm",        "round, cute, warm",                "round,cute,warm,food",                   84,83],
  ["Pudding",      "unisex","English", "soft sweet pudding",                   "soft, sweet, gentle",              "soft,sweet,gentle,food",                 83,82],
  ["Fudge",        "unisex","English", "rich chocolate fudge",                 "rich, sweet, dark",                "rich,sweet,dark,chocolate",              82,82],
  ["Marshmallow",  "unisex","English", "soft white marshmallow",               "soft, white, fluffy",              "soft,white,fluffy,sweet",                85,83],
  ["Shortcake",    "unisex","English", "sweet shortcake, delicate",            "sweet, soft, delicate",            "sweet,soft,delicate,cake",               81,81],
  ["Crumpet",      "unisex","English", "soft warm crumpet, cozy",              "soft, warm, cozy",                 "soft,warm,cozy,british",                 80,80],
  ["Muffin",       "unisex","English", "sweet baked muffin",                   "sweet, round, warm",               "sweet,round,warm,baked",                 85,82],
  ["Brownie",      "unisex","English", "rich chocolate brownie",               "rich, dark, sweet",                "rich,dark,sweet,chocolate",              83,82],
  ["Bonbon",       "unisex","French",  "sweet bonbon candy, tiny",             "sweet, small, playful",            "sweet,small,playful,french",             81,81],
  ["Sprinkle",     "unisex","English", "colorful sprinkles, fun",              "colorful, cheerful, fun",          "colorful,cheerful,fun,sweet",            82,82],
  ["Churro",       "unisex","Spanish", "sweet fried churro, warm",             "sweet, warm, crunchy",             "sweet,warm,crunchy,spanish",             82,82],
  ["Macaron",      "unisex","French",  "delicate French macaron, colorful",    "delicate, sweet, colorful",        "delicate,sweet,colorful,french",         82,83],
  ["Roly",         "unisex","English", "roly-poly, round and rolling",         "round, rolling, playful",          "round,rolling,playful,cute",             82,82],
  ["Wobble",       "unisex","English", "wobbly, round and adorable",           "wobbly, round, adorable",          "wobbly,round,adorable,playful",          80,81],
  ["Tumble",       "unisex","English", "tumbling, playful and energetic",      "playful, tumbling, energetic",     "playful,tumbling,energetic,fun",         80,81],
  ["Twitchy",      "unisex","English", "twitchy nose, curious and alert",      "curious, twitchy, alert",          "curious,twitchy,alert,cute",             80,81],
  ["Wheel",        "unisex","English", "spinning wheel, energetic",            "energetic, spinning, active",      "wheel,energetic,active,spinning",        79,80],
  // Indian hamster names (10)
  ["Golu",         "unisex","Hindi",   "chubby dear little round one",         "chubby, round, beloved",           "chubby,round,beloved,hindi",             82,82],
  ["Guddu",        "unisex","Hindi",   "dear little one, beloved",             "dear, little, beloved",            "dear,little,beloved,hindi",              80,81],
  ["Pintoo",       "unisex","Hindi",   "small dear one, tiny",                 "small, dear, gentle",              "small,dear,gentle,hindi",                79,80],
  ["Chotu",        "male",  "Hindi",   "small one, tiny little",               "small, tiny, playful",             "small,tiny,playful,hindi",               80,80],
  ["Motu",         "male",  "Hindi",   "chubby, round and plump",              "chubby, plump, playful",           "chubby,plump,playful,hindi",             80,80],
  ["Ladoo",        "unisex","Hindi",   "sweet round ball, beloved",            "sweet, round, beloved",            "sweet,round,beloved,hindi",              82,82],
  ["Halwa",        "unisex","Hindi",   "sweet pudding, soft and warm",         "sweet, soft, gentle",              "sweet,soft,gentle,hindi",                79,80],
  ["Mithu",        "unisex","Hindi",   "sweet one, dear and gentle",           "sweet, gentle, dear",              "sweet,gentle,dear,hindi",                80,81],
  ["Bablu",        "unisex","Hindi",   "dear small baby, cherished",           "tiny, cherished, playful",         "tiny,cherished,playful,hindi",           79,80],
  ["Tilu",         "unisex","Hindi",   "sesame seed, tiny and earthy",         "tiny, earthy, gentle",             "tiny,earthy,gentle,hindi",               77,79],
  // Unique/character hamster names (5)
  ["Pipsqueak",    "unisex","English", "tiny squeaky one, adorable",           "tiny, squeaky, adorable",          "tiny,squeaky,adorable,small",            82,82],
  ["Rascal",       "unisex","English", "playful little rascal, mischievous",   "mischievous, playful, bold",       "mischievous,playful,bold,fun",           81,82],
  ["Scamper",      "unisex","English", "scampering about, quick and playful",  "quick, energetic, playful",        "quick,energetic,playful,scamper",        80,81],
  ["Freckle",      "unisex","English", "small freckle, spotted and cute",      "spotted, tiny, cute",              "spotted,tiny,cute,freckle",              79,80],
  ["Pebble",       "unisex","English", "smooth round pebble, earthy",          "smooth, round, earthy",            "smooth,round,earthy,calm",               79,79],
];

// ── 50 CROSS-TYPE SEEDS (dog/cat/bird/fish/rabbit/turtle → hamster) ──────────

const CROSS_SEEDS = [
  // From dogs (10)
  ["Luna",       "female","Latin",      "moon, luminous",                     "gentle, mysterious, beautiful",  "moon,mysterious,beautiful,latin",    88,88],
  ["Stella",     "female","Latin",      "star, radiant",                      "radiant, bright, affectionate",  "star,radiant,bright,latin",          87,87],
  ["Nova",       "female","Latin",      "new star, brightness",               "bright, curious, energetic",     "star,bright,modern,space",           86,87],
  ["Ember",      "female","English",    "warm glowing ember",                 "warm, glowing, fiery",           "warm,glowing,fiery,fire",            82,84],
  ["Misty",      "female","English",    "soft mist, ethereal",                "gentle, ethereal, soft",         "mist,gentle,ethereal,soft",          81,83],
  ["Aurora",     "female","Latin",      "dawn, northern lights",              "radiant, magical, colorful",     "dawn,magical,colorful,space",        87,90],
  ["Mochi",      "unisex","Japanese",   "sweet rice cake, round",             "soft, sweet, round",             "japanese,sweet,soft,round",          84,86],
  ["Matcha",     "unisex","Japanese",   "powdered green tea",                 "calm, earthy, green",            "japanese,tea,calm,green",            80,85],
  ["Maple",      "female","English",    "maple tree, sweet golden",           "sweet, warm, golden",            "nature,sweet,warm,golden",           82,82],
  ["Nala",       "female","African",    "successful, beloved",                "beloved, gentle, strong",        "african,beloved,gentle,strong",      85,84],
  // From cats (10)
  ["Onyx",       "unisex","Greek",      "black gemstone, dark",               "sleek, dark, mysterious",        "gem,dark,sleek,mysterious",          83,86],
  ["Frost",      "unisex","English",    "cool frost, icy sheen",              "cool, crisp, elegant",           "cool,crisp,elegant,icy",             81,84],
  ["Ash",        "unisex","English",    "ash tree, silvery grey",             "calm, gentle, silvery",          "tree,calm,grey,gentle",              78,81],
  ["Iris",       "female","Greek",      "rainbow goddess, colorful",          "colorful, graceful, vibrant",    "rainbow,colorful,graceful,greek",    83,85],
  ["Truffle",    "unisex","French",     "rare earthy mushroom",               "rare, earthy, rich",             "luxury,earthy,rare,rich",            80,83],
  ["Cleo",       "female","Greek",      "glory, fame",                        "regal, independent, bold",       "glory,regal,bold,classic",           85,86],
  ["Marble",     "unisex","English",    "marbled pattern, elegant",           "elegant, patterned, unique",     "marble,elegant,pattern,unique",      80,83],
  ["Pearl",      "female","English",    "precious gem, luminous",             "precious, elegant, serene",      "gem,precious,elegant,serene",        88,86],
  ["Velvet",     "female","French",     "smooth, velvety, luxurious",         "smooth, elegant, luxurious",     "velvet,smooth,elegant,luxury",       83,85],
  ["Midnight",   "unisex","English",    "dark midnight, mysterious",          "mysterious, dark, deep",         "midnight,dark,mysterious,night",     83,86],
  // From birds (10)
  ["Skye",       "female","English",    "sky-blue, open and free",            "serene, blue, airy",             "sky,blue,serene,airy",               82,83],
  ["Kiwi",       "unisex","Maori",      "kiwi, green and unique",             "perky, green, unique",           "kiwi,green,unique,perky",            82,82],
  ["Mango",      "unisex","Hindi",      "tropical sweet mango",               "vibrant, tropical, orange",      "tropical,orange,vibrant,fruit",      84,85],
  ["Tango",      "unisex","Spanish",    "passionate dance, orange",           "bold, passionate, vibrant",      "dance,bold,orange,vibrant",          81,83],
  ["Samba",      "unisex","Portuguese", "lively Brazilian dance",             "lively, vibrant, joyful",        "dance,lively,vibrant,joyful",        80,83],
  ["Peaches",    "female","English",    "sweet peach, soft and warm",         "sweet, soft, warm",              "sweet,soft,warm,peach",              83,83],
  ["Lemon",      "unisex","English",    "bright lemon, citrus",               "bright, tart, cheerful",         "citrus,bright,cheerful,yellow",      80,80],
  ["Robin",      "unisex","English",    "red-breasted robin, cheerful",       "cheerful, friendly, bright",     "bird,cheerful,friendly,classic",     82,82],
  ["Goldie",     "female","English",    "golden colored, bright",             "bright, warm, cheerful",         "gold,bright,warm,cheerful",          84,83],
  ["Cosmo",      "male",  "Greek",      "cosmos, universe, order",            "cosmic, curious, bright",        "space,universe,bright,curious",      80,84],
  // From fish (5)
  ["Bubbles",    "unisex","English",    "playful air bubbles",                "playful, bubbly, cheerful",      "bubbles,playful,cheerful,light",     82,82],
  ["Shimmer",    "unisex","English",    "shimmering light",                   "sparkling, luminous, beautiful", "sparkle,luminous,beautiful,light",   83,84],
  ["Coral",      "female","English",    "ocean coral, colorful",              "colorful, nurturing, beautiful", "ocean,colorful,beautiful,reef",      83,83],
  ["Rainbow",    "unisex","English",    "rainbow of colors",                  "colorful, joyful, vibrant",      "rainbow,colorful,joyful,vibrant",    83,83],
  ["Glitter",    "unisex","English",    "tiny sparkling glitter",             "sparkling, cheerful, bright",    "sparkle,cheerful,bright,colorful",   80,82],
  // From rabbit (5)
  ["Clover",     "unisex","English",    "lucky clover plant, green",          "lucky, gentle, green",           "lucky,green,gentle,nature",          81,81],
  ["Meadow",     "female","English",    "open peaceful meadow",               "peaceful, natural, free",        "nature,peaceful,free,meadow",        80,81],
  ["Vanilla",    "female","Spanish",    "sweet vanilla cream",                "sweet, soft, classic",           "sweet,soft,classic,cream",           82,81],
  ["Honey",      "female","English",    "sweet golden nectar",                "sweet, gentle, warm",            "sweet,gentle,warm,honey",            84,83],
  ["Poppy",      "female","English",    "vibrant poppy flower",               "vibrant, bright, cheerful",      "flower,vibrant,bright,poppy",        83,83],
  // From turtles (5)
  ["Darwin",     "male",  "English",    "dear friend, naturalist",            "curious, wise, scientific",      "science,curious,wise,nature",        80,82],
  ["Zen",        "unisex","Japanese",   "meditative, peaceful",               "peaceful, calm, serene",         "peaceful,calm,serene,zen",           81,83],
  ["Serenity",   "female","Latin",      "peaceful, serene",                   "serene, calm, gentle",           "serene,calm,gentle,peaceful",        80,82],
  ["Einstein",   "male",  "German",     "genius, one stone",                  "clever, curious, genius",        "genius,clever,curious,science",      81,83],
  ["Aristotle",  "male",  "Greek",      "philosopher, best purpose",          "wise, thoughtful, philosophical","philosophy,wise,thoughtful,greek",   79,82],
  // Additional 5 (from various types)
  ["Daisy",      "female","English",    "day's eye flower, cheerful",         "cheerful, sunny, bright",        "flower,cheerful,sunny,bright",       83,82],
  ["Willow",     "female","English",    "graceful willow tree",               "graceful, gentle, flowing",      "nature,graceful,gentle,tree",        83,83],
  ["Cotton",     "unisex","English",    "soft white cotton",                  "soft, white, pure",              "cotton,white,soft,pure",             83,82],
  ["Sage",       "unisex","English",    "wise sage, healing herb",            "calm, wise, herbal",             "herb,calm,wise,green",               81,82],
  ["Acorn",      "unisex","English",    "small round acorn",                  "small, earthy, round",           "small,round,earthy,nature",          79,79],
];

const ALL_SEEDS = [...HAMSTER_SEEDS, ...CROSS_SEEDS]; // 100 total

// ── 15 HAMSTER-OWN PREFIXES (Fuzzy/Chubby/Tiny locked to hamster) ────────────

const HAMSTER_OWN_PREFIXES = [
  { word:"Fuzzy",     meaning:"fuzzy, soft and fuzzy",          keywords:"fuzzy,soft,gentle",          pop:-4, vibe:+2 },
  { word:"Chubby",    meaning:"chubby, plump and round",        keywords:"chubby,plump,round",         pop:-4, vibe:+2 },
  { word:"Tiny",      meaning:"tiny, small and cute",           keywords:"tiny,small,cute",            pop:-4, vibe:+2 },
  { word:"Round",     meaning:"round, plump and cute",          keywords:"round,plump,cute",           pop:-5, vibe:+2 },
  { word:"Pudgy",     meaning:"pudgy, adorably plump",          keywords:"pudgy,plump,adorable",       pop:-6, vibe:+2 },
  { word:"Squeak",    meaning:"squeaky, tiny and cute",         keywords:"squeak,tiny,cute",           pop:-5, vibe:+2 },
  { word:"Fluffy",    meaning:"soft and fluffy",                keywords:"fluffy,soft,gentle",         pop:-4, vibe:+2 },
  { word:"Pouchy",    meaning:"pouchy cheeks, charming",        keywords:"pouchy,cheeks,charming",     pop:-6, vibe:+2 },
  { word:"Burrow",    meaning:"burrowing, earthy and curious",  keywords:"burrow,earthy,curious",      pop:-6, vibe:+1 },
  { word:"Mini",      meaning:"mini, tiny and adorable",        keywords:"mini,tiny,adorable",         pop:-5, vibe:+2 },
  { word:"Teeny",     meaning:"teeny, very small and cute",     keywords:"teeny,tiny,small",           pop:-5, vibe:+2 },
  { word:"Snuggly",   meaning:"snuggly, warm and cozy",         keywords:"snuggly,warm,cozy",          pop:-5, vibe:+2 },
  { word:"Cuddly",    meaning:"cuddly, adorable and warm",      keywords:"cuddly,adorable,warm",       pop:-4, vibe:+2 },
  { word:"Whiskered", meaning:"whiskered, curious and alert",   keywords:"whiskered,curious,alert",    pop:-6, vibe:+2 },
  { word:"Nibble",    meaning:"small nibbles, curious",         keywords:"nibble,curious,small",       pop:-5, vibe:+2 },
];

// ── 34 CROSS-TYPE PREFIXES (dog/cat originals, filtered for hamsters) ─────────

const CROSS_PREFIXES = [
  // 24 from dog's original prefix set
  { word:"Golden",   meaning:"golden, shining",            keywords:"golden,shining,bright",     pop:-4, vibe:+2 },
  { word:"Silver",   meaning:"silver, bright metallic",    keywords:"silver,bright,metallic",    pop:-5, vibe:+2 },
  { word:"Shadow",   meaning:"dark, mysterious",           keywords:"shadow,dark,mysterious",    pop:-6, vibe:+3 },
  { word:"Storm",    meaning:"fierce, powerful",           keywords:"storm,fierce,powerful",     pop:-5, vibe:+3 },
  { word:"River",    meaning:"flowing, free",              keywords:"river,flowing,free",        pop:-6, vibe:+1 },
  { word:"Cloud",    meaning:"soft, dreamy",               keywords:"cloud,dreamy,soft",         pop:-7, vibe:+1 },
  { word:"Moon",     meaning:"gentle, moonlit",            keywords:"moon,moonlit,gentle",       pop:-5, vibe:+2 },
  { word:"Sun",      meaning:"warm, radiant",              keywords:"sun,radiant,warm",          pop:-5, vibe:+2 },
  { word:"Blaze",    meaning:"fiery, bold, radiant",       keywords:"blaze,fiery,bold,radiant",  pop:-5, vibe:+3 },
  { word:"Rusty",    meaning:"rusty, warm, earthy",        keywords:"rusty,warm,earthy",         pop:-6, vibe:+2 },
  { word:"Sandy",    meaning:"sandy, warm, earthy",        keywords:"sandy,warm,earthy",         pop:-5, vibe:+1 },
  { word:"Rocky",    meaning:"rocky, steady, strong",      keywords:"rocky,steady,strong",       pop:-5, vibe:+2 },
  { word:"Wild",     meaning:"untamed, free-spirited",     keywords:"wild,untamed,free",         pop:-4, vibe:+3 },
  { word:"Sir",      meaning:"knightly, noble",            keywords:"sir,noble,knight",          pop:-4, vibe:+3 },
  { word:"Lady",     meaning:"noble, graceful",            keywords:"lady,noble,elegant",        pop:-4, vibe:+3 },
  { word:"Captain",  meaning:"leader, bold",               keywords:"captain,leader,bold",       pop:-5, vibe:+3 },
  { word:"Prince",   meaning:"royal, noble heir",          keywords:"prince,royal,noble",        pop:-5, vibe:+4 },
  { word:"Princess", meaning:"royal, graceful",            keywords:"princess,royal,regal",      pop:-5, vibe:+4 },
  { word:"Duke",     meaning:"noble lord",                 keywords:"duke,noble,lord",           pop:-5, vibe:+3 },
  { word:"Major",    meaning:"important, bold",            keywords:"major,important,bold",      pop:-6, vibe:+2 },
  { word:"Baron",    meaning:"noble baron",                keywords:"baron,noble,lord",          pop:-6, vibe:+3 },
  { word:"King",     meaning:"regal, commanding",          keywords:"king,regal,commanding",     pop:-5, vibe:+4 },
  { word:"Queen",    meaning:"regal, majestic",            keywords:"queen,regal,majestic",      pop:-5, vibe:+4 },
  { word:"Lord",     meaning:"noble, commanding",          keywords:"lord,noble,commanding",     pop:-5, vibe:+3 },
  // 10 from cat's new prefix set
  { word:"Dreamy",   meaning:"dreamy, ethereal",           keywords:"dreamy,ethereal,serene",    pop:-5, vibe:+3 },
  { word:"Mystic",   meaning:"mystic, magical",            keywords:"mystic,magical,mysterious", pop:-4, vibe:+4 },
  { word:"Lunar",    meaning:"lunar, moon-touched",        keywords:"lunar,moon,mysterious",     pop:-5, vibe:+3 },
  { word:"Whisper",  meaning:"soft whisper, gentle",       keywords:"whisper,gentle,soft",       pop:-5, vibe:+3 },
  { word:"Twilight", meaning:"twilight, dusk glow",        keywords:"twilight,dusk,glow",        pop:-4, vibe:+4 },
  { word:"Dusk",     meaning:"dusk, evening glow",         keywords:"dusk,evening,glow",         pop:-5, vibe:+3 },
  { word:"Royal",    meaning:"royal, regal",               keywords:"royal,regal,noble",         pop:-4, vibe:+4 },
  { word:"Regal",    meaning:"regal, majestic",            keywords:"regal,majestic,dignified",  pop:-5, vibe:+4 },
  { word:"Noble",    meaning:"noble, dignified",           keywords:"noble,dignified,proud",     pop:-5, vibe:+3 },
  { word:"Elegant",  meaning:"elegant, refined",           keywords:"elegant,refined,graceful",  pop:-5, vibe:+3 },
];

const ALL_PREFIXES = [...HAMSTER_OWN_PREFIXES, ...CROSS_PREFIXES]; // 49 total

// ── GENERATION — exact math: 100 seeds × 50 passes = 5,000 ─────────────────

function generateHamsterNames() {
  const slugSet = new Set();
  const results = [];

  function tryAdd(name, gender, origin, meaningShort, personality, keywords, pop, vibe) {
    const s = slug(name);
    if (slugSet.has(s)) return;
    slugSet.add(s);
    results.push(makeRecord(name, gender, origin, meaningShort, personality, keywords, pop, vibe));
  }

  for (const [n, g, o, m, p, k, pop, vibe] of ALL_SEEDS) {
    tryAdd(n, g, o, m, p, k, pop, vibe);
  }

  for (const pfx of ALL_PREFIXES) {
    for (const [n, g, o, m, p, k, pop, vibe] of ALL_SEEDS) {
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

const crossPfxWords = new Set(CROSS_PREFIXES.map(p => p.word));
const crossPfxCombos = hamsters.filter(e => crossPfxWords.has(e.name.split(' ')[0]));

const crossSeedNames = new Set(CROSS_SEEDS.map(s => s[0]));
const crossSeedCombos = hamsters.filter(e =>
  e.name.includes(' ') && crossSeedNames.has(e.name.split(' ').slice(1).join(' '))
);

console.log('─'.repeat(50));
console.log(`Hamster seeds   : ${HAMSTER_SEEDS.length}`);
console.log(`Cross-type seeds: ${CROSS_SEEDS.length}`);
console.log(`Total seeds     : ${ALL_SEEDS.length}`);
console.log(`Hamster-own pfx : ${HAMSTER_OWN_PREFIXES.length}`);
console.log(`Cross-type pfx  : ${CROSS_PREFIXES.length}`);
console.log(`Total prefixes  : ${ALL_PREFIXES.length}`);
console.log(`Expected total  : ${ALL_SEEDS.length * (ALL_PREFIXES.length + 1)}`);
console.log(`Total generated : ${hamsters.length}`);
console.log(`Unique slugs    : ${uniqueSlugs.size}`);
console.log(`Duplicates      : ${hamsters.length - uniqueSlugs.size}`);
console.log(`Cross-pfx combos: ${crossPfxCombos.length}`);
console.log(`Cross-seed combos:${crossSeedCombos.length}`);
console.log('─'.repeat(50));
console.log('First 10:', hamsters.slice(0, 10).map(h => h.name).join(', '));
console.log('Last  10:', hamsters.slice(-10).map(h => h.name).join(', '));
console.log('─'.repeat(50));

const outPath = join(__dir, 'hamster-names-5000.json');
writeFileSync(outPath, JSON.stringify(hamsters, null, 2));
console.log(`Saved → scripts/hamster-names-5000.json (${(JSON.stringify(hamsters).length / 1024).toFixed(0)} KB)`);
