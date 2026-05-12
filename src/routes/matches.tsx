import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { useAuth } from "@/hooks/use-auth";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { gradientFor } from "@/lib/gradients";
import { NameSheet } from "@/components/NameSheet";

export const Route = createFileRoute("/matches")({
  head: () => ({ meta: [{ title: "Matches — HeyBaby AI" }] }),
  component: MatchesPage,
});

function MatchesPage() {
  const { profile, user } = useAuth();
  const [matches, setMatches] = useState<{ created_at: string; name: Tables<"names"> }[]>([]);
  const [active, setActive] = useState<Tables<"names"> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profile?.room_code) { setLoading(false); return; }
    (async () => {
      const { data } = await supabase
        .from("matches")
        .select("created_at, name:names(*)")
        .eq("room_code", profile.room_code!)
        .order("created_at", { ascending: false });
      setMatches((data as any) ?? []);
      setLoading(false);
    })();
  }, [profile?.room_code]);

  return (
    <div className="min-h-screen">
      <Header />
      <div className="max-w-3xl mx-auto px-5 pt-6 pb-32">
        <h1 className="text-3xl font-extrabold">Your Matches 💕</h1>
        <p className="text-sm text-ink/60 mt-1">Names you and your partner both loved.</p>

        {!user && <Empty title="Sign in to see your matches" cta="/profile" ctaLabel="Sign in" />}
        {user && !profile?.partner_id && <Empty title="Connect your partner first" cta="/profile" ctaLabel="Get your room code" />}
        {user && profile?.partner_id && !loading && matches.length === 0 && (
          <Empty title="No matches yet. Keep swiping!" cta="/swipe" ctaLabel="Start swiping" />
        )}

        <div className="grid sm:grid-cols-2 gap-3 mt-6">
          {matches.map((m, i) => (
            <button key={i} onClick={() => setActive(m.name)}
              className={`${gradientFor(m.name.gradient_index ?? i)} rounded-2xl p-5 text-white text-left shadow hover:scale-[1.01] transition`}>
              <div className="text-xs font-semibold opacity-80">{new Date(m.created_at).toLocaleDateString()}</div>
              <div className="text-3xl font-extrabold mt-2">{m.name.name}</div>
              <div className="text-sm mt-1 opacity-90">{m.name.meaning_short}</div>
              <div className="mt-4 inline-flex pill bg-white/20 backdrop-blur px-3 py-1 text-xs font-semibold">
                Generate AI Report →
              </div>
            </button>
          ))}
        </div>
      </div>
      <NameSheet name={active} onClose={() => setActive(null)} />
      <BottomNav />
    </div>
  );
}

function Empty({ title, cta, ctaLabel }: { title: string; cta: string; ctaLabel: string }) {
  return (
    <div className="text-center py-16">
      <div className="text-ink/60 mb-4">{title}</div>
      <Link to={cta} className="pill grad-primary text-white px-6 py-3 text-sm font-semibold">{ctaLabel}</Link>
    </div>
  );
}
