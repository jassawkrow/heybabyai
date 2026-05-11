import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, X, Home, Compass, Layers, User } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Logo } from "@/components/Logo";

interface NameRow {
  name: string; slug: string; gender: string; origin: string;
  pronunciation: string; meaning_short: string; ai_vibe_score: number;
  india_rank: number; gradient_index: number; keywords: string; numerology: number;
}

const GRADIENTS = ["gradient-hero", "gradient-warm", "gradient-cool", "gradient-couple"];
const grad = (idx: number) => GRADIENTS[((idx - 1) % 4 + 4) % 4];

const ORIGINS = ["Sanskrit", "Tamil", "Telugu", "Hindi", "Arabic", "Modern"];
const GENDERS = ["girl", "boy", "unisex"];

export default function Explore() {
  const [names, setNames] = useState<NameRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [gender, setGender] = useState("");
  const [origin, setOrigin] = useState("");
  const [numerology, setNumerology] = useState<number | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    clearTimeout(timer.current);
    timer.current = setTimeout(async () => {
      setLoading(true);
      let q = supabase
        .from("names")
        .select("name,slug,gender,origin,pronunciation,meaning_short,ai_vibe_score,india_rank,gradient_index,keywords,numerology");
      if (search) q = q.or(`name.ilike.%${search}%,meaning_short.ilike.%${search}%`);
      if (gender) q = q.eq("gender", gender);
      if (origin) q = q.eq("origin", origin);
      if (numerology) q = q.eq("numerology", numerology);
      const { data } = await q.limit(100);
      setNames(data || []);
      setLoading(false);
    }, 300);
    return () => clearTimeout(timer.current);
  }, [search, gender, origin, numerology]);

  const chip = (active: boolean, color: string) =>
    `flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold border transition-all ${
      active ? `bg-${color} text-white border-${color}` : "bg-card border-border hover:border-primary/40"
    }`;

  return (
    <div className="min-h-screen pb-28">
      {/* Header */}
      <header className="sticky top-0 z-30 backdrop-blur-xl bg-background/80 border-b border-border/50">
        <div className="container flex items-center gap-3 h-16">
          <Logo />
          <div className="flex-1 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search names, meanings…"
              className="w-full pl-10 pr-9 py-2.5 rounded-full bg-card border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Filter chips */}
      <div className="sticky top-16 z-20 bg-background/90 backdrop-blur border-b border-border/30">
        <div className="container flex gap-2 py-3 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
          {GENDERS.map((g) => (
            <button key={g} onClick={() => setGender(gender === g ? "" : g)}
              className={chip(gender === g, "primary")}>
              {g.charAt(0).toUpperCase() + g.slice(1)}
            </button>
          ))}
          <div className="w-px bg-border self-stretch mx-1 flex-shrink-0" />
          {ORIGINS.map((o) => (
            <button key={o} onClick={() => setOrigin(origin === o ? "" : o)}
              className={chip(origin === o, "purple")}>
              {o}
            </button>
          ))}
          <div className="w-px bg-border self-stretch mx-1 flex-shrink-0" />
          {[1,2,3,4,5,6,7,8,9].map((n) => (
            <button key={n} onClick={() => setNumerology(numerology === n ? null : n)}
              className={`flex-shrink-0 h-8 w-8 rounded-full text-xs font-bold border transition-all ${
                numerology === n ? "bg-secondary text-secondary-foreground border-secondary" : "bg-card border-border hover:border-secondary/50"
              }`}>
              {n}
            </button>
          ))}
        </div>
      </div>

      {/* Count */}
      <div className="container pt-4 pb-1">
        <p className="text-xs text-muted-foreground font-medium">
          {loading ? "Searching…" : `${names.length} name${names.length !== 1 ? "s" : ""} found`}
        </p>
      </div>

      {/* Masonry */}
      <div className="container mt-2">
        {loading ? (
          <div className="columns-2 md:columns-3 lg:columns-4 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="break-inside-avoid mb-4 rounded-[1.5rem] bg-muted animate-pulse"
                style={{ height: `${130 + (i % 3) * 50}px` }} />
            ))}
          </div>
        ) : names.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="font-bold text-lg">No names found</h3>
            <p className="text-muted-foreground text-sm mt-1">Try a different search or clear the filters.</p>
          </div>
        ) : (
          <div className="columns-2 md:columns-3 lg:columns-4 gap-4">
            {names.map((n, i) => (
              <motion.div key={n.slug}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.025, 0.5) }}
                className="break-inside-avoid mb-4">
                <Link to={`/report/${n.slug}`}>
                  <div className={`relative rounded-[1.5rem] overflow-hidden shadow-soft hover:scale-[1.02] hover:shadow-card transition-all cursor-pointer ${grad(n.gradient_index)}`}>
                    <div className="absolute inset-0 bg-black/10" />
                    <div className="relative p-5 text-white">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase px-2.5 py-1 rounded-full bg-white/20 backdrop-blur">
                          {n.gender === "girl" ? "Girl" : n.gender === "boy" ? "Boy" : "Unisex"}
                        </span>
                        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-white/20 backdrop-blur">
                          ✨ {n.ai_vibe_score}
                        </span>
                      </div>
                      <h3 className="text-2xl font-extrabold tracking-tight mt-3 drop-shadow-sm">{n.name}</h3>
                      <p className="text-xs opacity-75 mt-0.5">/ {n.pronunciation} /</p>
                      <p className="text-sm opacity-90 mt-2 leading-snug">{n.meaning_short}</p>
                      <span className="inline-block mt-3 text-[10px] font-semibold px-2.5 py-1 rounded-full bg-white/20 backdrop-blur">
                        {n.origin}
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom nav dock */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-1 px-3 py-2 rounded-full bg-foreground/90 backdrop-blur-xl shadow-pop">
        {[
          { icon: Home, label: "Home", to: "/", active: false },
          { icon: Compass, label: "Explore", to: "/explore", active: true },
          { icon: Layers, label: "Swipe", to: "/", active: false },
          { icon: User, label: "Profile", to: "/", active: false },
        ].map(({ icon: Icon, label, to, active }) => (
          <Link key={label} to={to}
            className={`flex flex-col items-center gap-0.5 px-4 py-2 rounded-full text-white transition-all hover:bg-white/10 ${active ? "bg-white/15" : ""}`}>
            <Icon className="h-5 w-5" />
            <span className="text-[9px] font-semibold">{label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
