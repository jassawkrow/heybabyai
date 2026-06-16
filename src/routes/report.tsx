import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { gradientFor } from "@/lib/gradients";
import { Search, Lock, Download, Share2, X } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import { openRazorpay, getCurrency, getPricing, fmtPrice } from "@/lib/razorpay";
import { ReportTemplate } from "@/components/ReportTemplate";
import { generateNameReport } from "@/lib/generatePDF";
import { generateAIContent, type AIContent } from "@/lib/generateAIContent";

const search = z.object({ name: z.string().optional() });

export const Route = createFileRoute("/report")({
  validateSearch: search,
  head: () => ({ meta: [{ title: "AI Identity Report — HeyBaby AI" }] }),
  component: ReportPage,
});

function ReportPage() {
  const { name } = Route.useSearch();
  const { user, profile } = useAuth();
  const currency = getCurrency();
  const p = getPricing(currency);
  const [query, setQuery] = useState(name ?? "");
  const [hit, setHit] = useState<Tables<"names"> | null>(null);
  const [unlocked, setUnlocked] = useState(false);

  // Couple tier gets full report for free
  useEffect(() => {
    if (profile?.tier === "couple") setUnlocked(true);
  }, [profile?.tier]);

  // Restore unlock state if user has already paid for a report
  useEffect(() => {
    if (!user || unlocked) return;
    supabase
      .from("payments")
      .select("id")
      .eq("user_id", user.id)
      .eq("tier", "report")
      .eq("status", "paid")
      .limit(1)
      .maybeSingle()
      .then(({ data }) => { if (data) setUnlocked(true); });
  }, [user?.id]);

  useEffect(() => {
    if (!name) return;
    setQuery(name);
    supabase.from("names").select("*").ilike("name", name).limit(1).maybeSingle()
      .then(({ data }) => setHit(data));
  }, [name]);

  const onSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    const { data } = await supabase.from("names").select("*").ilike("name", query.trim()).limit(1).maybeSingle();
    if (!data) toast.error("Name not found in our deck");
    setHit(data);
  };

  const handleUnlock = () => {
    if (!user) {
      toast.error("Sign in first");
      location.assign("/profile");
      return;
    }
    if (!hit) return;
    openRazorpay({
      amount: p.report,
      currency,
      description: `AI Identity Report – ${hit.name}`,
      email: user.email ?? "",
      onSuccess: async (r: any, amountSmallest: number) => {
        await supabase.from("payments").insert({
          user_id: user.id,
          amount_paise: amountSmallest,
          currency,
          tier: "report",
          razorpay_payment_id: r.razorpay_payment_id,
          status: "paid",
        });
        setUnlocked(true);
        toast.success("Report unlocked! 🎉");
      },
    });
  };

  const tier = profile?.tier ?? "free";
  const isFree = tier === "free";

  return (
    <div className="min-h-screen">
      <Header />
      <div className="max-w-3xl mx-auto px-5 pt-8 pb-32">
        <div className="text-center">
          <span className="pill bg-white/70 px-3 py-1 text-[11px] font-bold tracking-widest text-purple uppercase">✦ AI Identity Report</span>
          <h1 className="text-4xl font-extrabold mt-4">More than just a name.</h1>
          <p className="text-ink/65 mt-3">Etymology, numerology, archetype — your final shortlist.</p>
        </div>

        <form onSubmit={onSearch} className="mt-8 glass pill flex items-center gap-3 px-5 py-3.5">
          <Search className="w-4 h-4 text-ink/50" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Enter a name… try Aarav"
            className="flex-1 bg-transparent outline-none text-sm" />
          <button className="pill grad-primary text-white text-xs font-semibold px-4 py-1.5">Generate</button>
        </form>

        {hit && (
          <Report
            name={hit}
            unlocked={unlocked}
            isFree={isFree}
            onUnlock={handleUnlock}
            reportPrice={fmtPrice(p.report, p)}
          />
        )}

        {!hit && (
          <div className="mt-12 grid sm:grid-cols-3 gap-3 text-center">
            {["Aarav", "Aanya", "Rumi"].map((n) => (
              <Link key={n} to="/report" search={{ name: n }} className="rounded-2xl bg-white p-5 hover:scale-[1.02] transition">
                <div className="text-2xl font-extrabold">{n}</div>
                <div className="text-xs text-ink/55 mt-1">Preview a sample report</div>
              </Link>
            ))}
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  );
}

function Report({
  name, unlocked, isFree, onUnlock, reportPrice,
}: {
  name: Tables<"names">;
  unlocked: boolean;
  isFree: boolean;
  onUnlock: () => void;
  reportPrice: string;
}) {
  const [photoDataUrl, setPhotoDataUrl] = useState<string | undefined>(undefined);
  const [generating, setGenerating] = useState(false);
  const [generatingAI, setGeneratingAI] = useState(false);
  const [aiContent, setAiContent] = useState<AIContent | null>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setPhotoDataUrl(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleGenerate = async () => {
    setGenerating(true);
    setGeneratingAI(true);
    try {
      console.log('Step 1: Starting AI content generation');
      const ai = await generateAIContent(
        name.name,
        name.origin,
        name.meaning_short,
        name.numerology,
        name.rasi,
        name.star,
      );
      console.log('Step 2: AI content received:', ai);
      setAiContent(ai);
      setGeneratingAI(false);
      await new Promise(resolve => setTimeout(resolve, 800));
      console.log('Step 3: Starting PDF generation');
      console.log('Slide 1 element:', document.getElementById('report-slide-1'));
      console.log('Slide 2 element:', document.getElementById('report-slide-2'));
      await generateNameReport({
        name: name.name,
        pronunciation: name.pronunciation,
        meaning_short: name.meaning_short,
        origin: name.origin,
        ai_vibe_score: name.ai_vibe_score,
        numerology: name.numerology,
        rasi: name.rasi,
        star: name.star,
        personality: name.personality,
        keywords: name.keywords,
        meaning_long: name.meaning_long,
        photoDataUrl,
        aiContent: ai,
      });
      console.log('Step 4: PDF generated successfully');
    } catch (err) {
      console.error('PDF generation failed:', err);
      toast.error('Failed to generate PDF: ' + (err as Error).message);
    } finally {
      setGenerating(false);
      setGeneratingAI(false);
    }
  };

  return (
    <>
      <article className="mt-10 space-y-6">
        <header className={`rounded-3xl ${gradientFor(name.gradient_index)} text-white p-8 text-center`}>
          <div className="text-[10px] font-extrabold tracking-[0.3em]">HEYBABY · AI IDENTITY REPORT</div>
          <h2 className="text-6xl font-extrabold mt-4">{name.name}</h2>
          {name.pronunciation && <div className="italic mt-2 text-white/90">/{name.pronunciation}/</div>}
          <div className="mt-4 flex flex-wrap gap-2 justify-center">
            <span className="glass-chip pill px-3 py-1 text-xs">{name.origin}</span>
            {name.gender && <span className="glass-chip pill px-3 py-1 text-xs">{name.gender}</span>}
            {name.ai_vibe_score != null && <span className="glass-chip pill px-3 py-1 text-xs">✨ {name.ai_vibe_score}</span>}
          </div>
        </header>

        {/* Always visible: Name meaning */}
        <Section title="The Name">
          <p className="text-lg font-semibold">{name.meaning_short}</p>
          {name.meaning_long && <p className="mt-3 text-ink/75 leading-relaxed">{name.meaning_long}</p>}
        </Section>

        {/* Locked sections */}
        <div className={unlocked ? "" : "relative"}>
          {!unlocked && (
            <div className="absolute inset-0 z-10 flex items-center justify-center backdrop-blur-md bg-cream/70 rounded-3xl">
              <div className="text-center max-w-xs p-6">
                <Lock className="w-7 h-7 mx-auto text-purple" />
                <h3 className="mt-3 text-xl font-extrabold">
                  {isFree ? "🔒 Unlock the full AI Identity Report" : `Unlock for ${reportPrice}`}
                </h3>
                <p className="text-xs text-ink/60 mt-2">
                  {isFree
                    ? "Get the complete numerology, Vedic astrology, personality analysis and a beautiful downloadable PDF"
                    : "One-time purchase · Instant PDF download"}
                </p>
                <button onClick={onUnlock} className="mt-4 pill grad-primary text-white font-semibold px-6 py-3 text-sm">
                  Unlock for {reportPrice}
                </button>
                {isFree && (
                  <p className="text-[10px] text-ink/40 mt-3">
                    Or <Link to="/pricing" className="underline text-purple">upgrade to Couple's Pass</Link> for 1 free report
                  </p>
                )}
              </div>
            </div>
          )}
          <div className={unlocked ? "space-y-6" : "pointer-events-none select-none blur-[6px] opacity-50 space-y-6"}>
            <Section title="Numerology">
              <div className="flex items-center gap-5">
                <div className="w-20 h-20 rounded-full grad-4 text-white flex items-center justify-center text-3xl font-extrabold shrink-0">
                  {name.numerology ?? "?"}
                </div>
                <div className="text-sm text-ink/75">
                  Life Path Number {name.numerology}. Lucky day: Wednesday · Lucky color: Teal · Lucky stone: Emerald.
                  People with this vibration are intuitive, expressive, and naturally creative.
                </div>
              </div>
            </Section>

            <Section title="Vedic Astrology">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <Field label="Rasi" value={name.rasi ?? "—"} />
                <Field label="Nakshatra" value={name.star ?? "—"} />
                <Field label="Element" value="Fire" />
                <Field label="Energy" value="Powerful" />
              </div>
            </Section>

            <Section title="Personality Archetype">
              <div className="text-2xl font-extrabold text-grad-primary">{name.personality ?? "The Mystic"}</div>
              <div className="flex flex-wrap gap-2 mt-3">
                {(name.keywords ?? "creative,intuitive,bold").split(",").map((k, i) => (
                  <span key={i} className={`pill px-3 py-1 text-xs font-semibold text-white ${gradientFor(i)}`}>{k.trim()}</span>
                ))}
              </div>
            </Section>

            <Section title="✦ Fun Fact" className="border-2 border-gold/40 bg-gold/10">
              {name.meaning_long ?? "This name has been carried by poets, mystics, and changemakers across centuries."}
            </Section>
          </div>
        </div>

        {/* ── Photo upload + PDF generate (unlocked only) ── */}
        {unlocked && (
          <>
            <Section title="Personalise Your Report">
              <p className="text-sm text-ink/60 mb-4">
                Add a family or baby photo — it will appear on the front page of your PDF.
              </p>
              {photoDataUrl ? (
                <div className="relative">
                  <img
                    src={photoDataUrl}
                    className="w-full h-40 object-cover rounded-2xl"
                    alt="Report photo"
                  />
                  <button
                    onClick={() => setPhotoDataUrl(undefined)}
                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60 flex items-center justify-center hover:bg-black/80 transition"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                </div>
              ) : (
                <label className="block border-2 border-dashed border-black/15 rounded-2xl p-8 text-center cursor-pointer hover:border-teal/40 transition">
                  <div className="text-3xl mb-2">📷</div>
                  <div className="text-sm font-semibold text-ink/60">Tap to add a photo</div>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoUpload}
                  />
                </label>
              )}
              <p className="text-[10px] text-ink/40 mt-2 text-center">
                Optional · Your photo stays on your device and is never uploaded
              </p>
            </Section>

            <div className="flex gap-3 no-print">
              <button
                onClick={handleGenerate}
                disabled={generating}
                className="flex-1 pill grad-primary text-white py-3 font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-60 transition"
              >
                {generating ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin shrink-0" />
                    {generatingAI ? 'Generating AI story…' : 'Creating PDF…'}
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" /> Download PDF Report
                  </>
                )}
              </button>
              <button
                onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success("Link copied!"); }}
                className="flex-1 pill bg-white border border-black/10 py-3 font-semibold text-sm flex items-center justify-center gap-2"
              >
                <Share2 className="w-4 h-4" /> Share
              </button>
            </div>
          </>
        )}

        <footer className="text-center text-xs text-ink/50 pt-4">
          Generated by HeyBaby AI · heybabyai.com · {new Date().toLocaleDateString()}
        </footer>
      </article>

      {/* Hidden PDF template — rendered off-screen for html2canvas capture */}
      <div style={{ position: 'absolute', left: '-9999px', top: 0, overflow: 'hidden' }}>
        <ReportTemplate
          name={name.name}
          pronunciation={name.pronunciation}
          meaning_short={name.meaning_short}
          origin={name.origin}
          ai_vibe_score={name.ai_vibe_score}
          numerology={name.numerology}
          rasi={name.rasi}
          star={name.star}
          personality={name.personality}
          keywords={name.keywords}
          meaning_long={name.meaning_long}
          photoDataUrl={photoDataUrl}
          aiContent={aiContent ?? undefined}
        />
      </div>
    </>
  );
}

function Section({ title, children, className = "" }: any) {
  return (
    <section className={`rounded-3xl bg-white p-6 ${className}`}>
      <div className="text-[10px] font-extrabold tracking-widest text-ink/50 uppercase">{title}</div>
      <div className="mt-3">{children}</div>
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
