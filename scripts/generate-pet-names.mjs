/**
 * Pet name generator + Supabase uploader.
 * Run: node scripts/generate-pet-names.mjs
 *
 * Requires SUPABASE_SERVICE_ROLE_KEY in environment (or .env.local).
 * Set it: $env:SUPABASE_SERVICE_ROLE_KEY="eyJ..."  (PowerShell)
 *         export SUPABASE_SERVICE_ROLE_KEY="eyJ..."  (bash)
 *
 * SQL to run first in Supabase SQL editor:
 *
 *   create table pet_names (
 *     id uuid primary key default gen_random_uuid(),
 *     slug text unique not null,
 *     pet_type text not null,
 *     name text not null,
 *     gender text not null default 'unisex',
 *     origin text not null,
 *     meaning_short text,
 *     meaning_long text,
 *     personality text,
 *     keywords text,
 *     popularity_score int default 70,
 *     ai_vibe_score int default 75,
 *     starting_letter text,
 *     created_at timestamptz default now()
 *   );
 *
 *   create table pet_swipes (
 *     id uuid primary key default gen_random_uuid(),
 *     user_id uuid references profiles(id) on delete cascade,
 *     pet_name_id uuid references pet_names(id) on delete cascade,
 *     liked boolean not null,
 *     created_at timestamptz default now(),
 *     unique(user_id, pet_name_id)
 *   );
 *
 *   create table pet_matches (
 *     id uuid primary key default gen_random_uuid(),
 *     room_code text not null,
 *     pet_name_id uuid references pet_names(id) on delete cascade,
 *     created_at timestamptz default now()
 *   );
 *
 *   create index on pet_names(pet_type);
 *   create index on pet_names(starting_letter);
 *   create index on pet_names(ai_vibe_score desc);
 *   create index on pet_swipes(user_id);
 *   create index on pet_swipes(pet_name_id);
 */

const SUPABASE_URL = "https://gitjchzvmskzenjlyvkc.supabase.co";
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "PASTE_SERVICE_ROLE_KEY_HERE";

// ── Helpers ──────────────────────────────────────────────────────────────────

function makeSlug(name, petType) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + petType;
}

const LONG = {
  dog: (n, o, m, p) => `${n} is a beloved dog name with ${o} roots. The name means "${m}". Dogs named ${n} are known for being ${p} — loyal companions who fill every home with unconditional love. Whether bounding through the park or napping at your feet, ${n} is a name that fits a four-legged friend perfectly.`,
  cat: (n, o, m, p) => `${n} is an elegant name for a cat with ${o} origins. The name means "${m}". Cats named ${n} tend to be ${p}, carrying an air of mystery and grace. This name captures the independent spirit and quiet charm that makes cats such fascinating companions.`,
  bird: (n, o, m, p) => `${n} is a bright, musical name for a bird rooted in ${o} tradition. The name means "${m}". Birds named ${n} are often ${p}, filling their home with color, song, and personality. A perfect name for a feathered friend who loves the spotlight.`,
  fish: (n, o, m, p) => `${n} is a graceful name for a fish drawing from ${o} tradition. The name means "${m}". Fish named ${n} glide through water with ${p} energy, bringing calm and beauty to any aquarium. A serene name for a serene companion.`,
  rabbit: (n, o, m, p) => `${n} is a soft, whimsical name for a rabbit with ${o} roots. The name means "${m}". Rabbits named ${n} are often ${p}, hopping their way into every heart they meet. This name perfectly captures the gentle, playful nature of your bunny.`,
  hamster: (n, o, m, p) => `${n} is a charming name for a hamster inspired by ${o} tradition. The name means "${m}". Hamsters named ${n} are often ${p}, entertaining their families with endless energy and tiny antics. A small name packed with big personality.`,
  turtle: (n, o, m, p) => `${n} is a wise, steady name for a turtle rooted in ${o} tradition. The name means "${m}". Turtles named ${n} embody ${p} qualities — calm, ancient, and endlessly fascinating. A name as timeless and enduring as the turtle itself.`,
};

function build(petType, entries) {
  return entries.map(([name, gender, origin, meaningShort, personality, keywords, popularity, vibe]) => ({
    slug: makeSlug(name, petType),
    pet_type: petType,
    name,
    gender,
    origin,
    meaning_short: meaningShort,
    meaning_long: LONG[petType](name, origin, meaningShort, personality),
    personality,
    keywords,
    popularity_score: popularity ?? 70,
    ai_vibe_score: vibe ?? 75,
    starting_letter: name[0]?.toUpperCase() ?? 'A',
  }));
}

// ── DOG NAMES ────────────────────────────────────────────────────────────────
// [name, gender, origin, meaning_short, personality, keywords, popularity, vibe]

