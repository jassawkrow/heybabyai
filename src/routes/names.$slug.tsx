import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { supabase } from "@/integrations/supabase/client";
import { gradientFor } from "@/lib/gradients";
import { openRazorpay } from "@/lib/razorpay";
import { ArrowRight } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

export const Route = createFileRoute("/names/$slug")({
  loader: async ({ params: { slug } }) => {
    const { data } = await supabase
      .from("names")
      .select("*")
      .eq("slug", slug.toLowerCase())
      .maybeSingle();
    return data as Tables<"names"> | null;
  },
  head: ({ loaderData: name }) => {
    if (!name) return { meta: [{ title: "Name Not Found | HeyBaby AI" }] };
    return {
      meta: [
        { title: `${name.name} Baby Name — Meaning, Numerology & More | HeyBaby AI` },
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
  const navigate = useNavigate();

  if (!name) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="max-w-2xl mx-auto px-5 pt-20 text-center">
          <h1 className="text-3xl font-extrabold">Name not found</h1>
          <p className="text-ink/60 mt-2 text-sm">This name might be spelled differently in our database.</p>
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
    publisher: { "@type": "Organization", name: "HeyBaby AI", url: "https://www.heybabyai.com" },
    about: { "@type": "Thing", name: name.name, description: name.meaning_long ?? name.meaning_short ?? "" },
  };

  const handleUnlock = () => {
    openRazorpay({
      amount: 49900,
      description: `AI Identity Report — ${name.name}`,
      onSuccess: async (r: any) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase.from("payments").insert({
            user_id: user.id,
            amount_paise: 49900,
            tier: "report",
            razorpay_payment_id: r.razorpay_payment_id,
            status: "paid",
          });
        }
        navigate({ to: "/report", search: { name: name.name } });
      },
    });
  };

  return (
    <div className="min-h-screen">
      <Header />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-2xl mx-auto px-5 pt-8 pb-32 space-y-5">

        {/* ── FREE: Hero ── */}
        <div className={`${gradientFor(name.gradient_index)} rounded-3xl text-white p-8 text-center`}>
          <div className="text-[10px] font-extrabold tracking-[0.3em] opacity-70">HEYBABY · BABY NAME</div>
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

        {/* ── FREE: Meaning short ── */}
        <Section title="Meaning">
          <p className="text-lg font-semibold">{name.meaning_short}</p>
        </Section>

        {/* ── FREE: Origin ── */}
        <Section title="Origin & Culture">
          <p className="text-ink/75">
            <strong>{name.name}</strong> is a <strong>{name.gender}</strong> name of{" "}
            <strong>{name.origin}</strong> origin.
            {name.starting_letter && ` It begins with the letter ${name.starting_letter}.`}
          </p>
        </Section>

        {/* ── FREE: Swipe CTA ── */}
        <div className="rounded-3xl bg-white border border-black/8 p-6 text-center shadow-sm">
          <p className="text-sm text-ink/65 mb-3">
            Find names you both love — swipe together with your partner.
          </p>
          <Link
            to="/swipe"
            className="inline-flex items-center gap-2 pill grad-primary text-white font-semibold px-6 py-3 text-sm hover:scale-[1.02] transition"
          >
            Start swiping free on HeyBaby AI <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* ── PREMIUM PREVIEW CARD ── */}
        <div style={{
          background: "linear-gradient(135deg,#1DAFB6,#7928A3)",
          borderRadius: "20px",
          padding: "24px",
          color: "white",
        }}>
          <div style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "2px", opacity: 0.8, marginBottom: "8px" }}>
            ✦ PREMIUM AI IDENTITY REPORT
          </div>
          <h2 style={{ fontSize: "24px", fontWeight: 800, marginBottom: "16px" }}>
            More than just a name.
          </h2>
          <div style={{ display: "grid", gap: "12px", fontSize: "14px" }}>
            <div>📖 Full etymology and cultural history</div>
            <div>🔢 Numerology — life path, lucky number, color, day</div>
            <div>⭐ Vedic astrology — Rasi, Nakshatra, element</div>
            <div>🎭 Personality archetype analysis</div>
            <div>✨ Famous bearers and cultural significance</div>
            <div>📄 Downloadable PDF certificate</div>
          </div>
          <div style={{
            marginTop: "20px",
            background: "rgba(255,255,255,0.2)",
            borderRadius: "12px",
            padding: "12px",
            textAlign: "center",
          }}>
            <span style={{ fontSize: "28px", fontWeight: 800 }}>₹499</span>
            <span style={{ opacity: 0.8 }}> one-time · or FREE with Couple's Pass</span>
          </div>
        </div>

        {/* ── LOCKED sections ── */}
        <div style={{ position: "relative", overflow: "hidden", borderRadius: "16px" }}>
          {/* Blurred content behind the overlay */}
          <div style={{ filter: "blur(6px)", pointerEvents: "none" }}>
            <div style={{ background: "white", padding: "24px", marginBottom: "12px", borderRadius: "16px" }}>
              <div style={{ fontSize: "10px", fontWeight: 800, letterSpacing: "4px", color: "#888", marginBottom: "12px" }}>NUMEROLOGY</div>
              <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                <div style={{ width: 80, height: 80, borderRadius: "50%", background: "linear-gradient(135deg,#1DAFB6,#7928A3)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "32px", fontWeight: 800, flexShrink: 0 }}>
                  {name.numerology ?? "7"}
                </div>
                <p style={{ fontSize: "14px", color: "#555" }}>
                  Life Path Number {name.numerology ?? "7"}. Lucky day: Wednesday · Lucky color: Teal · Lucky stone: Emerald.
                  People with this vibration are intuitive, expressive, and naturally creative.
                </p>
              </div>
            </div>
            <div style={{ background: "white", padding: "24px", marginBottom: "12px", borderRadius: "16px" }}>
              <div style={{ fontSize: "10px", fontWeight: 800, letterSpacing: "4px", color: "#888", marginBottom: "12px" }}>VEDIC ASTROLOGY</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div style={{ background: "#fef9f0", borderRadius: "12px", padding: "12px" }}><div style={{ fontSize: "10px", fontWeight: 700, color: "#888" }}>RASI</div><div style={{ fontWeight: 600 }}>{name.rasi ?? "Mesha"}</div></div>
                <div style={{ background: "#fef9f0", borderRadius: "12px", padding: "12px" }}><div style={{ fontSize: "10px", fontWeight: 700, color: "#888" }}>NAKSHATRA</div><div style={{ fontWeight: 600 }}>{name.star ?? "Ashwini"}</div></div>
              </div>
            </div>
            <div style={{ background: "white", padding: "24px", borderRadius: "16px" }}>
              <div style={{ fontSize: "10px", fontWeight: 800, letterSpacing: "4px", color: "#888", marginBottom: "12px" }}>PERSONALITY ARCHETYPE</div>
              <div style={{ fontSize: "22px", fontWeight: 800, background: "linear-gradient(135deg,#1DAFB6,#7928A3)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                {name.personality ?? "The Visionary"}
              </div>
              <div style={{ display: "flex", flexWrap: "wrap" as const, gap: "8px", marginTop: "12px" }}>
                {(name.keywords ?? "creative,intuitive,bold").split(",").slice(0, 4).map((k, i) => (
                  <span key={i} className={`pill px-3 py-1 text-xs font-semibold text-white ${gradientFor(i)}`}>{k.trim()}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Lock overlay */}
          <div style={{
            position: "absolute", inset: 0,
            display: "flex", flexDirection: "column" as const,
            alignItems: "center", justifyContent: "center",
            background: "rgba(254,251,245,0.85)",
            borderRadius: "16px",
            border: "2px solid #1DAFB6",
          }}>
            <div style={{ fontSize: "32px" }}>🔒</div>
            <h3 style={{
              fontWeight: 800,
              background: "linear-gradient(135deg,#1DAFB6,#7928A3)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              margin: "8px 0",
            }}>
              AI Identity Report
            </h3>
            <p style={{ color: "#4a3a52", textAlign: "center", padding: "0 20px", fontSize: "14px", lineHeight: 1.5 }}>
              Get the complete numerology analysis,
              Vedic astrology, personality archetype
              and cultural deep-dive for {name.name}
            </p>
            <button
              onClick={handleUnlock}
              style={{
                background: "linear-gradient(135deg,#1DAFB6,#7928A3)",
                color: "white",
                padding: "12px 32px",
                borderRadius: "100px",
                fontWeight: 700,
                fontSize: "16px",
                margin: "16px 0 8px",
                cursor: "pointer",
                border: "none",
              }}
            >
              Unlock Full Report — ₹499
            </button>
            <p style={{ fontSize: "12px", color: "#8a7a8c", margin: 0 }}>
              One-time payment · Download PDF · No refunds
            </p>
            <p style={{ fontSize: "11px", color: "#1DAFB6", marginTop: "8px" }}>
              FREE with Couple's Pass 💕
            </p>
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
