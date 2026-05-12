import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { supabase } from "@/integrations/supabase/client";
import { gradientFor } from "@/lib/gradients";
import { ArrowRight } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

export const Route = createFileRoute("/names/$slug")({
  loader: async ({ params: { slug } }) => {
    const { data } = await supabase
      .from("names")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();
    return data as Tables<"names"> | null;
  },
  head: ({ loaderData: name }) => {
    if (!name) return { meta: [{ title: "Name Not Found | HeyBaby AI" }] };
    return {
      meta: [
        {
          title: `${name.name} Baby Name — Meaning, Numerology & More | HeyBaby AI`,
        },
        {
          name: "description",
          content: `${name.name} means ${name.meaning_short ?? ""}. Origin: ${name.origin}. Numerology: ${name.numerology ?? "—"}. Rasi: ${name.rasi ?? "—"}. Discover more Indian baby names on HeyBaby AI.`,
        },
        { property: "og:title", content: `${name.name} — ${name.meaning_short} | HeyBaby AI` },
        {
          property: "og:description",
          content: `${name.name} (${name.origin}) means ${name.meaning_short}. Explore numerology, Vedic astrology, and personality insights on HeyBaby AI.`,
        },
        { property: "og:url", content: `https://www.heybabyai.com/names/${name.slug}` },
        { property: "og:type", content: "article" },
      ],
    };
  },
  component: NamePage,
});

function NamePage() {
  const name = Route.useLoaderData();

  if (!name) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="max-w-2xl mx-auto px-5 pt-20 text-center">
          <h1 className="text-3xl font-extrabold">Name not found</h1>
          <Link to="/explore" className="mt-6 inline-block pill grad-primary text-white px-6 py-3 font-semibold text-sm">
            Explore names →
          </Link>
        </div>
        <BottomNav />
      </div>
    );
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${name.name} Baby Name Meaning`,
    description: `${name.name} means ${name.meaning_short}. Origin: ${name.origin}. Numerology number ${name.numerology ?? "—"}.`,
    url: `https://www.heybabyai.com/names/${name.slug}`,
    publisher: {
      "@type": "Organization",
      name: "HeyBaby AI",
      url: "https://www.heybabyai.com",
    },
    about: {
      "@type": "Thing",
      name: name.name,
      description: name.meaning_long ?? name.meaning_short ?? "",
    },
  };

  return (
    <div className="min-h-screen">
      <Header />

      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-2xl mx-auto px-5 pt-8 pb-32 space-y-5">
        {/* Hero gradient card */}
        <div className={`${gradientFor(name.gradient_index)} rounded-3xl text-white p-8 text-center`}>
          <div className="text-[10px] font-extrabold tracking-[0.3em] opacity-70">
            HEYBABY · BABY NAME
          </div>
          <h1 className="text-6xl font-extrabold mt-4 tracking-tight">{name.name}</h1>
          {name.pronunciation && (
            <div className="italic mt-2 text-white/90 text-sm">/{name.pronunciation}/</div>
          )}
          <div className="mt-4 flex flex-wrap gap-2 justify-center">
            <span className="glass-chip pill px-3 py-1 text-xs">{name.origin}</span>
            {name.gender && <span className="glass-chip pill px-3 py-1 text-xs">{name.gender}</span>}
            {name.ai_vibe_score != null && (
              <span className="glass-chip pill px-3 py-1 text-xs">✨ {name.ai_vibe_score}</span>
            )}
          </div>
        </div>

        {/* Meaning */}
        <Section title="Meaning">
          <p className="text-lg font-semibold">{name.meaning_short}</p>
          {name.meaning_long && (
            <p className="mt-3 text-ink/75 leading-relaxed">{name.meaning_long}</p>
          )}
        </Section>

        {/* Origin & culture */}
        <Section title="Origin & Culture">
          <p className="text-ink/75">
            <strong>{name.name}</strong> is a <strong>{name.gender}</strong> name of{" "}
            <strong>{name.origin}</strong> origin.
            {name.starting_letter && ` It begins with the letter ${name.starting_letter}.`}
          </p>
        </Section>

        {/* Numerology */}
        {name.numerology != null && (
          <Section title="Numerology">
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-full grad-4 text-white flex items-center justify-center text-3xl font-extrabold shrink-0">
                {name.numerology}
              </div>
              <p className="text-sm text-ink/75">
                Life Path Number {name.numerology}. People with this vibration are intuitive,
                expressive, and naturally creative. Lucky day: Wednesday · Lucky color: Teal.
              </p>
            </div>
          </Section>
        )}

        {/* Vedic Astrology */}
        {(name.rasi || name.star) && (
          <Section title="Vedic Astrology">
            <div className="grid grid-cols-2 gap-3 text-sm">
              {name.rasi && <Field label="Rasi" value={name.rasi} />}
              {name.star && <Field label="Nakshatra" value={name.star} />}
            </div>
          </Section>
        )}

        {/* Personality */}
        {name.personality && (
          <Section title="Personality Archetype">
            <div className="text-2xl font-extrabold text-grad-primary">{name.personality}</div>
            {name.keywords && (
              <div className="flex flex-wrap gap-2 mt-3">
                {name.keywords.split(",").map((k, i) => (
                  <span key={i} className={`pill px-3 py-1 text-xs font-semibold text-white ${gradientFor(i)}`}>
                    {k.trim()}
                  </span>
                ))}
              </div>
            )}
          </Section>
        )}

        {/* Fun fact */}
        {name.meaning_long && (
          <Section title="✦ Fun Fact" className="border-2 border-gold/40 bg-gold/10">
            <p className="text-sm text-ink/75 leading-relaxed">{name.meaning_long}</p>
          </Section>
        )}

        {/* CTA */}
        <div className="rounded-3xl grad-primary text-white p-7 text-center">
          <h2 className="text-xl font-extrabold">Find more names like {name.name}</h2>
          <p className="text-white/80 text-sm mt-2">
            Swipe through 2,278 Indian names with your partner. Match in real time.
          </p>
          <Link
            to="/swipe"
            className="mt-4 inline-flex items-center gap-2 pill bg-white text-purple font-semibold px-6 py-3 text-sm hover:scale-[1.02] transition"
          >
            Start swiping free <ArrowRight className="w-4 h-4" />
          </Link>
          <div className="mt-3">
            <Link to="/report" search={{ name: name.name }} className="text-white/70 text-xs underline">
              Get AI Identity Report for {name.name} →
            </Link>
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}

function Section({ title, children, className = "" }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={`rounded-3xl bg-white p-6 shadow-sm ${className}`}>
      <div className="text-[10px] font-extrabold tracking-widest text-ink/50 uppercase mb-3">{title}</div>
      {children}
    </section>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-cream p-3">
      <div className="text-[10px] font-bold text-ink/50 uppercase">{label}</div>
      <div className="font-semibold mt-0.5">{value}</div>
    </div>
  );
}