const DOGS = build('dog', [
  // Classic English male
  ["Buddy",    "male",   "English",      "loyal companion",             "friendly, loyal, energetic",        "loyal,classic,friendly,playful",      95, 88],
  ["Max",      "male",   "Latin",        "the greatest",                "confident, smart, strong",          "classic,strong,popular,confident",    97, 90],
  ["Charlie",  "male",   "English",      "free man",                    "playful, cheerful, social",         "playful,classic,cheerful,friendly",   94, 87],
  ["Cooper",   "male",   "English",      "barrel maker",                "curious, energetic, clever",        "clever,energetic,classic,work",       88, 84],
  ["Milo",     "male",   "Latin",        "soldier, gracious",           "calm, affectionate, gentle",        "gentle,calm,sweet,popular",           86, 85],
  ["Oliver",   "male",   "Latin",        "olive tree",                  "peaceful, loving, steady",          "classic,peaceful,nature,gentle",      84, 83],
  ["Jack",     "male",   "Hebrew",       "God is gracious",             "bold, energetic, fun",              "classic,bold,energetic,traditional",  92, 86],
  ["Finn",     "male",   "Irish",        "fair, white",                 "adventurous, bright, spirited",     "adventurous,irish,bright,spirited",   85, 86],
  ["Archie",   "male",   "English",      "truly brave",                 "brave, lively, affectionate",       "brave,classic,lively,british",        82, 84],
  ["Gus",      "male",   "Latin",        "great, magnificent",          "jolly, easygoing, lovable",         "jolly,easygoing,short,classic",       78, 82],
  ["Teddy",    "male",   "English",      "God's gift",                  "cuddly, sweet, gentle",             "sweet,cuddly,gentle,gift",            87, 86],
  ["Zeus",     "male",   "Greek",        "sky father, king of gods",    "powerful, majestic, commanding",    "strong,powerful,mythological,king",   91, 92],
  ["Apollo",   "male",   "Greek",        "shining, destroyer",          "radiant, noble, graceful",          "mythological,noble,shining,greek",    83, 89],
  ["Thor",     "male",   "Norse",        "god of thunder",              "strong, protective, fearless",      "strong,norse,thunder,powerful",       86, 91],
  ["Rocky",    "male",   "American",     "rest, rocky terrain",         "tough, spirited, determined",       "tough,strong,pop-culture,fighter",    90, 88],
  ["Duke",     "male",   "Latin",        "leader, commander",           "noble, dignified, loyal",           "noble,leader,classic,dignified",      85, 87],
  ["Bruno",    "male",   "German",       "brown, armored",              "sturdy, reliable, warm",            "german,sturdy,classic,strong",        79, 83],
  ["Rex",      "male",   "Latin",        "king",                        "regal, powerful, confident",        "king,latin,strong,classic",           88, 89],
  ["Dexter",   "male",   "Latin",        "right-handed, skillful",      "clever, quick, agile",              "clever,skillful,smart,classic",       81, 85],
  ["Chester",  "male",   "English",      "fortress city",               "reliable, sturdy, lovable",         "sturdy,classic,reliable,british",     76, 81],
  ["Winston",  "male",   "English",      "joyful stone",                "dignified, calm, distinguished",    "british,dignified,classic,regal",     80, 85],
  ["Murphy",   "male",   "Irish",        "sea warrior",                 "lively, bold, charming",            "irish,sea,warrior,lively",            83, 84],
  ["Bailey",   "male",   "English",      "bailiff, steward",            "sweet, gentle, reliable",           "sweet,gentle,classic,friendly",       84, 83],
  ["Leo",      "male",   "Latin",        "lion",                        "brave, charismatic, bold",          "lion,brave,bold,short",               89, 88],
  ["Beau",     "male",   "French",       "handsome",                    "charming, elegant, lovable",        "french,handsome,charming,elegant",    82, 86],
  ["Hank",     "male",   "English",      "ruler of the home",           "dependable, friendly, easygoing",  "dependable,homey,classic,friendly",   78, 82],
  ["Sam",      "male",   "Hebrew",       "told by God",                 "gentle, wise, loyal",               "classic,gentle,biblical,loyal",       87, 84],
  ["Tucker",   "male",   "English",      "cloth-tucker, garment maker", "energetic, fun, bouncy",            "energetic,playful,classic,work",      85, 83],
  ["Hunter",   "male",   "English",      "one who hunts",               "athletic, alert, bold",             "athletic,bold,classic,adventure",     86, 85],
  ["Ace",      "male",   "Latin",        "number one, excellence",      "confident, champion, spirited",     "champion,confident,short,cool",       84, 88],
  ["Bear",     "male",   "English",      "strong like a bear",          "sturdy, protective, gentle giant",  "strong,nature,huge,protective",       87, 87],
  ["Jax",      "male",   "American",     "God has been gracious",       "cool, modern, energetic",           "cool,modern,short,energetic",         85, 86],
  ["Chase",    "male",   "English",      "to hunt, pursue",             "alert, swift, playful",             "swift,playful,active,modern",         84, 85],
  ["Maverick", "male",   "American",     "independent spirit",          "free-spirited, bold, unique",       "bold,independent,modern,cool",        86, 89],
  ["Ranger",   "male",   "English",      "forest keeper, guardian",     "watchful, loyal, outdoorsy",        "outdoor,loyal,guardian,nature",       81, 85],
  ["Scout",    "male",   "English",      "to observe, explore",         "curious, adventurous, alert",       "curious,adventurous,nature,smart",    83, 85],
  ["Diesel",   "male",   "German",       "powerful engine",             "robust, powerful, fast",            "powerful,strong,bold,cool",           80, 84],
  ["Boomer",   "male",   "American",     "loud and boisterous",         "boisterous, fun, friendly",         "loud,fun,playful,energetic",          79, 82],
  ["Tank",     "male",   "American",     "heavy, powerful",             "strong, solid, dependable",         "strong,heavy,powerful,tough",         80, 83],
  ["Atlas",    "male",   "Greek",        "to carry, endure",            "strong, dependable, worldly",       "strong,greek,mythological,endure",    82, 87],
  ["Odin",     "male",   "Norse",        "fury and wisdom",             "wise, powerful, mystical",          "wise,norse,powerful,mythological",    83, 90],
  ["Bandit",   "male",   "American",     "outlaw, rebel",               "mischievous, clever, energetic",    "mischievous,rebel,fun,energetic",     82, 84],
  ["Rufus",    "male",   "Latin",        "red-haired",                  "cheerful, warm, friendly",          "classic,red,cheerful,warm",           76, 81],
  ["Cody",     "male",   "Irish",        "helpful one",                 "helpful, friendly, playful",        "helpful,irish,friendly,classic",      82, 82],
  ["Louie",    "male",   "German",       "famous warrior",              "lively, charming, lovable",         "lively,charming,french,classic",      81, 83],
  ["Bentley",  "male",   "English",      "bent grass meadow",           "distinguished, regal, stylish",     "regal,stylish,british,distinguished", 80, 86],
  ["Otto",     "male",   "German",       "wealth, fortune",             "steady, classic, reliable",         "german,classic,steady,reliable",      77, 82],
  ["Toby",     "male",   "Hebrew",       "God is good",                 "sweet, gentle, loving",             "sweet,gentle,classic,biblical",       84, 83],
  ["Jake",     "male",   "Hebrew",       "supplanter",                  "loyal, bold, energetic",            "classic,loyal,bold,biblical",         85, 83],
  ["Moose",    "male",   "American",     "large and powerful",          "big, friendly, gentle giant",       "big,nature,large,gentle",             80, 84],
  ["Henry",    "male",   "German",       "ruler of the home",           "regal, kind, steady",               "regal,classic,kind,distinguished",   83, 85],
  ["Hugo",     "male",   "German",       "mind, intellect",             "intelligent, noble, curious",       "intelligent,noble,german,classic",    81, 85],
  ["Buster",   "male",   "American",     "tough, sturdy",               "tough, playful, energetic",         "tough,playful,classic,energetic",     83, 83],
  ["Rudy",     "male",   "German",       "famous wolf",                 "spirited, charming, friendly",      "german,wolf,spirited,friendly",       79, 83],
  ["Riley",    "unisex", "Irish",        "valiant, courageous",         "brave, spirited, lively",           "brave,irish,spirited,lively",         85, 84],
  ["Ziggy",    "male",   "German",       "victorious protector",        "fun, quirky, energetic",            "fun,quirky,energetic,unique",         78, 85],
  ["Samson",   "male",   "Hebrew",       "sun child, strong",           "powerful, noble, brave",            "strong,biblical,powerful,noble",      79, 85],
  // Classic English female
  ["Bella",    "female", "Italian",      "beautiful",                   "loving, sweet, graceful",           "beautiful,popular,sweet,loving",      98, 90],
  ["Lucy",     "female", "English",      "light, illumination",         "bright, playful, clever",           "bright,light,playful,classic",        95, 88],
  ["Daisy",    "female", "English",      "day's eye flower",            "cheerful, sunny, gentle",           "flower,cheerful,sunny,classic",       92, 87],
  ["Molly",    "female", "Hebrew",       "wished-for child",            "sweet, loving, loyal",              "sweet,loving,classic,biblical",       91, 86],
  ["Sadie",    "female", "Hebrew",       "princess",                    "feisty, loving, spirited",          "princess,feisty,loving,spirited",     89, 87],
  ["Lola",     "female", "Spanish",      "sorrows, strong woman",       "bold, playful, spirited",           "bold,playful,spanish,spirited",       88, 86],
  ["Sophie",   "female", "Greek",        "wisdom",                      "wise, gentle, affectionate",        "wise,gentle,greek,classic",           90, 87],
  ["Rosie",    "female", "English",      "rose flower",                 "loving, cheerful, sweet",           "flower,sweet,loving,classic",         89, 87],
  ["Maggie",   "female", "Greek",        "pearl",                       "sweet, loyal, gentle",              "pearl,sweet,loyal,classic",           88, 85],
  ["Coco",     "female", "French",       "chocolate, coconut",          "playful, chic, lovable",            "chocolate,chic,playful,french",       87, 87],
  ["Stella",   "female", "Latin",        "star",                        "radiant, bold, affectionate",       "star,radiant,bold,latin",             90, 89],
  ["Nala",     "female", "African",      "successful, beloved",         "regal, gentle, brave",              "african,regal,gentle,lion-king",      85, 88],
  ["Abby",     "female", "Hebrew",       "father's joy",                "joyful, loving, loyal",             "joyful,loving,classic,biblical",      87, 85],
  ["Penny",    "female", "Greek",        "weaver of dreams",            "clever, loving, cheerful",          "clever,cheerful,classic,greek",       86, 85],
  ["Ruby",     "female", "Latin",        "deep red gemstone",           "vibrant, passionate, loving",       "ruby,gem,vibrant,loving",             88, 87],
  ["Chloe",    "female", "Greek",        "blooming, spring green",      "lively, sweet, social",             "blooming,lively,greek,sweet",         89, 86],
  ["Zoe",      "female", "Greek",        "life",                        "full of life, playful, bright",     "life,bright,playful,greek",           90, 88],
  ["Ellie",    "female", "Greek",        "bright shining one",          "bright, sweet, loving",             "bright,sweet,loving,classic",         88, 87],
  ["Hazel",    "female", "English",      "hazel tree, wise",            "gentle, wise, nature-loving",       "nature,wise,gentle,plant",            85, 86],
  ["Millie",   "female", "English",      "strength, determination",     "determined, sweet, gentle",         "strength,sweet,classic,gentle",       85, 84],
  ["Bonnie",   "female", "Scottish",     "beautiful, good",             "sweet, lively, loving",             "scottish,sweet,lively,beautiful",     83, 85],
  ["Nova",     "female", "Latin",        "new star, brightness",        "bright, curious, energetic",        "star,bright,modern,space",            86, 88],
  ["Angel",    "female", "Greek",        "messenger of God",            "sweet, gentle, heavenly",           "angel,sweet,gentle,divine",           85, 85],
  ["Poppy",    "female", "English",      "red flower, remembrance",     "bright, cheerful, energetic",       "flower,bright,cheerful,british",      84, 86],
  ["Luna",     "female", "Latin",        "moon",                        "gentle, mysterious, beautiful",     "moon,mysterious,beautiful,latin",     92, 89],
  ["Honey",    "female", "English",      "sweet nectar",                "sweet, loving, gentle",             "sweet,gentle,loving,nature",          86, 85],
  ["Ivy",      "female", "English",      "faithfulness, vine",          "tenacious, graceful, loyal",        "nature,faithful,graceful,plant",      84, 85],
  ["Maple",    "female", "English",      "maple tree, sweetness",       "sweet, warm, nature-loving",        "nature,sweet,warm,canadian",          83, 85],
  ["Sage",     "female", "English",      "wise one, healing herb",      "calm, wise, serene",                "wise,herb,calm,nature",               84, 86],
  ["Willow",   "female", "English",      "graceful tree",               "graceful, gentle, fluid",           "nature,graceful,gentle,tree",         86, 87],
  ["Aurora",   "female", "Latin",        "dawn, northern lights",       "radiant, magical, beautiful",       "dawn,magical,beautiful,space",        87, 90],
  ["Athena",   "female", "Greek",        "goddess of wisdom",           "wise, noble, strong",               "wisdom,goddess,greek,noble",          85, 89],
  ["Freya",    "female", "Norse",        "noble lady",                  "fierce, loving, noble",             "norse,noble,goddess,fierce",          84, 88],
  // Indian male dogs
  ["Raja",     "male",   "Sanskrit",     "king, ruler",                 "regal, commanding, loyal",          "king,indian,royal,loyal",             90, 88],
  ["Moti",     "male",   "Hindi",        "pearl, precious",             "gentle, precious, loyal",           "pearl,hindi,gentle,traditional",      82, 82],
  ["Sheru",    "male",   "Hindi",        "lion, brave one",             "brave, fierce, protective",         "lion,brave,hindi,traditional",        85, 85],
  ["Tiger",    "male",   "English",      "fierce and powerful",         "fierce, athletic, bold",            "tiger,powerful,fierce,bold",          88, 86],
  ["Bheem",    "male",   "Sanskrit",     "powerful, from Mahabharata",  "mighty, strong, noble",             "mahabharata,powerful,indian,strong",  83, 86],
  ["Arjun",    "male",   "Sanskrit",     "bright, white, from epic",    "skillful, brave, noble",            "mahabharata,brave,indian,noble",      85, 87],
  ["Veer",     "male",   "Hindi",        "brave hero",                  "brave, protective, strong",         "brave,hero,hindi,strong",             84, 86],
  ["Dev",      "male",   "Sanskrit",     "divine, god-like",            "noble, divine, gentle",             "divine,god,indian,noble",             83, 85],
  ["Raj",      "male",   "Sanskrit",     "ruler, king",                 "regal, confident, noble",           "king,ruler,indian,royal",             86, 85],
  ["Badal",    "male",   "Hindi",        "cloud, one who brings rain",  "calm, fluid, protective",           "cloud,nature,hindi,calm",             78, 83],
  ["Bijli",    "female", "Hindi",        "lightning, electric",         "swift, energetic, bright",          "lightning,electric,hindi,swift",      80, 86],
  ["Shiv",     "male",   "Sanskrit",     "auspicious, Lord Shiva",      "powerful, calm, divine",            "shiva,divine,powerful,hindu",         84, 87],
  ["Pawan",    "male",   "Sanskrit",     "wind, breeze",                "free, swift, gentle",               "wind,nature,sanskrit,gentle",         80, 83],
  ["Kabir",    "male",   "Arabic",       "great, noble",                "wise, noble, spiritual",            "wise,noble,sufi,spiritual",           82, 86],
  ["Dhruv",    "male",   "Sanskrit",     "polar star, steadfast",       "steadfast, reliable, bright",       "star,steadfast,reliable,hindu",       83, 86],
  ["Rudra",    "male",   "Sanskrit",     "roarer, storm god",           "fierce, powerful, intense",         "storm,fierce,powerful,shiva",         82, 87],
  ["Vikram",   "male",   "Sanskrit",     "brave, valiant",              "brave, heroic, victorious",         "brave,heroic,indian,valiant",         83, 86],
  // Indian female dogs
  ["Rani",     "female", "Hindi",        "queen",                       "regal, loving, gentle",             "queen,regal,indian,loving",           88, 86],
  ["Chameli",  "female", "Hindi",        "jasmine flower",              "gentle, sweet, fragrant",           "flower,sweet,hindi,fragrant",         80, 82],
  ["Durga",    "female", "Sanskrit",     "goddess, impassable",         "fierce, protective, divine",        "goddess,fierce,divine,hindu",         82, 87],
  ["Lakshmi",  "female", "Sanskrit",     "goddess of wealth and beauty","graceful, auspicious, beautiful",   "goddess,wealth,beauty,hindu",         84, 87],
  ["Meera",    "female", "Sanskrit",     "devotee, sea of love",        "devotional, sweet, gentle",         "devotion,love,krishna,hindi",         83, 85],
  ["Radha",    "female", "Sanskrit",     "success, beloved of Krishna", "loving, devoted, gentle",           "krishna,love,devoted,hindi",          82, 85],
  ["Sita",     "female", "Sanskrit",     "furrow, beloved of Rama",     "pure, gentle, devoted",             "ramayana,pure,devoted,hindu",         81, 84],
  ["Mishka",   "female", "Russian",      "little mouse, sweet",         "tiny, sweet, adorable",             "sweet,tiny,russian,adorable",         83, 85],
  ["Priya",    "female", "Sanskrit",     "beloved, dear",               "loving, affectionate, warm",        "beloved,loving,indian,warm",          85, 85],
  ["Nisha",    "female", "Sanskrit",     "night, darkness",             "mysterious, gentle, calm",          "night,mysterious,calm,hindi",         80, 83],
  ["Tulsi",    "female", "Sanskrit",     "holy basil, sacred plant",    "sacred, gentle, aromatic",          "sacred,plant,holy,hindi",             79, 82],
  ["Sapna",    "female", "Hindi",        "dream",                       "dreamy, gentle, imaginative",       "dream,dreamy,hindi,gentle",           79, 82],
  ["Pinky",    "female", "English",      "rosy pink, sweet",            "sweet, playful, cheerful",          "pink,sweet,playful,cheerful",         82, 81],
  ["Gudiya",   "female", "Hindi",        "little doll, darling",        "adorable, sweet, precious",         "doll,sweet,adorable,hindi",           80, 82],
  // Mythological male
  ["Hermes",   "male",   "Greek",        "messenger of the gods",       "swift, clever, adventurous",        "greek,messenger,swift,mythological",  78, 87],
  ["Poseidon", "male",   "Greek",        "ocean god",                   "powerful, commanding, fluid",       "ocean,powerful,greek,mythological",   77, 88],
  ["Ares",     "male",   "Greek",        "god of war",                  "fierce, bold, powerful",            "war,fierce,greek,mythological",       76, 87],
  ["Loki",     "male",   "Norse",        "trickster god",               "clever, mischievous, charming",     "trickster,norse,clever,mythological", 80, 88],
  ["Odin",     "male",   "Norse",        "fury, wisdom",                "wise, powerful, mystical",          "wisdom,norse,powerful,mythological",  78, 90],
  ["Osiris",   "male",   "Egyptian",     "god of the underworld",       "mysterious, noble, ancient",        "egyptian,ancient,noble,mythological", 74, 87],
  ["Horus",    "male",   "Egyptian",     "falcon god, sky lord",        "watchful, noble, powerful",         "falcon,egyptian,sky,mythological",    75, 87],
  ["Anubis",   "male",   "Egyptian",     "guide to the afterlife",      "loyal, protective, mysterious",     "egyptian,guide,loyal,mythological",   76, 88],
  // Nature/space
  ["Storm",    "male",   "English",      "tempest, powerful weather",   "fierce, bold, energetic",           "storm,fierce,bold,nature",            82, 86],
  ["Blaze",    "male",   "English",      "bright fire, flame",          "fiery, energetic, fast",            "fire,energetic,fast,bold",            83, 87],
  ["Phoenix",  "unisex", "Greek",        "mythical firebird, rebirth",  "resilient, bold, radiant",          "fire,rebirth,bold,mythological",      85, 90],
  ["Comet",    "male",   "English",      "space traveler, blazing star", "fast, bright, adventurous",        "space,fast,bright,adventurous",       80, 86],
  ["Cosmo",    "male",   "Greek",        "order, universe",             "cosmic, curious, bright",           "space,universe,bright,curious",       79, 86],
  ["River",    "unisex", "English",      "flowing water",               "calm, fluid, free-spirited",        "water,calm,nature,free",              83, 85],
  ["Zephyr",   "male",   "Greek",        "west wind, gentle breeze",    "free, gentle, swift",               "wind,gentle,greek,nature",            80, 86],
  // Food/cute
  ["Mochi",    "unisex", "Japanese",     "sweet rice cake",             "soft, sweet, round",                "japanese,sweet,soft,cute",            86, 88],
  ["Pretzel",  "male",   "German",       "twisted bread",               "quirky, clever, fun",               "bread,quirky,fun,german",             76, 83],
  ["Waffle",   "unisex", "English",      "crispy batter cake",          "sweet, warm, comforting",           "breakfast,sweet,warm,fun",            80, 85],
  ["Biscuit",  "unisex", "English",      "small flat cake",             "warm, comforting, sweet",           "food,sweet,comforting,classic",       82, 84],
  ["Cookie",   "unisex", "English",      "sweet baked treat",           "sweet, lovable, cheerful",          "sweet,baked,cheerful,lovable",        84, 85],
  ["Peanut",   "unisex", "English",      "small but mighty",            "tiny, energetic, adorable",         "tiny,cute,energetic,small",           83, 85],
  ["Noodle",   "unisex", "English",      "thin pasta, long and wiggly", "wiggly, playful, goofy",            "funny,wiggly,goofy,playful",          80, 84],
  ["Boba",     "unisex", "Cantonese",    "bubble tea pearl",            "round, sweet, fun",                 "bubble-tea,sweet,fun,asian",          79, 85],
  ["Matcha",   "unisex", "Japanese",     "powdered green tea",          "calm, earthy, gentle",              "japanese,tea,calm,earthy",            80, 86],
  ["Churro",   "male",   "Spanish",      "fried dough pastry",          "warm, sweet, festive",              "spanish,sweet,warm,festive",          77, 83],
  ["Espresso", "male",   "Italian",      "strong concentrated coffee",  "energetic, bold, intense",          "coffee,bold,intense,italian",         78, 85],
  ["Kimchi",   "unisex", "Korean",       "fermented vegetable dish",    "spicy, bold, unique",               "korean,spicy,bold,unique",            75, 84],
  ["Mango",    "unisex", "Hindi",        "tropical sweet fruit",        "sweet, tropical, vibrant",          "tropical,sweet,vibrant,fruit",        84, 86],
  ["Kiwi",     "unisex", "Maori",        "green fruit, NZ bird",        "perky, bright, energetic",          "fruit,bright,energetic,green",        81, 84],
  ["Coco",     "unisex", "French",       "coconut, chocolate",          "sweet, playful, chic",              "chocolate,coconut,sweet,playful",     85, 86],
  ["Maple",    "unisex", "English",      "maple tree, sweet syrup",     "sweet, warm, nature-loving",        "nature,sweet,warm,tree",              83, 85],
  ["Caramel",  "female", "French",       "golden toffee sweetness",     "warm, sweet, golden",               "sweet,warm,golden,french",            82, 84],
  ["Cinnamon", "female", "English",      "warm aromatic spice",         "warm, spicy, comforting",           "spice,warm,comforting,aromatic",      82, 84],
  ["Ginger",   "female", "English",      "pungent root, purity",        "spicy, energetic, bright",          "spice,bright,energetic,classic",      83, 84],
  ["Nutmeg",   "unisex", "English",      "warm baking spice",           "warm, cozy, aromatic",              "spice,warm,cozy,aromatic",            78, 83],
  // Pop culture
  ["Pluto",    "male",   "Roman",        "god of the underworld, planet","playful, loyal, cheerful",         "disney,planet,playful,classic",       88, 85],
  ["Snoopy",   "male",   "American",     "clever beagle detective",     "smart, imaginative, lovable",       "peanuts,clever,lovable,cartoon",      90, 88],
  ["Scooby",   "male",   "American",     "mystery-solving great dane",  "brave, lovable, funny",             "cartoon,brave,funny,lovable",         88, 87],
  ["Lassie",   "female", "Scottish",     "loyal and faithful collie",   "loyal, brave, heroic",              "classic,loyal,brave,tv",              87, 86],
  ["Bolt",     "male",   "American",     "lightning bolt, superdog",    "fast, brave, loyal",                "disney,fast,brave,loyal",             83, 85],
]);

