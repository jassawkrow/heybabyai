/**
 * Turtle name expander: exactly 50 seeds × 6 = 300 (50 seeds + 5 prefix passes × 50).
 * Run: node scripts/expand-turtle-names.mjs
 *
 * Seed breakdown: 30 existing + 15 Indian/mythological + 5 new wise = 50
 * Prefixes: 5 (math constraint at 300 target — Stone, Wise, Patient, Golden, Crystal)
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

// ── SEED ARRAY — exactly 50 ───────────────────────────────────────────────────

const SEEDS = [
  // 30 existing turtle seeds
  ["Shelly",      "female","English",   "one with a shell, protected",  "calm, gentle, protective",        "shell,calm,gentle,classic",         90,84],
  ["Sheldon",     "male",  "English",   "steep-sided valley, shell",    "steady, wise, calm",              "shell,steady,wise,calm",            87,83],
  ["Tank",        "male",  "English",   "large and heavy",              "slow, sturdy, powerful",          "heavy,slow,sturdy,powerful",        86,82],
  ["Turbo",       "male",  "Latin",     "spinning fast, turbo",         "surprisingly fast, energetic",    "fast,surprising,energetic,fun",     85,84],
  ["Speedy",      "unisex","English",   "surprisingly speedy",          "determined, surprising, steady",  "fast,surprising,determined,fun",    84,82],
  ["Slowpoke",    "unisex","English",   "pleasantly slow, patient",     "patient, calm, unhurried",        "slow,patient,calm,unhurried",       83,81],
  ["Franklin",    "male",  "English",   "free landholder, turtle",      "friendly, kind, adventurous",     "cartoon,friendly,kind,classic",     88,83],
  ["Crush",       "male",  "English",   "cool sea turtle",              "cool, laid-back, ocean",          "nemo,cool,ocean,laid-back",         87,84],
  ["Squirt",      "unisex","English",   "small water squirter",         "young, energetic, playful",       "nemo,young,playful,energetic",      85,83],
  ["Mossy",       "unisex","English",   "covered in moss",              "earthy, calm, ancient",           "moss,earthy,calm,ancient",          80,81],
  ["Pebble",      "unisex","English",   "smooth river pebble",          "smooth, calm, earthy",            "smooth,calm,earthy,nature",         79,79],
  ["Rocky",       "male",  "English",   "rocky terrain, strength",      "steady, rocky, determined",       "rocky,steady,determined,strong",    82,81],
  ["Slider",      "unisex","English",   "sliding turtle, smooth",       "smooth, sliding, graceful",       "slider,smooth,graceful,nature",     78,79],
  ["Snapper",     "male",  "English",   "snapping turtle, bold",        "bold, fierce, protective",        "snapper,bold,fierce,protective",    79,80],
  ["Sage",        "unisex","English",   "wise sage, ancient wisdom",    "wise, calm, ancient",             "wise,ancient,calm,herb",            83,83],
  ["Darwin",      "male",  "English",   "dear friend, naturalist",      "curious, scientific, wise",       "science,wise,curious,darwin",       80,82],
  ["Aristotle",   "male",  "Greek",     "best purpose, philosopher",    "wise, thoughtful, ancient",       "philosophy,wise,ancient,greek",     79,82],
  ["Plato",       "male",  "Greek",     "broad-shouldered, philosopher","broad, philosophical, wise",      "philosophy,wise,broad,greek",       78,81],
  ["Socrates",    "male",  "Greek",     "whole strength, philosopher",  "wise, questioning, calm",         "philosophy,wise,calm,greek",        77,81],
  ["Einstein",    "male",  "German",    "one stone, genius",            "genius, curious, thoughtful",     "genius,smart,curious,german",       80,82],
  ["Archie",      "male",  "English",   "truly brave",                  "brave, determined, friendly",     "brave,determined,friendly,classic", 80,80],
  ["Myrtle",      "female","Greek",     "myrtle plant, eternal",        "gentle, earthy, enduring",        "plant,gentle,earthy,enduring",      78,79],
  ["Gomez",       "male",  "Spanish",   "son of Gome",                  "charming, quirky, lovable",       "spanish,charming,quirky,lovable",   77,79],
  ["Tortuga",     "unisex","Spanish",   "turtle in Spanish",            "ancient, slow, dignified",        "spanish,ancient,slow,dignified",    79,80],
  ["Zen",         "unisex","Japanese",  "meditative, peaceful state",   "peaceful, calm, mindful",         "peaceful,calm,mindful,zen",         82,83],
  ["Serenity",    "female","Latin",     "peaceful, serene",             "serene, calm, gentle",            "peaceful,serene,calm,gentle",       81,82],
  ["Ancient",     "unisex","Latin",     "old, enduring, eternal",       "ancient, wise, enduring",         "ancient,wise,enduring,old",         77,80],
  ["Fossil",      "male",  "Latin",     "dug up, ancient remains",      "ancient, stoic, enduring",        "ancient,stoic,enduring,old",        75,79],
  ["Jade",        "female","Spanish",   "precious green stone",         "precious, green, calm",           "gem,precious,green,calm",           82,82],
  ["Basking",     "male",  "English",   "basking in warm sunlight",     "warm, lazy, content",             "warm,lazy,content,sun",             76,78],
  // 15 Indian / mythological seeds
  ["Kurma",       "male",  "Sanskrit",  "Vishnu's turtle avatar, divine","sacred, divine, ancient",        "vishnu,divine,sacred,hindu",        83,89],
  ["Akupara",     "male",  "Sanskrit",  "cosmic turtle holding Earth",  "cosmic, ancient, steadfast",      "cosmic,ancient,earth,mythological", 79,87],
  ["Bahumati",    "female","Sanskrit",  "earth goddess, abundant",      "nurturing, ancient, earthy",      "earth,nurturing,ancient,hindu",     77,84],
  ["Kachuwa",     "unisex","Hindi",     "turtle, the shelled one",      "steady, calm, patient",           "turtle,shell,steady,hindi",         79,81],
  ["Kachhua",     "unisex","Hindi",     "tortoise, ancient one",        "ancient, slow, dignified",        "tortoise,ancient,slow,hindi",       78,80],
  ["Dheeru",      "male",  "Hindi",     "patient, slow and steady",     "patient, steady, calm",           "patient,steady,calm,hindi",         78,81],
  ["Shanku",      "unisex","Sanskrit",  "conch, sacred sound",          "sacred, calm, resonant",          "conch,sacred,calm,hindu",           76,81],
  ["Vajra",       "male",  "Sanskrit",  "thunderbolt, indestructible",  "strong, indestructible, ancient", "thunderbolt,strong,ancient,hindu",  78,83],
  ["Sthira",      "unisex","Sanskrit",  "steady, stable, unmoving",     "steady, stable, calm",            "steady,stable,calm,hindu",          77,81],
  ["Dhruv",       "male",  "Sanskrit",  "polar star, constant",         "constant, steadfast, bright",     "star,constant,steadfast,hindu",     80,83],
  ["Bhoomi",      "female","Sanskrit",  "earth, ground, foundation",    "grounded, nurturing, calm",       "earth,ground,nurturing,hindu",      78,82],
  ["Ganga",       "female","Sanskrit",  "sacred river, pure",           "pure, flowing, divine",           "river,pure,divine,hindu",           79,83],
  ["Yamuna",      "female","Sanskrit",  "sacred river, sister of Yama", "gentle, pure, sacred",            "river,gentle,sacred,hindu",         78,82],
  ["Saraswati",   "female","Sanskrit",  "goddess of knowledge, river",  "wise, creative, divine",          "knowledge,wise,divine,hindu",       80,85],
  ["Chiranjeevi", "male",  "Sanskrit",  "immortal, long-living one",    "enduring, ancient, immortal",     "immortal,ancient,enduring,hindu",   79,85],
  // 5 new wise / ancient seeds (not already in existing 30)
  ["Elder",       "unisex","English",   "elder, oldest and wisest",     "ancient, wise, respected",        "elder,wise,ancient,respected",      78,81],
  ["Stoic",       "unisex","Greek",     "stoic, unmoved by hardship",   "calm, unmoved, enduring",         "stoic,calm,enduring,greek",         76,80],
  ["Eternal",     "unisex","Latin",     "eternal, without end",         "timeless, enduring, calm",        "eternal,timeless,enduring,latin",   77,81],
  ["Timeless",    "unisex","English",   "timeless, beyond time",        "ancient, serene, enduring",       "timeless,ancient,serene,classic",   76,80],
  ["Steadfast",   "unisex","English",   "steadfast, firmly loyal",      "loyal, firm, unwavering",         "steadfast,loyal,firm,classic",      77,81],
];

// ── 5 PREFIXES — exactly fills 250 combos to reach total 300 ─────────────────
// (300 target with 50 seeds requires exactly 5 prefix passes: 50 + 5×50 = 300)

const PREFIXES = [
  { word: "Stone",   meaning: "stone-solid, enduring",    keywords: "stone,solid,enduring",   pop: -5, vibe: +3 },
  { word: "Wise",    meaning: "wise, ancient knowing",    keywords: "wise,ancient,knowing",   pop: -4, vibe: +3 },
  { word: "Patient", meaning: "patient, unhurried",       keywords: "patient,calm,unhurried", pop: -5, vibe: +2 },
  { word: "Golden",  meaning: "golden, shining",          keywords: "golden,shining",         pop: -4, vibe: +2 },
  { word: "Crystal", meaning: "crystal clear, pure",      keywords: "crystal,pure,clear",     pop: -5, vibe: +3 },
];

// ── GENERATION — exact math: 50 seeds + 5×50 = 300 ───────────────────────────

function generateTurtleNames() {
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

const turtles = generateTurtleNames();
const slugs = turtles.map(t => t.slug);
const uniqueSlugs = new Set(slugs);
const indian = turtles.filter(e =>
  ['Hindi','Sanskrit'].some(o => e.origin.includes(o))
);

console.log('─'.repeat(50));
console.log(`Seeds defined   : ${SEEDS.length}`);
console.log(`Prefixes defined: ${PREFIXES.length}`);
console.log(`Expected total  : ${SEEDS.length * (PREFIXES.length + 1)}`);
console.log(`Total generated : ${turtles.length}`);
console.log(`Unique slugs    : ${uniqueSlugs.size}`);
console.log(`Duplicates      : ${turtles.length - uniqueSlugs.size}`);
console.log(`Indian-origin   : ${indian.length}`);
console.log('─'.repeat(50));
console.log('First 10:', turtles.slice(0, 10).map(t => t.name).join(', '));
console.log('Last  10:', turtles.slice(-10).map(t => t.name).join(', '));
console.log('─'.repeat(50));

const outPath = join(__dir, 'turtle-names-300.json');
writeFileSync(outPath, JSON.stringify(turtles, null, 2));
console.log(`Saved → scripts/turtle-names-300.json (${(JSON.stringify(turtles).length / 1024).toFixed(0)} KB)`);
