/**
 * Pet name pronunciation generator.
 * Format: /SYLL-ABLE SYLL-ABLE/ — caps, hyphens within words, spaces between words.
 *
 * Usage:
 *   node scripts/gen-pronunciations.mjs --sample   ← show 20 samples, exit
 *   node scripts/gen-pronunciations.mjs             ← update all 50k rows
 */

import { createClient } from '@supabase/supabase-js';
import { fileURLToPath } from 'url';
import { resolve } from 'path';

const SB_URL = 'https://gitjchzvmskzenjlyvkc.supabase.co';
const KEY    = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!KEY) { console.error('Set SUPABASE_SERVICE_ROLE_KEY'); process.exit(1); }
const sb = createClient(SB_URL, KEY, { auth: { persistSession: false } });

// ── Word dictionary ──────────────────────────────────────────────────────────
// Covers the prefix and seed vocabulary used across all 7 pet types.
const DICT = {
  // ── Titles / ranks (prefixes) ──
  king:'KING', queen:'KWEEN', prince:'PRINS', princess:'PRIN-ses',
  duke:'DYOOK', duchess:'DUCH-es', lord:'LORD', lady:'LAY-dee',
  sir:'SER', baron:'BAIR-un', captain:'KAP-tin', royal:'ROY-ul',
  regal:'REE-gul', noble:'NOH-bul', grand:'GRAND',
  // ── Descriptors (prefixes) ──
  midnight:'MID-nyte', twilight:'TWY-lyte', shadow:'SHA-doh',
  storm:'STORM', thunder:'THUN-der', lightning:'LYT-ning',
  dark:'DARK', bright:'BRYT', swift:'SWIFT', wild:'WYLD',
  brave:'BRAYV', mighty:'MY-tee', mystic:'MIS-tik', magic:'MAJ-ik',
  cosmic:'KOZ-mik', ancient:'AYN-shunt', eternal:'ee-TER-nul',
  divine:'dih-VYN', crimson:'KRIM-zun', copper:'KOP-er',
  marble:'MAR-bul', silver:'SIL-ver', golden:'GOHL-den',
  crystal:'KRIS-tul', arctic:'ARK-tik', solar:'SOH-ler',
  lunar:'LOO-ner', stellar:'STEL-er', phantom:'FAN-tum',
  sacred:'SAY-kred', spirit:'SPIR-it', blaze:'BLAYZ', ember:'EM-ber',
  // ── Nature ──
  moon:'MOON', sun:'SUN', star:'STAR', fire:'FYR', flame:'FLAYM',
  frost:'FROST', ice:'YSE', snow:'SNOH', wind:'WIND', rain:'RAYN',
  water:'WAW-ter', ocean:'OH-shun', river:'RIV-er', cloud:'KLOWD',
  mist:'MIST', fog:'FOG', dawn:'DAWN', dusk:'DUSK', night:'NYTE',
  light:'LYT', stone:'STOHN', earth:'ERTH', sky:'SKY', sea:'SEE',
  // ── Greek/Roman mythology ──
  zeus:'ZYOOS', thor:'THOR', odin:'OH-din', loki:'LOH-kee',
  freya:'FRAY-ah', apollo:'ah-POL-oh', athena:'ah-THEE-nah',
  ares:'AIR-eez', hermes:'HER-meez', poseidon:'poh-SY-dun',
  hades:'HAY-deez', artemis:'AR-teh-mis', hera:'HEER-ah',
  demeter:'dee-MEE-ter', persephone:'per-SEF-oh-nee',
  dionysus:'dy-oh-NY-sus', pegasus:'PEG-ah-sus', atlas:'AT-las',
  orion:'oh-RY-un', centaur:'SEN-tor', hydra:'HY-drah',
  medusa:'meh-DYOO-sah', phoenix:'FEE-niks', titan:'TY-tun',
  // ── Egyptian mythology ──
  bastet:'BAS-tet', anubis:'ah-NYOO-bis', ra:'RAH', osiris:'oh-SY-ris',
  isis:'EYE-sis', horus:'HOR-us', thoth:'THOHTH', sekhmet:'SEK-met',
  sobek:'SOH-bek', sphinx:'SFINKS', pharaoh:'FAIR-oh',
  cleopatra:'klee-oh-PAH-trah', nefertiti:'nef-er-TEE-tee',
  // ── Norse ──
  tyr:'TEER', baldur:'BAWL-der', frigg:'FRIG', skadi:'SKAH-dee',
  // ── Arthurian / fantasy ──
  merlin:'MER-lin', gandalf:'GAN-dalf', lancelot:'LAN-se-lot',
  arthur:'AR-ther', excalibur:'eks-KAL-ih-ber',
  // ── Hindu mythology ──
  krishna:'KRISH-nah', rama:'RAH-mah', sita:'SEE-tah',
  arjuna:'AR-joo-nah', hanuman:'HAN-oo-man', ganesha:'gah-NAY-shah',
  shiva:'SHEE-vah', vishnu:'VISH-noo', indra:'IN-drah',
  lakshmi:'LAKH-shmee', durga:'DUR-gah', kali:'KAH-lee',
  brahma:'BRAH-mah', kurma:'KUR-mah', garuda:'gah-ROO-dah',
  nandi:'NAN-dee', saraswati:'sah-RAS-wah-tee',
  // ── Japanese ──
  sakura:'sah-KOO-rah', hana:'HAH-nah', kiko:'KEE-koh',
  yuki:'YOO-kee', hiro:'HEE-roh', kai:'KY', sora:'SOH-rah',
  tora:'TOH-rah', riku:'REE-koo', mochi:'MOH-chee', tama:'TAH-mah',
  // ── Common pet names (single-word seeds) ──
  max:'MAX', bella:'BEL-ah', buddy:'BUD-ee', charlie:'CHAR-lee',
  rocky:'ROK-ee', lucy:'LOO-see', daisy:'DAY-zee', molly:'MOL-ee',
  coco:'KOH-koh', simba:'SIM-bah', nala:'NAH-lah', rex:'REKS',
  ace:'AYS', bear:'BAIR', tiger:'TY-ger', leo:'LEE-oh',
  luna:'LOO-nah', ruby:'ROO-bee', lola:'LOH-lah', milo:'MY-loh',
  cleo:'KLEE-oh', romeo:'ROH-mee-oh', jasper:'JAS-per',
  oliver:'OL-ih-ver', maverick:'MAV-er-ik', cooper:'KOO-per',
  winston:'WIN-stun', archie:'AR-chee', biscuit:'BIS-kit',
  ginger:'JIN-jer', pepper:'PEP-er', cinnamon:'SIN-ah-mun',
  hazel:'HAY-zul', willow:'WIL-oh', peanut:'PEE-nut',
  pickles:'PIK-ulz', nibbles:'NIB-ulz', whiskers:'HWIS-kerz',
  fluffy:'FLUF-ee', fuzzy:'FUZ-ee', patches:'PACH-ez',
  mittens:'MIT-unz', boots:'BOOTS', socks:'SOKS', pumpkin:'PUMP-kin',
  nugget:'NUG-et', muffin:'MUF-in', cookie:'KUK-ee',
  waffles:'WAF-ulz', noodle:'NOO-dul', bubbles:'BUB-ulz',
  // ── Birds ──
  tweety:'TWEE-tee', polly:'POL-ee', kiwi:'KEE-wee', hawk:'HAWK',
  eagle:'EE-gul', falcon:'FAL-kun', raven:'RAY-vun', dove:'DUV',
  robin:'ROB-in', sparrow:'SPAIR-oh', finch:'FINCH', wren:'REN',
  thunderbird:'THUN-der-berd',
  // ── Fish ──
  nemo:'NEE-moh', dory:'DOR-ee', finn:'FIN', coral:'KOR-ul',
  pearl:'PERL', aqua:'AK-wah', goldie:'GOHL-dee', tang:'TANG',
  // ── Rabbits / hamsters / turtles ──
  bunny:'BUN-ee', thumper:'THUMP-er', clover:'KLOH-ver',
  floppy:'FLOP-ee', hammy:'HAM-ee', shelly:'SHEL-ee',
  slider:'SLY-der', speedy:'SPEE-dee', terra:'TAIR-ah',
  // ── Other common descriptors ──
  aurora:'aw-ROR-ah', nova:'NOH-vah', stella:'STEL-ah',
  iris:'EYE-ris', lotus:'LOH-tus', jade:'JAYD', amber:'AM-ber',
  ash:'ASH', sage:'SAYJ', jasmine:'JAZ-min', violet:'VY-oh-let',
  ranger:'RAYN-jer', hunter:'HUN-ter', scout:'SKOWT',
  bandit:'BAN-dit', rebel:'REB-ul', dragon:'DRAG-un',
  rogue:'ROHG',
  // ── Titles for birds ──
  major:'MAY-jer', colonel:'KER-nul', admiral:'AD-mih-rul',

  // ── Audit corrections (2026-06) ──────────────────────────────────────────
  // User-specified Irish/Greek
  niamh:'NEEV', saoirse:'SEER-shah', zephyr:'ZEF-er',
  // Mythology / non-English phonetics
  akupara:'ah-koo-PAH-rah', alkonost:'AL-koh-nost',
  aristotle:'ar-IS-toh-tul', bahumati:'bah-hoo-MAH-tee',
  bennu:'BEN-oo', caladrius:'kah-LAY-dree-us',
  chiranjeevi:'cheer-AN-jee-vee', hamsa:'HUM-sah',
  jatayu:'jah-TAH-yoo', krauncha:'KROWN-chah',
  leviathan:'leh-VY-ah-thun', makara:'mah-KAH-rah',
  matsya:'MAT-syah', nereid:'NEER-ee-id',
  sampati:'sam-PAH-tee', simurgh:'si-MURG',
  sirin:'see-REEN', socrates:'SOK-rah-teez',
  sthira:'STEER-ah', tortuga:'tor-TOO-gah',
  triton:'TRY-tun', varuna:'vah-ROO-nah',
  // English algo failures
  beau:'BOH', dante:'DAN-tay', feathers:'FETH-erz',
  george:'JORJ', louie:'LOO-ee', macaron:'mak-ah-RON',
  maple:'MAY-pul', meadow:'MED-oh', myrtle:'MER-tul',
  peaches:'PEE-chez', pebble:'PEB-ul', primrose:'PRIM-rohz',
  ripple:'RIP-ul', sapphire:'SAF-yr', shortcake:'SHORT-kayk',
  skye:'SKY', sprinkle:'SPRIN-kul', steadfast:'STED-fast',
  tide:'TYD', truffle:'TRUF-ul', tumble:'TUM-bul',
  turquoise:'TER-kwoyz', twitchy:'TWITCH-ee',
  waffle:'WAF-ul', wave:'WAYV', wobble:'WOB-ul',
};