// ── CAT NAMES ────────────────────────────────────────────────────────────────

const CATS = build('cat', [
  // Classic English/European male
  ["Oliver",   "male",   "Latin",        "olive tree, peaceful",        "gentle, curious, affectionate",     "peaceful,gentle,popular,classic",     95, 88],
  ["Leo",      "male",   "Latin",        "lion, bold",                  "bold, regal, playful",              "lion,bold,regal,popular",             94, 89],
  ["Milo",     "male",   "Latin",        "soldier, gracious",           "gentle, affectionate, curious",     "gentle,curious,popular,classic",      92, 87],
  ["Charlie",  "male",   "English",      "free man",                    "playful, social, lovable",          "playful,social,classic,friendly",     91, 86],
  ["Jack",     "male",   "Hebrew",       "God is gracious",             "bold, curious, independent",        "bold,curious,classic,independent",    89, 85],
  ["Simba",    "male",   "Swahili",      "lion, strength",              "regal, adventurous, proud",         "lion-king,regal,pride,african",       90, 89],
  ["Oscar",    "male",   "Irish",        "God's spear, champion",       "wise, proud, independent",          "wise,proud,classic,irish",            88, 86],
  ["Jasper",   "male",   "Persian",      "treasurer, gemstone",         "elegant, mysterious, calm",         "gem,elegant,mysterious,persian",      85, 87],
  ["Hugo",     "male",   "German",       "mind, intellect",             "intellectual, curious, noble",      "intelligent,noble,german,curious",    84, 86],
  ["Felix",    "male",   "Latin",        "happy, fortunate",            "happy, playful, lucky",             "happy,lucky,cartoon,latin",           87, 86],
  ["Merlin",   "male",   "Welsh",        "sea fortress, wizard",        "wise, magical, mysterious",         "wizard,magical,mysterious,welsh",     83, 88],
  ["Gandalf",  "male",   "Norse",        "staff elf, wise wizard",      "wise, mysterious, ancient",         "wizard,wise,tolkien,magical",         82, 88],
  ["Romeo",    "male",   "Italian",      "pilgrim to Rome, romantic",   "romantic, passionate, dramatic",    "romantic,italian,dramatic,love",      83, 86],
  ["Dante",    "male",   "Latin",        "enduring, steadfast",         "literary, intense, mysterious",     "literary,intense,italian,classic",    81, 86],
  ["Loki",     "male",   "Norse",        "trickster god",               "mischievous, clever, charming",     "trickster,norse,clever,mischievous",  84, 87],
  ["Thor",     "male",   "Norse",        "thunder god",                 "bold, strong, playful",             "norse,thunder,bold,strong",           83, 87],
  ["Theo",     "male",   "Greek",        "gift of God",                 "sweet, gentle, curious",            "divine,sweet,gentle,greek",           85, 86],
  ["George",   "male",   "Greek",        "earth worker, farmer",        "steady, friendly, reliable",        "classic,steady,british,reliable",     82, 83],
  ["Monty",    "male",   "French",       "mountain",                    "bold, dignified, noble",            "french,noble,dignified,classic",      80, 84],
  ["Wilbur",   "male",   "English",      "wild boar, brave",            "gentle, bookish, sweet",            "gentle,sweet,charlotte,classic",      78, 82],
  ["Winston",  "male",   "English",      "joyful stone",                "distinguished, calm, wise",         "british,distinguished,wise,classic",  82, 85],
  // Classic English/European female
  ["Luna",     "female", "Latin",        "moon goddess",                "mysterious, serene, independent",   "moon,mysterious,serene,popular",      97, 90],
  ["Bella",    "female", "Italian",      "beautiful",                   "sweet, affectionate, beautiful",    "beautiful,sweet,popular,classic",     95, 89],
  ["Nala",     "female", "African",      "successful, beloved",         "regal, sweet, brave",               "african,regal,lion-king,brave",       90, 88],
  ["Cleo",     "female", "Greek",        "glory, pride",                "regal, independent, mysterious",    "egyptian,regal,mysterious,classic",   89, 88],
  ["Chloe",    "female", "Greek",        "blooming, spring",            "lively, curious, social",           "blooming,lively,greek,social",        91, 87],
  ["Sophie",   "female", "Greek",        "wisdom",                      "wise, elegant, gentle",             "wise,elegant,greek,classic",          89, 86],
  ["Lily",     "female", "English",      "pure flower",                 "delicate, sweet, graceful",         "flower,pure,sweet,graceful",          90, 87],
  ["Daisy",    "female", "English",      "day's eye flower",            "cheerful, bright, simple",          "flower,cheerful,bright,classic",      88, 85],
  ["Rosie",    "female", "English",      "rose flower",                 "sweet, loving, cheerful",           "flower,sweet,loving,classic",         87, 85],
  ["Misty",    "female", "English",      "covered in mist",             "mysterious, gentle, ethereal",      "mysterious,gentle,fog,classic",       86, 85],
  ["Callie",   "female", "Greek",        "beautiful, lovely",           "sweet, playful, curious",           "beautiful,sweet,playful,greek",       85, 84],
  ["Gracie",   "female", "Latin",        "grace, blessing",             "graceful, sweet, gentle",           "grace,gentle,sweet,classic",          86, 85],
  ["Ivy",      "female", "English",      "faithfulness, climbing vine", "tenacious, curious, graceful",      "nature,faithful,graceful,climbing",   85, 85],
  ["Hazel",    "female", "English",      "hazel tree, wise",            "wise, gentle, earthy",              "nature,wise,gentle,earthy",           84, 85],
  ["Willow",   "female", "English",      "graceful tree",               "graceful, gentle, serene",          "nature,graceful,gentle,serene",       86, 86],
  ["Violet",   "female", "Latin",        "purple flower",               "gentle, artistic, mysterious",      "flower,purple,artistic,gentle",       85, 86],
  ["Aurora",   "female", "Latin",        "dawn, northern lights",       "magical, radiant, beautiful",       "dawn,magical,beautiful,space",        86, 89],
  ["Stella",   "female", "Latin",        "star",                        "radiant, bold, luminous",           "star,radiant,bold,latin",             87, 88],
  ["Nova",     "female", "Latin",        "new star",                    "bright, curious, energetic",        "star,bright,modern,curious",          87, 88],
  ["Ellie",    "female", "Greek",        "bright shining one",          "bright, sweet, playful",            "bright,sweet,playful,gentle",         86, 85],
  ["Pearl",    "female", "English",      "pure, precious gem",          "elegant, precious, serene",         "gem,elegant,precious,serene",         83, 85],
  ["Poppy",    "female", "English",      "red flower",                  "bright, cheerful, bold",            "flower,bright,cheerful,bold",         85, 85],
  ["Iris",     "female", "Greek",        "rainbow goddess",             "colorful, independent, graceful",   "rainbow,goddess,greek,graceful",      84, 86],
  // Indian cats
  ["Billu",    "male",   "Hindi",        "shining, bright one",         "playful, lovable, mischievous",     "hindi,shining,playful,beloved",       85, 83],
  ["Mitu",     "unisex", "Hindi",        "sweet talker, parrot",        "chatty, playful, social",           "hindi,parrot,chatty,social",          82, 82],
  ["Kalu",     "male",   "Hindi",        "dark one, black",             "mysterious, clever, independent",   "dark,mysterious,clever,hindi",        80, 82],
  ["Nandini",  "female", "Sanskrit",     "delightful, daughter of joy", "joyful, gentle, affectionate",      "joy,gentle,divine,hindu",             81, 83],
  ["Pari",     "female", "Persian",      "fairy, angel",                "fairy-like, graceful, magical",     "fairy,magical,graceful,persian",      83, 85],
  ["Sonu",     "unisex", "Hindi",        "golden, beloved",             "golden, loving, sweet",             "golden,loving,sweet,hindi",           82, 82],
  ["Golu",     "male",   "Hindi",        "chubby, round",               "chubby, lovable, playful",          "chubby,lovable,round,cute",           83, 83],
  // Egyptian/mythological cats
  ["Bastet",   "female", "Egyptian",     "goddess of cats and home",    "regal, protective, divine",         "egyptian,goddess,cat,divine",         84, 90],
  ["Cleopatra","female", "Greek",        "glory of the father, queen",  "regal, commanding, mysterious",     "egyptian,queen,regal,mysterious",     83, 89],
  ["Isis",     "female", "Egyptian",     "throne, goddess of magic",    "magical, nurturing, powerful",      "egyptian,goddess,magic,powerful",     82, 88],
  ["Sphinx",   "male",   "Greek",        "to squeeze, the great riddle","mysterious, wise, stoic",           "egyptian,mysterious,ancient,wise",    78, 87],
  ["Pharaoh",  "male",   "Egyptian",     "great house, ruler",          "regal, commanding, proud",          "egyptian,regal,ruler,proud",          79, 87],
  ["Ra",       "male",   "Egyptian",     "sun god, king of gods",       "radiant, powerful, divine",         "sun,god,egyptian,divine",             80, 88],
  ["Anubis",   "male",   "Egyptian",     "guide to the afterlife",      "loyal, mysterious, protective",     "guide,egyptian,mystery,protective",   78, 87],
  // Nature/color cats
  ["Shadow",   "unisex", "English",      "dark reflection",             "mysterious, quiet, sleek",          "dark,mysterious,sleek,quiet",         87, 86],
  ["Midnight", "unisex", "English",      "darkest hour of night",       "mysterious, independent, dark",     "dark,mysterious,night,independent",   85, 86],
  ["Onyx",     "unisex", "Greek",        "black gemstone",              "sleek, mysterious, elegant",        "black,gem,sleek,mysterious",          83, 86],
  ["Misty",    "female", "English",      "covered in soft mist",        "soft, gentle, ethereal",            "soft,gentle,fog,ethereal",            83, 84],
  ["Snowball", "unisex", "English",      "white as snow",               "fluffy, gentle, sweet",             "white,fluffy,gentle,sweet",           85, 84],
  ["Marble",   "unisex", "English",      "streaked stone pattern",      "elegant, unique, beautiful",        "pattern,elegant,unique,stone",        80, 83],
  ["Ash",      "unisex", "English",      "ash tree, gray",              "calm, elegant, understated",        "gray,calm,elegant,nature",            81, 83],
  ["Frost",    "unisex", "English",      "frozen water crystals",       "cool, elegant, serene",             "cold,elegant,serene,winter",          80, 84],
  ["Storm",    "unisex", "English",      "tempest, weather",            "fierce, independent, powerful",     "fierce,independent,powerful,weather", 81, 85],
  ["Pepper",   "unisex", "English",      "peppery black-and-white",     "spicy, energetic, playful",         "spicy,energetic,playful,bw",          82, 83],
  // Food cats
  ["Oreo",     "unisex", "American",     "black-and-white cookie",      "sweet, playful, classic",           "cookie,sweet,black-white,playful",    88, 86],
  ["Mochi",    "unisex", "Japanese",     "sweet rice cake",             "soft, round, sweet",                "japanese,sweet,soft,round",           86, 87],
  ["Tofu",     "unisex", "Chinese",      "white bean curd",             "soft, gentle, pure",                "chinese,soft,white,gentle",           82, 84],
  ["Biscuit",  "unisex", "English",      "small baked treat",           "warm, comforting, sweet",           "food,warm,sweet,comforting",          83, 83],
  ["Waffle",   "unisex", "English",      "crispy batter cake",          "warm, sweet, cozy",                 "food,warm,sweet,cozy",                82, 84],
  ["Cookie",   "unisex", "English",      "sweet baked treat",           "sweet, lovable, warm",              "food,sweet,warm,lovable",             84, 84],
  ["Truffle",  "unisex", "French",       "rare earthy mushroom",        "rare, earthy, luxurious",           "luxury,earthy,rare,french",           81, 85],
  ["Fudge",    "unisex", "English",      "rich chocolate candy",        "rich, sweet, indulgent",            "chocolate,sweet,rich,indulgent",      82, 83],
  ["Nutmeg",   "unisex", "English",      "warm baking spice",           "warm, cozy, fragrant",              "spice,warm,cozy,aromatic",            80, 83],
  // More classics
  ["Socks",    "unisex", "English",      "white pawed, two-toned",      "playful, classic, lovable",         "classic,two-tone,lovable,playful",    84, 82],
  ["Whiskers", "unisex", "English",      "long facial whiskers",        "curious, investigative, classic",   "classic,curious,investigative,cat",   83, 81],
  ["Mittens",  "unisex", "English",      "white-pawed like mittens",    "gentle, sweet, playful",            "classic,gentle,sweet,playful",        84, 82],
  ["Fluffy",   "unisex", "English",      "soft and fluffy fur",         "soft, cuddly, gentle",              "fluffy,soft,cuddly,gentle",           85, 82],
  ["Tiger",    "male",   "English",      "tiger-striped, fierce",       "fierce, striped, bold",             "tiger,stripes,fierce,bold",           84, 84],
]);

