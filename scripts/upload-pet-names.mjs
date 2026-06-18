/**
 * Upload all 7 pet name files to Supabase pet_names table.
 * Uses service role key — bypasses RLS.
 * Batches 500 rows at a time per file.
 * Run: node scripts/upload-pet-names.mjs
 */
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

const SUPABASE_URL = 'https://gitjchzvmskzenjlyvkc.supabase.co';
const SERVICE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SERVICE_KEY) {
  console.error('ERROR: SUPABASE_SERVICE_ROLE_KEY not set');
  process.exit(1);
}

const sb = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { persistSession: false },
});

const FILES = [
  { label: 'dog',     path: 'scripts/dog-names-14000.json',  expected: 14000 },
  { label: 'cat',     path: 'scripts/cat-names-10000.json',  expected: 10000 },
  { label: 'bird',    path: 'scripts/bird-names-7000.json',  expected:  7000 },
  { label: 'fish',    path: 'scripts/fish-names-5000.json',  expected:  5000 },
  { label: 'rabbit',  path: 'scripts/rabbit-names-4500.json',expected:  4500 },
  { label: 'hamster', path: 'scripts/hamster-names-5000.json',expected: 5000 },
  { label: 'turtle',  path: 'scripts/turtle-names-4500.json',expected:  4500 },
];

const BATCH_SIZE = 500;
const HR  = '═'.repeat(64);
const HR2 = '─'.repeat(64);

function fmt(n) { return String(n).padStart(6); }

async function uploadFile(label, path, expected, grandTotal) {
  console.log(`\n${HR}`);
  console.log(`  UPLOADING: ${path}`);
  console.log(HR2);

  const records = JSON.parse(readFileSync(path, 'utf-8'));
  console.log(`  Loaded ${records.length} records from file`);

  // Strip any fields not in the Insert schema (just safety)
  const FIELDS = [
    'slug','pet_type','name','gender','origin',
    'meaning_short','meaning_long','personality','keywords',
    'popularity_score','ai_vibe_score','starting_letter',
  ];
  const rows = records.map(r => {
    const obj = {};
    for (const f of FIELDS) if (r[f] !== undefined) obj[f] = r[f];
    return obj;
  });

  let inserted = 0;
  let failed   = 0;
  const errors = [];
  const batches = Math.ceil(rows.length / BATCH_SIZE);

  for (let b = 0; b < batches; b++) {
    const slice = rows.slice(b * BATCH_SIZE, (b + 1) * BATCH_SIZE);
    const { error } = await sb
      .from('pet_names')
      .insert(slice);

    if (error) {
      failed += slice.length;
      errors.push({ batch: b + 1, count: slice.length, message: error.message, code: error.code });
      process.stdout.write('✗');
    } else {
      inserted += slice.length;
      process.stdout.write('.');
    }

    // Flush progress every 10 batches
    if ((b + 1) % 10 === 0) process.stdout.write(` ${inserted + failed}/${rows.length}\n  `);
  }
  process.stdout.write('\n');

  const newGrandTotal = grandTotal + inserted;

  console.log(HR2);
  console.log(`  File       : ${path}`);
  console.log(`  Attempted  :${fmt(rows.length)}`);
  console.log(`  Inserted   :${fmt(inserted)}  ${inserted === expected ? '✅' : inserted === rows.length ? '✅' : '⚠️'}`);
  console.log(`  Failed     :${fmt(failed)}  ${failed === 0 ? '✅' : '❌'}`);
  console.log(`  Grand total:${fmt(newGrandTotal)} so far`);

  if (errors.length > 0) {
    console.log(`\n  ❌ ERRORS (${errors.length} batch(es) failed):`);
    for (const e of errors) {
      console.log(`     Batch ${e.batch} (${e.count} rows): [${e.code}] ${e.message}`);
    }
  }

  return { inserted, failed, errors, grandTotal: newGrandTotal };
}

async function finalCountCheck() {
  console.log(`\n${HR}`);
  console.log('  FINAL COUNT — pet_names grouped by pet_type');
  console.log(HR2);

  const EXPECTED = {
    dog: 14000, cat: 10000, bird: 7000,
    fish: 5000, rabbit: 4500, hamster: 5000, turtle: 4500,
  };

  // Get counts per pet_type
  const results = {};
  for (const [type, exp] of Object.entries(EXPECTED)) {
    const { count } = await sb
      .from('pet_names')
      .select('*', { count: 'exact', head: true })
      .eq('pet_type', type);
    results[type] = count ?? 0;
  }

  console.log(`\n  ${'pet_type'.padEnd(10)} ${'actual'.padStart(8)} ${'expected'.padStart(10)} ${'status'.padStart(8)}`);
  console.log(`  ${'-'.repeat(40)}`);
  let totalActual = 0;
  let totalExpected = 0;
  for (const [type, exp] of Object.entries(EXPECTED)) {
    const actual = results[type];
    totalActual += actual;
    totalExpected += exp;
    const ok = actual === exp ? '✅' : actual > 0 ? '⚠️ partial' : '❌ empty';
    console.log(`  ${type.padEnd(10)} ${String(actual).padStart(8)} ${String(exp).padStart(10)} ${ok}`);
  }
  console.log(`  ${'-'.repeat(40)}`);
  console.log(`  ${'TOTAL'.padEnd(10)} ${String(totalActual).padStart(8)} ${String(totalExpected).padStart(10)} ${totalActual === totalExpected ? '✅ PERFECT' : '⚠️ MISMATCH'}`);
  console.log();
}

async function main() {
  console.log(HR);
  console.log('  PET NAMES UPLOAD — 7 files, service role key');
  console.log(`  Batch size: ${BATCH_SIZE} rows per request`);
  console.log(HR);

  let grandTotal = 0;
  const summary = [];

  for (const { label, path, expected } of FILES) {
    const result = await uploadFile(label, path, expected, grandTotal);
    grandTotal = result.grandTotal;
    summary.push({ label, ...result });
  }

  console.log(`\n${HR}`);
  console.log('  UPLOAD COMPLETE — SUMMARY');
  console.log(HR2);
  for (const s of summary) {
    const status = s.failed === 0 ? '✅' : '❌';
    console.log(`  ${status} ${s.label.padEnd(8)}: ${fmt(s.inserted)} inserted, ${fmt(s.failed)} failed`);
  }
  console.log(HR2);
  console.log(`  Grand total inserted: ${grandTotal}`);
  console.log();

  await finalCountCheck();
}

main().catch(err => {
  console.error('\nFATAL ERROR:', err);
  process.exit(1);
});
