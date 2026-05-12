import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { Star, Heart, Sparkles, FileText, ArrowRight, Search } from "lucide-react";
import { motion } from "framer-motion";
import { gradientFor } from "@/lib/gradients";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "HeyBaby AI — Find a name that feels like home" },
      { name: "description", content: "Swipe through 2,278 Indian baby names with your partner. Match in real time. Discover the one that feels right." },
    ],
  }),
  component: Landing,
});

const PREVIEW = [
  { name: "Aria", origin: "Sanskrit", meaning: "Noble melody", score: 98 },
  { name: "Rumi", origin: "Persian", meaning: "Beauty, friend, soulful", score: 96 },
  { name: "Anvi", origin: "Sanskrit", meaning: "Goddess of forests", score: 94 },
  { name: "Mira", origin: "Sanskrit", meaning: "Devoted, ocean", score: 95 },
  { name: "Ira", origin: "Sanskrit", meaning: "Earth, peace", score: 92 },
  { name: "Saanvi", origin: "Sanskrit", meaning: "Goddess Lakshmi", score: 97 },
  { name: "Kabir", origin: "Arabic", meaning: "Great, mystic poet", score: 93 },
  { name: "Vihaan", origin: "Sanskrit", meaning: "Dawn, beginning", score: 91 },
];

function Landing() {
  return (
    <div className="min-h-screen relative overflow-hidden">
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
          Find a name that <br className="hidden sm:block" />
          feels like <span className="text-grad-primary">home.</span>
        </h1>
        <p className="mt-5 max-w-xl mx-auto text-[15px] sm:text-base text-ink/65">
          Swipe through 2,278 Indian names with your partner. Match in real time. Discover the one that just feels right.
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
              Search 2,278 names… try Aria, Tamil, sacred
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

        <div className="mt-10 columns-2 sm:columns-4 gap-2.5 max-w-3xl mx-auto">
          {PREVIEW.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`${gradientFor(i)} rounded-2xl p-4 text-white text-left mb-2.5 break-inside-avoid float-y`}
              style={{ animationDelay: `${i * 0.3}s`, minHeight: 140 + (i % 3) * 30 }}
            >
              <div className="flex items-center justify-between text-[10px] font-semibold">
                <span className="glass-chip pill px-2 py-0.5">{p.origin}</span>
                <span className="glass-chip pill px-2 py-0.5">✨ {p.score}</span>
              </div>
              <div className="mt-6 text-2xl font-extrabold">{p.name}</div>
              <div className="text-[11px] mt-1 text-white/85">{p.meaning}</div>
            </motion.div>
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
    </footer>
  );
}