// ── BIRD NAMES ───────────────────────────────────────────────────────────────

const BIRDS = build('bird', [
  // Classic pet bird names
  ["Tweety",   "unisex", "English",      "sweet tweet, beloved canary", "cheerful, chirpy, singing",         "classic,canary,cheerful,singing",     92, 86],
  ["Polly",    "female", "English",      "beloved parrot",              "chatty, sociable, clever",          "parrot,classic,chatty,clever",        90, 85],
  ["Sunny",    "unisex", "English",      "bright and sunny",            "bright, cheerful, warm",            "bright,cheerful,sunny,warm",          88, 85],
  ["Kiwi",     "unisex", "Maori",        "New Zealand bird, fruit",     "perky, curious, energetic",         "newzealand,perky,curious,fruit",      85, 84],
  ["Mango",    "unisex", "Hindi",        "tropical sweet mango fruit",  "vibrant, tropical, cheerful",       "tropical,vibrant,colorful,sweet",     86, 85],
  ["Rio",      "unisex", "Spanish",      "river, free-flowing",         "free, adventurous, colorful",       "rio,free,colorful,adventurous",       84, 85],
  ["Sky",      "unisex", "English",      "the open sky above",          "free, open, blue",                  "sky,blue,free,open",                  85, 84],
  ["Blue",     "unisex", "English",      "the color of sky",            "calm, serene, beautiful",           "blue,calm,serene,color",              86, 85],
  ["Robin",    "unisex", "English",      "bright red-breasted bird",    "cheerful, musical, social",         "british,cheerful,musical,classic",    84, 83],
  ["Jay",      "male",   "Latin",        "jaybird, joyful",             "bold, intelligent, vocal",          "bold,intelligent,vocal,blue",         82, 83],
  ["Chirpy",   "unisex", "English",      "cheerful chirping sound",     "cheerful, vocal, happy",            "cheerful,vocal,happy,sound",          83, 82],
  ["Feather",  "unisex", "English",      "light bird feather",          "light, delicate, graceful",         "light,delicate,graceful,nature",      80, 83],
  ["Wing",     "unisex", "English",      "bird's wing for flight",      "free, adventurous, swift",          "free,swift,flight,adventurous",       79, 82],
  ["Sparrow",  "unisex", "English",      "small common bird",           "small, agile, sociable",            "small,agile,sociable,nature",         82, 82],
  ["Wren",     "female", "English",      "tiny energetic songbird",     "tiny, energetic, musical",          "tiny,musical,energetic,songbird",     80, 82],
  ["Lark",     "unisex", "English",      "singing lark bird",           "joyful, singing, free",             "singing,joyful,free,classic",         81, 83],
  ["Dove",     "female", "English",      "peaceful dove bird",          "peaceful, gentle, loving",          "peace,gentle,loving,white",           83, 84],
  ["Falcon",   "male",   "Latin",        "swift hunting falcon",        "swift, powerful, alert",            "swift,powerful,hunter,alert",         83, 85],
  ["Hawk",     "male",   "English",      "keen-eyed hawk bird",         "sharp, observant, powerful",        "sharp,powerful,hunter,keen",          82, 84],
  ["Eagle",    "male",   "English",      "soaring eagle",               "majestic, powerful, free",          "majestic,powerful,freedom,soaring",   84, 86],
  ["Swift",    "unisex", "English",      "fastest flying bird",         "swift, agile, determined",          "fast,agile,determined,flight",        82, 84],
  ["Soar",     "unisex", "English",      "to soar high in the sky",     "free, high-flying, ambitious",      "free,high,ambitious,sky",             80, 83],
  ["Phoenix",  "unisex", "Greek",        "mythical firebird, rebirth",  "resilient, radiant, majestic",      "mythological,rebirth,fire,majestic",  86, 90],
  ["Quill",    "unisex", "English",      "feather quill, writer",       "gentle, artistic, delicate",        "feather,artistic,delicate,writer",    78, 82],
  // Indian bird names
  ["Mithu",    "male",   "Hindi",        "parrot, sweet talker",        "chatty, colorful, clever",          "hindi,parrot,chatty,colorful",        88, 85],
  ["Tota",     "male",   "Hindi",        "parrot, green talker",        "vocal, green, clever",              "hindi,parrot,vocal,clever",           85, 83],
  ["Maina",    "female", "Hindi",        "mynah bird, songbird",        "musical, vocal, social",            "mynah,musical,hindi,social",          86, 84],
  ["Koel",     "female", "Hindi",        "cuckoo bird, sweet singer",   "melodious, sweet, elusive",         "cuckoo,melodious,sweet,hindi",        84, 84],
  ["Bulbul",   "unisex", "Persian",      "nightingale, sweet singer",   "melodious, romantic, singing",      "nightingale,singing,melodious,persian",83, 84],
  ["Pankhi",   "female", "Hindi",        "bird, one who flies free",    "free, graceful, soaring",           "bird,free,graceful,hindi",            81, 83],
  ["Garuda",   "male",   "Sanskrit",     "eagle, vehicle of Vishnu",    "majestic, divine, powerful",        "eagle,divine,powerful,hindu",         82, 87],
  ["Akash",    "male",   "Sanskrit",     "sky, heaven",                 "boundless, free, expansive",        "sky,heaven,free,infinite",            83, 85],
  ["Udaan",    "unisex", "Hindi",        "flight, soaring",             "free, ambitious, soaring",          "flight,free,ambitious,hindi",         80, 84],
  // Color-based bird names
  ["Scarlet",  "female", "English",      "bright red color",            "vibrant, bold, striking",           "red,vibrant,bold,striking",           84, 86],
  ["Indigo",   "unisex", "Greek",        "deep blue-purple color",      "deep, mysterious, colorful",        "blue,purple,deep,colorful",           83, 86],
  ["Azure",    "unisex", "French",       "sky blue color",              "serene, blue, beautiful",           "blue,serene,sky,beautiful",           82, 85],
  ["Crimson",  "unisex", "English",      "deep red color",              "deep, passionate, vibrant",         "red,deep,passionate,vibrant",         81, 85],
  ["Amber",    "female", "Arabic",       "golden amber resin",          "golden, warm, radiant",             "golden,warm,radiant,gem",             83, 84],
  ["Teal",     "unisex", "English",      "blue-green color",            "calm, beautiful, unique",           "blue-green,calm,unique,beautiful",    82, 84],
  ["Jade",     "female", "Spanish",      "green precious stone",        "precious, green, elegant",          "green,precious,elegant,gem",          83, 85],
  ["Cobalt",   "male",   "German",       "deep blue metallic hue",      "deep, intense, striking",           "blue,deep,intense,striking",          80, 84],
  ["Cyan",     "unisex", "Greek",        "bright blue-green",           "bright, vivid, playful",            "bright,vivid,playful,colorful",       79, 83],
  ["Sage",     "unisex", "English",      "gray-green wise herb",        "wise, calm, earthy",                "green,wise,calm,earthy",              80, 83],
  // Cute/quirky bird names
  ["Pip",      "unisex", "English",      "tiny seed, small sound",      "tiny, perky, adorable",             "tiny,perky,adorable,small",           83, 83],
  ["Cheep",    "unisex", "English",      "soft cheeping sound",         "soft, small, sweet",                "sound,small,sweet,soft",              79, 80],
  ["Zippy",    "unisex", "English",      "quick and energetic",         "quick, energetic, lively",          "quick,energetic,lively,fun",          81, 82],
  ["Toot",     "unisex", "English",      "tooting sound, honking",      "funny, vocal, unique",              "funny,vocal,unique,sound",            76, 80],
  ["Riff",     "male",   "English",      "musical riff, jazz",          "musical, creative, cool",           "musical,creative,cool,jazz",          78, 82],
  ["Finch",    "unisex", "English",      "small colorful finch bird",   "small, colorful, sociable",         "small,colorful,sociable,classic",     80, 82],
  ["Whistle",  "unisex", "English",      "whistling bird call",         "musical, vocal, happy",             "musical,vocal,happy,sound",           79, 81],
  ["Pebble",   "unisex", "English",      "small smooth stone",          "small, smooth, calm",               "small,smooth,calm,nature",            77, 80],
  ["Echo",     "unisex", "Greek",        "repeated sound, reflection",  "vocal, musical, mythological",      "musical,vocal,greek,echo",            81, 83],
]);

