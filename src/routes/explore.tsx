import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { SearchAndFilters, defaultFilters, type FilterState } from "@/components/SearchAndFilters";
import { NameCard } from "@/components/NameCard";
import { NameSheet } from "@/components/NameSheet";
import { PetNameCard } from "@/components/PetNameCard";
import { useEffect, useState, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { GuestAuthModal } from "@/components/GuestAuthModal";
import { Search, X } from "lucide-react";
import { z } from "zod";

export const Route = createFileRoute("/explore")({
  validateSearch: z.object({ mode: z.enum(["baby", "pets"]).optional() }),
  head: () => ({ meta: [{ title: "Explore Names — HeyBaby AI" }] }),
  component: Explore,
});

const PAGE = 50;

const PET_TYPES = ["All", "dog", "cat", "bird", "fish", "rabbit", "hamster", "turtle"] as const;
const PET_EMOJI: Record<string, string> = {
  dog: "🐕", cat: "🐈", bird: "🐦", fish: "🐠",
  rabbit: "🐇", hamster: "🐹", turtle: "🐢",
};

const RELIGION_MAP: Record<string, string[]> = {
  hindu:     ["Sanskrit", "Tamil", "Telugu", "Hindi", "Marathi", "Kannada", "Bengali", "Gujarati"],
  muslim:    ["Arabic", "Persian", "Urdu"],
  christian: ["Hebrew", "Greek", "Latin", "English"],
  sikh:      ["Punjabi"],
  buddhist:  ["Sanskrit", "Pali"],
  jewish:    ["Hebrew", "Aramaic"],
};

function Explore() {
  const { mode: modeParam } = Route.useSearch();
  const navigate = Route.useNavigate();
  const mode = modeParam ?? "baby";

  const { user } = useAuth();
  const [authModal, setAuthModal] = useState(false);

  // ── Baby names state (unchanged) ──────────────────────────────────────────
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [names, setNames]     = useState<Tables<"names">[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage]       = useState(0);
  const [done, setDone]       = useState(false);
  const [active, setActive]   = useState<Tables<"names"> | null>(null);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

  useEffect(() => { setNames([]); setPage(0); setDone(false); }, [filters]);

  useEffect(() => {
    if (mode !== "baby") return;
    let cancelled = false;
    setLoading(true);
    (async () => {
      let q = supabase
        .from("names")
        .select("*")
        .order(filters.sort, { ascending: filters.sort === "name", nullsFirst: false })
        .range(page * PAGE, page * PAGE + PAGE - 1);

      if (filters.gender !== "All")
        q = q.ilike("gender", filters.gender);

      if (filters.origin.length > 0) {
        q = q.in("origin", filters.origin);
      } else if (filters.religion !== "") {
        const origins = RELIGION_MAP[filters.religion] ?? [];
        if (origins.length > 0) q = q.in("origin", origins);
      }

      if (filters.letter !== "")
        q = q.eq("starting_letter", filters.letter);

      if (filters.numerology !== null)
        q = q.eq("numerology", filters.numerology);

      if (filters.rasi !== "")
        q = q.ilike("rasi", `%${filters.rasi}%`);

      if (filters.q.trim()) {
        const term = `%${filters.q.trim()}%`;
        q = q.or(
          `name.ilike.${term},meaning_short.ilike.${term},` +
          `keywords.ilike.${term},origin.ilike.${term}`
        );
      }

      const { data, error } = await q;
      if (cancelled) return;
      if (error) { toast.error(error.message); setLoading(false); return; }
      setNames((prev) => page === 0 ? (data ?? []) : [...prev, ...(data ?? [])]);
      if (!data || data.length < PAGE) setDone(true);
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [filters, page, mode]);

  useEffect(() => {
    const onScroll = () => {
      if (mode !== "baby" || loading || done) return;
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 800)
        setPage((p) => p + 1);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [loading, done, mode]);

  useEffect(() => {
    if (!user) return;
    supabase.from("swipes").select("name_id").eq("user_id", user.id).eq("liked", true)
      .then(({ data }) => setSavedIds(new Set((data ?? []).map((r: any) => r.name_id))));
  }, [user?.id]);

  const save = async (n: Tables<"names">) => {
    const { data: { user: freshUser } } = await supabase.auth.getUser();
    if (!freshUser) { setAuthModal(true); return; }
    const { error } = await supabase.from("swipes").upsert(
      { user_id: freshUser.id, name_id: n.id, liked: true },
      { onConflict: "user_id,name_id" }
    );
    if (error) {
      toast.error(error.message);
    } else {
      setSavedIds((prev) => new Set<string>([...prev, n.id]));
      toast.success(`Saved ${n.name} ✦`);
    }
  };

  // ── Pet names state ───────────────────────────────────────────────────────
  const [petNames, setPetNames]     = useState<Tables<"pet_names">[]>([]);
  const [petLoading, setPetLoading] = useState(false);
  const [petHasMore, setPetHasMore] = useState(true);
  const [petOffset, setPetOffset]   = useState(0);
  const [petQuery, setPetQuery]     = useState("");
  const [petType, setPetType]       = useState("All");
  const petBottomRef                = useRef<HTMLDivElement>(null);
  const petFetchingRef              = useRef(false);

  const fetchPetNames = useCallback(async (
    off: number, type: string, q: string, replace: boolean
  ) => {
    if (petFetchingRef.current) return;
    petFetchingRef.current = true;
    setPetLoading(true);
    try {
      let qb = supabase
        .from("pet_names")
        .select("*")
        .order("ai_vibe_score", { ascending: false, nullsFirst: false })
        .order("id", { ascending: true })
        .range(off, off + PAGE - 1);
      if (type !== "All") qb = qb.eq("pet_type", type);
      if (q.trim())
        qb = qb.or(`name.ilike.%${q.trim()}%,meaning_short.ilike.%${q.trim()}%,keywords.ilike.%${q.trim()}%`);
      const { data } = await qb;
      const rows = (data ?? []) as Tables<"pet_names">[];
      setPetNames((prev) => {
        const combined = replace ? rows : [...prev, ...rows];
        const seen = new Set<string>();
        return combined.filter((n) => {
          if (seen.has(n.id)) return false;
          seen.add(n.id);
          return true;
        });
      });
      setPetHasMore(rows.length === PAGE);
      setPetOffset(off + rows.length);
    } finally {
      setPetLoading(false);
      petFetchingRef.current = false;
    }
  }, []);

  useEffect(() => {
    if (mode !== "pets") return;
    petFetchingRef.current = false;
    setPetOffset(0);
    setPetHasMore(true);
    fetchPetNames(0, petType, petQuery, true);
  }, [petType, petQuery, mode, fetchPetNames]);

  useEffect(() => {
    if (!petBottomRef.current || mode !== "pets") return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && petHasMore && !petLoading)
        fetchPetNames(petOffset, petType, petQuery, false);
    }, { threshold: 0.1 });
    obs.observe(petBottomRef.current);
    return () => obs.disconnect();
  }, [petHasMore, petLoading, petOffset, petType, petQuery, mode, fetchPetNames]);

  const setMode = (m: "baby" | "pets") =>
    navigate({ search: () => ({ mode: m === "baby" ? undefined : m }) });

  return (
    <div className="min-h-screen">
      <Header />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 pb-32">

        {/* ── Baby / Pet toggle ──────────────────────────────────────────────── */}
        <div className="flex justify-center mb-6">
          <div className="glass pill flex p-1 gap-0.5">
            <button
              onClick={() => setMode("baby")}
              className={`pill px-5 py-2 text-sm font-semibold transition ${
                mode === "baby" ? "grad-primary text-white shadow-sm" : "text-ink/60 hover:text-ink"
              }`}
            >
              👶 Baby Names
            </button>
            <button
              onClick={() => setMode("pets")}
              className={`pill px-5 py-2 text-sm font-semibold transition ${
                mode === "pets" ? "grad-primary text-white shadow-sm" : "text-ink/60 hover:text-ink"
              }`}
            >
              🐾 Pet Names
            </button>
          </div>
        </div>

        {/* ── Baby names mode ────────────────────────────────────────────────── */}
        {mode === "baby" && (
          <>
            <SearchAndFilters state={filters} onChange={setFilters} />

            <div className="text-xs font-semibold text-ink/55 mt-4">
              {loading && page === 0
                ? "Searching…"
                : done && names.length === 0
                  ? "No names found — try clearing some filters"
                  : `Showing ${names.length} names`}
            </div>

            <div className="columns-2 sm:columns-3 lg:columns-4 gap-2.5 mt-4">
              {names.map((n, i) => (
                <NameCard key={n.id} name={n} idx={i} onClick={() => setActive(n)} />
              ))}
            </div>

            {loading && (
              <div className="columns-2 sm:columns-3 lg:columns-4 gap-2.5 mt-2">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="rounded-2xl bg-white/60 mb-2.5 shimmer" style={{ height: 160 + (i % 3) * 30 }} />
                ))}
              </div>
            )}
          </>
        )}

        {/* ── Pet names mode ─────────────────────────────────────────────────── */}
        {mode === "pets" && (
          <>
            {/* Search */}
            <div className="glass pill flex items-center gap-3 px-4 py-3 mb-4">
              <Search className="w-4 h-4 text-ink/50 shrink-0" />
              <input
                value={petQuery}
                onChange={(e) => setPetQuery(e.target.value)}
                placeholder="Search by name or meaning…"
                className="flex-1 bg-transparent outline-none text-sm"
              />
              {petQuery && (
                <button onClick={() => setPetQuery("")}>
                  <X className="w-4 h-4 text-ink/40" />
                </button>
              )}
            </div>

            {/* Pet type filter */}
            <div className="flex gap-2 flex-wrap mb-5">
              {PET_TYPES.map((t) => (
                <button
                  key={t}
                  onClick={() => setPetType(t)}
                  className={`pill px-3 py-1.5 text-xs font-semibold transition ${
                    petType === t ? "grad-primary text-white" : "bg-white/70 text-ink/70"
                  }`}
                >
                  {t === "All"
                    ? "🐾 All pets"
                    : `${PET_EMOJI[t]} ${t.charAt(0).toUpperCase() + t.slice(1)}s`}
                </button>
              ))}
            </div>

            {/* Count + swipe shortcut */}
            <div className="flex items-center justify-between mb-4">
              <div className="text-xs font-semibold text-ink/55">
                {petLoading && petOffset === 0
                  ? "Searching…"
                  : petNames.length === 0 && !petLoading
                    ? "No pet names found"
                    : `Showing ${petNames.length} pet names`}
              </div>
              <Link
                to="/pets/swipe"
                className="pill grad-primary text-white text-xs font-semibold px-4 py-1.5"
              >
                Swipe names →
              </Link>
            </div>

            {/* Grid */}
            <div className="columns-2 sm:columns-3 lg:columns-4 gap-2.5">
              {petNames.map((n, i) => <PetNameCard key={n.id} name={n} idx={i} />)}
            </div>

            {petLoading && (
              <div className="flex justify-center py-8">
                <div className="w-6 h-6 border-2 border-ink/20 border-t-ink/60 rounded-full animate-spin" />
              </div>
            )}
            <div ref={petBottomRef} className="h-4" />
          </>
        )}
      </div>

      <NameSheet name={active} onClose={() => setActive(null)} onSave={save} saved={savedIds.has(active?.id ?? "")} />
      <GuestAuthModal
        open={authModal}
        onClose={() => setAuthModal(false)}
        heading="Save this name"
        body="Create a free account to save names and swipe with your partner"
      />
      <BottomNav />
    </div>
  );
}
