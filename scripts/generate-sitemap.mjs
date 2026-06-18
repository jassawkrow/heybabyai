/**
 * Build-time sitemap generator.
 * Produces 5 files in public/:
 *   sitemap.xml          – sitemap index (points to child files)
 *   sitemap-static.xml   – static/marketing pages
 *   sitemap-names-1.xml  – name pages 1-50,000
 *   sitemap-names-2.xml  – name pages 50,001-end
 *   sitemap-pets.xml     – pet name pages
 */

import { writeFileSync } from "fs";

const SUPABASE_URL = "https://gitjchzvmskzenjlyvkc.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdpdGpjaHp2bXNremVuamx5dmtjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg0OTkwMzgsImV4cCI6MjA5NDA3NTAzOH0.5tdFA0MRXpdU3bE7mamU4Jh7Yy4tyFchO-3Jlf0OgQA";

const BASE_URL = "https://www.heybabyai.com";
const TODAY = new Date().toISOString().split("T")[0];
const SPLIT = 50_000;

// ── Fetch all slugs ─────────────────────────────────────────────────────────
async function fetchAllSlugs() {
  const slugs = [];
  let offset = 0;
  const pageSize = 1000;
  while (true) {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/names?select=slug&order=created_at.asc,id.asc&limit=${pageSize}&offset=${offset}`,
      { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }
    );
    const batch = await res.json();
    if (!Array.isArray(batch) || batch.length === 0) break;
    slugs.push(...batch.map((r) => r.slug));
    if (batch.length < pageSize) break;
    offset += pageSize;
    if (offset % 10000 === 0) console.log(`  fetched ${offset.toLocaleString()} slugs...`);
  }
  return slugs;
}

async function fetchAllPetSlugs() {
  const slugs = [];
  let offset = 0;
  const pageSize = 1000;
  while (true) {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/pet_names?select=slug&order=created_at.asc,id.asc&limit=${pageSize}&offset=${offset}`,
      { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }
    );
    if (!res.ok) break;
    const batch = await res.json();
    if (!Array.isArray(batch) || batch.length === 0) break;
    slugs.push(...batch.map((r) => r.slug));
    if (batch.length < pageSize) break;
    offset += pageSize;
  }
  return slugs;
}

// ── XML helpers ─────────────────────────────────────────────────────────────
function urlsetWrap(entries) {
  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
    ...entries,
    `</urlset>`,
  ].join("\n");
}

function nameEntry(slug) {
  return `  <url>\n    <loc>${BASE_URL}/names/${slug}</loc>\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n  </url>`;
}

function petEntry(slug) {
  return `  <url>\n    <loc>${BASE_URL}/pets/${slug}</loc>\n    <changefreq>monthly</changefreq>\n    <priority>0.6</priority>\n  </url>`;
}

function staticEntry(path, priority = "0.8") {
  return `  <url>\n    <loc>${BASE_URL}${path}</loc>\n    <lastmod>${TODAY}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
}

// ── Main ─────────────────────────────────────────────────────────────────────
console.log("Fetching all slugs from Supabase...");
const [slugs, petSlugs] = await Promise.all([fetchAllSlugs(), fetchAllPetSlugs()]);
console.log(`Total baby name slugs: ${slugs.length.toLocaleString()}`);
console.log(`Total pet name slugs: ${petSlugs.length.toLocaleString()}`);

const part1 = slugs.slice(0, SPLIT);
const part2 = slugs.slice(SPLIT);

// sitemap-names-1.xml
writeFileSync("public/sitemap-names-1.xml", urlsetWrap(part1.map(nameEntry)), "utf-8");
console.log(`sitemap-names-1.xml: ${part1.length.toLocaleString()} URLs`);

// sitemap-names-2.xml
writeFileSync("public/sitemap-names-2.xml", urlsetWrap(part2.map(nameEntry)), "utf-8");
console.log(`sitemap-names-2.xml: ${part2.length.toLocaleString()} URLs`);

// sitemap-pets.xml
writeFileSync("public/sitemap-pets.xml", urlsetWrap(petSlugs.map(petEntry)), "utf-8");
console.log(`sitemap-pets.xml: ${petSlugs.length.toLocaleString()} URLs`);

// sitemap-static.xml
const staticPages = [
  ["/",             "1.0"],
  ["/explore",      "0.8"],
  ["/pricing",      "0.8"],
  ["/swipe",        "0.8"],
  ["/pets/explore", "0.8"],
  ["/pets/swipe",   "0.7"],
  ["/saved",        "0.6"],
  ["/report",       "0.6"],
  ["/about",        "0.6"],
  ["/privacy",      "0.5"],
  ["/terms",        "0.5"],
];
writeFileSync(
  "public/sitemap-static.xml",
  urlsetWrap(staticPages.map(([path, pri]) => staticEntry(path, pri))),
  "utf-8"
);
console.log(`sitemap-static.xml: ${staticPages.length} URLs`);

// sitemap.xml  ← index file, NOT a urlset
const index = [
  `<?xml version="1.0" encoding="UTF-8"?>`,
  `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
  ...[
    "sitemap-static.xml",
    "sitemap-names-1.xml",
    "sitemap-names-2.xml",
    "sitemap-pets.xml",
  ].map(
    (f) =>
      `  <sitemap>\n    <loc>${BASE_URL}/${f}</loc>\n    <lastmod>${TODAY}</lastmod>\n  </sitemap>`
  ),
  `</sitemapindex>`,
].join("\n");

writeFileSync("public/sitemap.xml", index, "utf-8");
console.log(`sitemap.xml: index pointing to 3 child sitemaps`);
console.log(`Done. Total name URLs: ${slugs.length.toLocaleString()}`);