// ── FISH NAMES ───────────────────────────────────────────────────────────────

const FISH = build('fish', [
  ["Bubbles",  "unisex", "English",      "air bubbles underwater",      "playful, bubbly, cheerful",         "bubbles,playful,cheerful,water",      92, 86],
  ["Goldie",   "female", "English",      "golden colored, precious",    "bright, cheerful, warm",            "gold,bright,warm,classic",            90, 85],
  ["Splash",   "unisex", "English",      "water splashing sound",       "playful, energetic, fun",           "water,playful,energetic,fun",         88, 84],
  ["Nemo",     "male",   "Latin",        "nobody, brave little fish",   "brave, adventurous, cheerful",      "disney,brave,adventurous,orange",     95, 88],
  ["Dory",     "female", "English",      "forgetful blue tang fish",    "friendly, forgetful, cheerful",     "disney,friendly,blue,cheerful",       92, 87],
  ["Finn",     "unisex", "English",      "fish fin, white",             "graceful, swift, agile",            "fin,graceful,swift,agile",            88, 85],
  ["Flash",    "unisex", "English",      "bright flash of light",       "quick, bright, vivid",              "bright,quick,vivid,light",            85, 85],
  ["Ripple",   "unisex", "English",      "water ripple, gentle wave",   "gentle, fluid, graceful",           "water,gentle,fluid,graceful",         85, 84],
  ["Wave",     "unisex", "English",      "ocean wave",                  "fluid, powerful, rhythmic",         "ocean,fluid,rhythmic,powerful",       84, 84],
  ["Shimmer",  "unisex", "English",      "shimmering light on water",   "sparkling, beautiful, luminous",    "sparkle,beautiful,luminous,water",    86, 86],
  ["Glitter",  "unisex", "English",      "tiny sparkling particles",    "sparkling, cheerful, colorful",     "sparkle,colorful,cheerful,bright",    83, 84],
  ["Dart",     "male",   "English",      "moving swiftly, dart fish",   "swift, agile, quick",               "swift,agile,quick,movement",          82, 83],
  ["Coral",    "female", "English",      "ocean coral reef",            "colorful, nurturing, beautiful",    "ocean,colorful,reef,beautiful",       87, 86],
  ["Pearl",    "female", "English",      "precious ocean gem",          "precious, elegant, serene",         "gem,ocean,precious,elegant",          88, 86],
  ["Azure",    "unisex", "French",       "sky blue color",              "serene, beautiful, blue",           "blue,serene,beautiful,water",         83, 84],
  ["Turquoise","unisex", "French",       "blue-green precious stone",   "calm, beautiful, unique",           "blue-green,calm,beautiful,gem",       82, 84],
  ["Sapphire", "female", "Greek",        "blue precious gemstone",      "deep, beautiful, precious",         "blue,gem,precious,deep",              83, 85],
  ["Aqua",     "unisex", "Latin",        "water, aqua color",           "fluid, calm, serene",               "water,calm,serene,blue",              84, 83],
  ["Triton",   "male",   "Greek",        "son of Poseidon, merman",     "powerful, fluid, mythological",     "greek,ocean,powerful,mythological",   80, 86],
  ["Neptune",  "male",   "Roman",        "god of the sea",              "deep, powerful, mysterious",        "ocean,powerful,roman,mythological",   81, 86],
  ["Poseidon", "male",   "Greek",        "ocean god, earth shaker",     "powerful, commanding, deep",        "greek,ocean,powerful,mythological",   79, 87],
  ["Gill",     "unisex", "English",      "fish gill, breath of water",  "steady, calm, functional",          "anatomy,calm,water,classic",          80, 80],
  ["Zigzag",   "unisex", "English",      "zigzag swimming pattern",     "energetic, playful, unpredictable", "zigzag,energetic,playful,movement",   79, 82],
  ["Rainbow",  "unisex", "English",      "rainbow of colors",           "colorful, joyful, vibrant",         "rainbow,colorful,joyful,vibrant",     85, 85],
  ["Marble",   "unisex", "English",      "marbled pattern, swirling",   "elegant, patterned, unique",        "pattern,elegant,unique,swirl",        79, 82],
  ["Pebble",   "unisex", "English",      "smooth river pebble",         "smooth, calm, earthy",              "smooth,calm,earthy,nature",           78, 80],
  ["Brook",    "female", "English",      "small flowing stream",        "gentle, flowing, serene",           "water,gentle,flowing,serene",         80, 82],
  ["Tide",     "unisex", "English",      "ocean tide, cyclic flow",     "rhythmic, powerful, cyclic",        "ocean,rhythmic,powerful,cycle",       79, 82],
  ["Surf",     "male",   "English",      "surf, ocean waves",           "active, playful, ocean",            "ocean,active,playful,waves",          79, 82],
  ["Brine",    "unisex", "English",      "salt water of the ocean",     "salty, deep, ocean",                "salt,deep,ocean,classic",             76, 79],
  ["Orca",     "unisex", "Latin",        "barrel shape, killer whale",  "powerful, intelligent, bold",       "whale,powerful,intelligent,bold",     80, 85],
  ["Kelp",     "unisex", "English",      "ocean seaweed, marine plant", "wavy, green, oceanic",              "ocean,plant,green,wavy",              75, 78],
  ["Sandy",    "female", "English",      "sand colored, sandy",         "gentle, warm, earthy",              "sand,warm,earthy,gentle",             81, 80],
  ["Goldfin",  "male",   "English",      "golden finned fish",          "bright, golden, graceful",          "gold,fin,bright,graceful",            78, 81],
  ["Bluebell", "female", "English",      "blue bell flower, blue",      "delicate, blue, beautiful",         "blue,flower,delicate,beautiful",      79, 82],
  ["Whisker",  "male",   "English",      "catfish whiskers, sensory",   "curious, sensitive, exploratory",   "catfish,curious,sensory,exploratory", 77, 79],
]);

