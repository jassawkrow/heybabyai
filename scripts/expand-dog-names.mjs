/**
 * Dog name expander: 161 seeds × combinatorial prefixes → 3,500 unique dog records.
 * Run: node scripts/expand-dog-names.mjs
 * Outputs: scripts/dog-names-3500.json + console stats
 */

import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dir = dirname(fileURLToPath(import.meta.url));

// ── HELPERS ───────────────────────────────────────────────────────────────────

function slug(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-dog';
}

function longDesc(n, o, m, p) {
  return `${n} is a beloved dog name with ${o} roots. The name means "${m}". ` +
    `Dogs named ${n} are known for being ${p} — loyal companions who fill every home with unconditional love. ` +
    `Whether bounding through the park or napping at your feet, ${n} is a name that fits a four-legged friend perfectly.`;
}

function makeRecord(name, gender, origin, meaningShort, personality, keywords, pop, vibe) {
  return {
    slug: slug(name),
    pet_type: 'dog',
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

// ── SEED ARRAY (161 dogs — same as generate-pet-names.mjs) ───────────────────
// [name, gender, origin, meaning_short, personality, keywords, popularity, vibe]

const SEEDS = [
  // Western male
  ["Buddy","male","English","loyal companion","friendly, loyal, energetic","loyal,classic,friendly,playful",95,88],
  ["Max","male","Latin","the greatest","confident, smart, strong","classic,strong,popular,confident",97,90],
  ["Charlie","male","English","free man","playful, cheerful, social","playful,classic,cheerful,friendly",94,87],
  ["Cooper","male","English","barrel maker","curious, energetic, clever","clever,energetic,classic,work",88,84],
  ["Milo","male","Latin","soldier, gracious","calm, affectionate, gentle","gentle,calm,sweet,popular",86,85],
  ["Oliver","male","Latin","olive tree","peaceful, loving, steady","classic,peaceful,nature,gentle",84,83],
  ["Jack","male","Hebrew","God is gracious","bold, energetic, fun","classic,bold,energetic,traditional",92,86],
  ["Finn","male","Irish","fair, white","adventurous, bright, spirited","adventurous,irish,bright,spirited",85,86],
  ["Archie","male","English","truly brave","brave, lively, affectionate","brave,classic,lively,british",82,84],
  ["Gus","male","Latin","great, magnificent","jolly, easygoing, lovable","jolly,easygoing,short,classic",78,82],
  ["Teddy","male","English","God's gift","cuddly, sweet, gentle","sweet,cuddly,gentle,gift",87,86],
  ["Zeus","male","Greek","sky father, king of gods","powerful, majestic, commanding","strong,powerful,mythological,king",91,92],
  ["Apollo","male","Greek","shining, destroyer","radiant, noble, graceful","mythological,noble,shining,greek",83,89],
  ["Thor","male","Norse","god of thunder","strong, protective, fearless","strong,norse,thunder,powerful",86,91],
  ["Rocky","male","American","rocky terrain","tough, spirited, determined","tough,strong,pop-culture,fighter",90,88],
  ["Duke","male","Latin","leader, commander","noble, dignified, loyal","noble,leader,classic,dignified",85,87],
  ["Bruno","male","German","brown, armored","sturdy, reliable, warm","german,sturdy,classic,strong",79,83],
  ["Rex","male","Latin","king","regal, powerful, confident","king,latin,strong,classic",88,89],
  ["Dexter","male","Latin","right-handed, skillful","clever, quick, agile","clever,skillful,smart,classic",81,85],
  ["Chester","male","English","fortress city","reliable, sturdy, lovable","sturdy,classic,reliable,british",76,81],
  ["Winston","male","English","joyful stone","dignified, calm, distinguished","british,dignified,classic,regal",80,85],
  ["Murphy","male","Irish","sea warrior","lively, bold, charming","irish,sea,warrior,lively",83,84],
  ["Bailey","male","English","bailiff, steward","sweet, gentle, reliable","sweet,gentle,classic,friendly",84,83],
  ["Leo","male","Latin","lion","brave, charismatic, bold","lion,brave,bold,short",89,88],
  ["Beau","male","French","handsome","charming, elegant, lovable","french,handsome,charming,elegant",82,86],
  ["Hank","male","English","ruler of the home","dependable, friendly, easygoing","dependable,homey,classic,friendly",78,82],
  ["Sam","male","Hebrew","told by God","gentle, wise, loyal","classic,gentle,biblical,loyal",87,84],
  ["Tucker","male","English","cloth-tucker, garment maker","energetic, fun, bouncy","energetic,playful,classic,work",85,83],
  ["Hunter","male","English","one who hunts","athletic, alert, bold","athletic,bold,classic,adventure",86,85],
  ["Ace","male","Latin","number one, excellence","confident, champion, spirited","champion,confident,short,cool",84,88],
  ["Bear","male","English","strong like a bear","sturdy, protective, gentle giant","strong,nature,huge,protective",87,87],
  ["Jax","male","American","God has been gracious","cool, modern, energetic","cool,modern,short,energetic",85,86],
  ["Chase","male","English","to hunt, pursue","alert, swift, playful","swift,playful,active,modern",84,85],
  ["Maverick","male","American","independent spirit","free-spirited, bold, unique","bold,independent,modern,cool",86,89],
  ["Ranger","male","English","forest keeper, guardian","watchful, loyal, outdoorsy","outdoor,loyal,guardian,nature",81,85],
  ["Scout","male","English","to observe, explore","curious, adventurous, alert","curious,adventurous,nature,smart",83,85],
  ["Diesel","male","German","powerful engine","robust, powerful, fast","powerful,strong,bold,cool",80,84],
  ["Boomer","male","American","loud and boisterous","boisterous, fun, friendly","loud,fun,playful,energetic",79,82],
  ["Tank","male","American","heavy, powerful","strong, solid, dependable","strong,heavy,powerful,tough",80,83],
  ["Atlas","male","Greek","to carry, endure","strong, dependable, worldly","strong,greek,mythological,endure",82,87],
  ["Odin","male","Norse","fury and wisdom","wise, powerful, mystical","wise,norse,powerful,mythological",83,90],
  ["Bandit","male","American","outlaw, rebel","mischievous, clever, energetic","mischievous,rebel,fun,energetic",82,84],
  ["Rufus","male","Latin","red-haired","cheerful, warm, friendly","classic,red,cheerful,warm",76,81],
  ["Cody","male","Irish","helpful one","helpful, friendly, playful","helpful,irish,friendly,classic",82,82],
  ["Louie","male","German","famous warrior","lively, charming, lovable","lively,charming,french,classic",81,83],
  ["Bentley","male","English","bent grass meadow","distinguished, regal, stylish","regal,stylish,british,distinguished",80,86],
  ["Otto","male","German","wealth, fortune","steady, classic, reliable","german,classic,steady,reliable",77,82],
  ["Toby","male","Hebrew","God is good","sweet, gentle, loving","sweet,gentle,classic,biblical",84,83],
  ["Jake","male","Hebrew","supplanter","loyal, bold, energetic","classic,loyal,bold,biblical",85,83],
  ["Moose","male","American","large and powerful","big, friendly, gentle giant","big,nature,large,gentle",80,84],
  ["Henry","male","German","ruler of the home","regal, kind, steady","regal,classic,kind,distinguished",83,85],
  ["Hugo","male","German","mind, intellect","intelligent, noble, curious","intelligent,noble,german,classic",81,85],
  ["Buster","male","American","tough, sturdy","tough, playful, energetic","tough,playful,classic,energetic",83,83],
  ["Rudy","male","German","famous wolf","spirited, charming, friendly","german,wolf,spirited,friendly",79,83],
  ["Riley","unisex","Irish","valiant, courageous","brave, spirited, lively","brave,irish,spirited,lively",85,84],
  ["Ziggy","male","German","victorious protector","fun, quirky, energetic","fun,quirky,energetic,unique",78,85],
  ["Samson","male","Hebrew","sun child, strong","powerful, noble, brave","strong,biblical,powerful,noble",79,85],
  // Western female
  ["Bella","female","Italian","beautiful","loving, sweet, graceful","beautiful,popular,sweet,loving",98,90],
  ["Lucy","female","English","light, illumination","bright, playful, clever","bright,light,playful,classic",95,88],
  ["Daisy","female","English","day's eye flower","cheerful, sunny, gentle","flower,cheerful,sunny,classic",92,87],
  ["Molly","female","Hebrew","wished-for child","sweet, loving, loyal","sweet,loving,classic,biblical",91,86],
  ["Sadie","female","Hebrew","princess","feisty, loving, spirited","princess,feisty,loving,spirited",89,87],
  ["Lola","female","Spanish","sorrows, strong woman","bold, playful, spirited","bold,playful,spanish,spirited",88,86],
  ["Sophie","female","Greek","wisdom","wise, gentle, affectionate","wise,gentle,greek,classic",90,87],
  ["Rosie","female","English","rose flower","loving, cheerful, sweet","flower,sweet,loving,classic",89,87],
  ["Maggie","female","Greek","pearl","sweet, loyal, gentle","pearl,sweet,loyal,classic",88,85],
  ["Coco","female","French","chocolate, coconut","playful, chic, lovable","chocolate,chic,playful,french",87,87],
  ["Stella","female","Latin","star","radiant, bold, affectionate","star,radiant,bold,latin",90,89],
  ["Nala","female","African","successful, beloved","regal, gentle, brave","african,regal,gentle,lion-king",85,88],
  ["Abby","female","Hebrew","father's joy","joyful, loving, loyal","joyful,loving,classic,biblical",87,85],
  ["Penny","female","Greek","weaver of dreams","clever, loving, cheerful","clever,cheerful,classic,greek",86,85],
  ["Ruby","female","Latin","deep red gemstone","vibrant, passionate, loving","ruby,gem,vibrant,loving",88,87],
  ["Chloe","female","Greek","blooming, spring green","lively, sweet, social","blooming,lively,greek,sweet",89,86],
  ["Zoe","female","Greek","life","full of life, playful, bright","life,bright,playful,greek",90,88],
  ["Ellie","female","Greek","bright shining one","bright, sweet, loving","bright,sweet,loving,classic",88,87],
  ["Hazel","female","English","hazel tree, wise","gentle, wise, nature-loving","nature,wise,gentle,plant",85,86],
  ["Millie","female","English","strength, determination","determined, sweet, gentle","strength,sweet,classic,gentle",85,84],
  ["Bonnie","female","Scottish","beautiful, good","sweet, lively, loving","scottish,sweet,lively,beautiful",83,85],
  ["Nova","female","Latin","new star, brightness","bright, curious, energetic","star,bright,modern,space",86,88],
  ["Angel","female","Greek","messenger of God","sweet, gentle, heavenly","angel,sweet,gentle,divine",85,85],
  ["Poppy","female","English","red flower, remembrance","bright, cheerful, energetic","flower,bright,cheerful,british",84,86],
  ["Luna","female","Latin","moon","gentle, mysterious, beautiful","moon,mysterious,beautiful,latin",92,89],
  ["Honey","female","English","sweet nectar","sweet, loving, gentle","sweet,gentle,loving,nature",86,85],
  ["Ivy","female","English","faithfulness, vine","tenacious, graceful, loyal","nature,faithful,graceful,plant",84,85],
  ["Maple","female","English","maple tree, sweetness","sweet, warm, nature-loving","nature,sweet,warm,canadian",83,85],
  ["Sage","female","English","wise one, healing herb","calm, wise, serene","wise,herb,calm,nature",84,86],
  ["Willow","female","English","graceful tree","graceful, gentle, fluid","nature,graceful,gentle,tree",86,87],
  ["Aurora","female","Latin","dawn, northern lights","radiant, magical, beautiful","dawn,magical,beautiful,space",87,90],
  ["Athena","female","Greek","goddess of wisdom","wise, noble, strong","wisdom,goddess,greek,noble",85,89],
  ["Freya","female","Norse","noble lady","fierce, loving, noble","norse,noble,goddess,fierce",84,88],
  // Indian
  ["Raja","male","Sanskrit","king, ruler","regal, commanding, loyal","king,indian,royal,loyal",90,88],
  ["Moti","male","Hindi","pearl, precious","gentle, precious, loyal","pearl,hindi,gentle,traditional",82,82],
  ["Sheru","male","Hindi","lion, brave one","brave, fierce, protective","lion,brave,hindi,traditional",85,85],
  ["Tiger","male","English","fierce and powerful","fierce, athletic, bold","tiger,powerful,fierce,bold",88,86],
  ["Bheem","male","Sanskrit","powerful, from Mahabharata","mighty, strong, noble","mahabharata,powerful,indian,strong",83,86],
  ["Arjun","male","Sanskrit","bright, white, from epic","skillful, brave, noble","mahabharata,brave,indian,noble",85,87],
  ["Veer","male","Hindi","brave hero","brave, protective, strong","brave,hero,hindi,strong",84,86],
  ["Dev","male","Sanskrit","divine, god-like","noble, divine, gentle","divine,god,indian,noble",83,85],
  ["Raj","male","Sanskrit","ruler, king","regal, confident, noble","king,ruler,indian,royal",86,85],
  ["Badal","male","Hindi","cloud, one who brings rain","calm, fluid, protective","cloud,nature,hindi,calm",78,83],
  ["Bijli","female","Hindi","lightning, electric","swift, energetic, bright","lightning,electric,hindi,swift",80,86],
  ["Shiv","male","Sanskrit","auspicious, Lord Shiva","powerful, calm, divine","shiva,divine,powerful,hindu",84,87],
  ["Pawan","male","Sanskrit","wind, breeze","free, swift, gentle","wind,nature,sanskrit,gentle",80,83],
  ["Kabir","male","Arabic","great, noble","wise, noble, spiritual","wise,noble,sufi,spiritual",82,86],
  ["Dhruv","male","Sanskrit","polar star, steadfast","steadfast, reliable, bright","star,steadfast,reliable,hindu",83,86],
  ["Rudra","male","Sanskrit","roarer, storm god","fierce, powerful, intense","storm,fierce,powerful,shiva",82,87],
  ["Vikram","male","Sanskrit","brave, valiant","brave, heroic, victorious","brave,heroic,indian,valiant",83,86],
  ["Rani","female","Hindi","queen","regal, loving, gentle","queen,regal,indian,loving",88,86],
  ["Chameli","female","Hindi","jasmine flower","gentle, sweet, fragrant","flower,sweet,hindi,fragrant",80,82],
  ["Durga","female","Sanskrit","goddess, impassable","fierce, protective, divine","goddess,fierce,divine,hindu",82,87],
  ["Lakshmi","female","Sanskrit","goddess of wealth and beauty","graceful, auspicious, beautiful","goddess,wealth,beauty,hindu",84,87],
  ["Meera","female","Sanskrit","devotee, sea of love","devotional, sweet, gentle","devotion,love,krishna,hindi",83,85],
  ["Radha","female","Sanskrit","success, beloved of Krishna","loving, devoted, gentle","krishna,love,devoted,hindi",82,85],
  ["Sita","female","Sanskrit","furrow, beloved of Rama","pure, gentle, devoted","ramayana,pure,devoted,hindu",81,84],
  ["Mishka","female","Russian","little mouse, sweet","tiny, sweet, adorable","sweet,tiny,russian,adorable",83,85],
  ["Priya","female","Sanskrit","beloved, dear","loving, affectionate, warm","beloved,loving,indian,warm",85,85],
  ["Nisha","female","Sanskrit","night, darkness","mysterious, gentle, calm","night,mysterious,calm,hindi",80,83],
  ["Tulsi","female","Sanskrit","holy basil, sacred plant","sacred, gentle, aromatic","sacred,plant,holy,hindi",79,82],
  ["Pinky","female","English","rosy pink, sweet","sweet, playful, cheerful","pink,sweet,playful,cheerful",82,81],
  ["Gudiya","female","Hindi","little doll, darling","adorable, sweet, precious","doll,sweet,adorable,hindi",80,82],
  // Mythological
  ["Hermes","male","Greek","messenger of the gods","swift, clever, adventurous","greek,messenger,swift,mythological",78,87],
  ["Poseidon","male","Greek","ocean god","powerful, commanding, fluid","ocean,powerful,greek,mythological",77,88],
  ["Ares","male","Greek","god of war","fierce, bold, powerful","war,fierce,greek,mythological",76,87],
  ["Loki","male","Norse","trickster god","clever, mischievous, charming","trickster,norse,clever,mythological",80,88],
  ["Osiris","male","Egyptian","god of the underworld","mysterious, noble, ancient","egyptian,ancient,noble,mythological",74,87],
  ["Horus","male","Egyptian","falcon god, sky lord","watchful, noble, powerful","falcon,egyptian,sky,mythological",75,87],
  ["Anubis","male","Egyptian","guide to the afterlife","loyal, protective, mysterious","egyptian,guide,loyal,mythological",76,88],
  // Nature / space
  ["Storm","male","English","tempest, powerful weather","fierce, bold, energetic","storm,fierce,bold,nature",82,86],
  ["Blaze","male","English","bright fire, flame","fiery, energetic, fast","fire,energetic,fast,bold",83,87],
  ["Phoenix","unisex","Greek","mythical firebird, rebirth","resilient, bold, radiant","fire,rebirth,bold,mythological",85,90],
  ["Comet","male","English","space traveler, blazing star","fast, bright, adventurous","space,fast,bright,adventurous",80,86],
  ["Cosmo","male","Greek","order, universe","cosmic, curious, bright","space,universe,bright,curious",79,86],
  ["River","unisex","English","flowing water","calm, fluid, free-spirited","water,calm,nature,free",83,85],
  ["Zephyr","male","Greek","west wind, gentle breeze","free, gentle, swift","wind,gentle,greek,nature",80,86],
  // Food / cute
  ["Mochi","unisex","Japanese","sweet rice cake","soft, sweet, round","japanese,sweet,soft,cute",86,88],
  ["Pretzel","male","German","twisted bread","quirky, clever, fun","bread,quirky,fun,german",76,83],
  ["Waffle","unisex","English","crispy batter cake","sweet, warm, comforting","breakfast,sweet,warm,fun",80,85],
  ["Biscuit","unisex","English","small flat cake","warm, comforting, sweet","food,sweet,comforting,classic",82,84],
  ["Cookie","unisex","English","sweet baked treat","sweet, lovable, cheerful","sweet,baked,cheerful,lovable",84,85],
  ["Peanut","unisex","English","small but mighty","tiny, energetic, adorable","tiny,cute,energetic,small",83,85],
  ["Noodle","unisex","English","thin pasta, long and wiggly","wiggly, playful, goofy","funny,wiggly,goofy,playful",80,84],
  ["Boba","unisex","Cantonese","bubble tea pearl","round, sweet, fun","bubble-tea,sweet,fun,asian",79,85],
  ["Matcha","unisex","Japanese","powdered green tea","calm, earthy, gentle","japanese,tea,calm,earthy",80,86],
  ["Churro","male","Spanish","fried dough pastry","warm, sweet, festive","spanish,sweet,warm,festive",77,83],
  ["Espresso","male","Italian","strong concentrated coffee","energetic, bold, intense","coffee,bold,intense,italian",78,85],
  ["Kimchi","unisex","Korean","fermented vegetable dish","spicy, bold, unique","korean,spicy,bold,unique",75,84],
  ["Mango","unisex","Hindi","tropical sweet fruit","sweet, tropical, vibrant","tropical,sweet,vibrant,fruit",84,86],
  ["Kiwi","unisex","Maori","green fruit, NZ bird","perky, bright, energetic","fruit,bright,energetic,green",81,84],
  ["Caramel","female","French","golden toffee sweetness","warm, sweet, golden","sweet,warm,golden,french",82,84],
  ["Cinnamon","female","English","warm aromatic spice","warm, spicy, comforting","spice,warm,comforting,aromatic",82,84],
  ["Ginger","female","English","pungent root, purity","spicy, energetic, bright","spice,bright,energetic,classic",83,84],
  ["Nutmeg","unisex","English","warm baking spice","warm, cozy, aromatic","spice,warm,cozy,aromatic",78,83],
  // Pop culture
  ["Pluto","male","Roman","god of the underworld, planet","playful, loyal, cheerful","disney,planet,playful,classic",88,85],
  ["Snoopy","male","American","clever beagle detective","smart, imaginative, lovable","peanuts,clever,lovable,cartoon",90,88],
  ["Scooby","male","American","mystery-solving great dane","brave, lovable, funny","cartoon,brave,funny,lovable",88,87],
  ["Lassie","female","Scottish","loyal and faithful collie","loyal, brave, heroic","classic,loyal,brave,tv",87,86],
  ["Bolt","male","American","lightning bolt, superdog","fast, brave, loyal","disney,fast,brave,loyal",83,85],
];

// ── MODIFIER ARRAYS ───────────────────────────────────────────────────────────

const NATURE_PREFIXES = [
  { word: "Golden",  meaning: "golden, shining",      keywords: "golden,shining",   pop: -5, vibe: +2 },
  { word: "Silver",  meaning: "silver, bright",        keywords: "silver,bright",    pop: -5, vibe: +2 },
  { word: "Shadow",  meaning: "dark, mysterious",      keywords: "shadow,dark",      pop: -6, vibe: +3 },
  { word: "Storm",   meaning: "fierce, powerful",      keywords: "storm,fierce",     pop: -5, vibe: +3 },
  { word: "River",   meaning: "flowing, free",         keywords: "river,flowing",    pop: -6, vibe: +1 },
  { word: "Cloud",   meaning: "soft, dreamy",          keywords: "cloud,dreamy",     pop: -7, vibe: +1 },
  { word: "Moon",    meaning: "gentle, mysterious",    keywords: "moon,moonlit",     pop: -5, vibe: +2 },
  { word: "Sun",     meaning: "warm, radiant",         keywords: "sun,radiant",      pop: -5, vibe: +2 },
  { word: "Frost",   meaning: "cool, crisp",           keywords: "frost,cool",       pop: -7, vibe: +2 },
  { word: "Ember",   meaning: "warm, glowing",         keywords: "ember,glowing",    pop: -7, vibe: +2 },
  { word: "Blaze",    meaning: "fiery, bright",          keywords: "blaze,fiery",        pop: -6, vibe: +3 },
  { word: "Rusty",    meaning: "reddish, earthy",        keywords: "rusty,earthy",       pop: -5, vibe: +1 },
  { word: "Sandy",    meaning: "sand-colored, warm",     keywords: "sandy,warm",         pop: -5, vibe: +1 },
  { word: "Rocky",    meaning: "rugged, strong",         keywords: "rocky,rugged",       pop: -5, vibe: +1 },
  { word: "Misty",    meaning: "soft, ethereal",         keywords: "misty,ethereal",     pop: -6, vibe: +1 },
  { word: "Midnight", meaning: "dark, mysterious night", keywords: "midnight,dark,night",pop: -4, vibe: +4 },
  { word: "Copper",   meaning: "warm reddish metal",     keywords: "copper,warm,metal",  pop: -5, vibe: +3 },
  { word: "Crimson",  meaning: "deep red, bold",         keywords: "crimson,red,bold",   pop: -5, vibe: +3 },
  { word: "Marble",   meaning: "elegant, patterned",     keywords: "marble,elegant,pattern",pop:-6,vibe:+3},
  { word: "Wild",     meaning: "untamed, free-spirited", keywords: "wild,untamed,free",  pop: -5, vibe: +3 },
];

const TITLE_PREFIXES = [
  { word: "Sir",       meaning: "knightly, noble",     keywords: "sir,noble,knight",    pop: -4, vibe: +3 },
  { word: "Lady",      meaning: "noble, graceful",     keywords: "lady,noble,elegant",  pop: -4, vibe: +3 },
  { word: "Captain",   meaning: "leader, bold",        keywords: "captain,leader,bold", pop: -5, vibe: +3 },
  { word: "Prince",    meaning: "royal, noble heir",   keywords: "prince,royal,noble",  pop: -5, vibe: +4 },
  { word: "Princess",  meaning: "royal, graceful",     keywords: "princess,royal,regal",pop: -5, vibe: +4 },
  { word: "Duke",      meaning: "noble lord",          keywords: "duke,noble,lord",     pop: -5, vibe: +3 },
  { word: "Major",     meaning: "commanding, bold",    keywords: "major,bold,leader",   pop: -6, vibe: +2 },
  { word: "Baron",     meaning: "noble, lordly",       keywords: "baron,noble,lord",    pop: -6, vibe: +3 },
  { word: "King",      meaning: "regal, commanding",   keywords: "king,regal,royal",    pop: -4, vibe: +4 },
  { word: "Queen",     meaning: "regal, majestic",     keywords: "queen,regal,majestic",pop: -4, vibe: +4 },
  { word: "Lord",      meaning: "noble, powerful",     keywords: "lord,noble,powerful", pop: -5, vibe: +3 },
  { word: "General",   meaning: "commanding, strong",  keywords: "general,command,strong",pop:-6, vibe: +2 },
];

// ── GENERATION ────────────────────────────────────────────────────────────────

function generateDogNames(target = 3500) {
  const slugSet = new Set();
  const results = [];

  function tryAdd(name, gender, origin, meaningShort, personality, keywords, pop, vibe) {
    if (results.length >= target) return;
    const s = slug(name);
    if (slugSet.has(s)) return;
    slugSet.add(s);
    results.push(makeRecord(name, gender, origin, meaningShort, personality, keywords, pop, vibe));
  }

  // Pass 1 — seeds as-is (161)
  for (const [n, g, o, m, p, k, pop, vibe] of SEEDS) {
    tryAdd(n, g, o, m, p, k, pop, vibe);
  }

  // Pass 2 — nature prefix + seed  (20 × 161 = 3,220 potential)
  for (const pfx of NATURE_PREFIXES) {
    for (const [n, g, o, m, p, k, pop, vibe] of SEEDS) {
      const name = `${pfx.word} ${n}`;
      tryAdd(
        name, g, o,
        `${pfx.meaning} ${m}`,
        p,
        k + ',' + pfx.keywords,
        pop + pfx.pop,
        vibe + pfx.vibe,
      );
    }
  }

  // Pass 3 — title prefix + seed  (12 × 161 = 1,932 potential)
  for (const pfx of TITLE_PREFIXES) {
    for (const [n, g, o, m, p, k, pop, vibe] of SEEDS) {
      const name = `${pfx.word} ${n}`;
      tryAdd(
        name, g, o,
        `${pfx.meaning} ${m}`,
        p,
        k + ',' + pfx.keywords,
        pop + pfx.pop,
        vibe + pfx.vibe,
      );
    }
  }

  // Pass 4 — nature + title + seed combos (fills remaining if needed)
  outer: for (const np of NATURE_PREFIXES) {
    for (const tp of TITLE_PREFIXES) {
      for (const [n, g, o, m, p, k, pop, vibe] of SEEDS) {
        if (results.length >= target) break outer;
        const name = `${np.word} ${tp.word} ${n}`;
        tryAdd(
          name, g, o,
          `${np.meaning} ${tp.meaning} ${m}`,
          p,
          k + ',' + np.keywords + ',' + tp.keywords,
          pop + np.pop + tp.pop,
          vibe + np.vibe + tp.vibe,
        );
      }
    }
  }

  return results;
}

// ── RUN ───────────────────────────────────────────────────────────────────────

const dogs = generateDogNames(3500);
const slugs = dogs.map(d => d.slug);
const uniqueSlugs = new Set(slugs);

console.log('─'.repeat(50));
console.log(`Total generated : ${dogs.length}`);
console.log(`Unique slugs    : ${uniqueSlugs.size}`);
console.log(`Duplicates      : ${dogs.length - uniqueSlugs.size}`);
console.log('─'.repeat(50));
console.log('First 10:', dogs.slice(0, 10).map(d => d.name).join(', '));
console.log('Last  10:', dogs.slice(-10).map(d => d.name).join(', '));
console.log('─'.repeat(50));

// Save to JSON
const outPath = join(__dir, 'dog-names-3500.json');
writeFileSync(outPath, JSON.stringify(dogs, null, 2));
console.log(`Saved to: scripts/dog-names-3500.json (${(JSON.stringify(dogs).length / 1024).toFixed(0)} KB)`);