// ── Algorithmic fallback ─────────────────────────────────────────────────────
const VOWELS_SET = new Set('aeiou');
const isV = c => VOWELS_SET.has(c?.toLowerCase());

function applyPhonetics(w) {
  return w
    .replace(/tion/g, 'shun').replace(/sion/g, 'zhun')
    .replace(/ight/g, 'ite').replace(/igh/g, 'i')
    .replace(/ough/g, 'aw').replace(/tch/g, 'ch')
    .replace(/ck/g,  'k').replace(/ph/g, 'f')
    .replace(/gh(?=[aeiou])/g, 'g').replace(/gh/g, '')
    .replace(/kn/g, 'n').replace(/wr/g, 'r').replace(/qu/g, 'kw')
    .replace(/ea(?!u)/g, 'ee').replace(/oa/g, 'oh')
    .replace(/ai/g, 'ay').replace(/oo/g, 'oo')
    .replace(/ou(?=[^ght])/g, 'ow').replace(/au/g, 'aw')
    // terminal -le → ul (before silent-e so 'maple'→'mapul' not 'mapl')
    .replace(/le$/, 'ul')
    // silent final e (consonant + e at end)
    .replace(/([bcdfghjklmnpqrstvwxyz])e$/, '$1')
    // terminal y after consonant → ee
    .replace(/([bcdfghjklmnpqrstvwxyz])y$/, '$1ee');
}

