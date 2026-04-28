import { motion, PanInfo, useMotionValue, useTransform } from "framer-motion";
import { BabyName } from "@/data/names";
import { Sparkles, TrendingUp, Globe2 } from "lucide-react";

interface Props {
  name: BabyName;
  onSwipe: (dir: "left" | "right") => void;
  isTop: boolean;
  index: number;
}

export const SwipeCard = ({ name, onSwipe, isTop, index }: Props) => {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-18, 18]);
  const likeOpacity = useTransform(x, [0, 120], [0, 1]);
  const nopeOpacity = useTransform(x, [-120, 0], [1, 0]);

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x > 120) onSwipe("right");
    else if (info.offset.x < -120) onSwipe("left");
  };

  return (
    <motion.div
      className="absolute inset-0 select-none"
      style={{
        x: isTop ? x : 0,
        rotate: isTop ? rotate : 0,
        zIndex: 10 - index,
      }}
      drag={isTop ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      initial={{ scale: 1 - index * 0.04, y: index * 12, opacity: index > 2 ? 0 : 1 }}
      animate={{ scale: 1 - index * 0.04, y: index * 12, opacity: index > 2 ? 0 : 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      whileTap={isTop ? { cursor: "grabbing" } : {}}
    >
      <div className={`relative h-full w-full rounded-[2rem] overflow-hidden shadow-card bg-card ${name.gradient}`}>
        {/* decorative bg */}
        <div className="absolute inset-0 opacity-90" />
        <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-background/10 blur-2xl" />
        <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-background/10 blur-2xl" />

        {/* LIKE / NOPE overlays */}
        {isTop && (
          <>
            <motion.div
              style={{ opacity: likeOpacity }}
              className="absolute top-8 left-8 px-4 py-2 rounded-2xl border-4 border-primary-foreground/90 text-primary-foreground font-extrabold text-2xl rotate-[-12deg]"
            >
              LOVE IT
            </motion.div>
            <motion.div
              style={{ opacity: nopeOpacity }}
              className="absolute top-8 right-8 px-4 py-2 rounded-2xl border-4 border-primary-foreground/90 text-primary-foreground font-extrabold text-2xl rotate-[12deg]"
            >
              PASS
            </motion.div>
          </>
        )}

        <div className="relative h-full flex flex-col justify-between p-7 text-primary-foreground">
          <div className="flex justify-between items-start">
            <div className="px-3 py-1.5 rounded-full bg-background/20 backdrop-blur-md text-xs font-semibold uppercase tracking-wider">
              {name.gender === "neutral" ? "Unisex" : name.gender}
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-background/20 backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5" />
              <span className="text-xs font-bold">AI Vibe {name.vibeScore}</span>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <h2 className="text-6xl font-extrabold tracking-tight drop-shadow-sm">{name.name}</h2>
              <p className="text-primary-foreground/85 text-sm font-medium mt-1">/ {name.pronunciation} /</p>
            </div>
            <p className="text-lg font-medium leading-snug">{name.meaning}</p>
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-background/20 backdrop-blur-md text-xs font-semibold">
                <Globe2 className="h-3.5 w-3.5" /> {name.origin}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-background/20 backdrop-blur-md text-xs font-semibold">
                <TrendingUp className="h-3.5 w-3.5" /> #{name.rank}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-background/20 backdrop-blur-md text-xs font-semibold">
                ✨ {name.vibe}
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};