// ── RABBIT NAMES ─────────────────────────────────────────────────────────────

const RABBITS = build('rabbit', [
  ["Cotton",   "unisex", "English",      "soft white cotton",           "soft, fluffy, gentle",              "soft,fluffy,white,gentle",            92, 86],
  ["Thumper",  "male",   "American",     "thumping feet, Disney rabbit","energetic, bouncy, lovable",        "disney,energetic,bouncy,classic",     90, 86],
  ["Clover",   "female", "English",      "lucky clover plant",          "lucky, gentle, nature-loving",      "lucky,clover,nature,gentle",          88, 85],
  ["Bunnies",  "unisex", "English",      "little bunny, adorable",      "adorable, soft, playful",           "bunny,adorable,soft,playful",         86, 83],
  ["Hopscotch","unisex", "English",      "hopping game, playful",       "playful, energetic, bouncy",        "hopping,playful,energetic,bouncy",    85, 85],
  ["Cottontail","unisex","English",      "white cottony tail",          "gentle, fluffy, classic",           "cottontail,classic,fluffy,gentle",    87, 84],
  ["Petal",    "female", "English",      "flower petal, delicate",      "delicate, sweet, gentle",           "flower,delicate,sweet,gentle",        86, 85],
  ["Daisy",    "female", "English",      "day's eye flower",            "cheerful, gentle, bright",          "flower,cheerful,gentle,bright",       87, 84],
  ["Hazel",    "female", "English",      "hazel nut tree",              "gentle, earthy, warm",              "nut,earthy,warm,gentle",              84, 83],
  ["Willow",   "female", "English",      "graceful willow tree",        "graceful, gentle, nature-loving",   "tree,graceful,gentle,nature",         85, 84],
  ["Biscuit",  "unisex", "English",      "small flat baked treat",      "warm, comforting, sweet",           "food,warm,sweet,comforting",          85, 83],
  ["Peanut",   "unisex", "English",      "small but mighty",            "tiny, energetic, lovable",          "tiny,lovable,energetic,small",        87, 85],
  ["Caramel",  "female", "French",       "golden toffee sweetness",     "warm, sweet, golden",               "sweet,warm,golden,soft",              84, 83],
  ["Cinnamon", "female", "English",      "warm aromatic spice",         "warm, spicy, comforting",           "spice,warm,comforting,aromatic",      83, 83],
  ["Nutmeg",   "unisex", "English",      "warm baking spice",           "warm, cozy, fragrant",              "spice,warm,cozy,fragrant",            81, 82],
  ["Honey",    "female", "English",      "sweet golden nectar",         "sweet, gentle, loving",             "sweet,golden,gentle,loving",          86, 84],
  ["Vanilla",  "female", "Spanish",      "sweet vanilla flavor",        "sweet, gentle, classic",            "sweet,gentle,classic,flavor",         83, 82],
  ["Snowy",    "unisex", "English",      "white as snow",               "pure, gentle, fluffy",              "white,pure,gentle,fluffy",            85, 83],
  ["Fluffy",   "unisex", "English",      "soft and fluffy fur",         "soft, cuddly, sweet",               "fluffy,soft,cuddly,sweet",            87, 83],
  ["Poppy",    "female", "English",      "bright red poppy flower",     "bright, cheerful, bold",            "flower,bright,cheerful,bold",         84, 84],
  ["Meadow",   "female", "English",      "open grassy meadow",          "open, natural, free",               "nature,open,free,grassy",             83, 83],
  ["Clementine","female","Latin",        "mild, merciful",              "gentle, sweet, sunny",              "sweet,gentle,sunny,orange",           82, 83],
  ["Rosie",    "female", "English",      "rose flower, rosy",           "sweet, cheerful, loving",           "flower,sweet,cheerful,loving",        84, 83],
  ["Buttons",  "unisex", "English",      "round buttons, cute",         "cute, round, adorable",             "cute,round,adorable,buttons",         83, 82],
  ["Binky",    "unisex", "English",      "rabbit's joyful leap",        "joyful, bouncy, happy",             "rabbit,joyful,bounce,happy",          82, 83],
  ["Dandelion","unisex", "French",       "lion's tooth flower",         "wild, cheerful, free",              "flower,wild,cheerful,free",           81, 82],
  ["Flopsy",   "female", "English",      "floppy eared rabbit",         "floppy, sweet, gentle",             "floppy,sweet,gentle,beatrix",         83, 82],
  ["Mopsy",    "female", "English",      "mopsy, Peter Rabbit sister",  "gentle, sweet, curious",            "beatrix,gentle,sweet,curious",        81, 81],
  ["Peter",    "male",   "Greek",        "rock, Peter Rabbit",          "adventurous, bold, curious",        "beatrix,adventurous,bold,classic",    85, 83],
  ["Bramble",  "unisex", "English",      "thorny wild plant",           "wild, spirited, earthy",            "wild,spirited,earthy,plant",          79, 81],
  ["Acorn",    "unisex", "English",      "small but mighty acorn",      "small, mighty, earthy",             "small,mighty,earthy,nature",          79, 80],
  ["Juniper",  "female", "Latin",        "juniper berry shrub",         "fresh, herby, nature-loving",       "herb,fresh,nature,plant",             80, 82],
  ["Clyde",    "male",   "Scottish",     "river Clyde, heard from afar","steady, reliable, friendly",        "scottish,steady,reliable,friendly",   78, 80],
]);

