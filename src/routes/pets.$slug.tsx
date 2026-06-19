import { createFileRoute, Link } from "@tanstack/react-router";
import { Helmet } from "react-helmet-async";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { useAuth } from "@/hooks/use-auth";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Heart, Share2, ArrowLeft, ArrowRight } from "lucide-react";

type LoaderData = {
  name: Tables<"pet_names"> | null;
  related: Tables<"pet_names">[];
};

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

export const Route = createFileRoute("/pets/$slug")({
  loader: async ({ params: { slug } }): Promise<LoaderData> => {
    const { data: name } = await supabase
      .from("pet_names")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    if (!name) return { name: null, related: [] };

    const { data: related } = await supabase
      .from("pet_names")
      .select("*")
      .eq("pet_type", name.pet_type)
      .neq("slug", slug)
      .order("ai_vibe_score", { ascending: false, nullsFirst: false })
      .order("id", { ascending: true })
      .limit(6);

    return { name, related: (related ?? []) as Tables<"pet_names">[] };
  },
  head: ({ loaderData }) => {
    const name = loaderData?.name;
    if (!name) return { meta: [{ title: "Pet Name Not Found | HeyBaby AI" }] };
    const petType = name.pet_type.charAt(0).toUpperCase() + name.pet_type.slice(1);
    const title = `${name.name} — ${petType} Name Meaning & Pronunciation | HeyBaby AI`;
    const desc = `${name.name}${name.pronunciation ? ` (/${name.pronunciation}/)` : ""} is a ${name.pet_type} name meaning "${name.meaning_short ?? ""}". Find perfect pet names on HeyBaby AI.`;
    const url = `https://www.heybabyai.com/pets/${name.slug}`;
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:url", content: url },
        { property: "og:type", content: "article" },
        { property: "og:site_name", content: "HeyBaby AI" },
        { property: "og:image", content: "https://www.heybabyai.com/og-image.png" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: desc },
        { name: "twitter:image", content: "https://www.heybabyai.com/og-image.png" },
      ],
    };
  },
  component: PetNamePage,
});

