import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { useEffect, useRef, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { PetNameCard } from "@/components/PetNameCard";
import { Search, X, SlidersHorizontal } from "lucide-react";
import { z } from "zod";

const search = z.object({ type: z.string().optional(), q: z.string().optional() });

export const Route = createFileRoute("/pets/explore")({
  validateSearch: search,
  head: () => ({ meta: [{ title: "Pet Names — HeyBaby AI" }] }),
  component: PetExplorePage,
});

const PET_TYPES = ["All", "dog", "cat", "bird", "fish", "rabbit", "hamster", "turtle"] as const;
const PET_EMOJI: Record<string, string> = {
  dog: "🐕", cat: "🐈", bird: "🐦", fish: "🐠",
  rabbit: "🐇", hamster: "🐹", turtle: "🐢",
};
const PAGE = 50;

const PET_ORIGINS = [
  "Egyptian", "Greek", "Norse", "Sanskrit", "Celtic",
  "Japanese", "Latin", "English", "French", "Spanish",
  "Arabic", "Native American", "Persian", "Chinese", "Hebrew",
  "Slavic", "African", "Modern", "Italian", "German",
];
const SORT_OPTIONS = [
  { label: "Trending",   value: "desc"  as const },
  { label: "A–Z",        value: "alpha" as const },
  { label: "Rising",     value: "asc"   as const },
];
const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

type PetFilterState = { origin: string[]; letter: string; sort: "desc" | "asc" | "alpha" };
const defaultFilters: PetFilterState = { origin: [], letter: "", sort: "desc" };

function activeFilterCount(f: PetFilterState) {
  return [f.origin.length > 0, f.letter !== "", f.sort !== "desc"].filter(Boolean).length;
}

function PetExplorePage() {
  const { type: typeParam, q: qParam } = Route.useSearch();
  const navigate = Route.useNavigate();

  const [items, setItems]     = useState<Tables<"pet_names">[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset]   = useState(0);
  const [query, setQuery]     = useState(qParam ?? "");
  const [petType, setPetType] = useState(typeParam ?? "All");
  const bottomRef             = useRef<HTMLDivElement>(null);

  const [filters, setFilters]         = useState<PetFilterState>(defaultFilters);
  const [filterOpen, setFilterOpen]   = useState(false);
  const [filterDraft, setFilterDraft] = useState<PetFilterState>(defaultFilters);

  // Sync draft when panel opens
  useEffect(() => {
    if (filterOpen) setFilterDraft(filters);
  }, [filterOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  // Body scroll lock while panel open
  useEffect(() => {
    document.body.style.overflow = filterOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [filterOpen]);

  const fetchNames = useCallback(async (
    off: number, type: string, q: string, f: PetFilterState, replace: boolean
  ) => {
    setLoading(true);
    let qb = supabase.from("pet_names").select("*");

    if (f.sort === "alpha") {
      qb = qb.order("name", { ascending: true });
    } else {
      // Secondary sort by id ensures stable pagination when ai_vibe_score ties
      qb = qb
        .order("ai_vibe_score", { ascending: f.sort === "asc", nullsFirst: false })
        .order("id", { ascending: true });
    }

    qb = qb.range(off, off + PAGE - 1);

    if (type !== "All") qb = qb.eq("pet_type", type);
    if (q.trim()) qb = qb.or(`name.ilike.%${q.trim()}%,meaning_short.ilike.%${q.trim()}%,keywords.ilike.%${q.trim()}%`);
    if (f.origin.length > 0) qb = qb.in("origin", f.origin);
    if (f.letter) qb = qb.eq("starting_letter", f.letter);

    const { data } = await qb;
    const rows = (data ?? []) as Tables<"pet_names">[];
    setItems((prev) => replace ? rows : [...prev, ...rows]);
    setHasMore(rows.length === PAGE);
    setOffset(off + rows.length);
    setLoading(false);
  }, []);

  useEffect(() => {
    setOffset(0);
    setHasMore(true);
    fetchNames(0, petType, query, filters, true);
  }, [petType, query, filters, fetchNames]);

  useEffect(() => {
    if (!bottomRef.current) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && hasMore && !loading) {
        fetchNames(offset, petType, query, filters, false);
      }
    }, { threshold: 0.1 });
    obs.observe(bottomRef.current);
    return () => obs.disconnect();
  }, [hasMore, loading, offset, petType, query, filters, fetchNames]);

  const changeType = (t: string) => {
    setPetType(t);
    navigate({ search: (prev) => ({ ...prev, type: t === "All" ? undefined : t }) });
  };

  const applyFilters = () => {
    setFilters(filterDraft);
    setFilterOpen(false);
  };
  const clearFilters = () => {
    const cleared = defaultFilters;
    setFilters(cleared);
    setFilterDraft(cleared);
    setFilterOpen(false);
  };
  const toggleOrigin = (o: string) =>
    setFilterDraft((d) => ({
      ...d,
      origin: d.origin.includes(o) ? d.origin.filter((x) => x !== o) : [...d.origin, o],
    }));

  const count = activeFilterCount(filters);

  return (
    <div className="min-h-screen">
      <Header />
      <div className="max-w-5xl mx-auto px-5 pt-6 pb-32">

        {/* Header row */}
        <div className="flex items-center justify-between gap-4 mb-5">
          <div>
            <h1 className="text-3xl font-extrabold">Pet Names 🐾</h1>
            <p className="text-sm text-ink/60 mt-0.5">Find the perfect name for your furry friend</p>
          </div>
          <Link to="/pets/swipe" className="pill grad-primary text-white text-sm font-semibold px-5 py-2.5 shrink-0">
            Swipe names
          </Link>
        </div>

        {/* Search */}
        <div className="glass pill flex items-center gap-3 px-4 py-3 mb-4">
          <Search className="w-4 h-4 text-ink/50 shrink-0" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or meaning…"
            className="flex-1 bg-transparent outline-none text-sm"
          />
          {query && (
            <button onClick={() => setQuery("")}>
              <X className="w-4 h-4 text-ink/40" />
            </button>
          )}
        </div>

        {/* Pet type pills + Filters button */}
        <div className="flex items-center gap-2 flex-wrap mb-6">
          {PET_TYPES.map((t) => (
            <button
              key={t}
              onClick={() => changeType(t)}
              className={`pill px-3 py-1.5 text-xs font-semibold transition ${
                petType === t ? "grad-primary text-white" : "bg-white/70 text-ink/70"
              }`}
            >
              {t === "All" ? "All pets" : `${PET_EMOJI[t]} ${t.charAt(0).toUpperCase() + t.slice(1)}s`}
            </button>
          ))}

          <div className="flex-1" />

          {count > 0 && (
            <button
              onClick={clearFilters}
              className="pill px-3 py-1.5 text-xs font-semibold text-ink/60 bg-white/70 hover:bg-white transition flex items-center gap-1"
            >
              <X className="w-3 h-3" /> Clear
            </button>
          )}

          <button
            onClick={() => setFilterOpen(true)}
            className={`pill px-4 py-1.5 text-xs font-semibold transition flex items-center gap-1.5 ${
              count > 0 ? "grad-primary text-white shadow" : "bg-white/70 text-ink/70 hover:bg-white"
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Filters
            {count > 0 && (
              <span className="bg-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center ml-0.5 font-bold">
                {count}
              </span>
            )}
          </button>
        </div>

        {/* Result count */}
        {items.length > 0 && (
          <div className="text-xs font-semibold text-ink/55 mb-3">
            Showing {items.length} pet names
          </div>
        )}

        {/* Grid */}
        {items.length === 0 && !loading && (
          <div className="text-center py-20 text-ink/60">No pet names found — try clearing some filters.</div>
        )}
        <div className="columns-2 sm:columns-3 lg:columns-4 gap-2.5">
          {items.map((n, i) => <PetNameCard key={n.id} name={n} idx={i} />)}
        </div>

        {loading && (
          <div className="flex justify-center py-8">
            <div className="w-6 h-6 border-2 border-ink/20 border-t-ink/60 rounded-full animate-spin" />
          </div>
        )}
        <div ref={bottomRef} className="h-4" />
      </div>

      {/* ── Filter panel ─────────────────────────────────────────────────────── */}
      {filterOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end sm:justify-center sm:items-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setFilterOpen(false)} />
          <div className="relative z-10 bg-[#FEFBF5] rounded-t-3xl sm:rounded-3xl w-full sm:max-w-lg max-h-[88vh] flex flex-col shadow-2xl">

            {/* Header */}
            <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-black/8 shrink-0">
              <h2 className="font-extrabold text-base">Filter pet names</h2>
              <button onClick={() => setFilterOpen(false)} className="p-1.5 rounded-full hover:bg-black/8 transition">
                <X className="w-5 h-5 text-ink/60" />
              </button>
            </div>

            {/* Scrollable sections */}
            <div className="overflow-y-auto overscroll-contain flex-1 px-5 py-5 space-y-7">

              {/* Sort by */}
              <FilterSection title="Sort by">
                <div className="flex flex-wrap gap-2">
                  {SORT_OPTIONS.map(({ label, value }) => (
                    <Chip
                      key={value}
                      active={filterDraft.sort === value}
                      onClick={() => setFilterDraft((d) => ({ ...d, sort: value }))}
                    >
                      {label}
                    </Chip>
                  ))}
                </div>
              </FilterSection>

              {/* Starts with letter */}
              <FilterSection title="Starts with letter">
                <div className="grid grid-cols-7 gap-1.5">
                  {ALPHABET.map((letter) => {
                    const active = filterDraft.letter === letter;
                    return (
                      <button
                        key={letter}
                        onClick={() => setFilterDraft((d) => ({ ...d, letter: d.letter === letter ? "" : letter }))}
                        className={`rounded-xl py-1.5 text-sm font-bold transition ${
                          active ? "text-white" : "bg-white text-ink/70 hover:bg-white/60"
                        }`}
                        style={active ? { background: "linear-gradient(135deg,#1DAFB6,#7928A3)" } : {}}
                      >
                        {letter}
                      </button>
                    );
                  })}
                </div>
              </FilterSection>

              {/* Origin */}
              <FilterSection title="Origin / Culture">
                <div className="flex flex-wrap gap-2">
                  {PET_ORIGINS.map((o) => (
                    <Chip
                      key={o}
                      active={filterDraft.origin.includes(o)}
                      onClick={() => toggleOrigin(o)}
                    >
                      {o}
                    </Chip>
                  ))}
                </div>
              </FilterSection>

            </div>

            {/* Footer */}
            <div className="px-5 py-4 border-t border-black/8 shrink-0 flex gap-3">
              <button
                onClick={() => setFilterDraft(defaultFilters)}
                className="pill px-5 py-3 text-sm font-semibold text-ink/60 bg-white hover:bg-white/80 transition"
              >
                Clear all
              </button>
              <button
                onClick={applyFilters}
                className="flex-1 pill py-3 text-sm font-semibold text-white transition hover:opacity-90"
                style={{ background: "linear-gradient(135deg,#1DAFB6,#7928A3)" }}
              >
                Show results
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[10px] font-extrabold tracking-[0.2em] text-ink/45 uppercase mb-3">{title}</div>
      {children}
    </div>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`pill px-3 py-1.5 text-xs font-semibold transition ${
        active ? "text-white shadow-sm" : "bg-white text-ink/70 hover:bg-white/60"
      }`}
      style={active ? { background: "linear-gradient(135deg,#1DAFB6,#7928A3)" } : {}}
    >
      {children}
    </button>
  );
}