// ── HAMSTER NAMES ─────────────────────────────────────────────────────────────

const HAMSTERS = build('hamster', [
  ["Peanut",   "unisex", "English",      "small but mighty",            "tiny, energetic, adorable",         "tiny,cute,energetic,small",           90, 87],
  ["Nibbles",  "unisex", "English",      "small bites, nibbling",       "curious, gentle, munching",         "eating,curious,gentle,small",         88, 85],
  ["Nugget",   "unisex", "English",      "small golden nugget",         "small, golden, precious",           "small,golden,precious,cute",          87, 86],
  ["Pumpkin",  "unisex", "English",      "round orange pumpkin",        "round, warm, sweet",                "round,orange,sweet,warm",             85, 83],
  ["Squeaky",  "unisex", "English",      "squeaking sound",             "vocal, tiny, expressive",           "vocal,tiny,expressive,sound",         84, 82],
  ["Fluffy",   "unisex", "English",      "soft and fluffy",             "soft, cuddly, gentle",              "fluffy,soft,cuddly,gentle",           87, 82],
  ["Pompom",   "unisex", "French",       "fluffy round ball",           "round, fluffy, playful",            "round,fluffy,playful,cute",           85, 84],
  ["Acorn",    "unisex", "English",      "small round acorn",           "small, round, earthy",              "small,round,earthy,nature",           82, 82],
  ["Biscuit",  "unisex", "English",      "small baked treat",           "warm, comforting, small",           "food,warm,small,comforting",          83, 81],
  ["Marshmallow","unisex","English",     "soft white marshmallow",      "soft, sweet, fluffy",               "soft,sweet,fluffy,white",             86, 84],
  ["Cocoa",    "unisex", "Portuguese",   "chocolate cocoa",             "warm, sweet, chocolatey",           "chocolate,warm,sweet,brown",          83, 82],
  ["Caramel",  "unisex", "French",       "golden toffee",               "warm, sweet, golden",               "sweet,warm,golden,toffee",            82, 82],
  ["Butterscotch","unisex","English",    "buttery scotch candy",        "sweet, warm, buttery",              "sweet,buttery,warm,candy",            81, 82],
  ["Hazel",    "unisex", "English",      "hazel tree, nut",             "earthy, gentle, warm",              "nut,earthy,warm,nature",              80, 81],
  ["Chestnut", "unisex", "English",      "brown chestnut nut",          "warm, earthy, brown",               "nut,warm,earthy,brown",               79, 80],
  ["Waffle",   "unisex", "English",      "crispy batter waffle",        "warm, sweet, crispy",               "food,warm,sweet,breakfast",           82, 82],
  ["Pretzel",  "unisex", "German",       "twisted pretzel bread",       "twisted, salty, fun",               "bread,twisted,fun,salty",             79, 80],
  ["Teddy",    "unisex", "English",      "teddy bear, cuddly",          "cuddly, sweet, lovable",            "teddy,cuddly,sweet,bear",             85, 83],
  ["Hammy",    "male",   "English",      "little hamster, lovable",     "lovable, energetic, tiny",          "hamster,lovable,energetic,tiny",      83, 81],
  ["Hamlet",   "male",   "Old English",  "little home, Shakespeare",    "literary, intelligent, small",      "shakespeare,literary,small,clever",   80, 82],
  ["Chester",  "male",   "English",      "fortress, sturdy",            "sturdy, reliable, friendly",        "sturdy,reliable,friendly,classic",    79, 80],
  ["Pip",      "unisex", "English",      "tiny seed, small",            "tiny, perky, adorable",             "tiny,perky,adorable,small",           82, 82],
  ["Sprout",   "unisex", "English",      "new plant sprout, growing",   "growing, tiny, fresh",              "growing,tiny,fresh,plant",            80, 81],
  ["Mochi",    "unisex", "Japanese",     "sweet rice cake, round",      "round, soft, sweet",                "japanese,round,soft,sweet",           83, 84],
  ["Gizmo",    "unisex", "English",      "clever gadget, small",        "clever, curious, energetic",        "clever,curious,energetic,fun",        81, 82],
  ["Tumble",   "unisex", "English",      "tumbling, rolling",           "energetic, tumbling, playful",      "tumbling,energetic,playful,rolling",  80, 82],
  ["Roly",     "unisex", "English",      "roly poly, round and rolling","round, rolling, playful",           "round,rolling,playful,cute",          79, 80],
  ["Zippy",    "unisex", "English",      "fast and zippy",              "fast, energetic, lively",           "fast,energetic,lively,zippy",         80, 81],
  ["Honey",    "female", "English",      "sweet golden honey",          "sweet, gentle, warm",               "sweet,gentle,warm,golden",            82, 82],
  ["Cookie",   "unisex", "English",      "sweet baked cookie",          "sweet, warm, lovable",              "sweet,warm,lovable,food",             82, 81],
]);

