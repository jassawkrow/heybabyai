import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { SearchAndFilters, defaultFilters, type FilterState } from "@/components/SearchAndFilters";
import { NameCard } from "@/components/NameCard";
import { NameSheet } from "@/components/NameSheet";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { GuestAuthModal } from "@/components/GuestAuthModal";

export const Route = createFileRoute("/explore")({
  head: () => ({ meta: [{ title: "Explore Names — HeyBaby AI" }] }),
  component: Explore,
});

const PAGE = 50;

const RELIGION_MAP: Record<string, string[]> = {
  hindu:    ["Sanskrit", "Tamil", "Telugu", "Hindi", "Marathi", "Kannada", "Bengali", "Gujarati"],
  muslim:   ["Arabic", "Persian", "Urdu"],
  christian:["Hebrew", "Greek", "Latin", "English"],
  sikh:     ["Punjabi"],
  buddhist: ["Sanskrit", "Pali"],
  jewish:   ["Hebrew", "Aramaic"],
};

function Explore() {
  const { user } = useAuth();
  const [authModal, setAuthModal] = useState(false);
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [names, setNames]     = useState<Tables<"names">[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage]       = useState(0);
  const [done, setDone]       = useState(false);
  const [active, setActive]   = useState<Tables<"names"> | null>(null);

  useEffect(() => { setNames([]); setPage(0); setDone(false); }, [filters]);

  useEffect(() => {
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
        const religionOrigins = RELIGION_MAP[filters.religion] ?? [];
        if (religionOrigins.length > 0) q = q.in("origin", religionOrigins);
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
  }, [filters, page]);

  useEffect(() => {
    const onScroll = () => {
      if (loading || done) return;
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 800)
        setPage((p) => p + 1);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [loading, done]);

  const [savedIds, setSavedIds] = useState<Set<number>>(new Set());

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
      setSavedIds((prev) => new Set([...prev, n.id]));
      toast.success(`Saved ${n.name} ✦`);
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 pb-32">
        <SearchAndFilters state={filters} onChange={setFilters} />

        {/* Result count */}
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
      </div>

      <NameSheet name={active} onClose={() => setActive(null)} onSave={save} saved={savedIds.has(active?.id ?? 0)} />
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
