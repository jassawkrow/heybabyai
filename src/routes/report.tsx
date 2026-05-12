import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { gradientFor } from "@/lib/gradients";
import { Search, Lock, Download, Share2 } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import { openRazorpay } from "@/lib/razorpay";

const search = z.object({ name: z.string().optional() });

export const Route = createFileRoute("/report")({
  validateSearch: search,
  head: () => ({ meta: [{ title: "AI Identity Report — HeyBaby AI" }] }),
  component: ReportPage,
});

function ReportPage() {
  const { name } = Route.useSearch();
  const { user, profile } = useAuth();
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
      amount: 49900,
      description: `AI Identity Report - ${hit.name}`,
      email: user.email ?? "",
      onSuccess: async (r: any) => {
        await supabase.from("payments").insert({
          user_id: user.id,
          amount_paise: 49900,
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
  name, unlocked, isFree, onUnlock,
}: {
  name: Tables<"names">;
  unlocked: boolean;
  isFree: boolean;
  onUnlock: () => void;
}) {
  return (
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
                {isFree ? "🔒 Unlock the full AI Identity Report" : "Unlock for ₹499"}
              </h3>
              <p className="text-xs text-ink/60 mt-2">
                {isFree
                  ? "Get the complete numerology, Vedic astrology, personality analysis and fun facts"
                  : "One-time purchase · Instant download"}
              </p>
              <button onClick={onUnlock} className="mt-4 pill grad-primary text-white font-semibold px-6 py-3 text-sm">
                Unlock for ₹499
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

      {unlocked && (
        <div className="flex gap-3 no-print">
          <button onClick={() => window.print()} className="flex-1 pill grad-primary text-white py-3 font-semibold text-sm flex items-center justify-center gap-2">
            <Download className="w-4 h-4" /> Download PDF
          </button>
          <button
            onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success("Link copied!"); }}
            className="flex-1 pill bg-white border border-black/10 py-3 font-semibold text-sm flex items-center justify-center gap-2"
          >
            <Share2 className="w-4 h-4" /> Share
          </button>
        </div>
      )}

      <footer className="text-center text-xs text-ink/50 pt-4">
        Generated by HeyBaby AI · heybabyai.com · {new Date().toLocaleDateString()}
      </footer>
    </article>
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
