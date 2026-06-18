import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { useEffect, useRef, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { PetNameCard } from "@/components/PetNameCard";
import { Search, X } from "lucide-react";
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

function PetExplorePage() {
  const { type: typeParam, q: qParam } = Route.useSearch();
  const navigate = Route.useNavigate();

  const [items, setItems] = useState<Tables<"pet_names">[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const [query, setQuery] = useState(qParam ?? "");
  const [petType, setPetType] = useState(typeParam ?? "All");
  const bottomRef = useRef<HTMLDivElement>(null);

  const fetchNames = useCallback(async (off: number, type: string, q: string, replace: boolean) => {
    setLoading(true);
    let qb = supabase
      .from("pet_names")
      .select("*")
      .order("ai_vibe_score", { ascending: false, nullsFirst: false })
      .range(off, off + PAGE - 1);

    if (type !== "All") qb = qb.eq("pet_type", type);
    if (q.trim()) {
      qb = qb.or(`name.ilike.%${q.trim()}%,meaning_short.ilike.%${q.trim()}%,keywords.ilike.%${q.trim()}%`);
    }

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
    fetchNames(0, petType, query, true);
  }, [petType, query]);

  useEffect(() => {
    if (!bottomRef.current) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && hasMore && !loading) {
        fetchNames(offset, petType, query, false);
      }
    }, { threshold: 0.1 });
    obs.observe(bottomRef.current);
    return () => obs.disconnect();
  }, [hasMore, loading, offset, petType, query, fetchNames]);

  const changeType = (t: string) => {
    setPetType(t);
    navigate({ search: (prev) => ({ ...prev, type: t === "All" ? undefined : t }) });
  };

  return (
    <div className="min-h-screen">
      <Header />
      <div className="max-w-5xl mx-auto px-5 pt-6 pb-32">
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

        {/* Pet type filter */}
        <div className="flex gap-2 flex-wrap mb-6">
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
        </div>

        {/* Grid */}
        {items.length === 0 && !loading && (
          <div className="text-center py-20 text-ink/60">No pet names found.</div>
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
      <BottomNav />
    </div>
  );
}