// ── TURTLE NAMES ─────────────────────────────────────────────────────────────

const TURTLES = build('turtle', [
  ["Shelly",   "female", "English",      "one with a shell, protected", "calm, gentle, protective",          "shell,calm,gentle,classic",           90, 84],
  ["Sheldon",  "male",   "English",      "steep-sided valley, shell",   "steady, wise, calm",                "shell,steady,wise,calm",              87, 83],
  ["Tank",     "male",   "English",      "large and heavy",             "slow, sturdy, powerful",            "heavy,slow,sturdy,powerful",          86, 82],
  ["Turbo",    "male",   "Latin",        "spinning fast, turbo",        "surprisingly fast, energetic",      "fast,surprising,energetic,fun",       85, 84],
  ["Speedy",   "unisex", "English",      "surprisingly speedy",         "determined, surprising, steady",    "fast,surprising,determined,fun",      84, 82],
  ["Slowpoke", "unisex", "English",      "pleasantly slow, patient",    "patient, calm, unhurried",          "slow,patient,calm,unhurried",         83, 81],
  ["Franklin", "male",   "English",      "free landholder, turtle",     "friendly, kind, adventurous",       "cartoon,friendly,kind,classic",       88, 83],
  ["Crush",    "male",   "English",      "cool sea turtle",             "cool, laid-back, ocean",            "nemo,cool,ocean,laid-back",           87, 84],
  ["Squirt",   "unisex", "English",      "small water squirter",        "young, energetic, playful",         "nemo,young,playful,energetic",        85, 83],
  ["Mossy",    "unisex", "English",      "covered in moss",             "earthy, calm, ancient",             "moss,earthy,calm,ancient",            80, 81],
  ["Pebble",   "unisex", "English",      "smooth river pebble",         "smooth, calm, earthy",              "smooth,calm,earthy,nature",           79, 79],
  ["Rocky",    "male",   "English",      "rocky terrain, strength",     "steady, rocky, determined",         "rocky,steady,determined,strong",      82, 81],
  ["Slider",   "unisex", "English",      "sliding turtle, smooth",      "smooth, sliding, graceful",         "slider,smooth,graceful,nature",       78, 79],
  ["Snapper",  "male",   "English",      "snapping turtle, bold",       "bold, fierce, protective",          "snapper,bold,fierce,protective",      79, 80],
  ["Sage",     "unisex", "English",      "wise sage, ancient wisdom",   "wise, calm, ancient",               "wise,ancient,calm,herb",              83, 83],
  ["Darwin",   "male",   "English",      "dear friend, naturalist",     "curious, scientific, wise",         "science,wise,curious,darwin",         80, 82],
  ["Aristotle","male",   "Greek",        "best purpose, philosopher",   "wise, thoughtful, ancient",         "philosophy,wise,ancient,greek",       79, 82],
  ["Plato",    "male",   "Greek",        "broad-shouldered, philosopher","broad, philosophical, wise",        "philosophy,wise,broad,greek",         78, 81],
  ["Socrates", "male",   "Greek",        "whole strength, philosopher", "wise, questioning, calm",           "philosophy,wise,calm,greek",          77, 81],
  ["Einstein", "male",   "German",       "one stone, genius",           "genius, curious, thoughtful",       "genius,smart,curious,german",         80, 82],
  ["Archie",   "male",   "English",      "truly brave",                 "brave, determined, friendly",       "brave,determined,friendly,classic",   80, 80],
  ["Myrtle",   "female", "Greek",        "myrtle plant, eternal",       "gentle, earthy, enduring",          "plant,gentle,earthy,enduring",        78, 79],
  ["Gomez",    "male",   "Spanish",      "son of Gome",                 "charming, quirky, lovable",         "spanish,charming,quirky,lovable",     77, 79],
  ["Tortuga",  "unisex", "Spanish",      "turtle in Spanish",           "ancient, slow, dignified",          "spanish,ancient,slow,dignified",      79, 80],
  ["Zen",      "unisex", "Japanese",     "meditative, peaceful state",  "peaceful, calm, mindful",           "peaceful,calm,mindful,zen",           82, 83],
  ["Serenity", "female", "Latin",        "peaceful, serene",            "serene, calm, gentle",              "peaceful,serene,calm,gentle",         81, 82],
  ["Ancient",  "unisex", "Latin",        "old, enduring, eternal",      "ancient, wise, enduring",           "ancient,wise,enduring,old",           77, 80],
  ["Fossil",   "male",   "Latin",        "dug up, ancient remains",     "ancient, stoic, enduring",          "ancient,stoic,enduring,old",          75, 79],
  ["Jade",     "female", "Spanish",      "precious green stone",        "precious, green, calm",             "gem,precious,green,calm",             82, 82],
  ["Basking",  "male",   "English",      "basking in warm sunlight",    "warm, lazy, content",               "warm,lazy,content,sun",               76, 78],
]);

// ── Assemble + deduplicate ────────────────────────────────────────────────────

const ALL = [...DOGS, ...CATS, ...BIRDS, ...FISH, ...RABBITS, ...HAMSTERS, ...TURTLES];

const seen = new Set();
const UNIQUE = ALL.filter((r) => {
  if (seen.has(r.slug)) return false;
  seen.add(r.slug);
  return true;
});

console.log(`Total unique pet names: ${UNIQUE.length}`);
const byType = {};
for (const r of UNIQUE) byType[r.pet_type] = (byType[r.pet_type] ?? 0) + 1;
console.log('By type:', byType);

// ── Upload to Supabase ────────────────────────────────────────────────────────

const BATCH = 500;
let inserted = 0;
let errors = 0;

for (let i = 0; i < UNIQUE.length; i += BATCH) {
  const batch = UNIQUE.slice(i, i + BATCH);
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/pet_names`,
    {
      method: 'POST',
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'resolution=merge-duplicates,return=minimal',
      },
      body: JSON.stringify(batch),
    }
  );
  if (!res.ok) {
    const body = await res.text();
    console.error(`Batch ${i}–${i + BATCH} FAILED:`, res.status, body);
    errors++;
  } else {
    inserted += batch.length;
    console.log(`Uploaded ${inserted}/${UNIQUE.length}...`);
  }
}

if (errors === 0) {
  console.log(`Done! ${UNIQUE.length} pet names uploaded successfully.`);
} else {
  console.log(`Done with ${errors} batch errors. Check output above.`);
}
