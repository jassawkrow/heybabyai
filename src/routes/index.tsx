import { createFileRoute, Link } from "@tanstack/react-router";
import { Helmet } from "react-helmet-async";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { Star, Heart, Sparkles, FileText, ArrowRight, Search } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { sessionGradients } from "@/lib/sessionGradients";
import { cardHeightFor } from "@/lib/gradients";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "HeyBaby AI — Your Baby's Name Starts Here" },
      { name: "description", content: "Swipe through 100,000+ names from cultures around the world. Match with your partner. Guided by AI." },
    ],
  }),
  component: Landing,
});

const CARD_HEIGHTS = ["min-h-[180px]", "min-h-[150px]", "min-h-[150px]", "min-h-[180px]", "min-h-[165px]", "min-h-[165px]"];
const FLOAT_CLASSES = ["float-1", "float-2", "float-3", "float-4", "float-5", "float-6"];

function getFontSize(name: string) {
  const len = name.length;
  if (len <= 5) return "text-3xl";
  if (len <= 7) return "text-2xl";
  if (len <= 9) return "text-xl";
  if (len <= 12) return "text-lg";
  if (len <= 15) return "text-base";
  return "text-sm";
}

function Landing() {
  const [previewNames, setPreviewNames] = useState<Tables<"names">[]>([]);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("names")
        .select("id, name, meaning_short, origin, gradient_index, slug, gender, ai_vibe_score, pronunciation, rasi, star")
        .order("ai_vibe_score", { ascending: false, nullsFirst: false })
        .limit(100);
      if (data && data.length > 0) {
        const shuffled = [...data].sort(() => Math.random() - 0.5);
        setPreviewNames(shuffled.slice(0, 6));
      }
    })();
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden">
      <Helmet>
        <title>HeyBaby AI — Your Baby's Name Starts Here</title>
        <meta property="og:title" content="HeyBaby AI — Your Baby's Name Starts Here" />
        <meta property="og:description" content="Swipe through 100,000+ names from cultures around the world. Match with your partner. Guided by AI." />
        <meta property="og:url" content="https://heybabyai.com" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="HeyBaby AI" />
        <meta property="og:image" content="https://heybabyai.com/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="HeyBaby AI — Your Baby's Name Starts Here" />
        <meta name="twitter:description" content="Swipe through 100,000+ names from cultures around the world. Match with your partner. Guided by AI." />
        <meta name="twitter:image" content="https://heybabyai.com/og-image.png" />
      </Helmet>

      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-32 -left-32 w-[420px] h-[420px] rounded-full" style={{ background: "radial-gradient(circle, rgba(29,175,182,0.18), transparent 70%)" }} />
        <div className="absolute -bottom-40 -right-32 w-[520px] h-[520px] rounded-full" style={{ background: "radial-gradient(circle, rgba(239,92,132,0.18), transparent 70%)" }} />
      </div>

      <Header />

      <section className="max-w-5xl mx-auto px-5 sm:px-6 pt-10 sm:pt-16 pb-16 text-center">
        <span className="inline-flex items-center gap-1 pill bg-white/70 border border-purple/20 px-3 py-1 text-[11px] font-bold tracking-[0.18em] text-purple uppercase">
          ✦ AI-Powered Baby Name Discovery
        </span>
        <h1 className="mt-6 text-[34px] sm:text-[56px] leading-[1.05] font-extrabold tracking-tight">
          Your Baby's Name <span className="text-grad-primary">Starts Here</span>
        </h1>
        <p className="mt-5 max-w-xl mx-auto text-[15px] sm:text-base text-ink/65">
          Swipe through 100,000+ names from cultures around the world. Match with your partner. Guided by AI.
        </p>

        <div className="mt-7 flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/swipe" className="grad-primary pill text-white font-semibold px-7 py-4 text-sm sm:text-base shadow-xl shadow-purple/20 inline-flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.97] transition">
            Start free — 20 swipes a day <ArrowRight className="w-4 h-4" />
          </Link>
          <Link to="/profile" className="pill bg-white/70 border border-black/10 font-semibold px-7 py-4 text-sm sm:text-base hover:bg-white">
            Invite your partner
          </Link>
        </div>

        <div className="mt-8 max-w-xl mx-auto">
          <div className="glass pill flex items-center gap-3 px-5 py-3.5">
            <Search className="w-4 h-4 text-ink/50" />
            <Link to="/explore" className="flex-1 text-left text-sm text-ink/40">
              Search 100,000+ names… try Aria, Tamil, sacred
            </Link>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-center gap-2 text-xs text-ink/55">
          <span className="flex">
            {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-gold text-gold" />)}
          </span>
          Loved by 12,000+ Indian & NRI families
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-5 sm:px-6 pb-16">
        <div className="rounded-3xl text-white px-8 py-10 sm:py-12 text-center" style={{ background: "linear-gradient(135deg, #1DAFB6 0%, #9B59B6 100%)" }}>
          <h2 className="text-3xl sm:text-4xl font-extrabold">Decode your baby's name</h2>
          <p className="mt-3 text-white/85 max-w-md mx-auto text-sm sm:text-base">
            Get a full AI Identity Report — numerology, Vedic astrology, personality archetype and more
          </p>
          <Link to="/sample-report" className="mt-6 inline-flex items-center gap-2 pill bg-white text-purple font-semibold px-7 py-3.5 text-sm hover:scale-[1.02] active:scale-[0.97] transition">
            Get AI Identity Report →
          </Link>
          <div className="mt-3 text-xs text-white/60">Free preview · Full report ₹199</div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-5 sm:px-6 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <FeatureCard icon={Heart} grad="grad-2" title="Swipe what you love" body="Right for love, left for pass. Your taste shapes the deck." />
          <FeatureCard icon={Sparkles} grad="grad-primary" title="Match with your partner" body="Both swipe right — instant match with confetti." />
          <FeatureCard icon={FileText} grad="grad-3" title="Decode the AI Report" body="Etymology, numerology, personality — your final shortlist." />
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-5 sm:px-6 pb-24 text-center">
        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
          When you both swipe right, <br className="hidden sm:block" />
          <span className="text-grad-match">it's a match.</span>
        </h2>
        <p className="mt-4 text-ink/65 max-w-xl mx-auto">
          Send your partner an invite link, swipe at your own pace, and let the algorithm celebrate the moment you both fall for the same name.
        </p>

        <div className="mt-10 grid grid-cols-2 gap-2 w-full max-w-sm mx-auto">
          {previewNames.map((p, i) => (
            <Link to="/explore" key={p.id}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`${sessionGradients[i % sessionGradients.length]} ${CARD_HEIGHTS[i] ?? "min-h-[160px]"} ${FLOAT_CLASSES[i] ?? "float-1"} rounded-2xl p-3 text-white text-left cursor-pointer hover:scale-105 transition-transform duration-200 flex flex-col justify-between overflow-hidden`}
              >
                {/* Top: origin + vibe score */}
                <div className="flex items-center justify-between gap-1 text-[9px] font-semibold">
                  <span className="glass-chip pill px-2 py-0.5 truncate">{p.origin}</span>
                  {p.ai_vibe_score != null && (
                    <span className="glass-chip pill px-2 py-0.5 shrink-0">✦ {p.ai_vibe_score}</span>
                  )}
                </div>

                {/* Middle: name + pronunciation */}
                <div className="my-1">
                  <div className={`${getFontSize(p.name)} font-extrabold leading-tight`}>{p.name}</div>
                  {p.pronunciation && (
                    <div className="text-[10px] mt-0.5 text-white/75 italic">/{p.pronunciation}/</div>
                  )}
                  {p.meaning_short && (
                    <div className="text-[10px] mt-1 text-white/85 line-clamp-2">{p.meaning_short}</div>
                  )}
                </div>

                {/* Bottom: rasi + star */}
                {(p.rasi || p.star) && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {p.rasi && <span className="glass-chip pill px-2 py-0.5 text-[9px]">{p.rasi}</span>}
                    {p.star && <span className="glass-chip pill px-2 py-0.5 text-[9px]">{p.star}</span>}
                  </div>
                )}
              </motion.div>
            </Link>
          ))}
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-5 sm:px-6 pb-28 text-center">
        <h2 className="text-3xl sm:text-4xl font-extrabold">A plan for two.</h2>
        <p className="mt-3 text-ink/65">Start free. Upgrade when 20 swipes a day just isn't enough.</p>
        <Link to="/pricing" className="mt-6 inline-flex pill grad-primary text-white px-7 py-3.5 text-sm font-semibold">
          See pricing →
        </Link>
      </section>

      <Footer />
      <BottomNav />
      <div className="h-28" />
    </div>
  );
}

