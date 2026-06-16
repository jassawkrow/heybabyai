const SUPABASE_URL = "https://gitjchzvmskzenjlyvkc.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdpdGpjaHp2bXNremVuamx5dmtjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg0OTkwMzgsImV4cCI6MjA5NDA3NTAzOH0.5tdFA0MRXpdU3bE7mamU4Jh7Yy4tyFchO-3Jlf0OgQA";

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export default async function middleware(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const match = url.pathname.match(/^\/names\/([^/]+)$/);
  if (!match) return fetch(request);

  const slug = match[1];

  const [htmlRes, apiRes] = await Promise.all([
    fetch(`${url.origin}/`),
    fetch(
      `${SUPABASE_URL}/rest/v1/names?slug=eq.${encodeURIComponent(slug)}&select=name,meaning_short,origin,gender,pronunciation&limit=1`,
      { headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` } }
    ),
  ]);

  const html = await htmlRes.text();

  let injected = "";

  if (apiRes.ok) {
    const rows = (await apiRes.json()) as {
      name: string;
      meaning_short: string | null;
      origin: string | null;
      gender: string | null;
      pronunciation: string | null;
    }[];

    if (rows.length > 0) {
      const n = rows[0];
      const title = esc(`${n.name} — Name Meaning, Origin & Numerology | HeyBaby AI`);
      const desc = esc(
        n.meaning_short
          ? `${n.name} means "${n.meaning_short}". ${n.origin ?? ""} origin baby name with numerology, Vedic astrology & AI personality report.`
          : `Explore the meaning, origin and numerology of ${n.name}. Discover Vedic astrology, personality archetypes & more on HeyBaby AI.`
      );
      const canonical = esc(`https://www.heybabyai.com/names/${slug}`);
      const image = "https://www.heybabyai.com/og-image.png";

      injected = `
<title>${title}</title>
<meta name="description" content="${desc}" />
<link rel="canonical" href="${canonical}" />
<meta property="og:title" content="${title}" />
<meta property="og:description" content="${desc}" />
<meta property="og:url" content="${canonical}" />
<meta property="og:type" content="article" />
<meta property="og:image" content="${image}" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${title}" />
<meta name="twitter:description" content="${desc}" />
<meta name="twitter:image" content="${image}" />
<script type="application/ld+json">{"@context":"https://schema.org","@type":"Article","headline":${JSON.stringify(n.name + " Name Meaning")},"description":${JSON.stringify(desc)},"url":${JSON.stringify(canonical)}}</script>`;
    }
  }

  const modified = injected
    ? html.replace("<head>", "<head>" + injected)
    : html;

  return new Response(modified, {
    status: 200,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

export const config = {
  matcher: ["/names/:path*"],
};
