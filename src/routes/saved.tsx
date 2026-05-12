import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { useAuth } from "@/hooks/use-auth";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { NameCard } from "@/components/NameCard";
import { NameSheet } from "@/components/NameSheet";

export const Route = createFileRoute("/saved")({
  head: () => ({ meta: [{ title: "Saved — HeyBaby AI" }] }),
  component: SavedPage,
});

function SavedPage() {
  const { user } = useAuth();
  const [items, setItems] = useState<Tables<"names">[]>([]);
  const [filter, setFilter] = useState<"All" | "Girl" | "Boy" | "Unisex">("All");
  const [active, setActive] = useState<Tables<"names"> | null>(null);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase
        .from("swipes")
        .select("created_at, name:names(*)")
        .eq("user_id", user.id).eq("liked", true)
        .order("created_at", { ascending: false });
      const names = (data ?? []).map((r: any) => r.name).filter(Boolean) as Tables<"names">[];
      setItems(names);
    })();
  }, [user]);

  const filtered = filter === "All" ? items : items.filter((n) => (n.gender || "").toLowerCase() === filter.toLowerCase());

  return (
    <div className="min-h-screen">
      <Header />
      <div className="max-w-5xl mx-auto px-5 pt-6 pb-32">
        <h1 className="text-3xl font-extrabold">Saved Names ✦</h1>
        <div className="flex gap-2 mt-4">
          {(["All", "Girl", "Boy", "Unisex"] as const).map((g) => (
            <button key={g} onClick={() => setFilter(g)}
              className={`pill px-4 py-1.5 text-xs font-semibold ${filter === g ? "grad-primary text-white" : "bg-white/70 text-ink/70"}`}>
              {g}
            </button>
          ))}
        </div>

        {!user && <div className="text-center py-20 text-ink/60">
          <Link to="/profile" className="pill grad-primary text-white px-6 py-3 text-sm font-semibold">Sign in to save names</Link>
        </div>}

        {user && filtered.length === 0 && (
          <div className="text-center py-20">
            <div className="text-ink/60 mb-4">Nothing saved yet.</div>
            <Link to="/explore" className="pill grad-primary text-white px-6 py-3 text-sm font-semibold">Explore names →</Link>
          </div>
        )}

        <div className="columns-2 sm:columns-3 lg:columns-4 gap-2.5 mt-6">
          {filtered.map((n, i) => <NameCard key={n.id} name={n} idx={i} onClick={() => setActive(n)} />)}
        </div>
      </div>
      <NameSheet name={active} onClose={() => setActive(null)} />
      <BottomNav />
    </div>
  );
}
