/**
 * Cat name expander: ~102 seeds × combinatorial prefixes → 2,500 unique cat records.
 * Run: node scripts/expand-cat-names.mjs
 */

import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dir = dirname(fileURLToPath(import.meta.url));

function slug(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-cat';
}

function longDesc(n, o, m, p) {
  return `${n} is an elegant name for a cat with ${o} origins. The name means "${m}". ` +
    `Cats named ${n} tend to be ${p}, carrying an air of mystery and grace. ` +
    `This name captures the independent spirit and quiet charm that makes cats such fascinating companions.`;
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

// ── SEED ARRAY (~102 cats) ────────────────────────────────────────────────────
// [name, gender, origin, meaning_short, personality, keywords, popularity, vibe]

const SEEDS = [
  // Western male (21)
  ["Oliver","male","Latin","olive tree, peaceful","gentle, curious, affectionate","peaceful,gentle,popular,classic",95,88],
  ["Leo","male","Latin","lion, bold","bold, regal, playful","lion,bold,regal,popular",94,89],
  ["Milo","male","Latin","soldier, gracious","gentle, affectionate, curious","gentle,curious,popular,classic",92,87],
  ["Charlie","male","English","free man","playful, social, lovable","playful,social,classic,friendly",91,86],
  ["Jack","male","Hebrew","God is gracious","bold, curious, independent","bold,curious,classic,independent",89,85],
  ["Simba","male","Swahili","lion, strength","regal, adventurous, proud","lion-king,regal,pride,african",90,89],
  ["Oscar","male","Irish","God's spear, champion","wise, proud, independent","wise,proud,classic,irish",88,86],
  ["Jasper","male","Persian","treasurer, gemstone","elegant, mysterious, calm","gem,elegant,mysterious,persian",85,87],
  ["Hugo","male","German","mind, intellect","intellectual, curious, noble","intelligent,noble,german,curious",84,86],
  ["Felix","male","Latin","happy, fortunate","happy, playful, lucky","happy,lucky,cartoon,latin",87,86],
  ["Merlin","male","Welsh","sea fortress, wizard","wise, magical, mysterious","wizard,magical,mysterious,welsh",83,88],
  ["Gandalf","male","Norse","staff elf, wise wizard","wise, mysterious, ancient","wizard,wise,tolkien,magical",82,88],
  ["Romeo","male","Italian","pilgrim to Rome, romantic","romantic, passionate, dramatic","romantic,italian,dramatic,love",83,86],
  ["Dante","male","Latin","enduring, steadfast","literary, intense, mysterious","literary,intense,italian,classic",81,86],
  ["Loki","male","Norse","trickster god","mischievous, clever, charming","trickster,norse,clever,mischievous",84,87],
  ["Thor","male","Norse","thunder god","bold, strong, playful","norse,thunder,bold,strong",83,87],
  ["Theo","male","Greek","gift of God","sweet, gentle, curious","divine,sweet,gentle,greek",85,86],
  ["George","male","Greek","earth worker, farmer","steady, friendly, reliable","classic,steady,british,reliable",82,83],
  ["Monty","male","French","mountain","bold, dignified, noble","french,noble,dignified,classic",80,84],
  ["Wilbur","male","English","wild boar, brave","gentle, bookish, sweet","gentle,sweet,charlotte,classic",78,82],
  ["Winston","male","English","joyful stone","distinguished, calm, wise","british,distinguished,wise,classic",82,85],
  // Western female (23)
  ["Luna","female","Latin","moon goddess","mysterious, serene, independent","moon,mysterious,serene,popular",97,90],
  ["Bella","female","Italian","beautiful","sweet, affectionate, beautiful","beautiful,sweet,popular,classic",95,89],
  ["Nala","female","African","successful, beloved","regal, sweet, brave","african,regal,lion-king,brave",90,88],
  ["Cleo","female","Greek","glory, pride","regal, independent, mysterious","egyptian,regal,mysterious,classic",89,88],
  ["Chloe","female","Greek","blooming, spring","lively, curious, social","blooming,lively,greek,social",91,87],
  ["Sophie","female","Greek","wisdom","wise, elegant, gentle","wise,elegant,greek,classic",89,86],
  ["Lily","female","English","pure flower","delicate, sweet, graceful","flower,pure,sweet,graceful",90,87],
  ["Daisy","female","English","day's eye flower","cheerful, bright, simple","flower,cheerful,bright,classic",88,85],
  ["Rosie","female","English","rose flower","sweet, loving, cheerful","flower,sweet,loving,classic",87,85],
  ["Callie","female","Greek","beautiful, lovely","sweet, playful, curious","beautiful,sweet,playful,greek",85,84],
  ["Gracie","female","Latin","grace, blessing","graceful, sweet, gentle","grace,gentle,sweet,classic",86,85],
  ["Ivy","female","English","faithfulness, climbing vine","tenacious, curious, graceful","nature,faithful,graceful,climbing",85,85],
  ["Hazel","female","English","hazel tree, wise","wise, gentle, earthy","nature,wise,gentle,earthy",84,85],
  ["Willow","female","English","graceful tree","graceful, gentle, serene","nature,graceful,gentle,serene",86,86],
  ["Violet","female","Latin","purple flower","gentle, artistic, mysterious","flower,purple,artistic,gentle",85,86],
  ["Aurora","female","Latin","dawn, northern lights","magical, radiant, beautiful","dawn,magical,beautiful,space",86,89],
  ["Stella","female","Latin","star","radiant, bold, luminous","star,radiant,bold,latin",87,88],
  ["Nova","female","Latin","new star","bright, curious, energetic","star,bright,modern,curious",87,88],
  ["Ellie","female","Greek","bright shining one","bright, sweet, playful","bright,sweet,playful,gentle",86,85],
  ["Pearl","female","English","pure, precious gem","elegant, precious, serene","gem,elegant,precious,serene",83,85],
  ["Poppy","female","English","red flower","bright, cheerful, bold","flower,bright,cheerful,bold",85,85],
  ["Iris","female","Greek","rainbow goddess","colorful, independent, graceful","rainbow,goddess,greek,graceful",84,86],
  ["Misty","female","English","covered in mist","mysterious, gentle, ethereal","mysterious,gentle,fog,classic",86,85],
  // Indian cats — original 7 from generate-pet-names.mjs
  ["Billu","male","Hindi","shining, bright one","playful, lovable, mischievous","hindi,shining,playful,beloved",85,83],
  ["Mitu","unisex","Hindi","sweet talker, parrot","chatty, playful, social","hindi,parrot,chatty,social",82,82],
  ["Kalu","male","Hindi","dark one, black","mysterious, clever, independent","dark,mysterious,clever,hindi",80,82],
  ["Nandini","female","Sanskrit","delightful, daughter of joy","joyful, gentle, affectionate","joy,gentle,divine,hindu",81,83],
  ["Pari","female","Persian","fairy, angel","fairy-like, graceful, magical","fairy,magical,graceful,persian",83,85],
  ["Sonu","unisex","Hindi","golden, beloved","golden, loving, sweet","golden,loving,sweet,hindi",82,82],
  ["Golu","male","Hindi","chubby, round","chubby, lovable, playful","chubby,lovable,round,cute",83,83],
  // Indian cats — 20 new seeds
  ["Kali","female","Sanskrit","black goddess, time","fierce, mysterious, divine","goddess,fierce,black,divine",82,87],
  ["Chiku","unisex","Hindi","small sweet sapodilla","sweet, tiny, curious","sweet,tiny,fruit,hindi",79,82],
  ["Billi","female","Hindi","cat, feline one","graceful, independent, sly","cat,hindi,graceful,sly",80,82],
  ["Guddu","male","Hindi","darling, dear one","loving, gentle, playful","dear,loving,playful,hindi",79,81],
  ["Sona","female","Hindi","gold, dear one","warm, loving, precious","gold,warm,loving,hindi",80,83],
  ["Tara","female","Sanskrit","star, shining one","graceful, radiant, calm","star,radiant,calm,hindu",83,85],
  ["Asha","female","Sanskrit","hope, wish","hopeful, gentle, bright","hope,bright,gentle,hindu",81,83],
  ["Chamki","female","Hindi","sparkle, glitter","lively, bright, playful","sparkle,bright,lively,hindi",79,83],
  ["Minu","female","Hindi","bright, sparkling","gentle, bright, curious","bright,sparkling,gentle,hindi",78,82],
  ["Cheeku","unisex","Hindi","cute, tiny one","adorable, tiny, playful","cute,tiny,adorable,hindi",80,82],
  ["Pushpa","female","Sanskrit","flower, blossom","gentle, fragrant, graceful","flower,fragrant,gentle,hindu",79,82],
  ["Ganga","female","Sanskrit","sacred river, pure","serene, pure, divine","river,pure,divine,hindu",80,83],
  ["Shona","female","Hindi","gold, my dear","loving, warm, sweet","gold,loving,warm,hindi",80,83],
  ["Mitthu","male","Hindi","sweet parrot, dear one","chatty, affectionate, playful","parrot,sweet,chatty,hindi",81,83],
  ["Raju","male","Hindi","king, dear one","friendly, playful, loyal","friendly,playful,dear,hindi",79,81],
  ["Pappu","male","Hindi","dear boy, little one","sweet, playful, mischievous","dear,sweet,playful,hindi",78,80],
  ["Mithun","male","Sanskrit","Gemini, twin star","curious, dual-natured, clever","gemini,twin,clever,hindu",79,83],
  ["Kajal","female","Hindi","kohl, dark eyes","mysterious, beautiful, dark","dark,beautiful,mysterious,hindi",82,84],
  ["Nimo","male","Hindi","peaceful, calm one","calm, gentle, serene","calm,peaceful,gentle,hindi",78,81],
  ["Laado","female","Hindi","precious darling","precious, loving, gentle","precious,darling,loving,hindi",79,82],
  // Egyptian / mythological (7)
  ["Bastet","female","Egyptian","goddess of cats and home","regal, protective, divine","egyptian,goddess,cat,divine",84,90],
  ["Cleopatra","female","Greek","glory of the father, queen","regal, commanding, mysterious","egyptian,queen,regal,mysterious",83,89],
  ["Isis","female","Egyptian","throne, goddess of magic","magical, nurturing, powerful","egyptian,goddess,magic,powerful",82,88],
  ["Sphinx","male","Greek","to squeeze, the great riddle","mysterious, wise, stoic","egyptian,mysterious,ancient,wise",78,87],
  ["Pharaoh","male","Egyptian","great house, ruler","regal, commanding, proud","egyptian,regal,ruler,proud",79,87],
  ["Ra","male","Egyptian","sun god, king of gods","radiant, powerful, divine","sun,god,egyptian,divine",80,88],
  ["Anubis","male","Egyptian","guide to the afterlife","loyal, mysterious, protective","guide,egyptian,mystery,protective",78,87],
  // Nature / color (10)
  ["Shadow","unisex","English","dark reflection","mysterious, quiet, sleek","dark,mysterious,sleek,quiet",87,86],
  ["Midnight","unisex","English","darkest hour of night","mysterious, independent, dark","dark,mysterious,night,independent",85,86],
  ["Onyx","unisex","Greek","black gemstone","sleek, mysterious, elegant","black,gem,sleek,mysterious",83,86],
  ["Snowball","unisex","English","white as snow","fluffy, gentle, sweet","white,fluffy,gentle,sweet",85,84],
  ["Marble","unisex","English","streaked stone pattern","elegant, unique, beautiful","pattern,elegant,unique,stone",80,83],
  ["Ash","unisex","English","ash tree, gray","calm, elegant, understated","gray,calm,elegant,nature",81,83],
  ["Frost","unisex","English","frozen water crystals","cool, elegant, serene","cold,elegant,serene,winter",80,84],
  ["Storm","unisex","English","tempest, weather","fierce, independent, powerful","fierce,independent,powerful,weather",81,85],
  ["Pepper","unisex","English","peppery black-and-white","spicy, energetic, playful","spicy,energetic,playful,bw",82,83],
  ["Ember","unisex","English","glowing coal, warm light","warm, glowing, independent","warm,glowing,independent,nature",81,84],
  // Food (9)
  ["Oreo","unisex","American","black-and-white cookie","sweet, playful, classic","cookie,sweet,black-white,playful",88,86],
  ["Mochi","unisex","Japanese","sweet rice cake","soft, round, sweet","japanese,sweet,soft,round",86,87],
  ["Tofu","unisex","Chinese","white bean curd","soft, gentle, pure","chinese,soft,white,gentle",82,84],
  ["Biscuit","unisex","English","small baked treat","warm, comforting, sweet","food,warm,sweet,comforting",83,83],
  ["Waffle","unisex","English","crispy batter cake","warm, sweet, cozy","food,warm,sweet,cozy",82,84],
  ["Cookie","unisex","English","sweet baked treat","sweet, lovable, warm","food,sweet,warm,lovable",84,84],
  ["Truffle","unisex","French","rare earthy mushroom","rare, earthy, luxurious","luxury,earthy,rare,french",81,85],
  ["Fudge","unisex","English","rich chocolate candy","rich, sweet, indulgent","chocolate,sweet,rich,indulgent",82,83],
  ["Nutmeg","unisex","English","warm baking spice","warm, cozy, fragrant","spice,warm,cozy,aromatic",80,83],
  // Classics (5)
  ["Socks","unisex","English","white pawed, two-toned","playful, classic, lovable","classic,two-tone,lovable,playful",84,82],
  ["Whiskers","unisex","English","long facial whiskers","curious, investigative, classic","classic,curious,investigative,cat",83,81],
  ["Mittens","unisex","English","white-pawed like mittens","gentle, sweet, playful","classic,gentle,sweet,playful",84,82],
  ["Fluffy","unisex","English","soft and fluffy fur","soft, cuddly, gentle","fluffy,soft,cuddly,gentle",85,82],
  ["Tiger","male","English","tiger-striped, fierce","fierce, striped, bold","tiger,stripes,fierce,bold",84,84],
];

// ── MODIFIER ARRAYS ───────────────────────────────────────────────────────────

const NATURE_PREFIXES = [
  { word: "Golden",   meaning: "golden, shining",          keywords: "golden,shining",     pop: -5, vibe: +2 },
  { word: "Silver",   meaning: "silver, bright",           keywords: "silver,bright",       pop: -5, vibe: +2 },
  { word: "Shadow",   meaning: "dark, mysterious",         keywords: "shadow,dark",         pop: -5, vibe: +3 },
  { word: "Midnight", meaning: "dark, mysterious night",   keywords: "midnight,dark,night", pop: -4, vibe: +4 },
  { word: "Copper",   meaning: "warm reddish metal",       keywords: "copper,warm,metal",   pop: -5, vibe: +3 },
  { word: "Crimson",  meaning: "deep red, bold",           keywords: "crimson,red,bold",    pop: -5, vibe: +3 },
  { word: "Marble",   meaning: "elegant, patterned",       keywords: "marble,elegant",      pop: -6, vibe: +3 },
  { word: "Wild",     meaning: "untamed, free-spirited",   keywords: "wild,untamed,free",   pop: -5, vibe: +3 },
  { word: "Moon",     meaning: "gentle, mysterious",       keywords: "moon,moonlit",        pop: -5, vibe: +2 },
  { word: "Frost",    meaning: "cool, crisp",              keywords: "frost,cool,winter",   pop: -6, vibe: +2 },
  { word: "Storm",    meaning: "fierce, powerful",         keywords: "storm,fierce",        pop: -5, vibe: +3 },
  { word: "Ember",    meaning: "warm, glowing",            keywords: "ember,glowing,warm",  pop: -6, vibe: +2 },
  { word: "Onyx",     meaning: "sleek, dark gemstone",     keywords: "onyx,dark,gem",       pop: -6, vibe: +3 },
  { word: "Velvet",   meaning: "soft, smooth, luxurious",  keywords: "velvet,soft,luxury",  pop: -5, vibe: +4 },
  { word: "Misty",    meaning: "soft, ethereal",           keywords: "misty,ethereal,soft", pop: -6, vibe: +1 },
  { word: "Rusty",    meaning: "reddish, earthy",          keywords: "rusty,earthy",        pop: -6, vibe: +1 },
  { word: "Sable",    meaning: "dark, luxurious fur",      keywords: "sable,dark,luxury",   pop: -6, vibe: +3 },
  { word: "Ash",      meaning: "cool gray, calm",          keywords: "ash,gray,calm",       pop: -7, vibe: +2 },
  { word: "Blaze",    meaning: "fiery, bright",            keywords: "blaze,fiery,bright",  pop: -5, vibe: +3 },
  { word: "Pearl",    meaning: "pure, luminous",           keywords: "pearl,pure,luminous", pop: -5, vibe: +3 },
];

const TITLE_PREFIXES = [
  { word: "Sir",      meaning: "knightly, noble",    keywords: "sir,noble,knight",    pop: -4, vibe: +3 },
  { word: "Lady",     meaning: "noble, graceful",    keywords: "lady,noble,elegant",  pop: -4, vibe: +3 },
  { word: "Captain",  meaning: "leader, bold",       keywords: "captain,leader,bold", pop: -5, vibe: +3 },
  { word: "King",     meaning: "regal, commanding",  keywords: "king,regal,royal",    pop: -4, vibe: +4 },
  { word: "Queen",    meaning: "regal, majestic",    keywords: "queen,regal,majestic",pop: -4, vibe: +4 },
  { word: "Prince",   meaning: "royal, noble heir",  keywords: "prince,royal,noble",  pop: -5, vibe: +4 },
  { word: "Princess", meaning: "royal, graceful",    keywords: "princess,royal,regal",pop: -5, vibe: +4 },
  { word: "Duke",     meaning: "noble lord",         keywords: "duke,noble,lord",     pop: -5, vibe: +3 },
  { word: "Duchess",  meaning: "noble lady",         keywords: "duchess,noble,lady",  pop: -5, vibe: +3 },
  { word: "Countess", meaning: "noble, distinguished",keywords:"countess,noble,regal",pop: -6, vibe: +3 },
];

// ── GENERATION ────────────────────────────────────────────────────────────────

function generateCatNames(target = 2500) {
  const slugSet = new Set();
  const results = [];

  function tryAdd(name, gender, origin, meaningShort, personality, keywords, pop, vibe) {
    if (results.length >= target) return;
    const s = slug(name);
    if (slugSet.has(s)) return;
    slugSet.add(s);
    results.push(makeRecord(name, gender, origin, meaningShort, personality, keywords, pop, vibe));
  }

  // Pass 1 — seeds (102)
  for (const [n, g, o, m, p, k, pop, vibe] of SEEDS) {
    tryAdd(n, g, o, m, p, k, pop, vibe);
  }

  // Pass 2 — nature prefix + seed (20 × 102 = 2,040 potential)
  for (const pfx of NATURE_PREFIXES) {
    for (const [n, g, o, m, p, k, pop, vibe] of SEEDS) {
      tryAdd(name(pfx.word, n), g, o,
        `${pfx.meaning} ${m}`, p,
        k + ',' + pfx.keywords, pop + pfx.pop, vibe + pfx.vibe);
    }
  }

  // Pass 3 — title prefix + seed (10 × 102 = 1,020 potential, fills remaining)
  for (const pfx of TITLE_PREFIXES) {
    for (const [n, g, o, m, p, k, pop, vibe] of SEEDS) {
      tryAdd(name(pfx.word, n), g, o,
        `${pfx.meaning} ${m}`, p,
        k + ',' + pfx.keywords, pop + pfx.pop, vibe + pfx.vibe);
    }
  }

  return results;
}

function name(prefix, base) { return `${prefix} ${base}`; }

// ── RUN ───────────────────────────────────────────────────────────────────────

const cats = generateCatNames(2500);
const slugs = cats.map(c => c.slug);
const uniqueSlugs = new Set(slugs);
const indian = cats.filter(e => ['Hindi','Sanskrit','Persian'].some(o => e.origin.includes(o)));

console.log('─'.repeat(50));
console.log(`Total generated : ${cats.length}`);
console.log(`Unique slugs    : ${uniqueSlugs.size}`);
console.log(`Duplicates      : ${cats.length - uniqueSlugs.size}`);
console.log(`Indian-origin   : ${indian.length}`);
console.log('─'.repeat(50));
console.log('First 10:', cats.slice(0, 10).map(c => c.name).join(', '));
console.log('Last  10:', cats.slice(-10).map(c => c.name).join(', '));
console.log('─'.repeat(50));

const outPath = join(__dir, 'cat-names-2500.json');
writeFileSync(outPath, JSON.stringify(cats, null, 2));
console.log(`Saved → scripts/cat-names-2500.json (${(JSON.stringify(cats).length / 1024).toFixed(0)} KB)`);