function PetNamePage() {
  const { name, related } = Route.useLoaderData();
  const { user } = useAuth();
  const [liked, setLiked] = useState(false);

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
  const emoji    = PET_EMOJI[name.pet_type] ?? "🐾";
  const petType  = name.pet_type.charAt(0).toUpperCase() + name.pet_type.slice(1);
  const title    = `${name.name} — ${petType} Name Meaning & Pronunciation | HeyBaby AI`;
  const desc     = `${name.name}${name.pronunciation ? ` (/${name.pronunciation}/)` : ""} is a ${name.pet_type} name meaning "${name.meaning_short ?? ""}". Find perfect pet names on HeyBaby AI.`;
  const canonicalUrl = `https://www.heybabyai.com/pets/${name.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${name.name} ${petType} Name Meaning and Origin`,
    description: name.meaning_short ?? "",
    about: {
      "@type": "Thing",
      name: name.name,
      description: `${name.pet_type} name meaning ${name.meaning_short ?? ""}`,
    },
  };

  const handleLike = async () => {
    if (!user) { toast.error("Sign in to save names"); return; }
    const newLiked = !liked;
    setLiked(newLiked);
    await supabase.from("pet_swipes").upsert(
      { user_id: user.id, pet_name_id: name.id, liked: newLiked },
      { onConflict: "user_id,pet_name_id" }
    );
    toast.success(newLiked ? `Saved ${name.name}!` : "Removed from saved");
  };

  const handleShare = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({ title: name.name, url }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url);
      toast.success("Link copied!");
    }
  };

  return (
    <div className="min-h-screen">
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={desc} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={desc} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="article" />
        <meta property="og:site_name" content="HeyBaby AI" />
        <meta property="og:image" content="https://www.heybabyai.com/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={desc} />
        <meta name="twitter:image" content="https://www.heybabyai.com/og-image.png" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <Header />
      <div className="max-w-2xl mx-auto px-5 pt-8 pb-32 space-y-5">

        <Link to="/pets/explore" className="inline-flex items-center gap-1.5 text-sm text-ink/60 hover:text-ink transition">
          <ArrowLeft className="w-4 h-4" /> All pet names
        </Link>

        {/* ── Hero ── */}
        <div className="rounded-3xl text-white p-8 text-center" style={{ background: gradient }}>
          <div className="text-[10px] font-extrabold tracking-[0.3em] opacity-70">HEYBABY · PET NAMES</div>
          <h1 className="text-6xl font-extrabold mt-4 tracking-tight">{name.name}</h1>
          {name.pronunciation && (
            <div className="italic mt-2 text-white/90 text-sm">/{name.pronunciation}/</div>
          )}
          <div className="mt-4 flex flex-wrap gap-2 justify-center">
            <span className="glass-chip pill px-3 py-1 text-xs">{emoji} {name.pet_type}</span>
            {name.origin && <span className="glass-chip pill px-3 py-1 text-xs">{name.origin}</span>}
            {name.gender && <span className="glass-chip pill px-3 py-1 text-xs">{name.gender}</span>}
            {name.ai_vibe_score != null && (
              <span className="glass-chip pill px-3 py-1 text-xs">✦ {name.ai_vibe_score}</span>
            )}
          </div>
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

        {/* ── Meaning ── */}
        {name.meaning_short && (
          <Section title="Meaning">
            <p className="text-lg font-semibold">{name.meaning_short}</p>
            {name.meaning_long && (
              <p className="mt-2 text-ink/70 leading-relaxed text-sm">{name.meaning_long}</p>
            )}
          </Section>
        )}

        {/* ── Origin & Culture ── */}
        {name.origin && (
          <Section title="Origin & Culture">
            <p className="text-ink/75">
              <strong>{name.name}</strong> is a {name.gender ? <><strong>{name.gender}</strong> </> : ""}
              {name.pet_type} name of <strong>{name.origin}</strong> origin.
              {name.starting_letter && ` It begins with the letter ${name.starting_letter}.`}
            </p>
          </Section>
        )}

        {/* ── Personality ── */}
        {name.personality && (
          <Section title="Personality">
            <p className="text-base font-semibold capitalize">{name.personality}</p>
          </Section>
        )}

        {/* ── Vibes / Keywords ── */}
        {name.keywords && (
          <Section title="Vibes">
            <div className="flex flex-wrap gap-2">
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
          </Section>
        )}

        {/* ── Swipe CTA ── */}
        <div className="rounded-3xl bg-white border border-black/8 p-6 text-center shadow-sm">
          <p className="text-sm text-ink/65 mb-3">
            Find names you both love — swipe together with your partner.
          </p>
          <Link
            to="/pets/swipe"
            className="inline-flex items-center gap-2 pill grad-primary text-white font-semibold px-6 py-3 text-sm hover:scale-[1.02] transition"
          >
            Swipe pet names free <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* ── Related names ── */}
        {related.length > 0 && (
          <section className="rounded-3xl bg-white p-6 shadow-sm">
            <div className="text-[10px] font-extrabold tracking-widest text-ink/50 uppercase mb-3">
              More {emoji} {name.pet_type} names
            </div>
            <div className="grid grid-cols-1 gap-1">
              {related.map((r) => (
                <Link
                  key={r.id}
                  to="/pets/$slug"
                  params={{ slug: r.slug }}
                  className="flex items-center gap-4 rounded-2xl p-3 hover:bg-black/5 transition"
                >
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl flex-shrink-0"
                    style={{ background: gradient }}
                  >
                    {PET_EMOJI[r.pet_type] ?? "🐾"}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-ink">{r.name}</div>
                    <div className="text-xs text-ink/60 truncate">
                      {r.origin} · {r.pet_type}
                    </div>
                    {r.meaning_short && (
                      <div className="text-xs text-ink/50 truncate">{r.meaning_short}</div>
                    )}
                  </div>
                  <ArrowRight className="w-4 h-4 text-ink/30 flex-shrink-0" />
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

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-3xl bg-white p-6 shadow-sm">
      <div className="text-[10px] font-extrabold tracking-widest text-ink/50 uppercase mb-3">{title}</div>
      {children}
    </section>
  );
}
