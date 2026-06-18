/**
 * Read-only sanity check across all 7 pet name JSON files.
 * Run: node scripts/sanity-check.mjs
 */

import { readFileSync } from 'fs';

const FILES = [
  ['dog',     'scripts/dog-names-14000.json'],
  ['cat',     'scripts/cat-names-10000.json'],
  ['bird',    'scripts/bird-names-7000.json'],
  ['fish',    'scripts/fish-names-5000.json'],
  ['rabbit',  'scripts/rabbit-names-4500.json'],
  ['hamster', 'scripts/hamster-names-5000.json'],
  ['turtle',  'scripts/turtle-names-4500.json'],
];

const HR  = '='.repeat(62);
const HR2 = '-'.repeat(62);

// ── 1 & 2: Load all files + count ────────────────────────────────────────────
console.log(HR);
console.log('SANITY CHECK — all 7 pet name files');
console.log(HR);

const allData = {};
let grandTotal = 0;
for (const [type, file] of FILES) {
  const data = JSON.parse(readFileSync(file));
  allData[type] = data;
  grandTotal += data.length;
  console.log(`  ${type.padEnd(8)}: ${String(data.length).padStart(6)}  (${file})`);
}
console.log(HR2);
console.log(`  TOTAL   : ${String(grandTotal).padStart(6)}`);
console.log(`  EXPECTED:  50000`);
console.log(`  MATCH   : ${grandTotal === 50000 ? '✅ YES' : '❌ NO — MISMATCH'}`);
console.log();

// ── 3: Cross-file slug collision check ───────────────────────────────────────
console.log(HR);
console.log('CROSS-FILE SLUG COLLISION CHECK');
console.log(HR);
const globalSlugSet = new Set();
const collisions = [];
for (const [type, data] of Object.entries(allData)) {
  for (const entry of data) {
    if (globalSlugSet.has(entry.slug)) {
      collisions.push({ slug: entry.slug, type });
    }
    globalSlugSet.add(entry.slug);
  }
}
console.log(`  Global unique slugs   : ${globalSlugSet.size}`);
console.log(`  Cross-file collisions : ${collisions.length}`);
const crossOk = collisions.length === 0 && globalSlugSet.size === 50000;
console.log(`  STATUS: ${crossOk ? '✅ CLEAN — no cross-file slug duplicates' : '❌ COLLISIONS FOUND'}`);
if (collisions.length > 0) {
  console.log('  First 10 collisions:');
  collisions.slice(0, 10).forEach(c => console.log(`    ${c.slug} (${c.type})`));
}
console.log();

// ── 4: 30 deterministic-random samples per file ──────────────────────────────
console.log(HR);
console.log('RANDOM SAMPLE — 30 names per file (210 total)');
console.log(HR);

function seededPick(arr, n, seed) {
  let s = seed >>> 0;
  const copy = arr.slice();
  const picked = [];
  for (let i = 0; i < n && copy.length > 0; i++) {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    const idx = s % copy.length;
    picked.push(copy.splice(idx, 1)[0]);
  }
  return picked;
}

let seed = 42;
for (const [type, data] of Object.entries(allData)) {
  console.log(`\n--- ${type.toUpperCase()} (30 of ${data.length}) ---`);
  const sample = seededPick(data, 30, seed++);
  sample.forEach((e, i) => {
    const num = String(i + 1).padStart(2);
    const name = e.name.padEnd(30);
    console.log(`  ${num}. ${name} [${e.origin}]`);
  });
}
console.log();

// ── 5: Missing / empty field check ───────────────────────────────────────────
console.log(HR);
console.log('MISSING / EMPTY FIELD CHECK');
console.log(HR);
const REQUIRED = [
  'slug', 'pet_type', 'name', 'gender', 'origin',
  'meaning_short', 'meaning_long', 'personality', 'keywords',
  'popularity_score', 'ai_vibe_score', 'starting_letter',
];
let totalFieldIssues = 0;
for (const [type, data] of Object.entries(allData)) {
  const issues = [];
  for (const entry of data) {
    for (const field of REQUIRED) {
      const val = entry[field];
      if (val === undefined || val === null || val === '') {
        issues.push(`${entry.slug} — missing: ${field}`);
      }
    }
  }
  if (issues.length > 0) {
    console.log(`  ❌ ${type}: ${issues.length} issue(s)`);
    issues.slice(0, 5).forEach(i => console.log(`     ${i}`));
    if (issues.length > 5) console.log(`     ... and ${issues.length - 5} more`);
    totalFieldIssues += issues.length;
  } else {
    console.log(`  ✅ ${type}: all fields present and non-empty`);
  }
}
console.log();
console.log(`  TOTAL FIELD ISSUES: ${totalFieldIssues}`);
console.log();
console.log(HR);
console.log('SANITY CHECK COMPLETE');
console.log(HR);
