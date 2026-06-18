import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { useAuth } from "@/hooks/use-auth";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { NameCard } from "@/components/NameCard";
import { NameSheet } from "@/components/NameSheet";
import { PetNameCard } from "@/components/PetNameCard";
import { z } from "zod";

const search = z.object({ tab: z.enum(["baby", "pets"]).optional() });

export const Route = createFileRoute("/saved")({
  validateSearch: search,
  head: () => ({ meta: [{ title: "Saved — HeyBaby AI" }] }),
  component: SavedPage,
});

function SavedPage() {
  const { tab: tabParam } = Route.useSearch();
  const navigate = Route.useNavigate();
  const { user } = useAuth();
  const activeTab = tabParam ?? "baby";

  const [babyItems, setBabyItems] = useState<Tables<"names">[]>([]);
  const [petItems, setPetItems] = useState<Tables<"pet_names">[]>([]);
  const [filter, setFilter] = useState<"All" | "Girl" | "Boy" | "Unisex">("All");
  const [active, setActive] = useState<Tables<"names"> | null>(null);

  useEffect(() => {
    if (!user) return;
    if (activeTab === "baby") {
      (async () => {
        const { data } = await supabase
          .from("swipes")
          .select("name_id, names(*)")
          .eq("user_id", user.id)
          .eq("liked", true)
          .order("created_at", { ascending: false });
        const names = (data ?? []).map((r: any) => r.names).filter(Boolean) as Tables<"names">[];
        setBabyItems(names);
      })();
    } else {
      (async () => {
        const { data } = await supabase
          .from("pet_swipes")
          .select("pet_name_id, pet_names(*)")
          .eq("user_id", user.id)
          .eq("liked", true)
          .order("created_at", { ascending: false });
        const names = (data ?? []).map((r: any) => r.pet_names).filter(Boolean) as Tables<"pet_names">[];
        setPetItems(names);
      })();
    }
  }, [user, activeTab]);

  const filteredBaby = filter === "All"
    ? babyItems
    : babyItems.filter((n) => (n.gender || "").toLowerCase() === filter.toLowerCase());

  return (
    <div className="min-h-screen">
      <Header />
      <div className="max-w-5xl mx-auto px-5 pt-6 pb-32">
        <h1 className="text-3xl font-extrabold">Saved Names ✦</h1>

        {/* Tab switcher */}
        <div className="flex gap-2 mt-4 mb-5">
          <button
            onClick={() => navigate({ search: () => ({ tab: "baby" }) })}
            className={`pill px-5 py-2 text-sm font-semibold transition ${activeTab === "baby" ? "grad-primary text-white" : "bg-white/70 text-ink/70"}`}
          >
            Baby Names
          </button>
          <button
            onClick={() => navigate({ search: () => ({ tab: "pets" }) })}
            className={`pill px-5 py-2 text-sm font-semibold transition ${activeTab === "pets" ? "grad-primary text-white" : "bg-white/70 text-ink/70"}`}
          >
            Pet Names 🐾
          </button>
        </div>

        {/* Baby names tab */}
        {activeTab === "baby" && (
          <>
            <div className="flex gap-2 mb-4">
              {(["All", "Girl", "Boy", "Unisex"] as const).map((g) => (
                <button key={g} onClick={() => setFilter(g)}
                  className={`pill px-4 py-1.5 text-xs font-semibold ${filter === g ? "grad-primary text-white" : "bg-white/70 text-ink/70"}`}>
                  {g}
                </button>
              ))}
            </div>

            {!user && (
              <div className="text-center py-20 text-ink/60">
                <Link to="/profile" className="pill grad-primary text-white px-6 py-3 text-sm font-semibold">Sign in to save names</Link>
              </div>
            )}

            {user && filteredBaby.length === 0 && (
              <div className="text-center py-20">
                <div className="text-ink/60 mb-4">Nothing saved yet.</div>
                <Link to="/explore" className="pill grad-primary text-white px-6 py-3 text-sm font-semibold">Explore names →</Link>
              </div>
            )}

            <div className="columns-2 sm:columns-3 lg:columns-4 gap-2.5">
              {filteredBaby.map((n, i) => <NameCard key={n.id} name={n} idx={i} onClick={() => setActive(n)} />)}
            </div>
          </>
        )}

        {/* Pet names tab */}
        {activeTab === "pets" && (
          <>
            {!user && (
              <div className="text-center py-20 text-ink/60">
                <Link to="/profile" className="pill grad-primary text-white px-6 py-3 text-sm font-semibold">Sign in to save pet names</Link>
              </div>
            )}

            {user && petItems.length === 0 && (
              <div className="text-center py-20">
                <div className="text-5xl mb-4">🐾</div>
                <div className="text-ink/60 mb-4">No pet names saved yet.</div>
                <Link to="/pets/explore" className="pill grad-primary text-white px-6 py-3 text-sm font-semibold">Browse pet names →</Link>
              </div>
            )}

            <div className="columns-2 sm:columns-3 lg:columns-4 gap-2.5">
              {petItems.map((n, i) => <PetNameCard key={n.id} name={n} idx={i} />)}
            </div>
          </>
        )}
      </div>

      <NameSheet name={active} onClose={() => setActive(null)} />
      <BottomNav />
    </div>
  );
}
