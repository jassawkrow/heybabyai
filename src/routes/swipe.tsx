import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { useEffect, useMemo, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { motion, useMotionValue, useTransform, AnimatePresence } from "framer-motion";
import { sessionGradients } from "@/lib/sessionGradients";
import confetti from "canvas-confetti";
import { X, Heart, Undo2, SlidersHorizontal } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { MatchOverlay } from "@/components/MatchOverlay";
import { GuestAuthModal } from "@/components/GuestAuthModal";
import { toast } from "sonner";

export const Route = createFileRoute("/swipe")({
  head: () => ({ meta: [{ title: "Swipe — HeyBaby AI" }] }),
  component: Swipe,
});

const FREE_LIMIT = 20;

const ORIGINS = [
  "Sanskrit", "Tamil", "Telugu", "Hindi", "Punjabi",
  "Bengali", "Marathi", "Kannada", "Gujarati",
  "Arabic", "Persian", "Modern", "Hebrew", "Greek",
  "English", "French", "Spanish", "Italian", "German",
  "Irish", "Scottish", "Scandinavian", "Latin",
  "Japanese", "Korean", "Chinese", "African",
];

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

const COUNTRY_OPTIONS = [
  "All", "India", "Arab World", "Iran/Persia",
  "Europe", "Americas", "East Asia", "Africa",
  "Scandinavia", "British Isles",
];

const COUNTRY_MAP: Record<string, string[]> = {
  "India":        ["Sanskrit","Tamil","Telugu","Hindi","Punjabi","Bengali","Marathi","Kannada","Gujarati"],
  "Arab World":   ["Arabic"],
  "Iran/Persia":  ["Persian"],
  "Europe":       ["French","Italian","German","Greek","Latin","Spanish"],
  "Americas":     ["English","Modern"],
  "East Asia":    ["Japanese","Korean","Chinese"],
  "Africa":       ["African"],
  "Scandinavia":  ["Scandinavian"],
  "British Isles":["English","Irish","Scottish","Hebrew"],
};

type SwipeFilters = { letter: string; origin: string[]; country: string };
const defaultSwipeFilters: SwipeFilters = { letter: "", origin: [], country: "All" };

function activeSwipeCount(f: SwipeFilters) {
  return [
    f.letter !== "",
    f.origin.length > 0,
    f.country !== "All",
  ].filter(Boolean).length;
}

function Swipe() {
  const { user, profile, refreshProfile } = useAuth();
  const [deck, setDeck] = useState<Tables<"names">[]>([]);
  const [history, setHistory] = useState<{ name: Tables<"names">; liked: boolean }[]>([]);
  const [match, setMatch] = useState<Tables<"names"> | null>(null);
  const [partnerOnline, setPartnerOnline] = useState(false);
  const [guestModal, setGuestModal] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [swipeFilters, setSwipeFilters] = useState<SwipeFilters>(defaultSwipeFilters);
  const [draft, setDraft] = useState<SwipeFilters>(defaultSwipeFilters);

  // Sync draft when sheet opens
  useEffect(() => {
    if (filterOpen) setDraft(swipeFilters);
  }, [filterOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  // Lock body scroll while filter sheet is open
  useEffect(() => {
    document.body.style.overflow = filterOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [filterOpen]);

  useEffect(() => {
    const loadDeck = async () => {
      if (user === undefined) return;
      let query = supabase.from("names").select("*").order("ai_vibe_score", { ascending: false, nullsFirst: false });
      if (user) {
        const { data: swiped } = await supabase.from("swipes").select("name_id").eq("user_id", user.id);
        const ids = (swiped ?? []).map((s: any) => s.name_id);
        if (ids.length) query = (query as any).not("id", "in", `(${ids.join(",")})`);
      }
      if (swipeFilters.letter !== "")
        query = query.eq("starting_letter", swipeFilters.letter);
      if (swipeFilters.origin.length > 0) {
        query = query.in("origin", swipeFilters.origin);
      } else if (swipeFilters.country !== "All") {
        const countryOrigins = COUNTRY_MAP[swipeFilters.country] ?? [];
        if (countryOrigins.length > 0) query = query.in("origin", countryOrigins);
      }
      const { data } = await query.limit(80);
      setDeck(data ?? []);
    };
    loadDeck();
  }, [user?.id, swipeFilters]);

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

  // Reset guest swipe counter when user signs in
  useEffect(() => {
    if (user) localStorage.removeItem("guest_swipes");
  }, [user?.id]);

  const swipesLeft = useMemo(() => {
    if (!profile) return FREE_LIMIT;
    if (profile.tier && profile.tier !== "free") return Infinity;
    return Math.max(0, FREE_LIMIT - (profile.daily_swipes ?? 0));
  }, [profile]);

  const top = deck[0];

  const onSwipe = async (liked: boolean) => {
    if (!top) return;
    if (!user) {
      const count = parseInt(localStorage.getItem("guest_swipes") ?? "0", 10);
      if (count >= 20) {
        setGuestModal(true);
        return;
      }
      localStorage.setItem("guest_swipes", String(count + 1));
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

    await supabase.from("swipes").upsert({ user_id: user.id, name_id: top.id, liked }, { onConflict: "user_id,name_id" });
    if (profile?.tier === "free") {
      await supabase.from("profiles").update({ daily_swipes: (profile.daily_swipes ?? 0) + 1 }).eq("id", user.id);
      refreshProfile();
    }

    if (liked && profile?.partner_id) {
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

  const applyFilters = () => {
    setSwipeFilters(draft);
    setHistory([]);
    setFilterOpen(false);
  };

  const clearFilters = () => {
    setDraft(defaultSwipeFilters);
  };

  const toggleDraftOrigin = (o: string) =>
    setDraft((d) => ({
      ...d,
      origin: d.origin.includes(o) ? d.origin.filter((x) => x !== o) : [...d.origin, o],
    }));

  const filterCount = activeSwipeCount(swipeFilters);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="max-w-md w-full mx-auto px-5 pt-5 flex-1 flex flex-col">
        <div className="flex items-center justify-between text-sm">
          <span className="pill bg-white px-3 py-1.5 font-semibold text-ink/70 border border-black/5">
            {swipesLeft === Infinity ? "Unlimited" : `${swipesLeft} swipes left today`}
          </span>
          <div className="flex items-center gap-2">
            {profile?.partner_id ? (
              <span className="pill glass border border-teal/40 px-3 py-1.5 text-xs font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" /> Partner {partnerOnline ? "online" : "connected"}
              </span>
            ) : (
              <Link to="/profile" className="text-xs font-semibold text-purple">Invite your partner →</Link>
            )}
            <button
              onClick={() => setFilterOpen(true)}
              className={`relative pill px-3 py-1.5 text-xs font-semibold flex items-center gap-1.5 transition ${
                filterCount > 0 ? "text-white shadow" : "bg-white/80 text-ink/70 hover:bg-white border border-black/5"
              }`}
              style={filterCount > 0 ? { background: "linear-gradient(135deg,#1DAFB6,#7928A3)" } : {}}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              {filterCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-pink-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {filterCount}
                </span>
              )}
            </button>
          </div>
        </div>

        <div className="relative flex-1 mt-6 min-h-[440px]">
          <AnimatePresence>
            {deck.slice(0, 3).reverse().map((n, idxRev) => {
              const i = 2 - idxRev;
              const deckPos = history.length + i;
              const gradient = sessionGradients[deckPos % sessionGradients.length];
              if (i === 0) return <SwipeCard key={n.id} name={n} gradient={gradient} onSwipe={onSwipe} />;
              return (
                <motion.div
                  key={n.id}
                  initial={{ scale: 1 }}
                  animate={{ scale: 1 - i * 0.07, y: i * 12, opacity: 1 - i * 0.3 }}
                  className={`absolute inset-0 ${gradient} rounded-3xl shadow-xl`}
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

      {/* ── Swipe filter bottom sheet ── */}
      {filterOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setFilterOpen(false)} />
          <div className="relative z-10 bg-[#FEFBF5] rounded-t-3xl w-full max-h-[88vh] flex flex-col shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-black/8 shrink-0">
              <h2 className="font-extrabold text-base">Filter swipe deck</h2>
              <button onClick={() => setFilterOpen(false)} className="p-1.5 rounded-full hover:bg-black/8 transition">
                <X className="w-5 h-5 text-ink/60" />
              </button>
            </div>

            {/* Scrollable content */}
            <div className="overflow-y-auto overscroll-contain flex-1 px-5 py-5 space-y-7">

              {/* A to Z */}
              <div>
                <div className="text-[10px] font-extrabold tracking-[0.2em] text-ink/45 uppercase mb-3">Starts with letter</div>
                <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                  <button
                    onClick={() => setDraft((d) => ({ ...d, letter: "" }))}
                    className={`shrink-0 rounded-xl px-3 py-1.5 text-sm font-bold transition ${
                      draft.letter === "" ? "text-white" : "bg-white text-ink/70 hover:bg-white/60"
                    }`}
                    style={draft.letter === "" ? { background: "linear-gradient(135deg,#1DAFB6,#7928A3)" } : {}}
                  >
                    All
                  </button>
                  {ALPHABET.map((letter) => {
                    const active = draft.letter === letter;
                    return (
                      <button
                        key={letter}
                        onClick={() => setDraft((d) => ({ ...d, letter: d.letter === letter ? "" : letter }))}
                        className={`shrink-0 rounded-xl px-3 py-1.5 text-sm font-bold transition ${
                          active ? "text-white" : "bg-white text-ink/70 hover:bg-white/60"
                        }`}
                        style={active ? { background: "linear-gradient(135deg,#1DAFB6,#7928A3)" } : {}}
                      >
                        {letter}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Language / Origin */}
              <div>
                <div className="text-[10px] font-extrabold tracking-[0.2em] text-ink/45 uppercase mb-3">Language / Origin</div>
                <div className="flex flex-wrap gap-2">
                  {ORIGINS.map((o) => {
                    const active = draft.origin.includes(o);
                    return (
                      <button
                        key={o}
                        onClick={() => toggleDraftOrigin(o)}
                        className={`pill px-3 py-1.5 text-xs font-semibold transition ${
                          active ? "text-white shadow-sm" : "bg-white text-ink/70 hover:bg-white/60"
                        }`}
                        style={active ? { background: "linear-gradient(135deg,#1DAFB6,#7928A3)" } : {}}
                      >
                        {o}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Country / Region */}
              <div>
                <div className="text-[10px] font-extrabold tracking-[0.2em] text-ink/45 uppercase mb-3">Country / Region</div>
                <div className="flex flex-wrap gap-2">
                  {COUNTRY_OPTIONS.map((c) => {
                    const active = draft.country === c;
                    return (
                      <button
                        key={c}
                        onClick={() => setDraft((d) => ({ ...d, country: c }))}
                        className={`pill px-3 py-1.5 text-xs font-semibold transition ${
                          active ? "text-white shadow-sm" : "bg-white text-ink/70 hover:bg-white/60"
                        }`}
                        style={active ? { background: "linear-gradient(135deg,#EF5C84,#7928A3)" } : {}}
                      >
                        {c}
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Footer */}
            <div className="px-5 py-4 border-t border-black/8 shrink-0 flex gap-3">
              <button
                onClick={clearFilters}
                className="pill px-5 py-3 text-sm font-semibold text-ink/60 bg-white hover:bg-white/80 transition"
              >
                Clear
              </button>
              <button
                onClick={applyFilters}
                className="flex-1 pill py-3 text-sm font-semibold text-white transition hover:opacity-90"
                style={{ background: "linear-gradient(135deg,#1DAFB6,#7928A3)" }}
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      <MatchOverlay name={match} onClose={() => setMatch(null)} />
      <GuestAuthModal
        open={guestModal}
        onClose={() => setGuestModal(false)}
        heading="You have found 20 names!"
        body="Sign in free to keep swiping and save your favourites"
      />
      <BottomNav />
      <div className="h-28" />
    </div>
  );
}

function getSwipeFontSize(name: string) {
  const len = name.length;
  if (len <= 5) return "text-[52px]";
  if (len <= 7) return "text-[44px]";
  if (len <= 9) return "text-[36px]";
  if (len <= 12) return "text-[28px]";
  if (len <= 15) return "text-[22px]";
  return "text-xl";
}

function SwipeCard({ name, gradient, onSwipe }: { name: Tables<"names">; gradient: string; onSwipe: (liked: boolean) => void }) {
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
        if (info.offset.x > 100) {
          confetti({
            particleCount: 30,
            spread: 60,
            origin: { x: 0.5, y: 0.5 },
            colors: ["#1DAFB6", "#F8A51C", "#EF5C84", "#7928A3", "#EA4A35", "#ffffff"],
            scalar: 0.8,
            ticks: 60,
            gravity: 1.2,
          });
          onSwipe(true);
        } else if (info.offset.x < -100) {
          onSwipe(false);
        }
      }}
      whileTap={{ cursor: "grabbing" }}
      className={`absolute inset-0 ${gradient} rounded-3xl shadow-2xl text-white p-6 cursor-grab select-none flex flex-col overflow-hidden`}
    >
      <div className="flex items-start justify-between text-[10px] font-semibold flex-shrink-0">
        <span className="glass-chip pill px-2.5 py-1">{name.origin}</span>
        <span className="glass-chip pill px-2.5 py-1">✨ {name.ai_vibe_score ?? "–"}</span>
      </div>

      <motion.div style={{ opacity: likeOp }} className="absolute top-8 left-6 border-4 border-white pill px-3 py-1 text-xs font-extrabold rotate-[-8deg]">LOVE</motion.div>
      <motion.div style={{ opacity: passOp }} className="absolute top-8 right-6 border-4 border-white pill px-3 py-1 text-xs font-extrabold rotate-[8deg]">PASS</motion.div>

      <div className="mt-auto min-w-0">
        <div className={`${getSwipeFontSize(name.name)} leading-tight font-extrabold tracking-tight whitespace-nowrap overflow-hidden text-ellipsis w-full`}>{name.name}</div>
        {name.pronunciation && <div className="italic text-sm mt-2 text-white/85">/{name.pronunciation}/</div>}
        {name.meaning_short && <div className="text-base mt-2 text-white/95 line-clamp-2 break-words">{name.meaning_short}</div>}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {name.rasi && <span className="glass-chip pill px-2 py-0.5 text-[10px]">{name.rasi}</span>}
          {name.star && <span className="glass-chip pill px-2 py-0.5 text-[10px]">{name.star}</span>}
          {name.numerology != null && <span className="glass-chip pill px-2 py-0.5 text-[10px]">N° {name.numerology}</span>}
        </div>
      </div>
    </motion.div>
  );
}
