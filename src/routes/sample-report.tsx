import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { ReportTemplate } from "@/components/ReportTemplate";
import type { AIContent } from "@/lib/generateAIContent";

export const Route = createFileRoute("/sample-report")({
  head: () => ({
    meta: [
      { title: "Sample AI Identity Report — HeyBaby AI" },
      {
        name: "description",
        content:
          "Free preview of the HeyBaby AI Identity Report — numerology, Vedic astrology, personality archetype and a beautiful PDF report for your baby's name.",
      },
    ],
  }),
  component: SampleReportPage,
});

const rumiAIContent: AIContent = {
  historical_story:
    "Born in 1207 CE in Balkh, Afghanistan, Jalal ad-Din Rumi became one of the greatest mystic poets the world has ever known. His family fled the Mongol invasions westward, eventually settling in Konya, Anatolia — now modern Turkey. There, Rumi studied theology and law before a transformative encounter with the wandering dervish Shams-i-Tabrizi shook him to his spiritual core. That friendship, and its sudden loss, ignited the Masnavi, a six-volume ocean of poetry that continues to resonate across cultures more than 800 years later.",
  personality_deep:
    "Those bearing the name Rumi are deeply introspective, animated by an unquenchable inner fire. They carry a rare gift: the ability to translate raw emotion into universal wisdom that touches strangers as though it were written just for them. Thoughtful yet passionate, they often act as bridges — between old and new, between grief and joy, between the earthly and the divine.",
  cultural_significance:
    "Across Persian, Turkish, and broader Islamic civilizations, Rumi's name is synonymous with love as a spiritual force. His poetry was recited in royal courts and humble tea-houses alike. Today, translated into over 25 languages, Rumi is consistently one of the best-selling poets in the English-speaking world.",
  lucky_elements: "Color: Gold · Day: Thursday · Stone: Topaz",
  famous_bearers:
    "Jalal ad-Din Rumi (13th-century Persian poet and Sufi mystic), Rumi Neely (American fashion blogger and designer), Rumi Carter (daughter of Beyoncé and Jay-Z).",
};

const rumiData = {
  name: "Rumi",
  pronunciation: "/ROO-mee/",
  meaning_short: "from Rome; mystic poet",
  origin: "Persian",
  ai_vibe_score: 92,
  numerology: 7,
  rasi: "Tula",
  star: "Jyeshtha",
  personality: "The Artist",
  keywords: "Melodic,Authentic,Spirited",
  meaning_long:
    "The name Rumi carries the luminous legacy of Jalal ad-Din Rumi, the 13th-century Persian poet whose verses on love, loss, and the divine continue to move millions. Originally a geographic epithet meaning \"from Rome\" (referring to Anatolia, then known as Rûm), it evolved into a name synonymous with transcendence. Choosing Rumi for your child is an invitation to a life lived deeply — full of beauty, inquiry, and heart.",
};

const SLIDE_W = 794;
const SLIDE_H = 1123;
const TOTAL_H = SLIDE_H * 2; // two slides stacked

function SampleReportPage() {
  return (
    <div className="min-h-screen">
      <Header />

      <div className="max-w-2xl mx-auto px-5 pt-8 pb-6 text-center">
        <span className="pill bg-white/70 px-3 py-1 text-[11px] font-bold tracking-widest text-purple uppercase">
          ✦ Free Preview
        </span>
        <h1 className="text-3xl font-extrabold mt-3">AI Identity Report</h1>
        <p className="text-ink/65 mt-2 text-sm max-w-sm mx-auto">
          A 2-page PDF report with etymology, numerology, Vedic astrology and more — for any baby name.
        </p>
      </div>

      <div className="max-w-2xl mx-auto px-4 pb-8">
        <ScaledPreview />
      </div>

      <div className="max-w-2xl mx-auto px-5 pb-10">
        <div className="rounded-3xl bg-white border border-black/8 p-7 text-center shadow-sm">
          <p className="font-extrabold text-lg">Want this for your baby's name?</p>
          <p className="text-sm text-ink/60 mt-1">
            Search any name and unlock the full report for ₹199 — or get it free with Couple's Pass.
          </p>
          <div className="mt-5 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/report"
              className="pill grad-primary text-white font-semibold px-7 py-3 text-sm hover:scale-[1.02] transition"
            >
              Generate My Report — ₹199
            </Link>
            <Link
              to="/explore"
              className="pill bg-cream border border-black/10 text-ink font-semibold px-7 py-3 text-sm hover:scale-[1.02] transition"
            >
              Explore names first
            </Link>
          </div>
          <p className="text-[10px] text-ink/40 mt-3">
            FREE with{" "}
            <Link to="/pricing" className="underline text-purple">
              Couple's Pass
            </Link>
          </p>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}

function ScaledPreview() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.55);

  useEffect(() => {
    const measure = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.offsetWidth;
      setScale(Math.min(w / SLIDE_W, 0.55));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const scaledW = Math.round(SLIDE_W * scale);
  const scaledH = Math.round(TOTAL_H * scale);

  return (
    <div ref={containerRef} style={{ width: "100%" }}>
      {/* Page label */}
      <div className="text-[10px] font-extrabold tracking-widest text-ink/40 uppercase mb-2">
        Sample — Rumi
      </div>

      {/* Scaled slides container */}
      <div
        style={{
          width: scaledW,
          height: scaledH,
          overflow: "hidden",
          borderRadius: 16,
          position: "relative",
          boxShadow: "0 8px 40px rgba(0,0,0,0.25)",
          margin: "0 auto",
        }}
      >
        {/* Actual template, scaled */}
        <div
          style={{
            width: SLIDE_W,
            transformOrigin: "top left",
            transform: `scale(${scale})`,
          }}
        >
          <ReportTemplate {...rumiData} aiContent={rumiAIContent} />
        </div>

        {/* Page separator line at midpoint */}
        <div
          style={{
            position: "absolute",
            top: scaledH / 2,
            left: 0,
            right: 0,
            height: 3,
            background: "rgba(255,255,255,0.25)",
            pointerEvents: "none",
          }}
        />

        {/* Page labels */}
        <div
          style={{
            position: "absolute",
            top: 8,
            left: 10,
            background: "rgba(0,0,0,0.45)",
            color: "rgba(255,255,255,0.9)",
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: 2,
            padding: "3px 8px",
            borderRadius: 100,
            pointerEvents: "none",
          }}
        >
          PAGE 1
        </div>
        <div
          style={{
            position: "absolute",
            top: scaledH / 2 + 8,
            left: 10,
            background: "rgba(0,0,0,0.45)",
            color: "rgba(255,255,255,0.9)",
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: 2,
            padding: "3px 8px",
            borderRadius: 100,
            pointerEvents: "none",
          }}
        >
          PAGE 2
        </div>

        {/* Watermark */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
          }}
        >
          <span
            style={{
              transform: "rotate(-30deg)",
              opacity: 0.13,
              fontSize: Math.round(56 * scale),
              fontWeight: 800,
              color: "white",
              whiteSpace: "nowrap",
              letterSpacing: 6,
              fontFamily: "Arial, Helvetica, sans-serif",
            }}
          >
            SAMPLE PREVIEW
          </span>
        </div>
      </div>
    </div>
  );
}
