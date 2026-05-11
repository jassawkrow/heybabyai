import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, ArrowLeft } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Logo } from "@/components/Logo";

interface NameRow {
  name: string; slug: string; gender: string; origin: string;
  pronunciation: string; meaning_short: string; ai_vibe_score: number;
  india_rank: number; gradient_index: number; keywords: string;
  numerology: number; rasi: string; star: string; personality: string;
}

const GRADIENTS = ["gradient-hero", "gradient-warm", "gradient-cool", "gradient-couple"];
const grad = (idx: number) => GRADIENTS[((idx - 1) % 4 + 4) % 4];

const ORIGINS = ["Sanskrit", "Tamil", "Telugu", "Hindi", "Arabic", "Persian", "Modern", "Bengali", "Punjabi"];
const RASIS = ["Mesha","Vrishabha","Mithuna","Karka","Simha","Kanya","Tula","Vrishchika","Dhanu","Makara","Kumbha","Meena"];
const RASI_SYMBOLS: Record<string, string> = {
  Mesha:"♈",Vrishabha:"♉",Mithuna:"♊",Karka:"♋",Simha:"♌",Kanya:"♍",
  Tula:"♎",Vrishchika:"♏",Dhanu:"♐",Makara:"♑",Kumbha:"♒",Meena:"♓",
};

type Chip = { label: string; value: string };

