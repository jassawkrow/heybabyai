import { writeFileSync } from "fs";

const SUPABASE_URL = "https://gitjchzvmskzenjlyvkc.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdpdGpjaHp2bXNremVuamx5dmtjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg0OTkwMzgsImV4cCI6MjA5NDA3NTAzOH0.5tdFA0MRXpdU3bE7mamU4Jh7Yy4tyFchO-3Jlf0OgQA";

async function fetchAllSlugs() {
  const slugs = [];
  let from = 0;
  const pageSize = 1000;
  while (true) {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/names?select=slug&order=name&limit=${pageSize}&offset=${from}`,
      { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }
    );
    const batch = await res.json();
    if (!Array.isArray(batch) || batch.length === 0) break;
    slugs.push(...batch.map((r) => r.slug));
    if (batch.length < pageSize) break;
    from += pageSize;
  }
  return slugs;
}

const staticPages = [
  "/", "/swipe", "/explore", "/saved", "/pricing", "/report",
  "/about", "/privacy", "/terms",
];

const slugs = await fetchAllSlugs();
console.log(`Fetched ${slugs.length} name slugs`);

const today = new Date().toISOString().split("T")[0];

const entries = [
  ...staticPages.map((path) => `  <url>\n    <loc>https://www.heybabyai.com${path}</loc>\n    <changefreq>weekly</changefreq>\n    <lastmod>${today}</lastmod>\n  </url>`),
  ...slugs.map((slug) => `  <url>\n    <loc>https://www.heybabyai.com/names/${slug}</loc>\n    <changefreq>monthly</changefreq>\n    <lastmod>${today}</lastmod>\n  </url>`),
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join("\n")}
</urlset>`;

writeFileSync("public/sitemap.xml", xml, "utf-8");
console.log(`Sitemap written: ${entries.length} URLs total`);
