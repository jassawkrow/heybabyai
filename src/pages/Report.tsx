import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Download, Share2, Globe2, Star, Hash, Compass, Sparkles, BookOpen, Sun } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";

interface NameRecord {
  name: string; slug: string; gender: string; origin: string;
  pronunciation: string; meaning_short: string; meaning_long: string;
  numerology: number; rasi: string; star: string; starting_letter: string;
  world_rank: number; india_rank: number; ai_vibe_score: number;
  instagram_score: number; historical_score: number;
  personality: string; keywords: string; gradient_index: number;
}

const GRADIENTS = ["gradient-hero", "gradient-warm", "gradient-cool", "gradient-couple"];
const grad = (idx: number) => GRADIENTS[((idx - 1) % 4 + 4) % 4];

const RASI_SYMBOLS: Record<string, string> = {
  Mesha:"♈",Vrishabha:"♉",Mithuna:"♊",Karka:"♋",Simha:"♌",Kanya:"♍",
  Tula:"♎",Vrishchika:"♏",Dhanu:"♐",Makara:"♑",Kumbha:"♒",Meena:"♓",
};

const NUMEROLOGY: Record<number, { meaning: string; color: string; day: string; stone: string; element: string }> = {
  1: { meaning: "The Leader — independent, pioneering, self-reliant. Born to initiate and inspire.", color: "Red", day: "Sunday", stone: "Ruby", element: "Fire" },
  2: { meaning: "The Peacemaker — cooperative, intuitive, deeply sensitive to others' needs.", color: "White", day: "Monday", stone: "Moonstone", element: "Water" },
  3: { meaning: "The Communicator — expressive, creative, joyful. A natural storyteller.", color: "Yellow", day: "Thursday", stone: "Yellow Sapphire", element: "Ether" },
  4: { meaning: "The Builder — disciplined, trustworthy, grounded in purpose and stability.", color: "Green", day: "Wednesday", stone: "Emerald", element: "Earth" },
  5: { meaning: "The Explorer — adventurous, versatile, freedom-loving. Embraces change.", color: "Blue", day: "Friday", stone: "Diamond", element: "Air" },
  6: { meaning: "The Nurturer — caring, responsible, a harmonious force in every room.", color: "Pink", day: "Friday", stone: "Opal", element: "Water" },
  7: { meaning: "The Seeker — analytical, spiritual, introspective. Drawn to deeper truths.", color: "Violet", day: "Saturday", stone: "Amethyst", element: "Air" },
  8: { meaning: "The Achiever — powerful, ambitious, success-driven. A natural executive.", color: "Blue", day: "Saturday", stone: "Blue Sapphire", element: "Earth" },
  9: { meaning: "The Humanitarian — compassionate, generous, wise beyond their years.", color: "Red", day: "Tuesday", stone: "Coral", element: "Fire" },
};

const RASI_ELEMENT: Record<string, string> = {
  Mesha:"Fire",Simha:"Fire",Dhanu:"Fire",
  Vrishabha:"Earth",Kanya:"Earth",Makara:"Earth",
  Mithuna:"Air",Tula:"Air",Kumbha:"Air",
  Karka:"Water",Vrishchika:"Water",Meena:"Water",
};

const Section = ({ title, icon: Icon, children, className = "" }: {
  title: string; icon: React.ElementType; children: React.ReactNode; className?: string;
}) => (
  <div className={`rounded-[1.5rem] bg-card border border-border p-6 print:rounded-xl print:border print:shadow-none ${className}`}>
    <div className="flex items-center gap-2 mb-4">
      <div className="h-8 w-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
        <Icon className="h-4 w-4" />
      </div>
      <h3 className="font-extrabold text-base tracking-tight">{title}</h3>
    </div>
    {children}
  </div>
);

