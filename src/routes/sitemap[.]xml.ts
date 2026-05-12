import { createFileRoute } from "@tanstack/react-router";

const BASE_URL = "https://www.heybabyai.com";
const paths = ["/", "/about", "/pricing", "/explore", "/swipe", "/matches", "/saved", "/profile", "/report"];

export const Route = createFileRoute("/sitemap.xml")({
  loader: async () => {
    const xml = [
      `<?xml version="1.0" encoding="UTF-8"?>`,
      `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
      ...paths.map((p) => `  <url><loc>${BASE_URL}${p}</loc><changefreq>weekly</changefreq></url>`),
      `</urlset>`,
    ].join("\n");
    return xml;
  },
});
