/**
 * Cat name cross-pollinator: 125 seeds × 80 passes = 10,000 exactly.
 * Seeds: 102 original cat + 23 cross-type (food/bird/fish/rabbit/hamster/turtle)
 * Prefixes: 30 cat-original + 36 filtered cross-type + 13 new cat-specific = 79
 * Blocked for cats: Song/Wing/Feather (bird), Bubble/Deep (fish),
 *                   Fluffy/Cotton/Hop (rabbit), Tiny/Fuzzy/Chubby (hamster), Ancient/Shell (turtle)
 * Run: node scripts/expand-cat-names-10k.mjs
 */

import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dir = dirname(fileURLToPath(import.meta.url));

function slug(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-cat';
}

function longDesc(n, o, m, p) {
  return `${n} is an enchanting name for a cat with ${o} origins. The name means "${m}". ` +
    `Cats named ${n} tend to be ${p} — curious, independent, and endlessly fascinating companions. ` +
    `A name as mysterious and elegant as a cat itself.`;
}

function makeRecord(name, gender, origin, meaningShort, personality, keywords, pop, vibe) {
  return {
    slug: slug(name),
    pet_type: 'cat',
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

// ── 102 ORIGINAL CAT SEEDS ────────────────────────────────────────────────────

const CAT_SEEDS = [
  // 21 western male
  ["Oliver",    "male",  "Latin",   "olive tree, peace",               "peaceful, curious, affectionate",  "classic,peaceful,nature,gentle",    92,88],
  ["Leo",       "male",  "Latin",   "lion, brave",                     "brave, bold, charismatic",          "lion,brave,bold,short",             90,89],
  ["Milo",      "male",  "Latin",   "soldier, gracious",               "calm, affectionate, gentle",        "gentle,calm,sweet,popular",         88,86],
  ["Charlie",   "male",  "English", "free man",                        "playful, cheerful, social",         "playful,classic,cheerful,friendly", 89,86],
  ["Jack",      "male",  "Hebrew",  "God is gracious",                 "bold, energetic, playful",          "classic,bold,energetic,traditional",87,85],
  ["Simba",     "male",  "Swahili", "lion, strength",                  "regal, adventurous, proud",         "lion,regal,pride,african",          91,90],
  ["Oscar",     "male",  "Irish",   "God's spear, champion",           "wise, proud, independent",          "wise,proud,classic,irish",          89,87],
  ["Jasper",    "male",  "English", "jasper gemstone, treasure",       "calm, loyal, mysterious",           "gem,calm,mysterious,classic",       86,87],
  ["Hugo",      "male",  "German",  "mind, intellect",                 "intelligent, noble, curious",       "intelligent,noble,german,classic",  84,86],
  ["Felix",     "male",  "Latin",   "happy, fortunate",                "happy, playful, lucky",             "happy,lucky,playful,latin",         88,87],
  ["Merlin",    "male",  "Welsh",   "sea fortress, wizard",            "wise, magical, mysterious",         "wizard,magical,mysterious,welsh",   84,89],
  ["Gandalf",   "male",  "Norse",   "elf wand, wizard",                "wise, magical, powerful",           "wizard,tolkien,magical,fantasy",    82,90],
  ["Romeo",     "male",  "Italian", "pilgrim to Rome",                 "romantic, passionate, bold",        "romantic,italian,classic,bold",     83,86],
  ["Dante",     "male",  "Italian", "enduring, steadfast",             "mysterious, literary, dark",        "literary,dark,mysterious,italian",  81,87],
  ["Loki",      "male",  "Norse",   "trickster god",                   "mischievous, clever, charming",     "trickster,norse,clever,mythological",83,89],
  ["Thor",      "male",  "Norse",   "god of thunder",                  "strong, bold, majestic",            "strong,norse,thunder,powerful",     84,88],
  ["Theo",      "male",  "Greek",   "gift of God",                     "sweet, gentle, curious",            "divine,sweet,gentle,greek",         86,87],
  ["George",    "male",  "Greek",   "farmer, earthworker",             "friendly, reliable, classic",       "classic,friendly,reliable,greek",   82,84],
  ["Monty",     "male",  "French",  "mountain of the lord",            "charming, bold, lovable",           "french,charming,bold,classic",      80,84],
  ["Wilbur",    "male",  "English", "bright, determined",              "friendly, clever, spirited",        "classic,spirited,clever,friendly",  79,83],
  ["Winston",   "male",  "English", "joyful stone",                    "dignified, calm, distinguished",    "british,dignified,classic,regal",   82,86],
  // 23 western female
  ["Luna",      "female","Latin",   "moon",                            "gentle, mysterious, beautiful",     "moon,mysterious,beautiful,latin",   96,91],
  ["Bella",     "female","Italian", "beautiful",                       "loving, sweet, graceful",           "beautiful,popular,sweet,loving",    95,90],
  ["Nala",      "female","African", "beloved, successful",             "gentle, brave, regal",              "african,regal,gentle,lion-king",    87,88],
  ["Cleo",      "female","Greek",   "glory, fame",                     "regal, independent, mysterious",    "glory,regal,mysterious,classic",    90,89],
  ["Chloe",     "female","Greek",   "blooming, spring green",          "lively, sweet, social",             "blooming,lively,greek,sweet",       89,87],
  ["Sophie",    "female","Greek",   "wisdom",                          "wise, gentle, affectionate",        "wise,gentle,greek,classic",         88,86],
  ["Lily",      "female","English", "pure flower",                     "delicate, sweet, graceful",         "flower,pure,sweet,graceful",        91,88],
  ["Daisy",     "female","English", "day's eye flower",                "cheerful, sunny, gentle",           "flower,cheerful,sunny,classic",     87,86],
  ["Rosie",     "female","English", "rose flower",                     "loving, cheerful, sweet",           "flower,sweet,loving,classic",       86,85],
  ["Callie",    "female","Greek",   "beautiful, lovely",               "graceful, sweet, independent",      "beautiful,greek,sweet,graceful",    83,85],
  ["Gracie",    "female","Latin",   "grace, blessing",                 "graceful, sweet, gentle",           "grace,gentle,sweet,classic",        85,85],
  ["Ivy",       "female","English", "faithfulness, vine",              "tenacious, graceful, loyal",        "nature,faithful,graceful,plant",    85,86],
  ["Hazel",     "female","English", "hazel tree, wise",                "gentle, wise, nature-loving",       "nature,wise,gentle,tree",           84,85],
  ["Willow",    "female","English", "graceful tree",                   "graceful, gentle, fluid",           "nature,graceful,gentle,tree",       87,87],
  ["Violet",    "female","Latin",   "purple flower",                   "gentle, artistic, mysterious",      "flower,purple,artistic,gentle",     86,87],
  ["Aurora",    "female","Latin",   "dawn, northern lights",           "radiant, magical, beautiful",       "dawn,magical,beautiful,space",      88,91],
  ["Stella",    "female","Latin",   "star",                            "radiant, bold, affectionate",       "star,radiant,bold,latin",           88,89],
  ["Nova",      "female","Latin",   "new star, brightness",            "bright, curious, energetic",        "star,bright,modern,space",          87,88],
  ["Ellie",     "female","Greek",   "bright shining one",              "bright, sweet, loving",             "bright,sweet,loving,classic",       87,86],
  ["Pearl",     "female","English", "precious ocean gem",              "precious, elegant, serene",         "gem,ocean,precious,elegant",        85,86],
  ["Poppy",     "female","English", "red flower, remembrance",         "bright, cheerful, energetic",       "flower,bright,cheerful,british",    85,87],
  ["Iris",      "female","Greek",   "rainbow goddess",                 "colorful, graceful, radiant",       "rainbow,goddess,graceful,greek",    84,87],
  ["Misty",     "female","English", "soft mist, ethereal",             "gentle, ethereal, mysterious",      "mist,gentle,ethereal,mysterious",   82,84],
  // 7 original Indian
  ["Billu",     "male",  "Hindi",   "little dear one, fluffy",         "playful, sweet, lovable",           "hindi,lovable,sweet,fluffy",        80,82],
  ["Mitu",      "unisex","Hindi",   "little one, endearment",          "gentle, sweet, lovable",            "hindi,gentle,sweet,lovable",        79,81],
  ["Kalu",      "male",  "Hindi",   "dark, black one",                 "mysterious, clever, dark",          "hindi,dark,mysterious,clever",      78,82],
  ["Nandini",   "female","Sanskrit","bestowing joy, daughter",         "gentle, joyful, divine",            "sanskrit,joyful,divine,gentle",     80,83],
  ["Pari",      "female","Persian", "fairy, angelic one",              "magical, gentle, ethereal",         "fairy,magical,ethereal,persian",    81,84],
  ["Sonu",      "unisex","Hindi",   "golden, dear one",                "sweet, golden, lovable",            "hindi,golden,sweet,lovable",        79,81],
  ["Golu",      "male",  "Hindi",   "chubby, round one",               "chubby, lovable, playful",          "chubby,round,lovable,hindi",        81,83],
  // 7 Egyptian
  ["Bastet",    "female","Egyptian","goddess of cats, protector",      "regal, divine, protective",         "cat-goddess,divine,regal,egyptian", 88,92],
  ["Cleopatra", "female","Greek",   "glory of the father",             "regal, powerful, glamorous",        "egyptian,regal,powerful,queen",     85,90],
  ["Isis",      "female","Egyptian","throne, goddess of magic",        "magical, powerful, divine",         "goddess,magical,divine,egyptian",   83,90],
  ["Sphinx",    "unisex","Greek",   "strangling one, riddle",          "mysterious, ancient, wise",         "mysterious,ancient,riddle,egyptian",80,89],
  ["Pharaoh",   "male",  "Egyptian","great house, ruler",              "commanding, regal, ancient",        "ruler,regal,ancient,egyptian",      79,88],
  ["Ra",        "male",  "Egyptian","sun god, radiant",                "radiant, divine, powerful",         "sun,divine,powerful,egyptian",      78,89],
  ["Anubis",    "male",  "Egyptian","guide to afterlife, loyal",       "loyal, protective, mysterious",     "guide,loyal,mysterious,egyptian",   77,89],
  // 10 color/nature
  ["Shadow",    "unisex","English", "dark shadow, mysterious",         "mysterious, dark, elusive",         "shadow,dark,mysterious,elusive",    84,87],
  ["Midnight",  "unisex","English", "darkest hour, mysterious",        "dark, mysterious, elegant",         "midnight,dark,elegant,mysterious",  86,88],
  ["Onyx",      "unisex","Greek",   "black gemstone, dark",            "sleek, dark, precious",             "gem,dark,sleek,precious",           83,87],
  ["Snowball",  "unisex","English", "white snowball, pure",            "pure, gentle, white",               "white,pure,gentle,snowball",        84,83],
  ["Marble",    "unisex","English", "marbled pattern, swirling",       "patterned, elegant, unique",        "pattern,elegant,unique,marble",     81,84],
  ["Ash",       "unisex","English", "ash tree, grey ash",              "calm, gentle, earthy",              "tree,calm,earthy,grey",             79,82],
  ["Frost",     "unisex","English", "cool frost, icy",                 "cool, crisp, elegant",              "cool,crisp,elegant,ice",            82,85],
  ["Storm",     "unisex","English", "fierce tempest",                  "fierce, bold, powerful",            "storm,fierce,bold,nature",          81,86],
  ["Pepper",    "unisex","English", "spicy pepper, bold",              "spicy, bold, energetic",            "spice,bold,energetic,food",         82,83],
  ["Ember",     "female","English", "warm glowing ember",              "warm, glowing, cozy",               "warm,glowing,cozy,fire",            83,85],
  // 9 food
  ["Oreo",      "unisex","American","black and white cookie",          "playful, sweet, colorful",          "cookie,sweet,playful,american",     84,84],
  ["Mochi",     "unisex","Japanese","sweet rice cake",                 "soft, sweet, round",                "japanese,sweet,soft,cute",          86,88],
  ["Tofu",      "unisex","Chinese", "soft bean curd",                  "soft, gentle, calm",                "chinese,soft,gentle,calm",          78,82],
  ["Biscuit",   "unisex","English", "small baked treat",               "warm, comforting, sweet",           "food,warm,sweet,comforting",        82,82],
  ["Waffle",    "unisex","English", "crispy batter waffle",            "warm, sweet, crispy",               "food,warm,sweet,breakfast",         81,83],
  ["Cookie",    "unisex","English", "sweet baked cookie",              "sweet, lovable, cheerful",          "sweet,lovable,cheerful,food",       83,83],
  ["Truffle",   "unisex","French",  "rare earthy mushroom",            "rare, earthy, luxurious",           "luxury,earthy,rare,french",         82,85],
  ["Fudge",     "unisex","English", "rich chocolate fudge",            "rich, sweet, indulgent",            "chocolate,rich,sweet,indulgent",    81,83],
  ["Nutmeg",    "unisex","English", "warm baking spice",               "warm, cozy, aromatic",              "spice,warm,cozy,aromatic",          80,82],
  // 5 generic cat
  ["Socks",     "unisex","English", "white-footed, socked cat",        "playful, classic, distinctive",     "socks,classic,distinctive,feet",    83,82],
  ["Whiskers",  "unisex","English", "cat's sensory whiskers",          "curious, sensitive, exploratory",   "whiskers,curious,sensory,cat",      82,82],
  ["Mittens",   "unisex","English", "white-pawed mittens",             "sweet, gentle, classic",            "mittens,sweet,classic,paws",        84,83],
  ["Fluffy",    "unisex","English", "soft and fluffy fur",             "soft, cuddly, gentle",              "fluffy,soft,cuddly,gentle",         86,83],
  ["Tiger",     "unisex","English", "striped tiger cat",               "fierce, bold, wild",                "tiger,fierce,bold,striped",         83,85],
  // 20 new Indian
  ["Kali",      "female","Sanskrit","black, fierce goddess",           "fierce, powerful, divine",          "goddess,fierce,divine,hindu",       82,88],
  ["Chiku",     "unisex","Hindi",   "sapodilla, sweet fruit",          "sweet, gentle, lovable",            "sweet,fruit,gentle,hindi",          80,82],
  ["Billi",     "female","Hindi",   "cat, little one",                 "playful, sweet, curious",           "cat,playful,sweet,hindi",           82,83],
  ["Guddu",     "male",  "Hindi",   "little dear boy",                 "playful, sweet, lovable",           "little,dear,sweet,hindi",           79,81],
  ["Sona",      "female","Hindi",   "golden, beloved one",             "sweet, golden, gentle",             "golden,sweet,gentle,hindi",         81,83],
  ["Tara",      "female","Sanskrit","star, shining one",               "bright, graceful, calm",            "star,bright,calm,hindu",            83,85],
  ["Asha",      "female","Sanskrit","hope, wish",                      "hopeful, gentle, bright",           "hope,bright,gentle,hindu",          81,84],
  ["Chamki",    "female","Hindi",   "sparkle, glitter",                "sparkling, bright, playful",        "sparkle,bright,playful,hindi",      80,83],
  ["Minu",      "female","Hindi",   "precious gem, little one",        "precious, gentle, sweet",           "gem,precious,gentle,hindi",         79,82],
  ["Cheeku",    "unisex","Hindi",   "chipmunk, small lively one",      "lively, small, playful",            "small,lively,playful,hindi",        79,82],
  ["Pushpa",    "female","Sanskrit","flower blossom",                  "gentle, fragrant, beautiful",       "flower,fragrant,beautiful,hindi",   78,82],
  ["Ganga",     "female","Sanskrit","sacred river, pure",              "pure, flowing, sacred",             "river,sacred,pure,hindu",           79,84],
  ["Shona",     "female","Hindi",   "golden, dear one",                "sweet, golden, warm",               "golden,sweet,warm,hindi",           80,82],
  ["Mitthu",    "unisex","Hindi",   "sweet talker, parrot",            "talkative, sweet, charming",        "sweet,talkative,charming,hindi",    79,82],
  ["Raju",      "male",  "Hindi",   "king, ruler",                     "bold, playful, lovable",            "king,bold,playful,hindi",           79,81],
  ["Pappu",     "male",  "Hindi",   "little one, dear child",          "playful, cute, lovable",            "little,cute,lovable,hindi",         78,80],
  ["Mithun",    "male",  "Sanskrit","Gemini, twin",                    "playful, dual-natured, charming",   "gemini,twin,charming,hindi",        77,82],
  ["Kajal",     "female","Hindi",   "kohl eyeliner, dark eyes",        "mysterious, beautiful, dark",       "kohl,dark,beautiful,hindi",         80,83],
  ["Nimo",      "male",  "Hindi",   "calm water, serene",              "calm, gentle, mysterious",          "calm,gentle,mysterious,hindi",      78,82],
  ["Laado",     "female","Hindi",   "beloved, darling one",            "beloved, sweet, gentle",            "beloved,sweet,gentle,hindi",        81,83],
];

// ── 23 CROSS-TYPE SEEDS (food/bird/fish/rabbit/hamster/turtle → cats) ─────────

const CROSS_SEEDS = [
  // Food names from dog pool (not in cat seeds)
  ["Mango",        "unisex","Hindi",   "tropical sweet mango",         "playful, tropical, vibrant",     "tropical,sweet,vibrant,fruit",      84,86],
  ["Caramel",      "female","French",  "golden toffee sweetness",      "warm, sweet, golden",            "sweet,warm,golden,french",          82,84],
  ["Cinnamon",     "female","English", "warm aromatic spice",          "warm, spicy, comforting",        "spice,warm,comforting,aromatic",    82,84],
  ["Honey",        "female","English", "sweet golden honey",           "sweet, gentle, warm",            "sweet,gentle,warm,golden",          84,85],
  ["Ginger",       "female","English", "pungent root, fiery",          "spicy, bold, fiery",             "spice,bold,fiery,orange",           83,84],
  ["Matcha",       "unisex","Japanese","powdered green tea",           "calm, earthy, unique",           "japanese,tea,calm,earthy",          81,86],
  ["Boba",         "unisex","Cantonese","bubble tea pearl",            "round, sweet, playful",          "bubble-tea,sweet,playful,asian",    80,85],
  // Bird names (cross-type)
  ["Robin",        "unisex","English", "red-breasted robin bird",      "cheerful, bright, friendly",     "bird,cheerful,bright,friendly",     83,84],
  ["Raven",        "unisex","English", "dark, clever raven",           "mysterious, dark, clever",       "dark,mysterious,clever,raven",      83,87],
  ["Wren",         "female","English", "small, spirited wren bird",    "perky, spirited, small",         "bird,perky,spirited,small",         82,84],
  ["Blue",         "unisex","English", "blue color, calm cool",        "calm, mysterious, cool",         "blue,calm,cool,color",              80,83],
  ["Sunny",        "unisex","English", "bright sunshine, warm",        "warm, bright, cheerful",         "sunny,bright,warm,cheerful",        83,83],
  // Fish names (cross-type)
  ["Coral",        "female","English", "warm ocean coral, pink",       "warm, colorful, tropical",       "coral,warm,colorful,ocean",         84,85],
  ["Sapphire",     "female","Greek",   "blue precious gemstone",       "precious, deep, beautiful",      "gem,blue,precious,beautiful",       83,86],
  // Rabbit names (cross-type)
  ["Clover",       "unisex","English", "lucky clover plant",           "lucky, gentle, nature-loving",   "lucky,clover,nature,plant",         83,83],
  ["Juniper",      "female","Latin",   "juniper berry shrub",          "fresh, herby, unique",           "herb,fresh,nature,unique",          81,83],
  ["Vanilla",      "female","Spanish", "sweet vanilla flavor",         "sweet, classic, gentle",         "sweet,gentle,classic,flavor",       83,82],
  ["Clementine",   "female","Latin",   "mild, merciful citrus",        "gentle, sweet, sunny",           "sweet,gentle,sunny,citrus",         82,83],
  ["Meadow",       "female","English", "open grassy meadow",           "free, natural, calm",            "nature,free,calm,grassy",           81,82],
  // Hamster names (cross-type)
  ["Gizmo",        "unisex","English", "clever gadget, mechanism",     "clever, curious, playful",       "clever,curious,playful,fun",        80,82],
  ["Chestnut",     "unisex","English", "warm brown chestnut nut",      "warm, earthy, cozy",             "nut,warm,earthy,cozy",              79,80],
  ["Butterscotch", "unisex","English", "buttery scotch candy",         "sweet, warm, buttery",           "sweet,buttery,warm,golden",         81,82],
  // Turtle names (cross-type)
  ["Darwin",       "male",  "English", "dear friend, naturalist",      "curious, scientific, clever",    "science,curious,clever,explorer",   80,83],
];

const ALL_SEEDS = [...CAT_SEEDS, ...CROSS_SEEDS]; // 125 total

// ── 30 ORIGINAL CAT PREFIXES ──────────────────────────────────────────────────

const CAT_OWN_PREFIXES = [
  // Nature (20)
  { word:"Golden",   meaning:"golden, shining",        keywords:"golden,shining",           pop:-5, vibe:+2 },
  { word:"Silver",   meaning:"silver, bright",          keywords:"silver,bright",            pop:-5, vibe:+2 },
  { word:"Shadow",   meaning:"dark, mysterious",        keywords:"shadow,dark",              pop:-6, vibe:+3 },
  { word:"Storm",    meaning:"fierce, powerful",        keywords:"storm,fierce",             pop:-5, vibe:+3 },
  { word:"Cloud",    meaning:"soft, dreamy",            keywords:"cloud,dreamy",             pop:-7, vibe:+1 },
  { word:"Moon",     meaning:"gentle, mysterious",      keywords:"moon,moonlit",             pop:-5, vibe:+2 },
  { word:"Sun",      meaning:"warm, radiant",           keywords:"sun,radiant",              pop:-5, vibe:+2 },
  { word:"Frost",    meaning:"cool, crisp",             keywords:"frost,cool",               pop:-7, vibe:+2 },
  { word:"Ember",    meaning:"warm, glowing",           keywords:"ember,glowing",            pop:-7, vibe:+2 },
  { word:"Blaze",    meaning:"fiery, bright",           keywords:"blaze,fiery",              pop:-6, vibe:+3 },
  { word:"Misty",    meaning:"soft, ethereal",          keywords:"misty,ethereal",           pop:-6, vibe:+1 },
  { word:"Midnight", meaning:"dark, mysterious night",  keywords:"midnight,dark,night",      pop:-4, vibe:+4 },
  { word:"Copper",   meaning:"warm reddish metal",      keywords:"copper,warm,metal",        pop:-5, vibe:+3 },
  { word:"Crimson",  meaning:"deep red, bold",          keywords:"crimson,red,bold",         pop:-5, vibe:+3 },
  { word:"Marble",   meaning:"elegant, patterned",      keywords:"marble,elegant,pattern",   pop:-6, vibe:+3 },
  { word:"Wild",     meaning:"untamed, free-spirited",  keywords:"wild,untamed,free",        pop:-5, vibe:+3 },
  { word:"Velvet",   meaning:"smooth, velvety",         keywords:"velvet,smooth,soft",       pop:-5, vibe:+3 },
  { word:"Sable",    meaning:"dark, luxurious",         keywords:"sable,dark,luxury",        pop:-6, vibe:+3 },
  { word:"Onyx",     meaning:"dark, precious onyx",     keywords:"onyx,dark,precious",       pop:-5, vibe:+3 },
  { word:"Pearl",    meaning:"precious, luminous",      keywords:"pearl,precious,luminous",  pop:-4, vibe:+3 },
  // Title (10)
  { word:"Duchess",  meaning:"noble duchess",           keywords:"duchess,noble,elegant",    pop:-5, vibe:+3 },
  { word:"Lady",     meaning:"noble, graceful",         keywords:"lady,noble,elegant",       pop:-4, vibe:+3 },
  { word:"Princess", meaning:"royal, graceful",         keywords:"princess,royal,regal",     pop:-5, vibe:+4 },
  { word:"Queen",    meaning:"regal, majestic",         keywords:"queen,regal,majestic",     pop:-4, vibe:+4 },
  { word:"Madam",    meaning:"distinguished lady",      keywords:"madam,distinguished",      pop:-6, vibe:+2 },
  { word:"Sir",      meaning:"knightly, noble",         keywords:"sir,noble,knight",         pop:-4, vibe:+3 },
  { word:"Prince",   meaning:"royal, noble heir",       keywords:"prince,royal,noble",       pop:-5, vibe:+4 },
  { word:"Lord",     meaning:"noble, powerful",         keywords:"lord,noble,powerful",      pop:-5, vibe:+3 },
  { word:"Count",    meaning:"noble count",             keywords:"count,noble,classic",      pop:-6, vibe:+3 },
  { word:"Countess", meaning:"noble countess",          keywords:"countess,noble,elegant",   pop:-6, vibe:+3 },
];

// ── 36 CROSS-TYPE PREFIXES (filtered from dog's list — blocked: Song/Bubble/Deep/Fluffy/Tiny/Fuzzy/Chubby/Ancient) ─

const CROSS_PREFIXES = [
  // From cats' universal pool (not already in cat_own)
  { word:"Crystal",  meaning:"clear, sparkling pure",    keywords:"crystal,pure,sparkling",   pop:-5, vibe:+3 },
  { word:"Jade",     meaning:"green jade, precious",     keywords:"jade,green,precious",      pop:-5, vibe:+3 },
  // From bird prefixes (non-blocked)
  { word:"Melody",   meaning:"sweet melody",             keywords:"melody,sweet,musical",     pop:-5, vibe:+3 },
  { word:"Rainbow",  meaning:"colorful, vibrant",        keywords:"rainbow,colorful,vivid",   pop:-5, vibe:+3 },
  { word:"Dawn",     meaning:"first light, new day",     keywords:"dawn,morning,light",       pop:-5, vibe:+3 },
  { word:"Coral",    meaning:"warm coral, colorful",     keywords:"coral,warm,colorful",      pop:-5, vibe:+2 },
  { word:"Breeze",   meaning:"gentle, free",             keywords:"breeze,gentle,free",       pop:-5, vibe:+2 },
  { word:"Sunny",    meaning:"bright, warm, cheerful",   keywords:"sunny,bright,warm",        pop:-4, vibe:+2 },
  { word:"Soar",     meaning:"high-flying, ambitious",   keywords:"soar,flight,high",         pop:-5, vibe:+3 },
  // From fish prefixes (non-blocked)
  { word:"Marina",   meaning:"of the sea, harbour",      keywords:"marina,sea,harbour",       pop:-5, vibe:+2 },
  { word:"Ocean",    meaning:"vast, deep",               keywords:"ocean,vast,deep",          pop:-4, vibe:+3 },
  { word:"Tidal",    meaning:"rhythmic, flowing",        keywords:"tidal,rhythmic,flowing",   pop:-6, vibe:+2 },
  { word:"Lagoon",   meaning:"calm, tranquil",           keywords:"lagoon,calm,tranquil",     pop:-6, vibe:+2 },
  { word:"Seafoam",  meaning:"soft, frothy",             keywords:"seafoam,frothy,soft",      pop:-6, vibe:+2 },
  { word:"Glimmer",  meaning:"glimmering, faint glow",   keywords:"glimmer,glow,light",       pop:-6, vibe:+2 },
  { word:"Dazzle",   meaning:"dazzling, brilliant",      keywords:"dazzle,brilliant,bright",  pop:-5, vibe:+3 },
  { word:"Teal",     meaning:"teal, blue-green",         keywords:"teal,blue-green,cool",     pop:-5, vibe:+2 },
  { word:"Azure",    meaning:"sky blue, bright",         keywords:"azure,blue,sky",           pop:-5, vibe:+2 },
  // From rabbit prefixes (non-blocked)
  { word:"Soft",     meaning:"soft, gentle",             keywords:"soft,gentle,delicate",     pop:-5, vibe:+2 },
  { word:"Bouncy",   meaning:"bouncy, energetic",        keywords:"bouncy,energetic,playful", pop:-5, vibe:+2 },
  { word:"Hoppy",    meaning:"hoppy, joyful",            keywords:"hoppy,joyful,playful",     pop:-5, vibe:+2 },
  { word:"Gentle",   meaning:"gentle, tender",           keywords:"gentle,tender,sweet",      pop:-5, vibe:+2 },
  { word:"Sweet",    meaning:"sweet, lovable",           keywords:"sweet,lovable,dear",       pop:-4, vibe:+2 },
  { word:"Little",   meaning:"little, tiny",             keywords:"little,tiny,small",        pop:-4, vibe:+1 },
  // From hamster prefixes (non-blocked)
  { word:"Wee",      meaning:"wee, very small",          keywords:"wee,small,little",         pop:-5, vibe:+2 },
  { word:"Round",    meaning:"round, chubby",            keywords:"round,chubby,cute",        pop:-5, vibe:+2 },
  { word:"Speedy",   meaning:"speedy, quick",            keywords:"speedy,quick,energetic",   pop:-5, vibe:+2 },
  { word:"Zippy",    meaning:"zippy, fast",              keywords:"zippy,fast,lively",        pop:-5, vibe:+2 },
  { word:"Plump",    meaning:"plump, round",             keywords:"plump,round,cute",         pop:-6, vibe:+2 },
  { word:"Honey",    meaning:"honey-sweet, warm",        keywords:"honey,sweet,warm",         pop:-4, vibe:+2 },
  { word:"Sugar",    meaning:"sugary sweet",             keywords:"sugar,sweet,gentle",       pop:-4, vibe:+2 },
  // From turtle prefixes (non-blocked)
  { word:"Stone",    meaning:"stone-solid, enduring",    keywords:"stone,solid,enduring",     pop:-5, vibe:+3 },
  { word:"Patient",  meaning:"patient, unhurried",       keywords:"patient,calm,unhurried",   pop:-5, vibe:+2 },
  { word:"Wise",     meaning:"wise, knowing",            keywords:"wise,knowing,ancient",     pop:-4, vibe:+3 },
  { word:"Steady",   meaning:"steady, reliable",         keywords:"steady,reliable,calm",     pop:-5, vibe:+2 },
  { word:"Calm",     meaning:"calm, serene",             keywords:"calm,serene,peaceful",     pop:-5, vibe:+2 },
];

// ── 13 NEW CAT-SPECIFIC PREFIXES (to complete 79 total) ───────────────────────

const NEW_CAT_PREFIXES = [
  { word:"Dreamy",   meaning:"dreamy, ethereal",         keywords:"dreamy,ethereal,serene",   pop:-5, vibe:+3 },
  { word:"Silky",    meaning:"silky, smooth",            keywords:"silky,smooth,soft",        pop:-5, vibe:+3 },
  { word:"Sleek",    meaning:"sleek, graceful",          keywords:"sleek,graceful,smooth",    pop:-5, vibe:+3 },
  { word:"Mystic",   meaning:"mystic, magical",          keywords:"mystic,magical,mysterious",pop:-4, vibe:+4 },
  { word:"Lunar",    meaning:"lunar, moon-touched",      keywords:"lunar,moon,mysterious",    pop:-5, vibe:+3 },
  { word:"Whisper",  meaning:"whispered, soft",          keywords:"whisper,soft,quiet",       pop:-5, vibe:+3 },
  { word:"Twilight", meaning:"twilight, dusk glow",      keywords:"twilight,dusk,glow",       pop:-4, vibe:+4 },
  { word:"Dusk",     meaning:"dusk, evening glow",       keywords:"dusk,evening,glow",        pop:-5, vibe:+3 },
  { word:"Frosted",  meaning:"frosted, icy sheen",       keywords:"frosted,icy,cool",         pop:-6, vibe:+3 },
  { word:"Royal",    meaning:"royal, regal",             keywords:"royal,regal,noble",        pop:-4, vibe:+4 },
  { word:"Regal",    meaning:"regal, majestic",          keywords:"regal,majestic,dignified", pop:-5, vibe:+4 },
  { word:"Noble",    meaning:"noble, dignified",         keywords:"noble,dignified,proud",    pop:-5, vibe:+3 },
  { word:"Elegant",  meaning:"elegant, refined",         keywords:"elegant,refined,graceful", pop:-5, vibe:+3 },
];

const ALL_PREFIXES = [...CAT_OWN_PREFIXES, ...CROSS_PREFIXES, ...NEW_CAT_PREFIXES]; // 79 total

// ── GENERATION — exact math: 125 seeds × 80 passes = 10,000 ─────────────────

function generateCatNames() {
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

const cats = generateCatNames();
const slugs = cats.map(c => c.slug);
const uniqueSlugs = new Set(slugs);
const crossPfxWords = new Set([...CROSS_PREFIXES, ...NEW_CAT_PREFIXES].map(p => p.word));
const crossPfxCombos = cats.filter(e => {
  const first = e.name.split(' ')[0];
  return crossPfxWords.has(first);
});
const crossSeedNames = new Set(CROSS_SEEDS.map(s => s[0]));
const crossSeedCombos = cats.filter(e => crossSeedNames.has(e.name.split(' ').pop()) && e.name.includes(' '));

console.log('─'.repeat(50));
console.log(`Cat seeds       : ${CAT_SEEDS.length}`);
console.log(`Cross-type seeds: ${CROSS_SEEDS.length}`);
console.log(`Total seeds     : ${ALL_SEEDS.length}`);
console.log(`Cat-own pfx     : ${CAT_OWN_PREFIXES.length}`);
console.log(`Cross-type pfx  : ${CROSS_PREFIXES.length}`);
console.log(`New cat pfx     : ${NEW_CAT_PREFIXES.length}`);
console.log(`Total prefixes  : ${ALL_PREFIXES.length}`);
console.log(`Expected total  : ${ALL_SEEDS.length * (ALL_PREFIXES.length + 1)}`);
console.log(`Total generated : ${cats.length}`);
console.log(`Unique slugs    : ${uniqueSlugs.size}`);
console.log(`Duplicates      : ${cats.length - uniqueSlugs.size}`);
console.log(`Cross-pfx combos: ${crossPfxCombos.length}`);
console.log(`Cross-seed combos:${crossSeedCombos.length}`);
console.log('─'.repeat(50));
console.log('First 10:', cats.slice(0, 10).map(c => c.name).join(', '));
console.log('Last  10:', cats.slice(-10).map(c => c.name).join(', '));
console.log('─'.repeat(50));

const outPath = join(__dir, 'cat-names-10000.json');
writeFileSync(outPath, JSON.stringify(cats, null, 2));
console.log(`Saved → scripts/cat-names-10000.json (${(JSON.stringify(cats).length / 1024).toFixed(0)} KB)`);
