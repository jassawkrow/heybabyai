import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { Heart, Share2, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/pets/$slug")({
  head: ({ params }) => ({
    meta: [{ title: `${params.slug.split("-")[0]} Pet Name — HeyBaby AI` }],
  }),
  component: PetNamePage,
});

const PET_GRADIENTS: Record<string, string> = {
  dog:     "linear-gradient(135deg, #F97316, #C2410C)",
  cat:     "linear-gradient(135deg, #8B5CF6, #6D28D9)",
  bird:    "linear-gradient(135deg, #EAB308, #16A34A)",
  fish:    "linear-gradient(135deg, #0EA5E9, #0D9488)",
  rabbit:  "linear-gradient(135deg, #EC4899, #9333EA)",
  hamster: "linear-gradient(135deg, #F97316, #FBBF24)",
  turtle:  "linear-gradient(135deg, #22C55E, #065F46)",
};

const PET_EMOJI: Record<string, string> = {
  dog: "🐕", cat: "🐈", bird: "🐦", fish: "🐠",
  rabbit: "🐇", hamster: "🐹", turtle: "🐢",
};

function PetNamePage() {
  const { slug } = Route.useParams();
  const { user } = useAuth();
  const [name, setName] = useState<Tables<"pet_names"> | null>(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [related, setRelated] = useState<Tables<"pet_names">[]>([]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data } = await supabase
        .from("pet_names")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();
      setName(data as Tables<"pet_names"> | null);
      setLoading(false);

      if (data) {
        const { data: rel } = await supabase
          .from("pet_names")
          .select("*")
          .eq("pet_type", data.pet_type)
          .neq("slug", slug)
          .order("ai_vibe_score", { ascending: false })
          .limit(6);
        setRelated((rel ?? []) as Tables<"pet_names">[]);
      }
    })();
  }, [slug]);

  useEffect(() => {
    if (!user || !name) return;
    supabase
      .from("pet_swipes")
      .select("liked")
      .eq("user_id", user.id)
      .eq("pet_name_id", name.id)
      .maybeSingle()
      .then(({ data }) => { if (data) setLiked(data.liked); });
  }, [user, name?.id]);

  async function handleLike() {
    if (!user) {
      toast.error("Sign in to save names");
      return;
    }
    if (!name) return;
    const newLiked = !liked;
    setLiked(newLiked);
    await supabase.from("pet_swipes").upsert(
      { user_id: user.id, pet_name_id: name.id, liked: newLiked },
      { onConflict: "user_id,pet_name_id" }
    );
    toast.success(newLiked ? `Saved ${name.name}!` : "Removed from saved");
  }

  function handleShare() {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied!");
  }

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="flex items-center justify-center py-32">
          <div className="w-8 h-8 border-2 border-ink/20 border-t-ink/60 rounded-full animate-spin" />
        </div>
        <BottomNav />
      </div>
    );
  }

  if (!name) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="max-w-lg mx-auto px-5 pt-16 text-center">
          <div className="text-5xl mb-4">🐾</div>
          <h1 className="text-2xl font-extrabold">Pet name not found</h1>
          <Link to="/pets/explore" className="mt-6 inline-block pill grad-primary text-white px-6 py-3 text-sm font-semibold">
            Browse all pet names →
          </Link>
        </div>
        <BottomNav />
      </div>
    );
  }

  const gradient = PET_GRADIENTS[name.pet_type] ?? PET_GRADIENTS.dog;
  const emoji = PET_EMOJI[name.pet_type] ?? "🐾";

  return (
    <div className="min-h-screen">
      <Header />
      <div className="max-w-2xl mx-auto px-5 pt-6 pb-32">
        <Link to="/pets/explore" className="inline-flex items-center gap-1.5 text-sm text-ink/60 hover:text-ink mb-6 transition">
          <ArrowLeft className="w-4 h-4" /> All pet names
        </Link>

        {/* Hero card */}
        <div
          className="rounded-3xl text-white p-8 text-center mb-6 shadow-xl"
          style={{ background: gradient }}
        >
          <div className="text-4xl mb-2">{emoji}</div>
          <div className="text-xs font-bold tracking-widest opacity-75 uppercase mb-3">
            {name.pet_type} name
          </div>
          <h1 className="text-6xl font-extrabold leading-tight">{name.name}</h1>
          {name.origin && (
            <div className="mt-3 text-white/75 text-sm">{name.origin} origin</div>
          )}
          {name.ai_vibe_score != null && (
            <div className="mt-2 inline-block glass-chip pill px-3 py-1 text-sm">
              ✦ {name.ai_vibe_score} vibe score
            </div>
          )}
          <div className="mt-5 flex gap-3 justify-center">
            <button
              onClick={handleLike}
              className={`pill px-5 py-2.5 text-sm font-semibold flex items-center gap-2 transition ${
                liked ? "bg-white text-pink-500" : "bg-white/20 text-white"
              }`}
            >
              <Heart className={`w-4 h-4 ${liked ? "fill-pink-500" : ""}`} />
              {liked ? "Saved!" : "Save name"}
            </button>
            <button
              onClick={handleShare}
              className="pill bg-white/20 px-5 py-2.5 text-sm font-semibold text-white flex items-center gap-2"
            >
              <Share2 className="w-4 h-4" /> Share
            </button>
          </div>
        </div>

        {/* Detail sections */}
        <div className="space-y-4">
          {name.meaning_short && (
            <section className="rounded-3xl bg-white p-6">
              <div className="text-[10px] font-extrabold tracking-widest text-ink/50 uppercase">The Name</div>
              <p className="mt-3 text-lg font-semibold">{name.meaning_short}</p>
              {name.meaning_long && (
                <p className="mt-2 text-ink/70 leading-relaxed text-sm">{name.meaning_long}</p>
              )}
            </section>
          )}

          {name.personality && (
            <section className="rounded-3xl bg-white p-6">
              <div className="text-[10px] font-extrabold tracking-widest text-ink/50 uppercase">Personality</div>
              <p className="mt-3 text-base font-semibold capitalize">{name.personality}</p>
            </section>
          )}

          {name.keywords && (
            <section className="rounded-3xl bg-white p-6">
              <div className="text-[10px] font-extrabold tracking-widest text-ink/50 uppercase">Vibes</div>
              <div className="mt-3 flex flex-wrap gap-2">
                {name.keywords.split(",").map((k, i) => (
                  <span
                    key={i}
                    className="pill px-3 py-1 text-xs font-semibold text-white"
                    style={{ background: gradient }}
                  >
                    {k.trim()}
                  </span>
                ))}
              </div>
            </section>
          )}

          <section className="rounded-3xl bg-white p-6">
            <div className="text-[10px] font-extrabold tracking-widest text-ink/50 uppercase">Details</div>
            <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-2xl bg-cream p-3">
                <div className="text-[10px] font-bold text-ink/50 uppercase">Type</div>
                <div className="font-semibold mt-0.5 capitalize">{name.pet_type}</div>
              </div>
              <div className="rounded-2xl bg-cream p-3">
                <div className="text-[10px] font-bold text-ink/50 uppercase">Origin</div>
                <div className="font-semibold mt-0.5">{name.origin}</div>
              </div>
              {name.gender && (
                <div className="rounded-2xl bg-cream p-3">
                  <div className="text-[10px] font-bold text-ink/50 uppercase">Gender</div>
                  <div className="font-semibold mt-0.5 capitalize">{name.gender}</div>
                </div>
              )}
              {name.starting_letter && (
                <div className="rounded-2xl bg-cream p-3">
                  <div className="text-[10px] font-bold text-ink/50 uppercase">Starts with</div>
                  <div className="font-semibold mt-0.5">{name.starting_letter}</div>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Related names */}
        {related.length > 0 && (
          <section className="mt-8">
            <h2 className="text-xl font-extrabold mb-4">
              More {emoji} {name.pet_type} names
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {related.map((r) => (
                <Link
                  key={r.id}
                  to="/pets/$slug"
                  params={{ slug: r.slug }}
                  className="rounded-2xl text-white p-4 font-bold text-lg hover:scale-[1.03] transition-transform"
                  style={{ background: gradient }}
                >
                  {r.name}
                  {r.meaning_short && (
                    <div className="text-white/70 text-xs font-normal mt-0.5 line-clamp-1">{r.meaning_short}</div>
                  )}
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
      <BottomNav />
    </div>
  );
}
