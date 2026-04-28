import { useState, useMemo } from "@/lib/react-shim";
import { NAMES, BabyName } from "@/data/names";
import { SwipeCard } from "./SwipeCard";
import { MatchModal } from "./MatchModal";
import { PaywallModal } from "./PaywallModal";
import { Button } from "@/components/ui/button";
import { Heart, X, Undo2, SlidersHorizontal, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const FREE_LIMIT = 20;

export const SwipeDeck = () => {
  const [deck, setDeck] = useState<BabyName[]>(() => [...NAMES]);
  const [history, setHistory] = useState<BabyName[]>([]);
  const [match, setMatch] = useState<BabyName | null>(null);
  const [paywall, setPaywall] = useState(false);
  const [swipeCount, setSwipeCount] = useState(0);
  const [likes, setLikes] = useState(0);

  const handleSwipe = (dir: "left" | "right") => {
    if (swipeCount >= FREE_LIMIT) {
      setPaywall(true);
      return;
    }
    const top = deck[0];
    if (!top) return;
    setHistory((h) => [top, ...h]);
    setDeck((d) => d.slice(1));
    setSwipeCount((c) => c + 1);
    if (dir === "right") {
      setLikes((l) => l + 1);
      // Mock partner match: ~35% of likes trigger a match
      if (Math.random() < 0.35) {
        setTimeout(() => setMatch(top), 250);
      }
    }
  };

  const undo = () => {
    const last = history[0];
    if (!last) return;
    setHistory((h) => h.slice(1));
    setDeck((d) => [last, ...d]);
    setSwipeCount((c) => Math.max(0, c - 1));
  };

  const visible = deck.slice(0, 3);
  const remaining = Math.max(0, FREE_LIMIT - swipeCount);

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Header strip */}
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-card shadow-soft border border-border">
          <Sparkles className="h-3.5 w-3.5 text-secondary" />
          <span className="text-xs font-bold">{remaining} free swipes left</span>
        </div>
        <button className="h-9 w-9 rounded-full bg-card shadow-soft border border-border flex items-center justify-center hover:scale-105 transition">
          <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
        </button>
      </div>

      {/* Card stack */}
      <div className="relative w-full aspect-[3/4]">
        <AnimatePresence>
          {visible.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 rounded-[2rem] border-2 border-dashed border-border flex flex-col items-center justify-center text-center p-6 bg-card/50"
            >
              <div className="h-16 w-16 rounded-full gradient-warm flex items-center justify-center mb-4">
                <Heart className="h-8 w-8 text-primary-foreground fill-primary-foreground" />
              </div>
              <h3 className="text-xl font-bold">You've seen them all!</h3>
              <p className="text-sm text-muted-foreground mt-1 mb-4">
                {likes} names made your heart skip ✨
              </p>
              <Button onClick={() => { setDeck([...NAMES]); setHistory([]); }} className="rounded-full">
                Reshuffle deck
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
        {visible.map((n, i) => (
          <SwipeCard
            key={n.id}
            name={n}
            index={i}
            isTop={i === 0}
            onSwipe={handleSwipe}
          />
        ))}
      </div>

      {/* Action bar */}
      <div className="flex items-center justify-center gap-4 mt-6">
        <ActionButton onClick={() => handleSwipe("left")} aria-label="Pass" tone="orange" size="lg">
          <X className="h-7 w-7" strokeWidth={3} />
        </ActionButton>
        <ActionButton onClick={undo} aria-label="Undo" tone="secondary" size="md" disabled={!history.length}>
          <Undo2 className="h-5 w-5" strokeWidth={2.5} />
        </ActionButton>
        <ActionButton onClick={() => handleSwipe("right")} aria-label="Love it" tone="pink" size="lg">
          <Heart className="h-7 w-7 fill-current" />
        </ActionButton>
      </div>

      <MatchModal name={match} onClose={() => setMatch(null)} />
      <PaywallModal open={paywall} onClose={() => setPaywall(false)} />
    </div>
  );
};

const toneMap = {
  orange: "bg-card text-orange border-orange/20 hover:bg-orange hover:text-orange-foreground",
  pink: "bg-card text-pink border-pink/20 hover:bg-pink hover:text-pink-foreground",
  secondary: "bg-card text-secondary border-secondary/20 hover:bg-secondary hover:text-secondary-foreground",
};

const sizeMap = { md: "h-12 w-12", lg: "h-16 w-16" };

const ActionButton = ({
  children,
  onClick,
  tone,
  size,
  disabled,
  ...rest
}: {
  children: React.ReactNode;
  onClick: () => void;
  tone: keyof typeof toneMap;
  size: keyof typeof sizeMap;
  disabled?: boolean;
  "aria-label": string;
}) => (
  <motion.button
    whileTap={{ scale: 0.88 }}
    whileHover={{ scale: 1.06 }}
    onClick={onClick}
    disabled={disabled}
    className={`${sizeMap[size]} ${toneMap[tone]} rounded-full border-2 shadow-soft flex items-center justify-center transition-colors disabled:opacity-40 disabled:hover:bg-card disabled:hover:text-secondary`}
    {...rest}
  >
    {children}
  </motion.button>
);