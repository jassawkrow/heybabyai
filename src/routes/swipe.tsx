import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { useEffect, useMemo, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { motion, useMotionValue, useTransform, AnimatePresence } from "framer-motion";
import { gradientFor } from "@/lib/gradients";
import { X, Heart, Undo2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { MatchOverlay } from "@/components/MatchOverlay";
import { toast } from "sonner";

export const Route = createFileRoute("/swipe")({
  head: () => ({ meta: [{ title: "Swipe — HeyBaby AI" }] }),
  component: Swipe,
});

const FREE_LIMIT = 20;

function Swipe() {
  const { user, profile, refreshProfile } = useAuth();
  const [deck, setDeck] = useState<Tables<"names">[]>([]);
  const [history, setHistory] = useState<{ name: Tables<"names">; liked: boolean }[]>([]);
  const [match, setMatch] = useState<Tables<"names"> | null>(null);
  const [partnerOnline, setPartnerOnline] = useState(false);

  useEffect(() => {
    const loadDeck = async () => {
      if (user === undefined) return;
      let query = supabase.from("names").select("*").order("ai_vibe_score", { ascending: false, nullsFirst: false });
      if (user) {
        const { data: swiped } = await supabase.from("swipes").select("name_id").eq("user_id", user.id);
        const ids = (swiped ?? []).map((s: any) => s.name_id);
        if (ids.length) query = (query as any).not("id", "in", `(${ids.join(",")})`);
      }
      const { data } = await query.limit(80);
      setDeck(data ?? []);
    };
    loadDeck();
  }, [user?.id]);

  // Realtime: partner room channel
  useEffect(() => {
    if (!profile?.room_code) return;
    const channel = supabase.channel(`room-${profile.room_code}`, { config: { presence: { key: user?.id ?? "anon" } } });
    channel.on("presence", { event: "sync" }, () => {
      const state = channel.presenceState();
      const others = Object.keys(state).filter((k) => k !== user?.id);
      setPartnerOnline(others.length > 0);
    });
    channel.subscribe(async (status) => {
      if (status === "SUBSCRIBED") await channel.track({ at: Date.now() });
    });
    return () => { supabase.removeChannel(channel); };
  }, [profile?.room_code, user?.id]);

  const swipesLeft = useMemo(() => {
    if (!profile) return FREE_LIMIT;
    if (profile.tier && profile.tier !== "free") return Infinity;
    return Math.max(0, FREE_LIMIT - (profile.daily_swipes ?? 0));
  }, [profile]);

  const top = deck[0];

  const onSwipe = async (liked: boolean) => {
    if (!top) return;
    if (!user) {
      toast("Sign in to save your swipes", { action: { label: "Sign in", onClick: () => location.assign("/profile") } });
      setDeck((d) => d.slice(1));
      setHistory((h) => [{ name: top, liked }, ...h]);
      return;
    }
    if (swipesLeft <= 0 && liked) {
      toast.error("You've hit today's free limit. Upgrade to keep swiping ∞");
      return;
    }
    setHistory((h) => [{ name: top, liked }, ...h]);
    setDeck((d) => d.slice(1));

    await supabase.from("swipes").insert({ user_id: user.id, name_id: top.id, liked });
    if (profile?.tier === "free") {
      await supabase.from("profiles").update({ daily_swipes: (profile.daily_swipes ?? 0) + 1 }).eq("id", user.id);
      refreshProfile();
    }

    if (liked && profile?.partner_id) {
      // check if partner also liked it
      const { data: partnerSwipe } = await supabase.from("swipes")
        .select("id").eq("user_id", profile.partner_id).eq("name_id", top.id).eq("liked", true).maybeSingle();
      if (partnerSwipe && profile.room_code) {
        await supabase.from("matches").insert({ name_id: top.id, room_code: profile.room_code });
        setMatch(top);
      }
    }
  };

  const undo = () => {
    const last = history[0];
    if (!last) return;
    setHistory((h) => h.slice(1));
    setDeck((d) => [last.name, ...d]);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="max-w-md w-full mx-auto px-5 pt-5 flex-1 flex flex-col">
        <div className="flex items-center justify-between text-sm">
          <span className="pill bg-white px-3 py-1.5 font-semibold text-ink/70 border border-black/5">
            {swipesLeft === Infinity ? "Unlimited" : `${swipesLeft} swipes left today`}
          </span>
          {profile?.partner_id ? (
            <span className="pill glass border border-teal/40 px-3 py-1.5 text-xs font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" /> Partner {partnerOnline ? "online" : "connected"}
            </span>
          ) : (
            <Link to="/profile" className="text-xs font-semibold text-purple">Invite your partner →</Link>
          )}
        </div>

        <div className="relative flex-1 mt-6 min-h-[440px]">
          <AnimatePresence>
            {deck.slice(0, 3).reverse().map((n, idxRev) => {
              const i = 2 - idxRev;
              if (i === 0) return <SwipeCard key={n.id} name={n} onSwipe={onSwipe} />;
              return (
                <motion.div
                  key={n.id}
                  initial={{ scale: 1 }}
                  animate={{ scale: 1 - i * 0.07, y: i * 12, opacity: 1 - i * 0.3 }}
                  className={`absolute inset-0 ${gradientFor(n.gradient_index)} rounded-3xl shadow-xl`}
                  style={{ filter: `blur(${i * 2}px)`, zIndex: 10 - i }}
                />
              );
            })}
          </AnimatePresence>
          {deck.length === 0 && (
            <div className="text-center py-20 text-ink/60">
              You've seen the whole deck for now. <Link to="/explore" className="text-purple font-semibold">Explore more →</Link>
            </div>
          )}
        </div>

        <div className="flex items-center justify-center gap-5 my-6">
          <button onClick={() => onSwipe(false)} className="w-14 h-14 rounded-full bg-white border border-black/10 shadow flex items-center justify-center active:scale-95">
            <X className="w-6 h-6 text-ink/60" />
          </button>
          <button onClick={undo} disabled={!history.length} className="w-12 h-12 rounded-full bg-white border border-black/10 shadow flex items-center justify-center active:scale-95 disabled:opacity-40">
            <Undo2 className="w-5 h-5 text-gold" />
          </button>
          <button onClick={() => onSwipe(true)} className="w-16 h-16 rounded-full grad-2 shadow-xl shadow-pink/30 flex items-center justify-center active:scale-95">
            <Heart className="w-7 h-7 text-white fill-white" />
          </button>
        </div>
      </div>
      <MatchOverlay name={match} onClose={() => setMatch(null)} />
      <BottomNav />
      <div className="h-28" />
    </div>
  );
}

function SwipeCard({ name, onSwipe }: { name: Tables<"names">; onSwipe: (liked: boolean) => void }) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-12, 12]);
  const likeOp = useTransform(x, [40, 140], [0, 1]);
  const passOp = useTransform(x, [-140, -40], [1, 0]);
  const ref = useRef<HTMLDivElement>(null);

  return (
    <motion.div
      ref={ref}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      style={{ x, rotate, zIndex: 20 }}
      onDragEnd={(_, info) => {
        if (info.offset.x > 100) onSwipe(true);
        else if (info.offset.x < -100) onSwipe(false);
      }}
      whileTap={{ cursor: "grabbing" }}
      className={`absolute inset-0 ${gradientFor(name.gradient_index)} rounded-3xl shadow-2xl text-white p-6 cursor-grab select-none flex flex-col`}
    >
      <div className="flex items-start justify-between text-[10px] font-semibold">
        <span className="glass-chip pill px-2.5 py-1">{name.origin}</span>
        <span className="glass-chip pill px-2.5 py-1">✨ {name.ai_vibe_score ?? "–"}</span>
      </div>

      <motion.div style={{ opacity: likeOp }} className="absolute top-8 left-6 border-4 border-white pill px-3 py-1 text-xs font-extrabold rotate-[-8deg]">LOVE</motion.div>
      <motion.div style={{ opacity: passOp }} className="absolute top-8 right-6 border-4 border-white pill px-3 py-1 text-xs font-extrabold rotate-[8deg]">PASS</motion.div>

      <div className="mt-auto">
        <div className="text-[52px] leading-none font-extrabold tracking-tight">{name.name}</div>
        {name.pronunciation && <div className="italic text-sm mt-2 text-white/85">/{name.pronunciation}/</div>}
        {name.meaning_short && <div className="text-base mt-2 text-white/95">{name.meaning_short}</div>}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {name.rasi && <span className="glass-chip pill px-2 py-0.5 text-[10px]">{name.rasi}</span>}
          {name.star && <span className="glass-chip pill px-2 py-0.5 text-[10px]">{name.star}</span>}
          {name.numerology != null && <span className="glass-chip pill px-2 py-0.5 text-[10px]">N° {name.numerology}</span>}
        </div>
      </div>
    </motion.div>
  );
}