function splitSyllables(ph) {
  // Walk character-by-character; split at CVC→C boundary
  const out = [];
  let cur = '';
  for (let i = 0; i < ph.length; i++) {
    cur += ph[i];
    // Condition: previous char is vowel, current is consonant, next is consonant, char-after-next is vowel
    const prev = ph[i - 1] ?? '';
    const next  = ph[i + 1] ?? '';
    const next2 = ph[i + 2] ?? '';
    if (
      cur.length > 1 &&
      !isV(ph[i]) && isV(prev) &&
      !isV(next) && next !== '' && isV(next2)
    ) {
      out.push(cur); cur = '';
    }
  }
  if (cur) out.push(cur);
  return out.length ? out : [ph];
}

function algorithmicPronounce(word) {
  const ph = applyPhonetics(word.toLowerCase());
  return splitSyllables(ph).map(s => s.toUpperCase()).join('-');
}

// ── Public API ───────────────────────────────────────────────────────────────
export function pronounce(name) {
  return name.trim().split(/\s+/).map(word => {
    const key = word.toLowerCase().replace(/[^a-z]/g, '');
    return DICT[key] ?? algorithmicPronounce(word);
  }).join(' ');
}

// ── Main ─────────────────────────────────────────────────────────────────────
const BATCH = 500;

