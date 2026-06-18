/**
 * Rabbit name cross-pollinator: 90 seeds × 50 passes = 4,500 exactly.
 * Seeds: 45 original rabbit + 45 cross-type (dog/cat/bird/fish/hamster/turtle)
 * Prefixes: 15 rabbit-own + 34 cross-type = 49 total prefix passes
 * Cotton/Hop locked to rabbit — not leaked to other types.
 * Run: node scripts/expand-rabbit-names-4500.mjs
 */

import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dir = dirname(fileURLToPath(import.meta.url));

function slug(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-rabbit';
}

function longDesc(n, o, m, p) {
  return `${n} is a charming name for a rabbit with ${o} origins. The name means "${m}". ` +
    `Rabbits named ${n} are known for their ${p} nature, hopping through life with grace and curiosity. ` +
    `A delightful name for a gentle, soft-eared companion.`;
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

// ── 45 ORIGINAL RABBIT SEEDS ─────────────────────────────────────────────────

const RABBIT_SEEDS = [
  // Western classics
  ["Bunny",        "female","English",  "little rabbit, cute and gentle",    "gentle, fluffy, adorable",         "bunny,gentle,fluffy,classic",            90,84],
  ["Flopsy",       "female","English",  "floppy eared, soft and gentle",     "gentle, floppy, soft",             "floppy,gentle,soft,beatrix",             87,83],
  ["Mopsy",        "female","English",  "mop-like, fluffy and gentle",       "fluffy, gentle, classic",          "fluffy,gentle,classic,beatrix",           86,82],
  ["Peter",        "male",  "Greek",    "steadfast rock, adventurous",       "adventurous, bold, mischievous",   "adventurous,bold,mischievous,beatrix",    89,84],
  ["Cottontail",   "unisex","English",  "white cotton tail, classic",        "fluffy, white, classic",           "cotton,white,fluffy,classic",             87,83],
  ["Thumper",      "male",  "English",  "thumping foot, bold and friendly",  "bold, friendly, energetic",        "disney,bold,energetic,friendly",          88,84],
  ["Hazel",        "unisex","English",  "hazel nut, warm brown",             "warm, earthy, gentle",             "hazel,warm,earthy,nut",                   83,82],
  ["Snowball",     "unisex","English",  "white as snow, pure",               "pure, white, fluffy",              "white,pure,fluffy,snow",                  84,83],
  ["Oreo",         "unisex","American", "black and white, playful",          "playful, bold, contrasting",       "black,white,playful,cookie",              85,82],
  ["Biscuit",      "unisex","English",  "warm baked biscuit, golden",        "warm, round, golden",              "warm,golden,baked,cozy",                  82,80],
  ["Daisy",        "female","English",  "day's eye flower, cheerful",        "cheerful, sunny, bright",          "flower,cheerful,sunny,bright",            83,82],
  ["Clover",       "unisex","English",  "lucky clover plant, green",         "lucky, gentle, green",             "lucky,green,gentle,nature",               83,82],
  ["Meadow",       "female","English",  "open peaceful meadow",              "peaceful, natural, free",          "nature,peaceful,free,meadow",             81,81],
  ["Vanilla",      "female","Spanish",  "sweet vanilla cream",               "sweet, soft, classic",             "sweet,soft,classic,cream",                82,81],
  ["Caramel",      "female","French",   "golden toffee sweetness",           "warm, sweet, golden",              "sweet,warm,golden,caramel",               82,81],
  ["Cinnamon",     "female","English",  "warm aromatic spice",               "warm, spicy, reddish",             "spice,warm,reddish,cinnamon",             82,82],
  ["Ginger",       "female","English",  "pungent ginger root, earthy",       "bold, spicy, earthy",              "spice,bold,earthy,warm",                  83,82],
  ["Honey",        "female","English",  "sweet golden nectar",               "sweet, gentle, warm",              "sweet,gentle,warm,honey",                 84,83],
  ["Cocoa",        "unisex","Spanish",  "chocolate, warm brown",             "warm, comforting, rich",           "chocolate,warm,rich,brown",               82,82],
  ["Nutmeg",       "unisex","English",  "nutmeg spice, earthy warm",         "warm, earthy, spice",              "spice,warm,earthy,brown",                 80,80],
  ["Pepper",       "unisex","English",  "bold spice, peppery",               "bold, spicy, playful",             "spice,bold,playful,earthy",               80,80],
  ["Rosie",        "female","English",  "rose, blooming beauty",             "gentle, blooming, rosy",           "rose,gentle,blooming,pink",               83,82],
  ["Bella",        "female","Italian",  "beautiful, gorgeous",               "beautiful, gentle, classic",       "beautiful,gentle,classic,italian",        88,84],
  ["Willow",       "female","English",  "graceful willow tree",              "graceful, gentle, flowing",        "nature,graceful,gentle,tree",             83,83],
  ["Ivy",          "female","English",  "climbing ivy plant",                "resilient, green, climbing",       "ivy,green,resilient,nature",              82,82],
  ["Maple",        "female","English",  "maple tree, sweet golden",          "sweet, warm, golden",              "nature,sweet,warm,golden",                82,82],
  ["Poppy",        "female","English",  "vibrant poppy flower",              "vibrant, bright, cheerful",        "flower,vibrant,bright,poppy",             83,83],
  ["Primrose",     "female","English",  "first rose, spring flower",         "delicate, spring, fresh",          "flower,spring,delicate,fresh",            80,81],
  ["Violet",       "female","Latin",    "purple flower, colorful",           "gentle, artistic, colorful",       "flower,purple,artistic,colorful",         82,82],
  ["Lavender",     "female","Latin",    "lavender flower, calm",             "calm, gentle, purple",             "flower,calm,purple,lavender",             82,83],
  ["Sage",         "unisex","English",  "wise sage, healing herb",           "calm, wise, herbal",               "herb,calm,wise,green",                    81,82],
  ["Pebble",       "unisex","English",  "smooth river pebble",               "smooth, calm, earthy",             "smooth,round,earthy,calm",                79,79],
  ["Fluffy",       "unisex","English",  "soft and fluffy",                   "fluffy, soft, adorable",           "fluffy,soft,adorable,gentle",             84,82],
  ["Puff",         "unisex","English",  "soft puff of air",                  "soft, gentle, light",              "soft,gentle,light,airy",                  82,81],
  ["Cotton",       "unisex","English",  "soft white cotton",                 "soft, white, pure",                "cotton,white,soft,pure",                  83,82],
  ["Toffee",       "unisex","English",  "sweet toffee candy",                "sweet, warm, chewy",               "sweet,warm,chewy,candy",                  81,81],
  ["Butterscotch", "unisex","English",  "golden butterscotch",               "golden, sweet, rich",              "sweet,golden,rich,butterscotch",          81,81],
  ["Nibbles",      "unisex","English",  "tiny nibbles, curious",             "curious, tiny, gentle",            "tiny,curious,gentle,cute",                82,81],
  ["Pip",          "unisex","English",  "small pip, tiny seed",              "tiny, perky, cheerful",            "tiny,perky,cheerful,cute",                80,80],
  ["Binky",        "unisex","English",  "binkying jump, pure joy",           "joyful, energetic, happy",         "bunny,joyful,happy,energetic",            82,83],
  ["Dusty",        "unisex","English",  "dusty earth, muted warm",           "earthy, calm, gentle",             "earthy,calm,gentle,muted",                78,79],
  ["Foggy",        "unisex","English",  "misty fog, dreamy",                 "gentle, dreamy, misty",            "foggy,dreamy,gentle,misty",               77,79],
  // Indian seeds
  ["Shashi",       "unisex","Sanskrit", "hare-marked moon, lunar",           "lunar, gentle, moon-marked",       "moon,lunar,gentle,sanskrit",              80,83],
  ["Khargosh",     "unisex","Hindi",    "rabbit in Hindi, the gentle one",   "soft, gentle, patient",            "rabbit,gentle,soft,hindi",                78,80],
  ["Laali",        "female","Hindi",    "beloved, dear one, cherished",      "beloved, gentle, warm",            "beloved,gentle,warm,hindi",               79,80],
];

// ── 45 CROSS-TYPE SEEDS (dog/cat/bird/fish/hamster/turtle → rabbit) ──────────

const CROSS_SEEDS = [
  // From dogs (10)
  ["Luna",       "female","Latin",    "moon, luminous",                    "gentle, mysterious, beautiful",  "moon,mysterious,beautiful,latin",    88,88],
  ["Stella",     "female","Latin",    "star, radiant",                     "radiant, bright, affectionate",  "star,radiant,bright,latin",          87,87],
  ["Nova",       "female","Latin",    "new star, brightness",              "bright, curious, energetic",     "star,bright,modern,space",           86,87],
  ["Ember",      "female","English",  "warm glowing ember",                "warm, glowing, fiery",           "warm,glowing,fiery,fire",            82,84],
  ["Misty",      "female","English",  "soft mist, ethereal",               "gentle, ethereal, soft",         "mist,gentle,ethereal,soft",          81,83],
  ["Aurora",     "female","Latin",    "dawn, northern lights",             "radiant, magical, colorful",     "dawn,magical,colorful,space",        87,90],
  ["Mochi",      "unisex","Japanese", "sweet rice cake, round",            "soft, sweet, round",             "japanese,sweet,soft,round",          84,86],
  ["Matcha",     "unisex","Japanese", "powdered green tea",                "calm, earthy, green",            "japanese,tea,calm,green",            80,85],
  ["Cookie",     "female","English",  "sweet cookie, cheerful",            "sweet, cheerful, warm",          "sweet,cheerful,warm,cookie",         83,82],
  ["Nala",       "female","African",  "successful, beloved",               "beloved, gentle, strong",        "african,beloved,gentle,strong",      85,84],
  // From cats (10)
  ["Onyx",       "unisex","Greek",    "black gemstone, dark",              "sleek, dark, mysterious",        "gem,dark,sleek,mysterious",          83,86],
  ["Frost",      "unisex","English",  "cool frost, icy sheen",             "cool, crisp, elegant",           "cool,crisp,elegant,icy",             81,84],
  ["Ash",        "unisex","English",  "ash tree, silvery grey",            "calm, gentle, silvery",          "tree,calm,grey,gentle",              78,81],
  ["Iris",       "female","Greek",    "rainbow goddess, colorful",         "colorful, graceful, vibrant",    "rainbow,colorful,graceful,greek",    83,85],
  ["Truffle",    "unisex","French",   "rare earthy mushroom",              "rare, earthy, rich",             "luxury,earthy,rare,rich",            80,83],
  ["Cleo",       "female","Greek",    "glory, fame",                       "regal, independent, bold",       "glory,regal,bold,classic",           85,86],
  ["Marble",     "unisex","English",  "marbled pattern, elegant",          "elegant, patterned, unique",     "marble,elegant,pattern,unique",      80,83],
  ["Pearl",      "female","English",  "precious gem, luminous",            "precious, elegant, serene",      "gem,precious,elegant,serene",        88,86],
  ["Velvet",     "female","French",   "smooth, velvety, luxurious",        "smooth, elegant, luxurious",     "velvet,smooth,elegant,luxury",       83,85],
  ["Midnight",   "unisex","English",  "dark midnight, mysterious",         "mysterious, dark, deep",         "midnight,dark,mysterious,night",     83,86],
  // From birds (10)
  ["Skye",       "female","English",  "sky-blue, open and free",           "serene, blue, airy",             "sky,blue,serene,airy",               82,83],
  ["Kiwi",       "unisex","Maori",    "kiwi, green and unique",            "perky, green, unique",           "kiwi,green,unique,perky",            82,82],
  ["Mango",      "unisex","Hindi",    "tropical sweet mango",              "vibrant, tropical, orange",      "tropical,orange,vibrant,fruit",      84,85],
  ["Tango",      "unisex","Spanish",  "passionate dance, orange",          "bold, passionate, vibrant",      "dance,bold,orange,vibrant",          81,83],
  ["Samba",      "unisex","Portuguese","lively Brazilian dance",           "lively, vibrant, joyful",        "dance,lively,vibrant,joyful",        80,83],
  ["Peaches",    "female","English",  "sweet peach, soft and warm",        "sweet, soft, warm",              "sweet,soft,warm,peach",              83,83],
  ["Lemon",      "unisex","English",  "bright lemon, citrus",              "bright, tart, cheerful",         "citrus,bright,cheerful,yellow",      80,80],
  ["Robin",      "unisex","English",  "red-breasted robin, cheerful",      "cheerful, friendly, bright",     "bird,cheerful,friendly,classic",     82,82],
  ["Goldie",     "female","English",  "golden colored, bright",            "bright, warm, cheerful",         "gold,bright,warm,cheerful",          84,83],
  ["Cosmo",      "male",  "Greek",    "cosmos, universe, order",           "cosmic, curious, bright",        "space,universe,bright,curious",      80,84],
  // From fish (5)
  ["Bubbles",    "unisex","English",  "playful air bubbles",               "playful, bubbly, cheerful",      "bubbles,playful,cheerful,light",     82,82],
  ["Shimmer",    "unisex","English",  "shimmering light",                  "sparkling, luminous, beautiful", "sparkle,luminous,beautiful,light",   83,84],
  ["Coral",      "female","English",  "ocean coral, colorful",             "colorful, nurturing, beautiful", "ocean,colorful,beautiful,reef",      83,83],
  ["Rainbow",    "unisex","English",  "rainbow of colors",                 "colorful, joyful, vibrant",      "rainbow,colorful,joyful,vibrant",    83,83],
  ["Glitter",    "unisex","English",  "tiny sparkling glitter",            "sparkling, cheerful, bright",    "sparkle,cheerful,bright,colorful",   80,82],
  // From hamsters (5)
  ["Gizmo",      "male",  "English",  "clever small gadget",               "clever, curious, tiny",          "clever,curious,tiny,gadget",         80,82],
  ["Pompom",     "unisex","French",   "fluffy round ball",                 "round, fluffy, playful",         "round,fluffy,playful,cute",          80,80],
  ["Acorn",      "unisex","English",  "small round acorn",                 "small, earthy, round",           "small,round,earthy,nature",          79,79],
  ["Nugget",     "unisex","English",  "small golden nugget",               "small, golden, precious",        "small,golden,precious,nugget",       80,81],
  ["Pipsqueak",  "unisex","English",  "tiny, squeaky little one",          "tiny, squeaky, adorable",        "tiny,squeaky,adorable,small",        79,81],
  // From turtles (5)
  ["Darwin",     "male",  "English",  "dear friend, naturalist",           "curious, wise, scientific",      "science,curious,wise,nature",        80,82],
  ["Zen",        "unisex","Japanese", "meditative, peaceful",              "peaceful, calm, serene",         "peaceful,calm,serene,zen",           81,83],
  ["Serenity",   "female","Latin",    "peaceful, serene",                  "serene, calm, gentle",           "serene,calm,gentle,peaceful",        80,82],
  ["Einstein",   "male",  "German",   "genius, one stone",                 "clever, curious, genius",        "genius,clever,curious,science",      81,83],
  ["Aristotle",  "male",  "Greek",    "philosopher, best purpose",         "wise, thoughtful, philosophical","philosophy,wise,thoughtful,greek",   79,82],
];

const ALL_SEEDS = [...RABBIT_SEEDS, ...CROSS_SEEDS]; // 90 total

// ── 15 RABBIT-OWN PREFIXES (Cotton/Hop locked to rabbit only) ────────────────

const RABBIT_OWN_PREFIXES = [
  { word:"Cotton",  meaning:"soft cotton, pure and white",   keywords:"cotton,pure,soft,white",      pop:-5, vibe:+2 },
  { word:"Hop",     meaning:"hopping, energetic, bouncy",    keywords:"hop,energetic,bouncy,bunny",  pop:-5, vibe:+2 },
  { word:"Fluffy",  meaning:"soft and fluffy",               keywords:"fluffy,soft,gentle",          pop:-4, vibe:+2 },
  { word:"Soft",    meaning:"soft, gentle, tender",          keywords:"soft,gentle,tender",          pop:-4, vibe:+2 },
  { word:"Floppy",  meaning:"floppy eared, relaxed",         keywords:"floppy,ears,relaxed",         pop:-5, vibe:+2 },
  { word:"Snow",    meaning:"white as snow, pure",           keywords:"snow,white,pure",             pop:-5, vibe:+2 },
  { word:"Lop",     meaning:"lop-eared, gentle",             keywords:"lop,eared,gentle,breed",      pop:-6, vibe:+1 },
  { word:"Bouncy",  meaning:"bouncy, energetic, playful",    keywords:"bouncy,energetic,playful",    pop:-5, vibe:+2 },
  { word:"Silky",   meaning:"silky smooth, elegant",         keywords:"silky,smooth,elegant",        pop:-5, vibe:+2 },
  { word:"Little",  meaning:"small, tiny, adorable",         keywords:"little,tiny,adorable",        pop:-5, vibe:+2 },
  { word:"Sweet",   meaning:"sweet, lovable",                keywords:"sweet,lovable,gentle",        pop:-4, vibe:+2 },
  { word:"Bun",     meaning:"bunny, cute and hoppy",         keywords:"bun,bunny,cute,hoppy",        pop:-5, vibe:+2 },
  { word:"Angora",  meaning:"angora, luxurious soft fur",    keywords:"angora,soft,luxurious,breed", pop:-6, vibe:+3 },
  { word:"Russet",  meaning:"reddish-brown, earthy warm",    keywords:"russet,reddish,earthy,brown", pop:-7, vibe:+2 },
  { word:"Velvet",  meaning:"velvety smooth, luxurious",     keywords:"velvet,smooth,luxurious,soft",pop:-5, vibe:+3 },
];

// ── 34 CROSS-TYPE PREFIXES (from dog/cat's prefix sets, filtered for rabbit) ─

const CROSS_PREFIXES = [
  // 24 from dog's original prefix set (not blocked for rabbits)
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

const ALL_PREFIXES = [...RABBIT_OWN_PREFIXES, ...CROSS_PREFIXES]; // 49 total

// ── GENERATION — exact math: 90 seeds × 50 passes = 4,500 ───────────────────

function generateRabbitNames() {
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

const rabbits = generateRabbitNames();
const slugs = rabbits.map(r => r.slug);
const uniqueSlugs = new Set(slugs);

const crossPfxWords = new Set(CROSS_PREFIXES.map(p => p.word));
const crossPfxCombos = rabbits.filter(e => crossPfxWords.has(e.name.split(' ')[0]));

const crossSeedNames = new Set(CROSS_SEEDS.map(s => s[0]));
const crossSeedCombos = rabbits.filter(e =>
  e.name.includes(' ') && crossSeedNames.has(e.name.split(' ').slice(1).join(' '))
);

console.log('─'.repeat(50));
console.log(`Rabbit seeds    : ${RABBIT_SEEDS.length}`);
console.log(`Cross-type seeds: ${CROSS_SEEDS.length}`);
console.log(`Total seeds     : ${ALL_SEEDS.length}`);
console.log(`Rabbit-own pfx  : ${RABBIT_OWN_PREFIXES.length}`);
console.log(`Cross-type pfx  : ${CROSS_PREFIXES.length}`);
console.log(`Total prefixes  : ${ALL_PREFIXES.length}`);
console.log(`Expected total  : ${ALL_SEEDS.length * (ALL_PREFIXES.length + 1)}`);
console.log(`Total generated : ${rabbits.length}`);
console.log(`Unique slugs    : ${uniqueSlugs.size}`);
console.log(`Duplicates      : ${rabbits.length - uniqueSlugs.size}`);
console.log(`Cross-pfx combos: ${crossPfxCombos.length}`);
console.log(`Cross-seed combos:${crossSeedCombos.length}`);
console.log('─'.repeat(50));
console.log('First 10:', rabbits.slice(0, 10).map(r => r.name).join(', '));
console.log('Last  10:', rabbits.slice(-10).map(r => r.name).join(', '));
console.log('─'.repeat(50));

const outPath = join(__dir, 'rabbit-names-4500.json');
writeFileSync(outPath, JSON.stringify(rabbits, null, 2));
console.log(`Saved → scripts/rabbit-names-4500.json (${(JSON.stringify(rabbits).length / 1024).toFixed(0)} KB)`);
