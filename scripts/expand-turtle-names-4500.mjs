/**
 * Turtle name cross-pollinator: 90 seeds × 50 passes = 4,500 exactly.
 * Seeds: 50 original turtle + 40 cross-type (dog/cat/bird/fish/rabbit/hamster)
 * Prefixes: 15 turtle-own + 34 cross-type = 49 total prefix passes
 * Slow/Ancient/Shell locked to turtle — not leaked to other types.
 * Run: node scripts/expand-turtle-names-4500.mjs
 */

import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dir = dirname(fileURLToPath(import.meta.url));

function slug(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-turtle';
}

function longDesc(n, o, m, p) {
  return `${n} is a wise, steady name for a turtle rooted in ${o} tradition. The name means "${m}". ` +
    `Turtles named ${n} embody ${p} qualities — calm, ancient, and endlessly fascinating. ` +
    `A name as timeless and enduring as the turtle itself.`;
}

function makeRecord(name, gender, origin, meaningShort, personality, keywords, pop, vibe) {
  return {
    slug: slug(name),
    pet_type: 'turtle',
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

// ── 50 ORIGINAL TURTLE SEEDS ─────────────────────────────────────────────────

const TURTLE_SEEDS = [
  // 30 existing turtle seeds
  ["Shelly",      "female","English",  "one with a shell, protected",          "calm, gentle, protective",         "shell,calm,gentle,classic",          90,84],
  ["Sheldon",     "male",  "English",  "steep-sided valley, shell",            "steady, wise, calm",               "shell,steady,wise,calm",             87,83],
  ["Tank",        "male",  "English",  "large and heavy",                      "slow, sturdy, powerful",           "heavy,slow,sturdy,powerful",         86,82],
  ["Turbo",       "male",  "Latin",    "spinning fast, turbo",                 "surprisingly fast, energetic",     "fast,surprising,energetic,fun",      85,84],
  ["Speedy",      "unisex","English",  "surprisingly speedy",                  "determined, surprising, steady",   "fast,surprising,determined,fun",     84,82],
  ["Slowpoke",    "unisex","English",  "pleasantly slow, patient",             "patient, calm, unhurried",         "slow,patient,calm,unhurried",        83,81],
  ["Franklin",    "male",  "English",  "free landholder, turtle",              "friendly, kind, adventurous",      "cartoon,friendly,kind,classic",      88,83],
  ["Crush",       "male",  "English",  "cool sea turtle",                      "cool, laid-back, ocean",           "nemo,cool,ocean,laid-back",          87,84],
  ["Squirt",      "unisex","English",  "small water squirter",                 "young, energetic, playful",        "nemo,young,playful,energetic",       85,83],
  ["Mossy",       "unisex","English",  "covered in moss",                      "earthy, calm, ancient",            "moss,earthy,calm,ancient",           80,81],
  ["Pebble",      "unisex","English",  "smooth river pebble",                  "smooth, calm, earthy",             "smooth,calm,earthy,nature",          79,79],
  ["Rocky",       "male",  "English",  "rocky terrain, strength",              "steady, rocky, determined",        "rocky,steady,determined,strong",     82,81],
  ["Slider",      "unisex","English",  "sliding turtle, smooth",               "smooth, sliding, graceful",        "slider,smooth,graceful,nature",      78,79],
  ["Snapper",     "male",  "English",  "snapping turtle, bold",                "bold, fierce, protective",         "snapper,bold,fierce,protective",     79,80],
  ["Sage",        "unisex","English",  "wise sage, ancient wisdom",            "wise, calm, ancient",              "wise,ancient,calm,herb",             83,83],
  ["Darwin",      "male",  "English",  "dear friend, naturalist",              "curious, scientific, wise",        "science,wise,curious,darwin",        80,82],
  ["Aristotle",   "male",  "Greek",    "best purpose, philosopher",            "wise, thoughtful, ancient",        "philosophy,wise,ancient,greek",      79,82],
  ["Plato",       "male",  "Greek",    "broad-shouldered, philosopher",        "broad, philosophical, wise",       "philosophy,wise,broad,greek",        78,81],
  ["Socrates",    "male",  "Greek",    "whole strength, philosopher",          "wise, questioning, calm",          "philosophy,wise,calm,greek",         77,81],
  ["Einstein",    "male",  "German",   "one stone, genius",                    "genius, curious, thoughtful",      "genius,smart,curious,german",        80,82],
  ["Archie",      "male",  "English",  "truly brave",                          "brave, determined, friendly",      "brave,determined,friendly,classic",  80,80],
  ["Myrtle",      "female","Greek",    "myrtle plant, eternal",                "gentle, earthy, enduring",         "plant,gentle,earthy,enduring",       78,79],
  ["Gomez",       "male",  "Spanish",  "son of Gome",                          "charming, quirky, lovable",        "spanish,charming,quirky,lovable",    77,79],
  ["Tortuga",     "unisex","Spanish",  "turtle in Spanish",                    "ancient, slow, dignified",         "spanish,ancient,slow,dignified",     79,80],
  ["Zen",         "unisex","Japanese", "meditative, peaceful state",           "peaceful, calm, mindful",          "peaceful,calm,mindful,zen",          82,83],
  ["Serenity",    "female","Latin",    "peaceful, serene",                     "serene, calm, gentle",             "peaceful,serene,calm,gentle",        81,82],
  ["Ancient",     "unisex","Latin",    "old, enduring, eternal",               "ancient, wise, enduring",          "ancient,wise,enduring,old",          77,80],
  ["Fossil",      "male",  "Latin",    "dug up, ancient remains",              "ancient, stoic, enduring",         "ancient,stoic,enduring,old",         75,79],
  ["Jade",        "female","Spanish",  "precious green stone",                 "precious, green, calm",            "gem,precious,green,calm",            82,82],
  ["Basking",     "male",  "English",  "basking in warm sunlight",             "warm, lazy, content",              "warm,lazy,content,sun",              76,78],
  // 15 Indian / mythological seeds
  ["Kurma",       "male",  "Sanskrit", "Vishnu's turtle avatar, divine",       "sacred, divine, ancient",          "vishnu,divine,sacred,hindu",         83,89],
  ["Akupara",     "male",  "Sanskrit", "cosmic turtle holding Earth",          "cosmic, ancient, steadfast",       "cosmic,ancient,earth,mythological",  79,87],
  ["Bahumati",    "female","Sanskrit", "earth goddess, abundant",              "nurturing, ancient, earthy",       "earth,nurturing,ancient,hindu",      77,84],
  ["Kachuwa",     "unisex","Hindi",    "turtle, the shelled one",              "steady, calm, patient",            "turtle,shell,steady,hindi",          79,81],
  ["Kachhua",     "unisex","Hindi",    "tortoise, ancient one",                "ancient, slow, dignified",         "tortoise,ancient,slow,hindi",        78,80],
  ["Dheeru",      "male",  "Hindi",    "patient, slow and steady",             "patient, steady, calm",            "patient,steady,calm,hindi",          78,81],
  ["Shanku",      "unisex","Sanskrit", "conch, sacred sound",                  "sacred, calm, resonant",           "conch,sacred,calm,hindu",            76,81],
  ["Vajra",       "male",  "Sanskrit", "thunderbolt, indestructible",          "strong, indestructible, ancient",  "thunderbolt,strong,ancient,hindu",   78,83],
  ["Sthira",      "unisex","Sanskrit", "steady, stable, unmoving",             "steady, stable, calm",             "steady,stable,calm,hindu",           77,81],
  ["Dhruv",       "male",  "Sanskrit", "polar star, constant",                 "constant, steadfast, bright",      "star,constant,steadfast,hindu",      80,83],
  ["Bhoomi",      "female","Sanskrit", "earth, ground, foundation",            "grounded, nurturing, calm",        "earth,ground,nurturing,hindu",       78,82],
  ["Ganga",       "female","Sanskrit", "sacred river, pure",                   "pure, flowing, divine",            "river,pure,divine,hindu",            79,83],
  ["Yamuna",      "female","Sanskrit", "sacred river, sister of Yama",         "gentle, pure, sacred",             "river,gentle,sacred,hindu",          78,82],
  ["Saraswati",   "female","Sanskrit", "goddess of knowledge, river",          "wise, creative, divine",           "knowledge,wise,divine,hindu",        80,85],
  ["Chiranjeevi", "male",  "Sanskrit", "immortal, long-living one",            "enduring, ancient, immortal",      "immortal,ancient,enduring,hindu",    79,85],
  // 5 wise / ancient seeds
  ["Elder",       "unisex","English",  "elder, oldest and wisest",             "ancient, wise, respected",         "elder,wise,ancient,respected",       78,81],
  ["Stoic",       "unisex","Greek",    "stoic, unmoved by hardship",           "calm, unmoved, enduring",          "stoic,calm,enduring,greek",          76,80],
  ["Eternal",     "unisex","Latin",    "eternal, without end",                 "timeless, enduring, calm",         "eternal,timeless,enduring,latin",    77,81],
  ["Timeless",    "unisex","English",  "timeless, beyond time",                "ancient, serene, enduring",        "timeless,ancient,serene,classic",    76,80],
  ["Steadfast",   "unisex","English",  "steadfast, firmly loyal",              "loyal, firm, unwavering",          "steadfast,loyal,firm,classic",       77,81],
];

// ── 40 CROSS-TYPE SEEDS (dog/cat/bird/fish/rabbit/hamster → turtle) ──────────

const CROSS_SEEDS = [
  // From dogs (10)
  ["Luna",       "female","Latin",    "moon, luminous",                     "gentle, mysterious, beautiful",  "moon,mysterious,beautiful,latin",    88,88],
  ["Stella",     "female","Latin",    "star, radiant",                      "radiant, bright, affectionate",  "star,radiant,bright,latin",          87,87],
  ["Nova",       "female","Latin",    "new star, brightness",               "bright, curious, energetic",     "star,bright,modern,space",           86,87],
  ["Aurora",     "female","Latin",    "dawn, northern lights",              "radiant, magical, colorful",     "dawn,magical,colorful,space",        87,90],
  ["Shadow",     "unisex","English",  "dark shadow, mysterious",            "mysterious, dark, elusive",      "shadow,dark,mysterious,elusive",     81,84],
  ["Cosmo",      "male",  "Greek",    "order, cosmos, universe",            "cosmic, curious, bright",        "space,universe,bright,curious",      80,84],
  ["Maple",      "female","English",  "maple tree, sweet golden",           "sweet, warm, golden",            "nature,sweet,warm,golden",           82,82],
  ["Willow",     "female","English",  "graceful willow tree",               "graceful, gentle, flowing",      "nature,graceful,gentle,tree",        83,83],
  ["Ember",      "female","English",  "warm glowing ember",                 "warm, glowing, fiery",           "warm,glowing,fiery,fire",            82,84],
  ["Misty",      "female","English",  "soft mist, ethereal",                "gentle, ethereal, soft",         "mist,gentle,ethereal,soft",          81,83],
  // From cats (10)
  ["Onyx",       "unisex","Greek",    "black gemstone, dark",               "sleek, dark, mysterious",        "gem,dark,sleek,mysterious",          83,86],
  ["Midnight",   "unisex","English",  "dark midnight, mysterious",          "mysterious, dark, deep",         "midnight,dark,mysterious,night",     83,86],
  ["Marble",     "unisex","English",  "marbled pattern, elegant",           "elegant, patterned, unique",     "marble,elegant,pattern,unique",      80,83],
  ["Pearl",      "female","English",  "precious gem, luminous",             "precious, elegant, serene",      "gem,precious,elegant,serene",        88,86],
  ["Velvet",     "female","French",   "smooth, velvety, luxurious",         "smooth, elegant, luxurious",     "velvet,smooth,elegant,luxury",       83,85],
  ["Frost",      "unisex","English",  "cool frost, icy sheen",              "cool, crisp, elegant",           "cool,crisp,elegant,icy",             81,84],
  ["Ash",        "unisex","English",  "ash tree, silvery grey",             "calm, gentle, silvery",          "tree,calm,grey,gentle",              78,81],
  ["Iris",       "female","Greek",    "rainbow goddess, colorful",          "colorful, graceful, vibrant",    "rainbow,colorful,graceful,greek",    83,85],
  ["Truffle",    "unisex","French",   "rare earthy mushroom",               "rare, earthy, rich",             "luxury,earthy,rare,rich",            80,83],
  ["Cleo",       "female","Greek",    "glory, fame",                        "regal, independent, bold",       "glory,regal,bold,classic",           85,86],
  // From birds (5)
  ["Phoenix",    "unisex","Greek",    "mythical firebird, rebirth",         "bold, resilient, radiant",       "fire,rebirth,bold,mythological",     85,89],
  ["Skye",       "female","English",  "sky-blue, open and free",            "serene, blue, airy",             "sky,blue,serene,airy",               82,83],
  ["Kiwi",       "unisex","Maori",    "kiwi, green and unique",             "perky, green, unique",           "kiwi,green,unique,perky",            82,82],
  ["Mango",      "unisex","Hindi",    "tropical sweet mango",               "vibrant, tropical, orange",      "tropical,orange,vibrant,fruit",      84,85],
  ["Rio",        "unisex","Spanish",  "river, tropical, free-spirited",     "vibrant, tropical, flowing",     "river,tropical,vibrant,flowing",     85,85],
  // From fish (5)
  ["Neptune",    "male",  "Roman",    "god of the sea",                     "deep, powerful, mysterious",     "ocean,powerful,roman,mythological",  81,86],
  ["Coral",      "female","English",  "ocean coral, colorful",              "colorful, nurturing, beautiful", "ocean,colorful,beautiful,reef",      83,83],
  ["Rainbow",    "unisex","English",  "rainbow of colors",                  "colorful, joyful, vibrant",      "rainbow,colorful,joyful,vibrant",    83,83],
  ["Shimmer",    "unisex","English",  "shimmering light",                   "sparkling, luminous, beautiful", "sparkle,luminous,beautiful,light",   83,84],
  ["Triton",     "male",  "Greek",    "son of Poseidon, merman",            "powerful, fluid, mythological",  "greek,ocean,powerful,mythological",  80,86],
  // From rabbit (5)
  ["Clover",     "unisex","English",  "lucky clover plant, green",          "lucky, gentle, green",           "lucky,green,gentle,nature",          81,81],
  ["Meadow",     "female","English",  "open peaceful meadow",               "peaceful, natural, free",        "nature,peaceful,free,meadow",        80,81],
  ["Hazel",      "unisex","English",  "hazel nut, warm brown",              "warm, earthy, gentle",           "hazel,warm,earthy,nut",              83,82],
  ["Honey",      "female","English",  "sweet golden nectar",                "sweet, gentle, warm",            "sweet,gentle,warm,honey",            84,83],
  ["Poppy",      "female","English",  "vibrant poppy flower",               "vibrant, bright, cheerful",      "flower,vibrant,bright,poppy",        83,83],
  // From hamster (5)
  ["Nugget",     "unisex","English",  "small golden nugget",                "small, golden, precious",        "small,golden,precious,nugget",       80,81],
  ["Pumpkin",    "unisex","English",  "round orange pumpkin",               "round, orange, cheerful",        "round,orange,cheerful,fall",         80,79],
  ["Chestnut",   "unisex","English",  "brown chestnut, round earthy",       "warm, earthy, round",            "earthy,warm,round,brown",            79,79],
  ["Mochi",      "unisex","Japanese", "sweet rice cake, round",             "soft, sweet, round",             "japanese,sweet,soft,round",          84,86],
  ["Acorn",      "unisex","English",  "small round acorn",                  "small, earthy, round",           "small,round,earthy,nature",          79,79],
];

const ALL_SEEDS = [...TURTLE_SEEDS, ...CROSS_SEEDS]; // 90 total

// ── 15 TURTLE-OWN PREFIXES (Slow/Ancient/Shell locked to turtle) ─────────────

const TURTLE_OWN_PREFIXES = [
  { word:"Slow",     meaning:"slow, steady and patient",      keywords:"slow,steady,patient",       pop:-5, vibe:+2 },
  { word:"Ancient",  meaning:"ancient, old and enduring",     keywords:"ancient,old,enduring",      pop:-5, vibe:+3 },
  { word:"Shell",    meaning:"shelled, armored, protected",   keywords:"shell,armored,protected",   pop:-5, vibe:+2 },
  { word:"Stone",    meaning:"stone-solid, enduring",         keywords:"stone,solid,enduring",      pop:-5, vibe:+3 },
  { word:"Wise",     meaning:"wise, ancient knowing",         keywords:"wise,knowing,sage",         pop:-4, vibe:+3 },
  { word:"Patient",  meaning:"patient, calm and unhurried",   keywords:"patient,calm,unhurried",    pop:-5, vibe:+2 },
  { word:"Golden",   meaning:"golden, shining",               keywords:"golden,shining,bright",     pop:-4, vibe:+2 },
  { word:"Crystal",  meaning:"crystal clear, pure",           keywords:"crystal,pure,clear",        pop:-5, vibe:+3 },
  { word:"Earthy",   meaning:"earthy, grounded in nature",    keywords:"earthy,grounded,nature",    pop:-6, vibe:+2 },
  { word:"Steady",   meaning:"steady, reliable, firm",        keywords:"steady,reliable,firm",      pop:-5, vibe:+2 },
  { word:"Enduring", meaning:"enduring, lasting forever",     keywords:"enduring,lasting,strong",   pop:-6, vibe:+2 },
  { word:"Serene",   meaning:"serene, deeply peaceful",       keywords:"serene,peaceful,calm",      pop:-5, vibe:+3 },
  { word:"Emerald",  meaning:"emerald green, precious",       keywords:"emerald,green,precious",    pop:-5, vibe:+3 },
  { word:"Muddy",    meaning:"muddy, earthy and grounded",    keywords:"muddy,earthy,grounded",     pop:-7, vibe:+1 },
  { word:"Pond",     meaning:"pond-dwelling, calm water",     keywords:"pond,calm,water,nature",    pop:-6, vibe:+2 },
];

// ── 34 CROSS-TYPE PREFIXES (dog/cat originals, filtered for turtles) ─────────

const CROSS_PREFIXES = [
  // 24 from dog's original prefix set (not in turtle-own, not blocked for turtle)
  { word:"Silver",   meaning:"silver, bright metallic",       keywords:"silver,bright,metallic",    pop:-5, vibe:+2 },
  { word:"Shadow",   meaning:"dark, mysterious",              keywords:"shadow,dark,mysterious",    pop:-6, vibe:+3 },
  { word:"Storm",    meaning:"fierce, powerful",              keywords:"storm,fierce,powerful",     pop:-5, vibe:+3 },
  { word:"River",    meaning:"flowing, free",                 keywords:"river,flowing,free",        pop:-6, vibe:+1 },
  { word:"Cloud",    meaning:"soft, dreamy",                  keywords:"cloud,dreamy,soft",         pop:-7, vibe:+1 },
  { word:"Moon",     meaning:"gentle, moonlit",               keywords:"moon,moonlit,gentle",       pop:-5, vibe:+2 },
  { word:"Sun",      meaning:"warm, radiant",                 keywords:"sun,radiant,warm",          pop:-5, vibe:+2 },
  { word:"Ember",    meaning:"warm, glowing",                 keywords:"ember,glowing,warm",        pop:-7, vibe:+2 },
  { word:"Blaze",    meaning:"fiery, bold, radiant",          keywords:"blaze,fiery,bold,radiant",  pop:-5, vibe:+3 },
  { word:"Rocky",    meaning:"rocky, steady, strong",         keywords:"rocky,steady,strong",       pop:-5, vibe:+2 },
  { word:"Misty",    meaning:"soft, ethereal",                keywords:"misty,ethereal,soft",       pop:-6, vibe:+1 },
  { word:"Midnight", meaning:"dark, mysterious night",        keywords:"midnight,dark,night",       pop:-4, vibe:+4 },
  { word:"Copper",   meaning:"warm reddish metal",            keywords:"copper,warm,metal",         pop:-5, vibe:+3 },
  { word:"Crimson",  meaning:"deep red, bold",                keywords:"crimson,red,bold",          pop:-5, vibe:+3 },
  { word:"Marble",   meaning:"elegant, patterned",            keywords:"marble,elegant,pattern",    pop:-6, vibe:+3 },
  { word:"Wild",     meaning:"untamed, free-spirited",        keywords:"wild,untamed,free",         pop:-4, vibe:+3 },
  { word:"Sir",      meaning:"knightly, noble",               keywords:"sir,noble,knight",          pop:-4, vibe:+3 },
  { word:"Lady",     meaning:"noble, graceful",               keywords:"lady,noble,elegant",        pop:-4, vibe:+3 },
  { word:"Captain",  meaning:"leader, bold",                  keywords:"captain,leader,bold",       pop:-5, vibe:+3 },
  { word:"Prince",   meaning:"royal, noble heir",             keywords:"prince,royal,noble",        pop:-5, vibe:+4 },
  { word:"Princess", meaning:"royal, graceful",               keywords:"princess,royal,regal",      pop:-5, vibe:+4 },
  { word:"King",     meaning:"regal, commanding",             keywords:"king,regal,commanding",     pop:-5, vibe:+4 },
  { word:"Queen",    meaning:"regal, majestic",               keywords:"queen,regal,majestic",      pop:-5, vibe:+4 },
  { word:"Lord",     meaning:"noble, commanding",             keywords:"lord,noble,commanding",     pop:-5, vibe:+3 },
  // 10 from cat's new prefix set
  { word:"Dreamy",   meaning:"dreamy, ethereal",              keywords:"dreamy,ethereal,serene",    pop:-5, vibe:+3 },
  { word:"Mystic",   meaning:"mystic, magical",               keywords:"mystic,magical,mysterious", pop:-4, vibe:+4 },
  { word:"Lunar",    meaning:"lunar, moon-touched",           keywords:"lunar,moon,mysterious",     pop:-5, vibe:+3 },
  { word:"Whisper",  meaning:"soft whisper, gentle",          keywords:"whisper,gentle,soft",       pop:-5, vibe:+3 },
  { word:"Twilight", meaning:"twilight, dusk glow",           keywords:"twilight,dusk,glow",        pop:-4, vibe:+4 },
  { word:"Dusk",     meaning:"dusk, evening glow",            keywords:"dusk,evening,glow",         pop:-5, vibe:+3 },
  { word:"Royal",    meaning:"royal, regal",                  keywords:"royal,regal,noble",         pop:-4, vibe:+4 },
  { word:"Regal",    meaning:"regal, majestic",               keywords:"regal,majestic,dignified",  pop:-5, vibe:+4 },
  { word:"Noble",    meaning:"noble, dignified",              keywords:"noble,dignified,proud",     pop:-5, vibe:+3 },
  { word:"Elegant",  meaning:"elegant, refined",              keywords:"elegant,refined,graceful",  pop:-5, vibe:+3 },
];

const ALL_PREFIXES = [...TURTLE_OWN_PREFIXES, ...CROSS_PREFIXES]; // 49 total

// ── GENERATION — exact math: 90 seeds × 50 passes = 4,500 ───────────────────

function generateTurtleNames() {
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

const turtles = generateTurtleNames();
const slugs = turtles.map(t => t.slug);
const uniqueSlugs = new Set(slugs);

const crossPfxWords = new Set(CROSS_PREFIXES.map(p => p.word));
const crossPfxCombos = turtles.filter(e => crossPfxWords.has(e.name.split(' ')[0]));

const crossSeedNames = new Set(CROSS_SEEDS.map(s => s[0]));
const crossSeedCombos = turtles.filter(e =>
  e.name.includes(' ') && crossSeedNames.has(e.name.split(' ').slice(1).join(' '))
);

console.log('─'.repeat(50));
console.log(`Turtle seeds    : ${TURTLE_SEEDS.length}`);
console.log(`Cross-type seeds: ${CROSS_SEEDS.length}`);
console.log(`Total seeds     : ${ALL_SEEDS.length}`);
console.log(`Turtle-own pfx  : ${TURTLE_OWN_PREFIXES.length}`);
console.log(`Cross-type pfx  : ${CROSS_PREFIXES.length}`);
console.log(`Total prefixes  : ${ALL_PREFIXES.length}`);
console.log(`Expected total  : ${ALL_SEEDS.length * (ALL_PREFIXES.length + 1)}`);
console.log(`Total generated : ${turtles.length}`);
console.log(`Unique slugs    : ${uniqueSlugs.size}`);
console.log(`Duplicates      : ${turtles.length - uniqueSlugs.size}`);
console.log(`Cross-pfx combos: ${crossPfxCombos.length}`);
console.log(`Cross-seed combos:${crossSeedCombos.length}`);
console.log('─'.repeat(50));
console.log('First 10:', turtles.slice(0, 10).map(t => t.name).join(', '));
console.log('Last  10:', turtles.slice(-10).map(t => t.name).join(', '));
console.log('─'.repeat(50));

const outPath = join(__dir, 'turtle-names-4500.json');
writeFileSync(outPath, JSON.stringify(turtles, null, 2));
console.log(`Saved → scripts/turtle-names-4500.json (${(JSON.stringify(turtles).length / 1024).toFixed(0)} KB)`);