const Badge = ({ children, color = "primary" }: { children: React.ReactNode; color?: string }) => (
  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-${color}/10 text-${color} border border-${color}/20`}>
    {children}
  </span>
);

export default function Report() {
  const { slug } = useParams<{ slug: string }>();
  const [name, setName] = useState<NameRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!slug) return;
    supabase.from("names").select("*").eq("slug", slug).limit(1).single()
      .then(({ data }) => { setName(data); setLoading(false); });
  }, [slug]);

  const share = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent" />
    </div>
  );

  if (!name) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <p className="text-2xl font-bold">Name not found</p>
      <Link to="/search"><Button className="rounded-full">Search names</Button></Link>
    </div>
  );

  const num = NUMEROLOGY[name.numerology] || NUMEROLOGY[1];
  const keywords = name.keywords?.split("|").map((k) => k.trim()).filter(Boolean) || [];
  const element = RASI_ELEMENT[name.rasi] || "Cosmic";
  const genderLabel = name.gender === "girl" ? "Girl" : name.gender === "boy" ? "Boy" : "Unisex";

  return (
    <div className="min-h-screen bg-background pb-16 print:pb-0 print:bg-white">

      {/* ── PRINT HEADER (hidden on screen) ── */}
      <div className="hidden print:flex print:items-center print:justify-between print:px-8 print:py-5 print:border-b">
        <img src="/logo.png" alt="HeyBaby AI" className="h-10" />
        <div className="text-right">
          <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">AI Identity Report</p>
          <p className="text-xs text-gray-400">{new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p>
        </div>
      </div>

      {/* ── SCREEN NAV ── */}
      <div className="print:hidden sticky top-0 z-30 backdrop-blur-xl bg-background/80 border-b border-border/50">
        <div className="container h-14 flex items-center justify-between">
          <Link to="/search" className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition">
            <ArrowLeft className="h-4 w-4" /> Back to Search
          </Link>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={share} className="rounded-full gap-1.5">
              <Share2 className="h-3.5 w-3.5" />
              {copied ? "Copied!" : "Share"}
            </Button>
            <Button size="sm" onClick={() => window.print()} className="rounded-full gradient-hero text-white border-0 gap-1.5">
              <Download className="h-3.5 w-3.5" /> Download PDF
            </Button>
          </div>
        </div>
      </div>

      {/* ── HERO HEADER ── */}
      <div className={`relative overflow-hidden print:bg-gray-50 print:border-b`}>
        <div className={`${grad(name.gradient_index)} print:hidden`}>
          <div className="absolute inset-0 bg-black/10" />
          <div className="relative container py-12 text-white">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur text-[11px] font-bold uppercase tracking-widest mb-5">
                <Sparkles className="h-3 w-3" /> AI Identity Report
              </span>
              <h1 className="text-7xl sm:text-9xl font-extrabold tracking-tight drop-shadow-sm leading-none">{name.name}</h1>
              <p className="text-xl italic opacity-80 mt-2 font-medium">/ {name.pronunciation} /</p>
              <p className="mt-4 text-lg opacity-90 max-w-xl leading-relaxed">{name.meaning_short}</p>
              <div className="flex flex-wrap gap-2 mt-5">
                <span className="px-3 py-1.5 rounded-full bg-white/20 text-xs font-semibold">{genderLabel}</span>
                <span className="px-3 py-1.5 rounded-full bg-white/20 text-xs font-semibold"><Globe2 className="inline h-3 w-3 mr-1" />{name.origin}</span>
                <span className="px-3 py-1.5 rounded-full bg-white/20 text-xs font-semibold">✨ Vibe {name.ai_vibe_score}</span>
                <span className="px-3 py-1.5 rounded-full bg-white/20 text-xs font-semibold">🇮🇳 #{name.india_rank}</span>
              </div>
            </motion.div>
          </div>
        </div>
        {/* Print hero */}
        <div className="hidden print:block px-8 py-8">
          <p className="text-xs uppercase tracking-widest text-gray-400 font-bold mb-2">AI Identity Report</p>
          <h1 className="text-6xl font-extrabold tracking-tight" style={{ background: "linear-gradient(135deg,#1DAFB6,#7928A3)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>{name.name}</h1>
          <p className="text-lg italic text-gray-500 mt-1">/ {name.pronunciation} /</p>
          <p className="text-gray-600 mt-2">{name.meaning_short} · {name.origin} · {genderLabel}</p>
        </div>
      </div>

      {/* ── SECTIONS ── */}
      <div className="container mt-8 grid md:grid-cols-2 gap-5 print:mt-6 print:gap-4 print:px-8">

        {/* S1 — THE NAME */}
        <Section title="The Name" icon={BookOpen} className="md:col-span-2">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <p className="text-muted-foreground text-sm leading-relaxed">{name.meaning_long || name.meaning_short}</p>
              <div className="flex flex-wrap gap-2 mt-4">
                <Badge color="primary">{name.origin}</Badge>
                <Badge color="secondary">Starting letter: {name.starting_letter}</Badge>
                {name.world_rank > 0 && <Badge color="purple">World #{name.world_rank}</Badge>}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 md:grid-cols-1 md:gap-3">
              {[
                { label: "AI Vibe", value: name.ai_vibe_score, color: "bg-primary" },
                { label: "Trending", value: name.instagram_score, color: "bg-secondary" },
                { label: "Heritage", value: name.historical_score, color: "bg-purple" },
              ].map(({ label, value, color }) => (
                <div key={label} className="rounded-xl bg-muted p-3 text-center">
                  <p className="text-2xl font-extrabold">{value}</p>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* S2 — NUMEROLOGY */}
        <Section title="Numerology Profile" icon={Hash}>
          <div className="flex items-center gap-4 mb-4">
            <div className="h-20 w-20 rounded-2xl gradient-hero flex items-center justify-center text-4xl font-extrabold text-white flex-shrink-0 shadow-soft">
              {name.numerology}
            </div>
            <div>
              <p className="font-extrabold text-xl">Life Path {name.numerology}</p>
              <p className="text-sm text-muted-foreground mt-1 leading-snug">{num.meaning}</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-2">
            {[
              { label: "Lucky Color", value: num.color, emoji: "🎨" },
              { label: "Lucky Day", value: num.day, emoji: "📅" },
              { label: "Lucky Stone", value: num.stone, emoji: "💎" },
            ].map(({ label, value, emoji }) => (
              <div key={label} className="rounded-xl bg-muted p-3 text-center">
                <p className="text-lg mb-0.5">{emoji}</p>
                <p className="text-xs font-bold text-foreground leading-tight">{value}</p>
                <p className="text-[9px] uppercase tracking-wider text-muted-foreground mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* S3 — VEDIC ASTROLOGY */}
        <Section title="Vedic Astrology" icon={Star}>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="rounded-xl bg-muted p-4 text-center">
              <p className="text-4xl mb-1">{RASI_SYMBOLS[name.rasi] || "✦"}</p>
              <p className="font-extrabold">{name.rasi}</p>
              <p className="text-xs text-muted-foreground mt-0.5">Rasi (Zodiac)</p>
            </div>
            <div className="rounded-xl bg-muted p-4 text-center">
              <p className="text-4xl mb-1">⭐</p>
              <p className="font-extrabold text-sm">{name.star}</p>
              <p className="text-xs text-muted-foreground mt-0.5">Nakshatra (Star)</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-muted px-3 py-2 flex items-center gap-2">
              <Sun className="h-4 w-4 text-secondary flex-shrink-0" />
              <div>
                <p className="text-xs font-bold">{element} Element</p>
                <p className="text-[10px] text-muted-foreground">Astrology energy</p>
              </div>
            </div>
            <div className="rounded-xl bg-muted px-3 py-2 flex items-center gap-2">
              <Compass className="h-4 w-4 text-primary flex-shrink-0" />
              <div>
                <p className="text-xs font-bold">Letter {name.starting_letter}</p>
                <p className="text-[10px] text-muted-foreground">Nakshatra syllable</p>
              </div>
            </div>
          </div>
        </Section>

        {/* S4 — PERSONALITY ARCHETYPE */}
        <Section title="Personality Archetype" icon={Compass} className="md:col-span-2">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full gradient-couple text-white text-sm font-bold mb-3 shadow-soft">
                <Sparkles className="h-4 w-4" /> {name.personality}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Names carry an invisible energy that shapes first impressions. <strong className="text-foreground">{name.name}</strong> embodies
                the archetype of <em>{name.personality?.toLowerCase()}</em> — radiating {num.element.toLowerCase()} energy,
                depth, and a presence that is both memorable and timeless.
              </p>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                People named {name.name} are often described as {keywords.slice(0, 2).join(" and ").toLowerCase() || "remarkable"} —
                qualities that stem from the name's {name.origin} roots and its {num.element}-aligned numerological signature.
              </p>
            </div>
            <div>
              {keywords.length > 0 && (
                <>
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Keywords</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {keywords.map((kw) => (
                      <span key={kw} className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold border border-primary/20">{kw}</span>
                    ))}
                  </div>
                </>
              )}
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Element Affinity</p>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-muted">
                <div className="h-10 w-10 rounded-xl gradient-warm flex items-center justify-center text-xl flex-shrink-0">
                  {element === "Fire" ? "🔥" : element === "Water" ? "💧" : element === "Earth" ? "🌿" : "🌬️"}
                </div>
                <div>
                  <p className="font-bold text-sm">{element}</p>
                  <p className="text-xs text-muted-foreground">Elemental energy from Vedic tradition</p>
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* S5 — FUN FACT (gold highlight box) */}
        <Section title="Did You Know?" icon={Sparkles} className="md:col-span-2">
          <div className="rounded-2xl bg-secondary/10 border border-secondary/30 p-5 flex gap-4">
            <div className="text-3xl flex-shrink-0">✨</div>
            <p className="text-sm leading-relaxed text-foreground">
              <strong>{name.name}</strong> comes from the <strong>{name.origin}</strong> tradition and carries the vibrational frequency of life path <strong>{name.numerology}</strong> in Pythagorean numerology.
              {name.rasi && ` It resonates with ${name.rasi} (${RASI_SYMBOLS[name.rasi] || ""}) energy in Vedic astrology, making it especially auspicious for children born under this sign.`}
              {" "}With an AI Vibe Score of <strong>{name.ai_vibe_score}</strong>, it ranks among the most resonant names in the HeyBaby database of 2,278 curated names.
            </p>
          </div>
        </Section>
      </div>

      {/* ── PRINT FOOTER ── */}
      <div className="hidden print:flex print:items-center print:justify-between print:px-8 print:pt-6 print:mt-6 print:border-t print:text-xs print:text-gray-400">
        <span>Generated by HeyBaby AI · heybabyai.com</span>
        <span>{new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</span>
      </div>

      {/* ── SCREEN CTA ── */}
      <div className="container mt-10 text-center print:hidden">
        <p className="text-muted-foreground text-sm mb-4">Love <strong>{name.name}</strong>? Swipe it with your partner.</p>
        <div className="flex items-center justify-center gap-3">
          <Link to="/"><Button size="lg" className="rounded-full gradient-hero text-white border-0 font-bold px-8">Start swiping →</Button></Link>
          <Link to="/search"><Button size="lg" variant="outline" className="rounded-full font-bold px-8">Browse more names</Button></Link>
        </div>
      </div>

      <style>{`
        @media print {
          @page { size: A4; margin: 0; }
          body { background: white !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .print\\:hidden { display: none !important; }
        }
      `}</style>
    </div>
  );
}
