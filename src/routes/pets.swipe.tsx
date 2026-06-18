import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { useEffect, useState, useRef } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { Heart, X, RotateCcw } from "lucide-react";

export const Route = createFileRoute("/pets/swipe")({
  head: () => ({ meta: [{ title: "Swipe Pet Names — HeyBaby AI" }] }),
  component: PetSwipePage,
});

const PET_TYPES = ["dog", "cat", "bird", "fish", "rabbit", "hamster", "turtle"] as const;
type PetType = (typeof PET_TYPES)[number];

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

function PetSwipePage() {
  const { user, profile } = useAuth();
  const [petType, setPetType] = useState<PetType>("dog");
  const [deck, setDeck] = useState<Tables<"pet_names">[]>([]);
  const [idx, setIdx] = useState(0);
  const [swiped, setSwiped] = useState(0);
  const [match, setMatch] = useState<Tables<"pet_names"> | null>(null);

  useEffect(() => {
    loadDeck(petType);
  }, [petType, user]);

  async function loadDeck(type: PetType) {
    setIdx(0);
    setSwiped(0);

    let swiped_ids: string[] = [];
    if (user) {
      const { data } = await supabase
        .from("pet_swipes")
        .select("pet_name_id")
        .eq("user_id", user.id);
      swiped_ids = (data ?? []).map((r: any) => r.pet_name_id);
    }

    let qb = supabase
      .from("pet_names")
      .select("*")
      .eq("pet_type", type)
      .order("ai_vibe_score", { ascending: false, nullsFirst: false })
      .limit(100);

    if (swiped_ids.length > 0) qb = qb.not("id", "in", `(${swiped_ids.join(",")})`);

    const { data } = await qb;
    setDeck((data ?? []) as Tables<"pet_names">[]);
  }

  async function handleSwipe(liked: boolean) {
    const name = deck[idx];
    if (!name) return;

    if (user) {
      await supabase.from("pet_swipes").upsert(
        { user_id: user.id, pet_name_id: name.id, liked },
        { onConflict: "user_id,pet_name_id" }
      );

      if (liked && profile?.room_code) {
        const partnerSwipe = await supabase
          .from("pet_swipes")
          .select("id")
          .eq("pet_name_id", name.id)
          .eq("liked", true)
          .neq("user_id", user.id)
          .maybeSingle();

        if (partnerSwipe.data) {
          await supabase.from("pet_matches").upsert(
            { room_code: profile.room_code, pet_name_id: name.id },
            { onConflict: "room_code,pet_name_id" }
          );
          setMatch(name);
        }
      }
    }

    setIdx((i) => i + 1);
    setSwiped((s) => s + 1);
  }

  const currentName = deck[idx] ?? null;
  const nextName = deck[idx + 1] ?? null;
  const done = idx >= deck.length && deck.length > 0;

  return (
    <div className="min-h-screen">
      <Header />
      <div className="max-w-lg mx-auto px-5 pt-6 pb-32">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-extrabold">Pet Name Swipe 🐾</h1>
          <p className="text-sm text-ink/60 mt-1">Right = love it, left = pass</p>
        </div>

        {/* Pet type selector */}
        <div className="flex gap-2 flex-wrap justify-center mb-6">
          {PET_TYPES.map((t) => (
            <button
              key={t}
              onClick={() => setPetType(t)}
              className={`pill px-3 py-1.5 text-xs font-semibold transition ${
                petType === t ? "text-white" : "bg-white/70 text-ink/70"
              }`}
              style={petType === t ? { background: PET_GRADIENTS[t] } : undefined}
            >
              {PET_EMOJI[t]} {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* Swipe counter */}
        {deck.length > 0 && (
          <div className="text-center text-xs text-ink/50 mb-4">
            {Math.min(idx, deck.length)} / {deck.length} names seen
          </div>
        )}

        {/* Card stack */}
        <div className="relative h-[460px] flex items-center justify-center">
          {/* Background card (next) */}
          {nextName && (
            <div
              className="absolute inset-0 rounded-3xl text-white flex flex-col items-center justify-center scale-[0.95] opacity-70"
              style={{ background: PET_GRADIENTS[nextName.pet_type] ?? PET_GRADIENTS.dog }}
            />
          )}

          {/* Active card */}
          {currentName && !done ? (
            <PetSwipeCard key={currentName.id} name={currentName} onSwipe={handleSwipe} />
          ) : done ? (
            <div className="text-center py-16 space-y-4">
              <div className="text-5xl">🎉</div>
              <h3 className="text-xl font-extrabold">You've seen all {petType} names!</h3>
              <p className="text-ink/60 text-sm">{swiped} names reviewed</p>
              <div className="flex gap-3 justify-center">
                <button onClick={() => loadDeck(petType)} className="pill bg-white border border-black/10 px-5 py-2.5 text-sm font-semibold flex items-center gap-2">
                  <RotateCcw className="w-4 h-4" /> Reset
                </button>
                <Link to="/pets/explore" className="pill grad-primary text-white px-5 py-2.5 text-sm font-semibold">
                  Explore all →
                </Link>
              </div>
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-8 h-8 border-2 border-ink/20 border-t-ink/60 rounded-full animate-spin mx-auto mb-4" />
              <p className="text-ink/60 text-sm">Loading pet names…</p>
            </div>
          )}
        </div>

        {/* Buttons */}
        {currentName && !done && (
          <div className="flex justify-center gap-6 mt-6">
            <button
              onClick={() => handleSwipe(false)}
              className="w-16 h-16 rounded-full bg-white border-2 border-red-200 flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition"
            >
              <X className="w-6 h-6 text-red-400" />
            </button>
            <button
              onClick={() => handleSwipe(true)}
              className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition"
              style={{ background: PET_GRADIENTS[petType] }}
            >
              <Heart className="w-6 h-6 text-white" />
            </button>
          </div>
        )}

        {!user && (
          <p className="text-center text-xs text-ink/50 mt-6">
            <Link to="/profile" className="underline text-purple">Sign in</Link> to save your swipes and match with your partner
          </p>
        )}
      </div>

      {/* Match overlay */}
      {match && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setMatch(null)}>
          <div
            className="rounded-3xl p-8 text-white text-center max-w-xs mx-4 shadow-2xl"
            style={{ background: PET_GRADIENTS[match.pet_type] ?? PET_GRADIENTS.dog }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-5xl mb-3">{PET_EMOJI[match.pet_type] ?? "🐾"}</div>
            <div className="text-xs font-bold tracking-widest opacity-80 mb-2">PET NAME MATCH!</div>
            <h2 className="text-4xl font-extrabold">{match.name}</h2>
            {match.meaning_short && <p className="mt-2 text-white/80 text-sm">{match.meaning_short}</p>}
            <p className="mt-3 text-white/70 text-xs">You and your partner both love this name!</p>
            <button
              onClick={() => setMatch(null)}
              className="mt-5 pill bg-white/20 px-6 py-2.5 text-sm font-semibold"
            >
              Keep swiping
            </button>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}

function PetSwipeCard({
  name,
  onSwipe,
}: {
  name: Tables<"pet_names">;
  onSwipe: (liked: boolean) => void;
}) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-18, 18]);
  const loveOpacity = useTransform(x, [30, 100], [0, 1]);
  const passOpacity = useTransform(x, [-100, -30], [1, 0]);
  const gradient = PET_GRADIENTS[name.pet_type] ?? PET_GRADIENTS.dog;
  const emoji = PET_EMOJI[name.pet_type] ?? "🐾";

  function handleDragEnd(_: any, info: any) {
    if (info.offset.x > 100) {
      animate(x, 500, { duration: 0.3 }).then(() => onSwipe(true));
    } else if (info.offset.x < -100) {
      animate(x, -500, { duration: 0.3 }).then(() => onSwipe(false));
    } else {
      animate(x, 0, { type: "spring", stiffness: 300 });
    }
  }

  return (
    <motion.div
      className="absolute inset-0 rounded-3xl text-white cursor-grab active:cursor-grabbing select-none flex flex-col justify-between p-7 shadow-2xl"
      style={{ x, rotate, background: gradient }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.8}
      onDragEnd={handleDragEnd}
    >
      {/* LOVE overlay */}
      <motion.div
        className="absolute top-8 left-7 border-4 border-green-300 rounded-xl px-4 py-2"
        style={{ opacity: loveOpacity, rotate: -12 }}
      >
        <span className="text-green-300 font-extrabold text-xl tracking-widest">LOVE</span>
      </motion.div>
      {/* PASS overlay */}
      <motion.div
        className="absolute top-8 right-7 border-4 border-red-300 rounded-xl px-4 py-2"
        style={{ opacity: passOpacity, rotate: 12 }}
      >
        <span className="text-red-300 font-extrabold text-xl tracking-widest">PASS</span>
      </motion.div>

      <div className="flex items-center gap-2 text-sm font-semibold opacity-80">
        <span className="text-2xl">{emoji}</span>
        <span>{name.pet_type.charAt(0).toUpperCase() + name.pet_type.slice(1)} name</span>
        {name.ai_vibe_score != null && (
          <span className="ml-auto glass-chip pill px-2 py-0.5 text-xs">✦ {name.ai_vibe_score}</span>
        )}
      </div>

      <div className="text-center">
        <div className="text-6xl font-extrabold leading-tight">{name.name}</div>
        {name.origin && (
          <div className="mt-2 text-white/70 text-sm italic">{name.origin} origin</div>
        )}
      </div>

      <div>
        {name.meaning_short && (
          <p className="text-white/90 text-base leading-relaxed">{name.meaning_short}</p>
        )}
        {name.personality && (
          <p className="text-white/65 text-sm mt-2">{name.personality}</p>
        )}
        {name.keywords && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {name.keywords.split(",").slice(0, 4).map((k, i) => (
              <span key={i} className="glass-chip pill px-2 py-0.5 text-[10px]">{k.trim()}</span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