async function main() {
  const SAMPLE = process.argv[2] === '--sample';

  if (SAMPLE) {
    // Show examples — mix of mythology fixes, English algo fixes, and combos
    const testNames = [
      // Mythology / non-English fixes
      'Akupara', 'Saraswati', 'Triton', 'Aristotle', 'Simurgh',
      'Niamh', 'Saoirse', 'Zephyr',
      // English algo fixes
      'Maple', 'Wave', 'Skye', 'Meadow', 'Peaches', 'Sprinkle', 'Wobble',
      // 2-word combos
      'King Zeus', 'Princess Bella', 'Midnight Thor', 'Crystal Aurora', 'Shadow Storm',
    ];
    console.log('\n── Sample pronunciations ───────────────────────────────────');
    for (const n of testNames) {
      const p = pronounce(n);
      const allDict = n.split(' ').every(w => DICT[w.toLowerCase().replace(/[^a-z]/g, '')]);
      console.log(`  "${n.padEnd(20)}"  →  /${p}/  (${allDict ? 'dict' : 'algo'})`);
    }
    return;
  }

  // ── Full batch run ───────────────────────────────────────────────────────
  console.log('Loading all pet names...');
  let offset = 0, total = 0;

  while (true) {
    // Fetch full rows so we can upsert back (avoids not-null constraint errors)
    const { data, error } = await sb.from('pet_names')
      .select('*')
      .range(offset, offset + BATCH - 1);

    if (error) { console.error('Fetch error:', error.message); break; }
    if (!data?.length) break;

    // Add pronunciation to each row
    const rows = data.map(row => ({ ...row, pronunciation: pronounce(row.name) }));

    // Upsert back (onConflict=id → just updates changed field)
    const { error: upErr } = await sb.from('pet_names')
      .upsert(rows, { onConflict: 'id' });

    if (upErr) { console.error(`Upsert error at offset ${offset}:`, upErr.message); break; }

    total += rows.length;
    offset += BATCH;

    if (total % 5000 === 0 || rows.length < BATCH) {
      console.log(`  ${total} / ~50000 updated...`);
    }
  }

  console.log(`\nDone — ${total} rows updated.`);

  // Spot-check a few known names
  const { data: spot } = await sb.from('pet_names')
    .select('name, pronunciation')
    .in('name', ['Zeus', 'Luna', 'Maple', 'Saraswati', 'Triton', 'King Zeus', 'Princess Bella'])
    .limit(10);
  console.log('\nSpot-check:');
  spot?.forEach(r => console.log(`  "${r.name}" → /${r.pronunciation}/`));
}

// Guard: only run main when this file is the entry point, not when imported
const __filename = fileURLToPath(import.meta.url);
if (resolve(process.argv[1] ?? '') === resolve(__filename)) {
  main().catch(console.error);
}