const FilterRow = ({
  label, chips, active, onSelect,
}: {
  label: string;
  chips: Chip[];
  active: string;
  onSelect: (v: string) => void;
}) => (
  <div className="flex items-center gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
    <span className="flex-shrink-0 text-[11px] font-bold uppercase tracking-wider text-muted-foreground w-20">{label}</span>
    {[{ label: "All", value: "all" }, ...chips].map((c) => (
      <button
        key={c.value}
        onClick={() => onSelect(active === c.value ? "all" : c.value)}
        className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all ${
          active === c.value
            ? "bg-primary text-white border-primary shadow-sm"
            : "bg-card border-border hover:border-primary/50 text-foreground"
        }`}
      >
        {c.label}
      </button>
    ))}
  </div>
);

export default function SearchPage() {
  const [names, setNames] = useState<NameRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [search, setSearch] = useState("");
  const [gender, setGender] = useState("all");
  const [origin, setOrigin] = useState("all");
  const [numerology, setNumerology] = useState("all");
  const [rasi, setRasi] = useState("all");
  const timer = useRef<ReturnType<typeof setTimeout>>();
  const inputRef = useRef<HTMLInputElement>(null);

  const hasFilters = gender !== "all" || origin !== "all" || numerology !== "all" || rasi !== "all";

  useEffect(() => {
    if (!search.trim() && !hasFilters) { setSearched(false); return; }
    clearTimeout(timer.current);
    timer.current = setTimeout(async () => {
      setLoading(true);
      setSearched(true);
      let q = supabase.from("names").select(
        "name,slug,gender,origin,pronunciation,meaning_short,ai_vibe_score,india_rank,gradient_index,keywords,numerology,rasi,star,personality"
      );
      if (search.trim()) {
        q = q.or(
          `name.ilike.%${search}%,meaning_short.ilike.%${search}%,origin.ilike.%${search}%,keywords.ilike.%${search}%,personality.ilike.%${search}%`
        );
      }
      if (gender !== "all") q = q.eq("gender", gender);
      if (origin !== "all") q = q.eq("origin", origin);
      if (numerology !== "all") q = q.eq("numerology", Number(numerology));
      if (rasi !== "all") q = q.eq("rasi", rasi);
      const { data } = await q.order("ai_vibe_score", { ascending: false }).limit(100);
      setNames(data || []);
      setLoading(false);
    }, 350);
    return () => clearTimeout(timer.current);
  }, [search, gender, origin, numerology, rasi]);

  const clearAll = () => { setSearch(""); setGender("all"); setOrigin("all"); setNumerology("all"); setRasi("all"); inputRef.current?.focus(); };

  return (
    <div className="min-h-screen pb-10">
      {/* Header */}
      <header className="sticky top-0 z-30 backdrop-blur-xl bg-background/90 border-b border-border/50">
        <div className="container flex items-center gap-3 h-16">
          <Link to="/" className="text-muted-foreground hover:text-foreground transition flex-shrink-0">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <Logo />
        </div>
      </header>

      <div className="container pt-8 pb-4">
        {/* Big search bar */}
        <div className="relative max-w-2xl mx-auto mb-6">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
          <input
            ref={inputRef}
            autoFocus
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder='Search 2,278 names… try "Rumi", "sacred", "Tamil"'
            className="w-full pl-14 pr-12 py-4 rounded-2xl bg-card border-2 border-border text-base focus:outline-none focus:border-primary/60 transition shadow-soft"
          />
          {(search || hasFilters) && (
            <button onClick={clearAll} className="absolute right-4 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full bg-muted flex items-center justify-center hover:bg-muted-foreground/20 transition">
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="max-w-4xl mx-auto space-y-2 bg-card rounded-2xl border border-border p-4 shadow-soft mb-6">
          <FilterRow label="Gender" active={gender} onSelect={setGender}
            chips={[{ label: "Girl", value: "girl" }, { label: "Boy", value: "boy" }, { label: "Unisex", value: "unisex" }]} />
          <FilterRow label="Origin" active={origin} onSelect={setOrigin}
            chips={ORIGINS.map((o) => ({ label: o, value: o }))} />
          <FilterRow label="Number" active={numerology} onSelect={setNumerology}
            chips={[1,2,3,4,5,6,7,8,9].map((n) => ({ label: String(n), value: String(n) }))} />
          <FilterRow label="Rasi" active={rasi} onSelect={setRasi}
            chips={RASIS.map((r) => ({ label: `${RASI_SYMBOLS[r]} ${r}`, value: r }))} />
        </div>

        {/* State: not searched yet */}
        {!searched && !loading && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-2xl font-extrabold">Find the perfect name</h2>
            <p className="text-muted-foreground mt-2 text-sm max-w-sm mx-auto">
              Search by name, meaning, or feeling. Filter by origin, numerology, or zodiac sign.
            </p>
          </div>
        )}

        {/* Count */}
        {searched && (
          <p className="text-xs text-muted-foreground font-medium mb-4 max-w-4xl mx-auto">
            {loading ? "Searching…" : `${names.length} name${names.length !== 1 ? "s" : ""} found`}
            {(gender !== "all" || origin !== "all" || numerology !== "all" || rasi !== "all") && (
              <button onClick={clearAll} className="ml-3 text-primary underline underline-offset-2">Clear filters</button>
            )}
          </p>
        )}

        {/* Grid */}
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="columns-2 md:columns-3 lg:columns-4 gap-4">
              {Array.from({ length: 16 }).map((_, i) => (
                <div key={i} className="break-inside-avoid mb-4 rounded-[1.5rem] bg-muted animate-pulse"
                  style={{ height: `${140 + (i % 4) * 40}px` }} />
              ))}
            </div>
          ) : searched && names.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">😔</div>
              <h3 className="font-extrabold text-xl">No names found</h3>
              <p className="text-muted-foreground text-sm mt-1">Try "divine" or "Tamil" or clear your filters.</p>
              <button onClick={clearAll} className="mt-4 text-primary font-semibold underline underline-offset-2 text-sm">
                Clear all filters
              </button>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div key={`${search}-${gender}-${origin}-${numerology}-${rasi}`}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="columns-2 md:columns-3 lg:columns-4 gap-4">
                {names.map((n, i) => (
                  <motion.div key={n.slug}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(i * 0.02, 0.5) }}
                    className="break-inside-avoid mb-4">
                    <Link to={`/report/${n.slug}`}>
                      <div className={`relative rounded-[1.5rem] overflow-hidden shadow-soft hover:shadow-card hover:scale-[1.02] transition-all cursor-pointer ${grad(n.gradient_index)}`}>
                        <div className="absolute inset-0 bg-black/10" />
                        <div className="relative p-5 text-white">
                          {/* Top row */}
                          <div className="flex items-start justify-between gap-2">
                            <span className="text-[10px] font-bold uppercase px-2.5 py-1 rounded-full bg-white/20 backdrop-blur leading-none">
                              {n.origin}
                            </span>
                            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-white/20 backdrop-blur leading-none flex-shrink-0">
                              ✨ {n.ai_vibe_score}
                            </span>
                          </div>
                          {/* Name */}
                          <h3 className="text-3xl font-extrabold tracking-tight mt-3 drop-shadow-sm leading-none">{n.name}</h3>
                          <p className="text-xs italic opacity-75 mt-1">/ {n.pronunciation} /</p>
                          <p className="text-sm opacity-90 mt-2 leading-snug">{n.meaning_short}</p>
                          {/* Bottom badges */}
                          <div className="flex flex-wrap gap-1.5 mt-3">
                            {n.rasi && (
                              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/15 backdrop-blur">
                                {RASI_SYMBOLS[n.rasi] || "✦"} {n.rasi}
                              </span>
                            )}
                            {n.star && (
                              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/15 backdrop-blur">
                                ⭐ {n.star}
                              </span>
                            )}
                            {n.gender && (
                              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/15 backdrop-blur">
                                {n.gender === "girl" ? "👧" : n.gender === "boy" ? "👦" : "⚧"}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
}