function FeatureCard({ icon: Icon, grad, title, body }: any) {
  return (
    <div className="rounded-2xl bg-white p-6 text-left shadow-sm">
      <div className={`w-11 h-11 rounded-2xl ${grad} flex items-center justify-center text-white`}>
        <Icon className="w-5 h-5" />
      </div>
      <h3 className="mt-4 font-extrabold text-lg">{title}</h3>
      <p className="text-sm text-ink/60 mt-1">{body}</p>
    </div>
  );
}

function Footer() {
  return (
    <footer className="border-t border-black/5 px-6 py-10 text-sm text-ink/60">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="font-extrabold text-ink">heybaby<span className="text-grad-primary">ai</span></div>
          <div className="text-xs mt-1">Made with ♥ for new parents</div>
        </div>
        <div className="flex gap-5 text-xs">
          <Link to="/about">About</Link>
          <Link to="/pricing">Pricing</Link>
          <Link to="/report">AI Report</Link>
        </div>
      </div>
      <div className="max-w-5xl mx-auto text-center text-[11px] mt-6 text-ink/40">
        All sales final · No refunds on digital purchases · hello@heybabyai.com
      </div>
      <div className="max-w-5xl mx-auto text-center text-[11px] mt-3 flex items-center justify-center gap-4 text-ink/35">
        <Link to="/privacy" className="hover:text-ink/60 transition">Privacy Policy</Link>
        <span>·</span>
        <Link to="/terms" className="hover:text-ink/60 transition">Terms of Service</Link>
      </div>
    </footer>
  );
}
