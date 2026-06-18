/**
 * Bird name cross-pollinator: 100 seeds × 70 passes = 7,000 exactly.
 * Seeds: 90 original bird (53 western + 25 Indian + 12 mythological) + 10 cross-type
 * Prefixes: 21 bird-own + 23 from dog-originals + 25 from cross-type/new = 69
 * Wing/Feather/Song locked to birds only — not leaked to other types.
 * Run: node scripts/expand-bird-names-7k.mjs
 */

import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dir = dirname(fileURLToPath(import.meta.url));

function slug(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-bird';
}

function longDesc(n, o, m, p) {
  return `${n} is a vibrant name for a bird with ${o} origins. The name means "${m}". ` +
    `Birds named ${n} tend to be ${p} — colorful, intelligent, and full of personality. ` +
    `A name that soars as freely as its feathered owner.`;
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

// ── 90 ORIGINAL BIRD SEEDS ────────────────────────────────────────────────────

const BIRD_SEEDS = [
  // 53 western bird seeds
  ["Tweety",      "female","English",  "tweeting, chirping",            "cheerful, vocal, small",           "tweet,chirpy,small,classic",        94,87],
  ["Polly",       "female","English",  "beloved, sweet parrot",         "sweet, social, talkative",         "parrot,sweet,classic,talkative",    92,85],
  ["Kiwi",        "unisex","Maori",    "kiwi bird, flightless",         "curious, unique, quirky",          "kiwi,nz,unique,curious",            88,84],
  ["Mango",       "unisex","Hindi",    "tropical sweet mango",          "vibrant, tropical, bright",        "tropical,fruit,vibrant,bright",     87,86],
  ["Rio",         "unisex","Spanish",  "river, free-spirited",          "vibrant, playful, colorful",       "movie,river,playful,tropical",      88,87],
  ["Sky",         "unisex","English",  "open sky, freedom",             "free, bright, open",               "sky,free,open,bright",              90,87],
  ["Blue",        "unisex","English",  "blue color, serene",            "calm, cool, serene",               "blue,calm,serene,cool",             87,85],
  ["Robin",       "unisex","English",  "red-breasted robin bird",       "cheerful, bright, classic",        "bird,cheerful,classic,red",         88,85],
  ["Jay",         "male",  "English",  "jay bird, bold, bright",        "bold, bright, energetic",          "bird,bold,bright,energetic",        84,83],
  ["Sunny",       "unisex","English",  "bright sunshine, warm",         "warm, cheerful, bright",           "sunny,bright,warm,cheerful",        87,85],
  ["Angel",       "female","Greek",    "divine messenger, heavenly",    "gentle, divine, sweet",            "angel,divine,sweet,gentle",         85,85],
  ["Charlie",     "male",  "English",  "free man, cheerful",            "playful, cheerful, social",        "classic,playful,cheerful,social",   86,83],
  ["Sweetie",     "female","English",  "sweet one, adorable",           "sweet, adorable, gentle",          "sweet,adorable,gentle,loving",      83,82],
  ["Pip",         "unisex","English",  "small seed, tiny one",          "tiny, perky, adorable",            "tiny,perky,adorable,small",         82,83],
  ["Cookie",      "unisex","English",  "sweet baked cookie",            "sweet, warm, lovable",             "sweet,warm,lovable,food",           84,83],
  ["Peanut",      "unisex","English",  "small but mighty",              "tiny, energetic, lovable",         "tiny,small,energetic,lovable",      85,83],
  ["Pudding",     "unisex","English",  "sweet pudding, soft",           "soft, sweet, gentle",              "sweet,soft,gentle,food",            80,81],
  ["Ducky",       "unisex","English",  "dear duck, sweet",              "cute, gentle, water-loving",       "duck,cute,gentle,sweet",            81,80],
  ["Snowflake",   "female","English",  "white snowflake, pure",         "pure, white, gentle",              "white,pure,gentle,snow",            83,83],
  ["Cotton",      "unisex","English",  "soft white cotton",             "soft, gentle, white",              "soft,white,gentle,cotton",          81,80],
  ["Cherry",      "female","English",  "cherry fruit, bright red",      "bright, sweet, vibrant",           "fruit,bright,sweet,red",            83,83],
  ["Goldie",      "female","English",  "golden one, bright",            "bright, golden, cheerful",         "golden,bright,cheerful,classic",    85,83],
  ["Lucky",       "unisex","English",  "lucky one, fortunate",          "cheerful, playful, lucky",         "lucky,cheerful,playful,classic",    84,82],
  ["Sage",        "unisex","English",  "wise sage, healing herb",       "wise, calm, aromatic",             "wise,calm,herb,nature",             82,83],
  ["Pippin",      "unisex","English",  "small apple seed, tiny",        "tiny, cheerful, perky",            "tiny,cheerful,perky,nature",        80,82],
  ["Tango",       "unisex","Spanish",  "passionate dance, bold",        "bold, passionate, lively",         "dance,bold,passionate,spanish",     82,84],
  ["Samba",       "unisex","Portuguese","Brazilian dance, vibrant",     "vibrant, lively, musical",         "dance,vibrant,musical,brazilian",   81,84],
  ["Coco",        "unisex","French",   "chocolate, coconut, warm",      "playful, warm, cheerful",          "chocolate,warm,playful,french",     83,82],
  ["Peaches",     "female","English",  "sweet peach fruit, soft",       "sweet, soft, fruity",              "fruit,sweet,soft,peachy",           83,82],
  ["Lemon",       "unisex","English",  "bright lemon, tart citrus",     "bright, tart, energetic",          "citrus,bright,tart,yellow",         81,81],
  ["Pepper",      "unisex","English",  "spicy pepper, bold",            "bold, spicy, energetic",           "spice,bold,energetic,food",         82,82],
  ["Birdie",      "female","English",  "little bird, dear one",         "sweet, classic, tiny",             "bird,sweet,classic,tiny",           83,81],
  ["Cleo",        "female","Greek",    "glory, fame",                   "regal, independent, mysterious",   "glory,regal,mysterious,classic",    85,86],
  ["Bella",       "female","Italian",  "beautiful",                     "sweet, beautiful, gentle",         "beautiful,sweet,gentle,classic",    87,86],
  ["Oscar",       "male",  "Irish",    "God's spear, champion",         "bold, proud, independent",         "classic,bold,champion,irish",       84,83],
  ["Luna",        "female","Latin",    "moon, luminous",                "gentle, mysterious, beautiful",    "moon,mysterious,beautiful,latin",   88,88],
  ["Phoenix",     "unisex","Greek",    "mythical firebird, rebirth",    "bold, resilient, radiant",         "fire,rebirth,bold,mythological",    87,90],
  ["Ziggy",       "male",  "German",   "victorious protector",          "fun, quirky, energetic",           "fun,quirky,energetic,unique",       80,83],
  ["Pebble",      "unisex","English",  "smooth little pebble",          "small, smooth, earthy",            "small,smooth,earthy,nature",        79,79],
  ["Willow",      "female","English",  "graceful willow tree",          "graceful, gentle, nature-loving",  "nature,graceful,gentle,tree",       82,83],
  ["Daisy",       "female","English",  "day's eye flower",              "cheerful, sunny, gentle",          "flower,cheerful,sunny,classic",     84,83],
  ["Sparky",      "unisex","English",  "sparkling, electric",           "energetic, bright, electric",      "spark,energetic,bright,electric",   81,82],
  ["Beaky",       "unisex","English",  "beaky, characterful beak",      "curious, characterful, bold",      "beak,curious,bird,characterful",    79,80],
  ["Biscuit",     "unisex","English",  "small baked treat",             "warm, comforting, sweet",          "food,warm,sweet,comforting",        81,80],
  ["Feathers",    "unisex","English",  "feathered, soft and colorful",  "soft, colorful, gentle",           "feathers,soft,colorful,bird",       82,81],
  ["Skye",        "female","English",  "sky-blue, open and free",       "free, blue, airy",                 "sky,free,blue,airy",                83,83],
  ["Cheddar",     "unisex","English",  "bold orange cheddar",           "bold, orange, quirky",             "bold,orange,quirky,food",           78,80],
  ["Mochi",       "unisex","Japanese", "sweet rice cake",               "soft, sweet, round",               "japanese,sweet,soft,cute",          83,84],
  ["Milo",        "male",  "Latin",    "soldier, gracious",             "calm, gentle, affectionate",       "gentle,calm,sweet,classic",         82,82],
  ["Jade",        "female","Spanish",  "precious green stone",          "precious, green, calm",            "gem,green,precious,calm",           83,83],
  ["Shadow",      "unisex","English",  "dark shadow, mysterious",       "mysterious, dark, elusive",        "shadow,dark,mysterious,elusive",    81,84],
  ["Cosmo",       "male",  "Greek",    "order, cosmos, universe",       "cosmic, curious, bright",          "space,universe,bright,curious",     80,84],
  ["Finch",       "unisex","English",  "finch bird, small and perky",   "perky, small, melodious",          "bird,perky,small,melodious",        82,82],
  // 25 Indian bird seeds
  ["Hirwa",       "male",  "Marathi",  "green, green-colored bird",     "vibrant, green, earthy",           "green,vibrant,marathi,bird",        80,82],
  ["Titu",        "unisex","Hindi",    "little one, titmouse bird",     "tiny, cheerful, sweet",            "tiny,sweet,cheerful,hindi",         80,81],
  ["Neela",       "female","Hindi",    "blue, the blue-hued bird",      "serene, blue, gentle",             "blue,serene,gentle,hindi",          80,82],
  ["Laal",        "male",  "Hindi",    "red, crimson one",              "vibrant, bold, striking",          "red,vibrant,bold,hindi",            79,81],
  ["Pilu",        "unisex","Hindi",    "small sparrow-like bird",       "tiny, swift, nimble",              "small,swift,nimble,hindi",          78,80],
  ["Sampati",     "male",  "Sanskrit", "Ramayana's great eagle",        "noble, powerful, ancient",         "ramayana,noble,eagle,ancient",      79,85],
  ["Parewa",      "unisex","Hindi",    "dove, the peaceful one",        "peaceful, gentle, pure",           "dove,peaceful,gentle,hindi",        79,81],
  ["Gagan",       "male",  "Hindi",    "sky, heavens, vast above",      "vast, free, open",                 "sky,heaven,vast,hindi",             80,82],
  ["Paro",        "female","Hindi",    "dove, pure and gentle",         "pure, gentle, loving",             "dove,pure,gentle,hindi",            79,81],
  ["Titli",       "female","Hindi",    "butterfly, fluttering",         "playful, fluttering, colorful",    "butterfly,playful,colorful,hindi",  81,83],
  ["Kaga",        "male",  "Sanskrit", "crow, clever and intelligent",  "clever, dark, intelligent",        "crow,clever,dark,hindi",            78,81],
  ["Chakor",      "unisex","Sanskrit", "partridge, moon-lover bird",    "romantic, moonlit, gentle",        "partridge,romantic,moonlit,hindi",  79,82],
  ["Mayur",       "male",  "Sanskrit", "peacock, beautiful and proud",  "regal, beautiful, proud",          "peacock,regal,beautiful,hindi",     83,88],
  ["Mor",         "male",  "Hindi",    "peacock, colorful display",     "colorful, proud, regal",           "peacock,colorful,proud,hindi",      82,87],
  ["Muniya",      "female","Hindi",    "small sparrow, chirpy",         "chirpy, small, sweet",             "sparrow,chirpy,small,hindi",        80,81],
  ["Sundar",      "male",  "Sanskrit", "beautiful, handsome",           "beautiful, elegant, charming",     "beautiful,elegant,charming,hindi",  81,83],
  ["Chirag",      "male",  "Hindi",    "lamp, bright light",            "bright, warm, illuminating",       "lamp,bright,warm,hindi",            79,82],
  ["Neel",        "male",  "Hindi",    "blue, sapphire-hued",           "calm, blue, serene",               "blue,calm,serene,hindi",            80,82],
  ["Jatayu",      "male",  "Sanskrit", "Ramayana's noble eagle",        "noble, brave, heroic",             "ramayana,noble,eagle,heroic",       80,86],
  ["Krauncha",    "unisex","Sanskrit", "heron bird, ancient symbol",    "ancient, graceful, mythological",  "heron,ancient,graceful,hindi",      77,83],
  ["Bater",       "unisex","Hindi",    "quail bird, small and quick",   "small, quick, nimble",             "quail,small,quick,hindi",           77,79],
  ["Kabutar",     "unisex","Hindi",    "pigeon, peace messenger",       "peaceful, gentle, urban",          "pigeon,peaceful,gentle,hindi",      78,79],
  ["Teetar",      "unisex","Hindi",    "partridge, melodious singer",   "melodious, swift, earthy",         "partridge,melodious,swift,hindi",   78,80],
  ["Hamsa",       "unisex","Sanskrit", "swan, divine grace",            "divine, graceful, pure",           "swan,divine,graceful,hindi",        83,87],
  ["Pakshi",      "unisex","Sanskrit", "bird, the winged one",          "free, vibrant, spirited",          "bird,free,vibrant,hindi",           79,81],
  // 12 mythological bird seeds
  ["Roc",         "male",  "Arabic",   "giant legendary bird",          "powerful, legendary, vast",        "giant,legendary,powerful,arabic",   78,88],
  ["Simurgh",     "unisex","Persian",  "divine healing bird of Iran",   "divine, healing, ancient",         "divine,healing,ancient,persian",    79,89],
  ["Thunderbird", "unisex","Lakota",   "thunder and storm spirit bird", "powerful, stormy, sacred",         "thunder,storm,sacred,native",       80,90],
  ["Huma",        "female","Persian",  "bird of paradise, fortune",     "fortunate, magical, divine",       "fortune,magical,divine,persian",    80,89],
  ["Bennu",       "male",  "Egyptian", "rising sun bird, phoenix-like", "radiant, ancient, divine",         "sun,ancient,radiant,egyptian",      79,88],
  ["Alkonost",    "female","Slavic",   "bird of paradise, enchanting",  "melodious, magical, enchanting",   "melody,magical,enchanting,slavic",  77,88],
  ["Sirin",       "female","Slavic",   "singing enchantress bird",      "enchanting, musical, beautiful",   "singing,enchanting,musical,slavic", 77,88],
  ["Ziz",         "male",  "Hebrew",   "giant sky master bird",         "powerful, ancient, vast",          "giant,ancient,vast,hebrew",         76,87],
  ["Pegasus",     "unisex","Greek",    "winged horse, freedom",         "noble, free, majestic",            "winged,noble,free,greek",           83,91],
  ["Chamrosh",    "unisex","Persian",  "guardian bird of mountains",    "protective, ancient, noble",       "guardian,ancient,noble,persian",    77,87],
  ["Strix",       "unisex","Latin",    "screech owl, night watcher",    "mysterious, nocturnal, wise",      "owl,mysterious,nocturnal,latin",    76,87],
  ["Caladrius",   "unisex","Latin",    "healing white bird",            "healing, pure, divine",            "healing,pure,divine,latin",         77,87],
];

// ── 10 CROSS-TYPE SEEDS (from dog/fish/cat/rabbit/hamster — work as bird names) ─

const CROSS_SEEDS = [
  ["Zephyr",   "unisex","Greek",   "west wind, gentle breeze",       "gentle, swift, free-spirited",   "wind,gentle,swift,greek",           83,87],
  ["Comet",    "unisex","English", "blazing sky comet, swift",        "fast, bright, adventurous",      "comet,space,fast,bright",           82,86],
  ["Flash",    "unisex","English", "bright flash of light",           "quick, bright, vivid",           "flash,quick,bright,vivid",          83,84],
  ["Shimmer",  "unisex","English", "shimmering iridescent light",     "sparkling, iridescent, colorful","shimmer,iridescent,colorful,light", 83,85],
  ["Glimmer",  "unisex","English", "glimmering soft glow",            "glowing, soft, luminous",        "glimmer,glow,soft,luminous",        80,84],
  ["Iris",     "female","Greek",   "rainbow goddess, colorful",       "colorful, graceful, radiant",    "rainbow,colorful,graceful,greek",   84,86],
  ["Meadow",   "female","English", "open grassy meadow, free",        "natural, free, peaceful",        "meadow,natural,free,peaceful",      80,82],
  ["Zippy",    "unisex","English", "fast and zippy, quick",           "fast, energetic, lively",        "fast,energetic,lively,zippy",       80,82],
  ["Blaze",    "unisex","English", "fiery bright flame",              "fiery, bold, radiant",           "fire,bold,fiery,radiant",           82,85],
  ["Sapphire", "female","Greek",   "blue precious gemstone",          "precious, deep, beautiful",      "gem,blue,precious,beautiful",       83,86],
];

const ALL_SEEDS = [...BIRD_SEEDS, ...CROSS_SEEDS]; // 100 total

// ── 21 ORIGINAL BIRD PREFIXES (type-locked: Wing/Feather/Song stay bird-only) ─

const BIRD_OWN_PREFIXES = [
  { word:"Sky",      meaning:"open sky, freedom",         keywords:"sky,open,freedom",          pop:-5, vibe:+2 },
  { word:"Cloud",    meaning:"soft cloud, dreamy",         keywords:"cloud,dreamy,soft",         pop:-6, vibe:+2 },
  { word:"Storm",    meaning:"fierce storm, powerful",     keywords:"storm,fierce,powerful",     pop:-5, vibe:+3 },
  { word:"Breeze",   meaning:"gentle breeze, free",        keywords:"breeze,gentle,free",        pop:-5, vibe:+2 },
  { word:"Feather",  meaning:"soft feather, delicate",     keywords:"feather,soft,delicate",     pop:-4, vibe:+3 },
  { word:"Wing",     meaning:"spread wings, soaring",      keywords:"wing,soaring,flight",       pop:-4, vibe:+3 },
  { word:"Song",     meaning:"melodious song, musical",    keywords:"song,melodious,musical",    pop:-4, vibe:+3 },
  { word:"Melody",   meaning:"sweet melody, lyrical",      keywords:"melody,sweet,musical",      pop:-5, vibe:+3 },
  { word:"Crystal",  meaning:"crystal clear, pure",        keywords:"crystal,pure,clear",        pop:-5, vibe:+3 },
  { word:"Sunny",    meaning:"bright sunshine, warm",      keywords:"sunny,bright,warm",         pop:-4, vibe:+2 },
  { word:"Rainbow",  meaning:"colorful rainbow, vibrant",  keywords:"rainbow,colorful,vibrant",  pop:-5, vibe:+3 },
  { word:"Dawn",     meaning:"first light, new day",       keywords:"dawn,morning,light",        pop:-5, vibe:+3 },
  { word:"Coral",    meaning:"warm coral, colorful",       keywords:"coral,warm,colorful",       pop:-5, vibe:+2 },
  { word:"Lemon",    meaning:"bright lemon, citrus",       keywords:"lemon,bright,citrus",       pop:-5, vibe:+2 },
  { word:"Pepper",   meaning:"bold pepper, spicy",         keywords:"pepper,bold,spicy",         pop:-5, vibe:+2 },
  { word:"Golden",   meaning:"golden, shining",            keywords:"golden,shining",            pop:-5, vibe:+2 },
  { word:"Silver",   meaning:"silver, bright",             keywords:"silver,bright",             pop:-5, vibe:+2 },
  { word:"Midnight", meaning:"dark, mysterious night",     keywords:"midnight,dark,night",       pop:-4, vibe:+4 },
  { word:"Wild",     meaning:"untamed, free-spirited",     keywords:"wild,untamed,free",         pop:-5, vibe:+3 },
  { word:"Copper",   meaning:"warm reddish metal",         keywords:"copper,warm,metal",         pop:-5, vibe:+3 },
  { word:"Crimson",  meaning:"deep red, bold",             keywords:"crimson,red,bold",          pop:-5, vibe:+3 },
];

// ── 48 CROSS-TYPE PREFIXES ────────────────────────────────────────────────────
// 23 from dog-originals not in bird's own + 25 from cross-type/new

const CROSS_PREFIXES = [
  // 23 from dog's original prefix set (not in bird's own)
  { word:"Shadow",   meaning:"dark, mysterious",           keywords:"shadow,dark",               pop:-6, vibe:+3 },
  { word:"River",    meaning:"flowing, free",              keywords:"river,flowing,free",        pop:-6, vibe:+1 },
  { word:"Moon",     meaning:"gentle, mysterious",         keywords:"moon,moonlit",              pop:-5, vibe:+2 },
  { word:"Sun",      meaning:"warm, radiant",              keywords:"sun,radiant,warm",          pop:-5, vibe:+2 },
  { word:"Frost",    meaning:"cool, crisp",                keywords:"frost,cool,crisp",          pop:-7, vibe:+2 },
  { word:"Ember",    meaning:"warm, glowing",              keywords:"ember,glowing,warm",        pop:-7, vibe:+2 },
  { word:"Rusty",    meaning:"reddish, earthy",            keywords:"rusty,earthy,red",          pop:-5, vibe:+1 },
  { word:"Sandy",    meaning:"sand-colored, warm",         keywords:"sandy,warm,sand",           pop:-5, vibe:+1 },
  { word:"Rocky",    meaning:"rugged, strong",             keywords:"rocky,rugged,strong",       pop:-5, vibe:+1 },
  { word:"Misty",    meaning:"soft, ethereal",             keywords:"misty,ethereal,soft",       pop:-6, vibe:+1 },
  { word:"Marble",   meaning:"elegant, patterned",         keywords:"marble,elegant,pattern",    pop:-6, vibe:+3 },
  { word:"Sir",      meaning:"knightly, noble",            keywords:"sir,noble,knight",          pop:-4, vibe:+3 },
  { word:"Lady",     meaning:"noble, graceful",            keywords:"lady,noble,elegant",        pop:-4, vibe:+3 },
  { word:"Captain",  meaning:"leader, bold",               keywords:"captain,leader,bold",       pop:-5, vibe:+3 },
  { word:"Prince",   meaning:"royal, noble heir",          keywords:"prince,royal,noble",        pop:-5, vibe:+4 },
  { word:"Princess", meaning:"royal, graceful",            keywords:"princess,royal,regal",      pop:-5, vibe:+4 },
  { word:"Duke",     meaning:"noble lord",                 keywords:"duke,noble,lord",           pop:-5, vibe:+3 },
  { word:"Major",    meaning:"commanding, bold",           keywords:"major,bold,commanding",     pop:-6, vibe:+2 },
  { word:"Baron",    meaning:"noble, lordly",              keywords:"baron,noble,lord",          pop:-6, vibe:+3 },
  { word:"King",     meaning:"regal, commanding",          keywords:"king,regal,royal",          pop:-4, vibe:+4 },
  { word:"Queen",    meaning:"regal, majestic",            keywords:"queen,regal,majestic",      pop:-4, vibe:+4 },
  { word:"Lord",     meaning:"noble, powerful",            keywords:"lord,noble,powerful",       pop:-5, vibe:+3 },
  { word:"General",  meaning:"commanding, strong",         keywords:"general,command,strong",    pop:-6, vibe:+2 },
  // 25 from cross-type/cat-new — best for birds
  { word:"Velvet",   meaning:"smooth, velvety plumage",    keywords:"velvet,smooth,plumage",     pop:-5, vibe:+3 },
  { word:"Sable",    meaning:"dark, luxurious",            keywords:"sable,dark,luxury",         pop:-6, vibe:+3 },
  { word:"Pearl",    meaning:"precious, luminous",         keywords:"pearl,precious,luminous",   pop:-4, vibe:+3 },
  { word:"Jade",     meaning:"green jade, precious",       keywords:"jade,green,precious",       pop:-5, vibe:+3 },
  { word:"Soar",     meaning:"soaring, high-flying",       keywords:"soar,flight,high",          pop:-5, vibe:+3 },
  { word:"Teal",     meaning:"teal, blue-green",           keywords:"teal,blue-green,cool",      pop:-5, vibe:+2 },
  { word:"Azure",    meaning:"sky blue, bright",           keywords:"azure,blue,sky",            pop:-5, vibe:+2 },
  { word:"Dazzle",   meaning:"dazzling, brilliant",        keywords:"dazzle,brilliant,bright",   pop:-5, vibe:+3 },
  { word:"Glimmer",  meaning:"glimmering, faint glow",     keywords:"glimmer,glow,light",        pop:-6, vibe:+2 },
  { word:"Ocean",    meaning:"vast, deep",                 keywords:"ocean,vast,deep",           pop:-4, vibe:+3 },
  { word:"Gentle",   meaning:"gentle, tender",             keywords:"gentle,tender,sweet",       pop:-5, vibe:+2 },
  { word:"Sweet",    meaning:"sweet, lovable",             keywords:"sweet,lovable,dear",        pop:-4, vibe:+2 },
  { word:"Little",   meaning:"little, tiny",               keywords:"little,tiny,small",         pop:-4, vibe:+1 },
  { word:"Honey",    meaning:"honey-sweet, warm",          keywords:"honey,sweet,warm",          pop:-4, vibe:+2 },
  { word:"Wise",     meaning:"wise, knowing",              keywords:"wise,knowing,ancient",      pop:-4, vibe:+3 },
  { word:"Dreamy",   meaning:"dreamy, ethereal",           keywords:"dreamy,ethereal,serene",    pop:-5, vibe:+3 },
  { word:"Mystic",   meaning:"mystic, magical",            keywords:"mystic,magical,mysterious", pop:-4, vibe:+4 },
  { word:"Lunar",    meaning:"lunar, moon-touched",        keywords:"lunar,moon,mysterious",     pop:-5, vibe:+3 },
  { word:"Whisper",  meaning:"whispering wings, soft",     keywords:"whisper,soft,quiet",        pop:-5, vibe:+3 },
  { word:"Twilight", meaning:"twilight, dusk glow",        keywords:"twilight,dusk,glow",        pop:-4, vibe:+4 },
  { word:"Dusk",     meaning:"dusk, evening glow",         keywords:"dusk,evening,glow",         pop:-5, vibe:+3 },
  { word:"Royal",    meaning:"royal, regal",               keywords:"royal,regal,noble",         pop:-4, vibe:+4 },
  { word:"Regal",    meaning:"regal, majestic",            keywords:"regal,majestic,dignified",  pop:-5, vibe:+4 },
  { word:"Noble",    meaning:"noble, dignified",           keywords:"noble,dignified,proud",     pop:-5, vibe:+3 },
  { word:"Elegant",  meaning:"elegant, refined",           keywords:"elegant,refined,graceful",  pop:-5, vibe:+3 },
];

const ALL_PREFIXES = [...BIRD_OWN_PREFIXES, ...CROSS_PREFIXES]; // 69 total

// ── GENERATION — exact math: 100 seeds × 70 passes = 7,000 ──────────────────

function generateBirdNames() {
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

const birds = generateBirdNames();
const slugs = birds.map(b => b.slug);
const uniqueSlugs = new Set(slugs);

const crossPfxWords = new Set(CROSS_PREFIXES.map(p => p.word));
const crossPfxCombos = birds.filter(e => crossPfxWords.has(e.name.split(' ')[0]));

const crossSeedNames = new Set(CROSS_SEEDS.map(s => s[0]));
const crossSeedCombos = birds.filter(e => crossSeedNames.has(e.name.split(' ').pop()) && e.name.includes(' '));

console.log('─'.repeat(50));
console.log(`Bird seeds      : ${BIRD_SEEDS.length}`);
console.log(`Cross-type seeds: ${CROSS_SEEDS.length}`);
console.log(`Total seeds     : ${ALL_SEEDS.length}`);
console.log(`Bird-own pfx    : ${BIRD_OWN_PREFIXES.length}`);
console.log(`Cross-type pfx  : ${CROSS_PREFIXES.length}`);
console.log(`Total prefixes  : ${ALL_PREFIXES.length}`);
console.log(`Expected total  : ${ALL_SEEDS.length * (ALL_PREFIXES.length + 1)}`);
console.log(`Total generated : ${birds.length}`);
console.log(`Unique slugs    : ${uniqueSlugs.size}`);
console.log(`Duplicates      : ${birds.length - uniqueSlugs.size}`);
console.log(`Cross-pfx combos: ${crossPfxCombos.length}`);
console.log(`Cross-seed combos:${crossSeedCombos.length}`);
console.log('─'.repeat(50));
console.log('First 10:', birds.slice(0, 10).map(b => b.name).join(', '));
console.log('Last  10:', birds.slice(-10).map(b => b.name).join(', '));
console.log('─'.repeat(50));

const outPath = join(__dir, 'bird-names-7000.json');
writeFileSync(outPath, JSON.stringify(birds, null, 2));
console.log(`Saved → scripts/bird-names-7000.json (${(JSON.stringify(birds).length / 1024).toFixed(0)} KB)`);
