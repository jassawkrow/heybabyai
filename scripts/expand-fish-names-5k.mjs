/**
 * Fish name cross-pollinator: 100 seeds × 50 passes = 5,000 exactly.
 * Seeds: 50 original fish + 50 cross-type (dog/cat/bird/rabbit/hamster/turtle)
 * Prefixes: 19 fish-own + 30 new cross-type = 49 total prefix passes
 * Fin/Bubble/Deep/Ocean locked to fish — not leaked to other types.
 * Run: node scripts/expand-fish-names-5k.mjs
 */

import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dir = dirname(fileURLToPath(import.meta.url));

function slug(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-fish';
}

function longDesc(n, o, m, p) {
  return `${n} is a graceful name for a fish with ${o} origins. The name means "${m}". ` +
    `Fish named ${n} glide through the water with ${p} energy, bringing beauty and calm to any aquarium. ` +
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

// ── 50 ORIGINAL FISH SEEDS ────────────────────────────────────────────────────

const FISH_SEEDS = [
  // 36 existing
  ["Bubbles",   "unisex","English",  "air bubbles underwater",        "playful, bubbly, cheerful",         "bubbles,playful,cheerful,water",     92,86],
  ["Goldie",    "female","English",  "golden colored, precious",      "bright, cheerful, warm",            "gold,bright,warm,classic",           90,85],
  ["Splash",    "unisex","English",  "water splashing sound",         "playful, energetic, fun",           "water,playful,energetic,fun",         88,84],
  ["Nemo",      "male",  "Latin",    "nobody, brave little fish",     "brave, adventurous, cheerful",      "disney,brave,adventurous,orange",    95,88],
  ["Dory",      "female","English",  "forgetful blue tang fish",      "friendly, forgetful, cheerful",     "disney,friendly,blue,cheerful",      92,87],
  ["Finn",      "unisex","English",  "fish fin, graceful",            "graceful, swift, agile",            "fin,graceful,swift,agile",            88,85],
  ["Flash",     "unisex","English",  "bright flash of light",         "quick, bright, vivid",              "bright,quick,vivid,light",            85,85],
  ["Ripple",    "unisex","English",  "water ripple, gentle wave",     "gentle, fluid, graceful",           "water,gentle,fluid,graceful",         85,84],
  ["Wave",      "unisex","English",  "ocean wave",                    "fluid, powerful, rhythmic",         "ocean,fluid,rhythmic,powerful",       84,84],
  ["Shimmer",   "unisex","English",  "shimmering light on water",     "sparkling, beautiful, luminous",    "sparkle,beautiful,luminous,water",    86,86],
  ["Glitter",   "unisex","English",  "tiny sparkling particles",      "sparkling, cheerful, colorful",     "sparkle,colorful,cheerful,bright",    83,84],
  ["Dart",      "male",  "English",  "moving swiftly, dart fish",     "swift, agile, quick",               "swift,agile,quick,movement",          82,83],
  ["Coral",     "female","English",  "ocean coral reef",              "colorful, nurturing, beautiful",    "ocean,colorful,reef,beautiful",       87,86],
  ["Pearl",     "female","English",  "precious ocean gem",            "precious, elegant, serene",         "gem,ocean,precious,elegant",          88,86],
  ["Azure",     "unisex","French",   "sky blue color",                "serene, beautiful, blue",           "blue,serene,beautiful,water",         83,84],
  ["Turquoise", "unisex","French",   "blue-green precious stone",     "calm, beautiful, unique",           "blue-green,calm,beautiful,gem",       82,84],
  ["Sapphire",  "female","Greek",    "blue precious gemstone",        "deep, beautiful, precious",         "blue,gem,precious,deep",              83,85],
  ["Aqua",      "unisex","Latin",    "water, aqua color",             "fluid, calm, serene",               "water,calm,serene,blue",              84,83],
  ["Triton",    "male",  "Greek",    "son of Poseidon, merman",       "powerful, fluid, mythological",     "greek,ocean,powerful,mythological",   80,86],
  ["Neptune",   "male",  "Roman",    "god of the sea",                "deep, powerful, mysterious",        "ocean,powerful,roman,mythological",   81,86],
  ["Poseidon",  "male",  "Greek",    "ocean god, earth shaker",       "powerful, commanding, deep",        "greek,ocean,powerful,mythological",   79,87],
  ["Gill",      "unisex","English",  "fish gill, breath of water",    "steady, calm, functional",          "anatomy,calm,water,classic",          80,80],
  ["Zigzag",    "unisex","English",  "zigzag swimming pattern",       "energetic, playful, unpredictable", "zigzag,energetic,playful,movement",   79,82],
  ["Rainbow",   "unisex","English",  "rainbow of colors",             "colorful, joyful, vibrant",         "rainbow,colorful,joyful,vibrant",     85,85],
  ["Marble",    "unisex","English",  "marbled pattern, swirling",     "elegant, patterned, unique",        "pattern,elegant,unique,swirl",        79,82],
  ["Pebble",    "unisex","English",  "smooth river pebble",           "smooth, calm, earthy",              "smooth,calm,earthy,nature",           78,80],
  ["Brook",     "female","English",  "small flowing stream",          "gentle, flowing, serene",           "water,gentle,flowing,serene",         80,82],
  ["Tide",      "unisex","English",  "ocean tide, cyclic flow",       "rhythmic, powerful, cyclic",        "ocean,rhythmic,powerful,cycle",       79,82],
  ["Surf",      "male",  "English",  "surf, ocean waves",             "active, playful, ocean",            "ocean,active,playful,waves",          79,82],
  ["Brine",     "unisex","English",  "salt water of the ocean",       "salty, deep, ocean",                "salt,deep,ocean,classic",             76,79],
  ["Orca",      "unisex","Latin",    "barrel shape, killer whale",    "powerful, intelligent, bold",       "whale,powerful,intelligent,bold",     80,85],
  ["Kelp",      "unisex","English",  "ocean seaweed, marine plant",   "wavy, green, oceanic",              "ocean,plant,green,wavy",              75,78],
  ["Sandy",     "female","English",  "sand colored, sandy",           "gentle, warm, earthy",              "sand,warm,earthy,gentle",             81,80],
  ["Goldfin",   "male",  "English",  "golden finned fish",            "bright, golden, graceful",          "gold,fin,bright,graceful",            78,81],
  ["Bluebell",  "female","English",  "blue bell flower, blue",        "delicate, blue, beautiful",         "blue,flower,delicate,beautiful",      79,82],
  ["Whisker",   "male",  "English",  "catfish whiskers, sensory",     "curious, sensitive, exploratory",   "catfish,curious,sensory,exploratory", 77,79],
  // 8 Indian seeds
  ["Matsya",    "male",  "Sanskrit", "Vishnu's fish avatar, divine",  "sacred, divine, ancient",           "vishnu,divine,sacred,hindu",          80,87],
  ["Rohu",      "unisex","Hindi",    "rohu carp, beloved river fish", "gentle, graceful, beloved",         "carp,river,gentle,hindi",             78,80],
  ["Hilsa",     "female","Bengali",  "prized river herring, regal",   "elegant, prized, regal",            "herring,river,prized,bengali",        79,82],
  ["Jhilmil",   "female","Hindi",    "sparkling, twinkling water",    "sparkling, bright, playful",        "sparkle,bright,water,hindi",          80,83],
  ["Lehar",     "unisex","Hindi",    "wave, flowing ripple",          "fluid, gentle, rhythmic",           "wave,fluid,gentle,hindi",             79,82],
  ["Chanda",    "female","Hindi",    "moon, moonfish, silver",        "serene, beautiful, moonlit",        "moon,silver,serene,hindi",            80,83],
  ["Moti",      "unisex","Hindi",    "pearl, precious gem",           "precious, gentle, luminous",        "pearl,precious,gentle,hindi",         80,83],
  ["Heera",     "female","Hindi",    "diamond, brilliant gem",        "brilliant, precious, bright",       "diamond,brilliant,precious,hindi",    80,84],
  // 6 mythological water seeds
  ["Nereid",    "female","Greek",    "sea nymph, daughter of Nereus", "graceful, mysterious, fluid",       "sea,nymph,graceful,greek",            78,85],
  ["Varuna",    "male",  "Sanskrit", "god of water and cosmic order", "powerful, just, ancient",           "water,cosmic,divine,hindu",           79,86],
  ["Ganga",     "female","Sanskrit", "sacred river, goddess",         "pure, sacred, flowing",             "river,sacred,pure,hindu",             80,86],
  ["Yamuna",    "female","Sanskrit", "sacred river, sister of Yama",  "gentle, pure, sacred",              "river,sacred,gentle,hindu",           79,85],
  ["Leviathan", "male",  "Hebrew",   "great sea monster, vast",       "powerful, ancient, deep",           "sea,ancient,powerful,hebrew",         78,86],
  ["Makara",    "unisex","Sanskrit", "sea creature, Capricorn symbol","ancient, mystical, powerful",       "sea,mythological,ancient,hindu",      78,85],
];

// ── 50 CROSS-TYPE SEEDS (dog/cat/bird/rabbit/hamster/turtle → fish) ───────────

const CROSS_SEEDS = [
  // From dogs (20)
  ["Luna",       "female","Latin",    "moon, luminous",               "gentle, mysterious, beautiful",  "moon,mysterious,beautiful,latin",    88,88],
  ["Stella",     "female","Latin",    "star",                         "radiant, bright, affectionate",  "star,radiant,bright,latin",          87,87],
  ["Nova",       "female","Latin",    "new star, brightness",         "bright, curious, energetic",     "star,bright,modern,space",           86,87],
  ["Phoenix",    "unisex","Greek",    "mythical firebird, rebirth",   "bold, resilient, radiant",       "fire,rebirth,bold,mythological",     85,89],
  ["Storm",      "unisex","English",  "fierce tempest",               "fierce, bold, powerful",         "storm,fierce,bold,nature",           81,85],
  ["Shadow",     "unisex","English",  "dark shadow, mysterious",      "mysterious, dark, elusive",      "shadow,dark,mysterious,elusive",     81,84],
  ["Cosmo",      "male",  "Greek",    "order, cosmos, universe",      "cosmic, curious, bright",        "space,universe,bright,curious",      80,84],
  ["Ember",      "female","English",  "warm glowing ember",           "warm, glowing, fiery",           "warm,glowing,fiery,fire",            82,84],
  ["Misty",      "female","English",  "soft mist, ethereal",          "gentle, ethereal, soft",         "mist,gentle,ethereal,soft",          81,83],
  ["Willow",     "female","English",  "graceful willow tree",         "graceful, gentle, flowing",      "nature,graceful,gentle,flowing",     82,83],
  ["Aurora",     "female","Latin",    "dawn, northern lights",        "radiant, magical, colorful",     "dawn,magical,colorful,space",        87,90],
  ["Maple",      "female","English",  "maple tree, warm sweet",       "sweet, warm, golden",            "nature,sweet,warm,golden",           80,82],
  ["Ginger",     "female","English",  "pungent root, fiery orange",   "bold, spicy, orange",            "spice,bold,orange,warm",             82,83],
  ["Cinnamon",   "female","English",  "warm aromatic spice",          "warm, reddish, comforting",      "spice,warm,reddish,aromatic",        81,82],
  ["Caramel",    "female","French",   "golden toffee sweetness",      "warm, sweet, golden",            "sweet,warm,golden,french",           81,82],
  ["Honey",      "female","English",  "sweet golden nectar",          "sweet, warm, golden",            "sweet,golden,warm,nature",           83,83],
  ["Mochi",      "unisex","Japanese", "sweet rice cake, round",       "soft, sweet, round",             "japanese,sweet,soft,round",          84,86],
  ["Boba",       "unisex","Cantonese","bubble tea pearl, sweet",      "round, sweet, playful",          "bubble-tea,sweet,playful,round",     80,84],
  ["Matcha",     "unisex","Japanese", "powdered green tea",           "calm, earthy, green",            "japanese,tea,calm,green",            80,85],
  ["Blaze",      "unisex","English",  "fiery bright flame",           "fiery, bold, radiant",           "fire,bold,fiery,radiant",            81,84],
  // From cats (10)
  ["Onyx",       "unisex","Greek",    "black gemstone, dark",         "sleek, dark, mysterious",        "gem,dark,sleek,mysterious",          83,86],
  ["Frost",      "unisex","English",  "cool frost, icy sheen",        "cool, crisp, elegant",           "cool,crisp,elegant,icy",             81,84],
  ["Ash",        "unisex","English",  "ash tree, silvery grey",       "calm, gentle, silvery",          "tree,calm,grey,gentle",              78,81],
  ["Iris",       "female","Greek",    "rainbow goddess, colorful",    "colorful, graceful, vibrant",    "rainbow,colorful,graceful,greek",    83,85],
  ["Violet",     "female","Latin",    "purple flower",                "gentle, artistic, colorful",     "flower,purple,artistic,colorful",    83,85],
  ["Snowball",   "unisex","English",  "white snowball, pure",         "pure, white, gentle",            "white,pure,gentle,soft",             82,82],
  ["Oreo",       "unisex","American", "black and white cookie",       "playful, bold, contrasting",     "cookie,black,white,playful",         82,82],
  ["Truffle",    "unisex","French",   "rare earthy mushroom",         "rare, earthy, rich",             "luxury,earthy,rare,rich",            80,83],
  ["Hazel",      "unisex","English",  "hazel nut, warm brown",        "warm, earthy, gentle",           "nut,warm,earthy,brown",              81,82],
  ["Cleo",       "female","Greek",    "glory, fame",                  "regal, independent, bold",       "glory,regal,bold,classic",           85,86],
  // From birds (10)
  ["Cherry",     "female","English",  "cherry fruit, bright red",     "bright, sweet, vibrant",         "fruit,red,bright,sweet",             82,82],
  ["Lemon",      "unisex","English",  "bright lemon, citrus",         "bright, tart, yellow",           "citrus,bright,yellow,tart",          80,80],
  ["Tango",      "unisex","Spanish",  "passionate dance, orange",     "bold, passionate, vibrant",      "dance,bold,orange,vibrant",          81,83],
  ["Rio",        "unisex","Spanish",  "river, tropical, free",        "vibrant, tropical, flowing",     "river,tropical,vibrant,flowing",     85,85],
  ["Skye",       "female","English",  "sky-blue, serene",             "serene, blue, airy",             "sky,blue,serene,airy",               82,83],
  ["Coco",       "unisex","French",   "chocolate, coconut, warm",     "warm, playful, tropical",        "chocolate,warm,playful,tropical",    82,82],
  ["Kiwi",       "unisex","Maori",    "kiwi, green and unique",       "perky, green, unique",           "kiwi,green,unique,perky",            82,82],
  ["Mango",      "unisex","Hindi",    "tropical sweet mango",         "vibrant, tropical, orange",      "tropical,orange,vibrant,fruit",      84,85],
  ["Pippin",     "unisex","English",  "small apple seed, tiny",       "tiny, perky, cheerful",          "small,perky,cheerful,nature",        79,81],
  ["Daisy",      "female","English",  "day's eye flower",             "cheerful, sunny, bright",        "flower,cheerful,sunny,bright",       83,82],
  // From rabbits (5)
  ["Clover",     "unisex","English",  "lucky clover plant",           "lucky, gentle, green",           "lucky,green,gentle,plant",           81,81],
  ["Meadow",     "female","English",  "open grassy meadow",           "peaceful, natural, free",        "nature,peaceful,free,green",         80,81],
  ["Vanilla",    "female","Spanish",  "sweet vanilla flavor",         "sweet, soft, classic",           "sweet,soft,classic,cream",           82,81],
  ["Snowflake",  "female","English",  "white snowflake, pure",        "pure, white, elegant",           "white,pure,elegant,ice",             82,82],
  ["Cotton",     "unisex","English",  "soft white cotton",            "soft, white, gentle",            "soft,white,gentle,cotton",           80,79],
  // From hamsters (2)
  ["Acorn",      "unisex","English",  "small round acorn",            "small, earthy, round",           "small,round,earthy,nature",          79,79],
  ["Pompom",     "unisex","French",   "fluffy round ball",            "round, fluffy, playful",         "round,fluffy,playful,cute",          80,80],
  // From turtles (3)
  ["Zen",        "unisex","Japanese", "meditative, peaceful",         "peaceful, calm, serene",         "peaceful,calm,serene,zen",           81,83],
  ["Serenity",   "female","Latin",    "peaceful, serene",             "serene, calm, gentle",           "serene,calm,gentle,peaceful",        80,82],
  ["Sage",       "unisex","English",  "wise sage, healing herb",      "wise, calm, green",              "wise,calm,herb,green",               81,82],
];

const ALL_SEEDS = [...FISH_SEEDS, ...CROSS_SEEDS]; // 100 total

// ── 19 ORIGINAL FISH PREFIXES (Bubble/Deep/Ocean/Tidal locked to fish) ────────

const FISH_OWN_PREFIXES = [
  { word:"Crystal",  meaning:"clear, pure, sparkling",    keywords:"crystal,pure,sparkling",   pop:-5, vibe:+3 },
  { word:"Marina",   meaning:"of the sea, harbour",       keywords:"marina,sea,harbour",       pop:-5, vibe:+2 },
  { word:"Bubble",   meaning:"light, bubbly, playful",    keywords:"bubble,light,playful",     pop:-5, vibe:+2 },
  { word:"Ocean",    meaning:"vast ocean, deep",          keywords:"ocean,vast,deep",          pop:-4, vibe:+3 },
  { word:"Deep",     meaning:"deep, mysterious, vast",    keywords:"deep,mysterious,vast",     pop:-5, vibe:+3 },
  { word:"Tidal",    meaning:"tidal, rhythmic, flowing",  keywords:"tidal,rhythmic,flowing",   pop:-6, vibe:+2 },
  { word:"Lagoon",   meaning:"calm lagoon, tranquil",     keywords:"lagoon,calm,tranquil",     pop:-6, vibe:+2 },
  { word:"Seafoam",  meaning:"soft seafoam, frothy",      keywords:"seafoam,frothy,soft",      pop:-6, vibe:+2 },
  { word:"Glimmer",  meaning:"glimmering, faint glow",    keywords:"glimmer,glow,light",       pop:-6, vibe:+2 },
  { word:"Dazzle",   meaning:"dazzling, brilliant",       keywords:"dazzle,brilliant,bright",  pop:-5, vibe:+3 },
  { word:"Golden",   meaning:"golden, shining",           keywords:"golden,shining",           pop:-4, vibe:+2 },
  { word:"Silver",   meaning:"silver, bright",            keywords:"silver,bright",            pop:-5, vibe:+2 },
  { word:"Midnight", meaning:"dark, mysterious night",    keywords:"midnight,dark,night",      pop:-4, vibe:+4 },
  { word:"Crimson",  meaning:"deep red, bold",            keywords:"crimson,red,bold",         pop:-5, vibe:+3 },
  { word:"Sky",      meaning:"sky-bright, open",          keywords:"sky,bright,open",          pop:-5, vibe:+2 },
  { word:"Teal",     meaning:"teal, blue-green",          keywords:"teal,blue-green,cool",     pop:-5, vibe:+2 },
  { word:"Wild",     meaning:"untamed, free-spirited",    keywords:"wild,untamed,free",        pop:-4, vibe:+3 },
  { word:"Copper",   meaning:"warm reddish metal",        keywords:"copper,warm,metal",        pop:-5, vibe:+3 },
  { word:"Jade",     meaning:"green jade, precious",      keywords:"jade,green,precious",      pop:-5, vibe:+3 },
];

// ── 30 CROSS-TYPE PREFIXES (from dog-originals + cat-new, filtered for fish) ──

const CROSS_PREFIXES = [
  // 16 from dog's original prefix set (not in fish's own)
  { word:"Shadow",   meaning:"dark, mysterious",          keywords:"shadow,dark",              pop:-6, vibe:+3 },
  { word:"Moon",     meaning:"gentle, moonlit",           keywords:"moon,moonlit,gentle",      pop:-5, vibe:+2 },
  { word:"Sun",      meaning:"warm, radiant",             keywords:"sun,radiant,warm",         pop:-5, vibe:+2 },
  { word:"Frost",    meaning:"cool, icy",                 keywords:"frost,cool,icy",           pop:-7, vibe:+2 },
  { word:"Ember",    meaning:"warm, glowing",             keywords:"ember,glowing,warm",       pop:-7, vibe:+2 },
  { word:"River",    meaning:"flowing, free",             keywords:"river,flowing,free",       pop:-6, vibe:+1 },
  { word:"Cloud",    meaning:"soft, dreamy",              keywords:"cloud,dreamy,soft",        pop:-7, vibe:+1 },
  { word:"Misty",    meaning:"soft, ethereal",            keywords:"misty,ethereal,soft",      pop:-6, vibe:+1 },
  { word:"Marble",   meaning:"elegant, patterned",        keywords:"marble,elegant,pattern",   pop:-6, vibe:+3 },
  { word:"Storm",    meaning:"fierce, powerful",          keywords:"storm,fierce,powerful",    pop:-5, vibe:+3 },
  { word:"Sir",      meaning:"knightly, noble",           keywords:"sir,noble,knight",         pop:-4, vibe:+3 },
  { word:"Lady",     meaning:"noble, graceful",           keywords:"lady,noble,elegant",       pop:-4, vibe:+3 },
  { word:"Captain",  meaning:"leader, bold",              keywords:"captain,leader,bold",      pop:-5, vibe:+3 },
  { word:"Prince",   meaning:"royal, noble heir",         keywords:"prince,royal,noble",       pop:-5, vibe:+4 },
  { word:"Princess", meaning:"royal, graceful",           keywords:"princess,royal,regal",     pop:-5, vibe:+4 },
  { word:"Duke",     meaning:"noble lord",                keywords:"duke,noble,lord",          pop:-5, vibe:+3 },
  // 11 from cat's new prefixes (bird/cat cross-type)
  { word:"Velvet",   meaning:"smooth, velvety",           keywords:"velvet,smooth,soft",       pop:-5, vibe:+3 },
  { word:"Sable",    meaning:"dark, luxurious",           keywords:"sable,dark,luxury",        pop:-6, vibe:+3 },
  { word:"Pearl",    meaning:"precious, luminous",        keywords:"pearl,precious,luminous",  pop:-4, vibe:+3 },
  { word:"Mystic",   meaning:"mystic, magical",           keywords:"mystic,magical,mysterious",pop:-4, vibe:+4 },
  { word:"Lunar",    meaning:"lunar, moon-touched",       keywords:"lunar,moon,mysterious",    pop:-5, vibe:+3 },
  { word:"Twilight", meaning:"twilight, dusk glow",       keywords:"twilight,dusk,glow",       pop:-4, vibe:+4 },
  { word:"Dreamy",   meaning:"dreamy, ethereal",          keywords:"dreamy,ethereal,serene",   pop:-5, vibe:+3 },
  { word:"Royal",    meaning:"royal, regal",              keywords:"royal,regal,noble",        pop:-4, vibe:+4 },
  { word:"Regal",    meaning:"regal, majestic",           keywords:"regal,majestic,dignified", pop:-5, vibe:+4 },
  { word:"Noble",    meaning:"noble, dignified",          keywords:"noble,dignified,proud",    pop:-5, vibe:+3 },
  { word:"Elegant",  meaning:"elegant, refined",          keywords:"elegant,refined,graceful", pop:-5, vibe:+3 },
  // 3 new additions
  { word:"Gentle",   meaning:"gentle, tender",            keywords:"gentle,tender,calm",       pop:-5, vibe:+2 },
  { word:"Sweet",    meaning:"sweet, lovable",            keywords:"sweet,lovable,gentle",     pop:-4, vibe:+2 },
  { word:"Indigo",   meaning:"indigo blue, rich deep",    keywords:"indigo,blue,deep,rich",    pop:-5, vibe:+3 },
];

const ALL_PREFIXES = [...FISH_OWN_PREFIXES, ...CROSS_PREFIXES]; // 49 total

// ── GENERATION — exact math: 100 seeds × 50 passes = 5,000 ──────────────────

function generateFishNames() {
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

const fish = generateFishNames();
const slugs = fish.map(f => f.slug);
const uniqueSlugs = new Set(slugs);

const crossPfxWords = new Set(CROSS_PREFIXES.map(p => p.word));
const crossPfxCombos = fish.filter(e => crossPfxWords.has(e.name.split(' ')[0]));

const crossSeedNames = new Set(CROSS_SEEDS.map(s => s[0]));
const crossSeedCombos = fish.filter(e => crossSeedNames.has(e.name.split(' ').pop()) && e.name.includes(' '));

console.log('─'.repeat(50));
console.log(`Fish seeds      : ${FISH_SEEDS.length}`);
console.log(`Cross-type seeds: ${CROSS_SEEDS.length}`);
console.log(`Total seeds     : ${ALL_SEEDS.length}`);
console.log(`Fish-own pfx    : ${FISH_OWN_PREFIXES.length}`);
console.log(`Cross-type pfx  : ${CROSS_PREFIXES.length}`);
console.log(`Total prefixes  : ${ALL_PREFIXES.length}`);
console.log(`Expected total  : ${ALL_SEEDS.length * (ALL_PREFIXES.length + 1)}`);
console.log(`Total generated : ${fish.length}`);
console.log(`Unique slugs    : ${uniqueSlugs.size}`);
console.log(`Duplicates      : ${fish.length - uniqueSlugs.size}`);
console.log(`Cross-pfx combos: ${crossPfxCombos.length}`);
console.log(`Cross-seed combos:${crossSeedCombos.length}`);
console.log('─'.repeat(50));
console.log('First 10:', fish.slice(0, 10).map(f => f.name).join(', '));
console.log('Last  10:', fish.slice(-10).map(f => f.name).join(', '));
console.log('─'.repeat(50));

const outPath = join(__dir, 'fish-names-5000.json');
writeFileSync(outPath, JSON.stringify(fish, null, 2));
console.log(`Saved → scripts/fish-names-5000.json (${(JSON.stringify(fish).length / 1024).toFixed(0)} KB)`);
