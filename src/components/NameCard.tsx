import { motion } from "framer-motion";
import { gradientFor, cardHeightFor } from "@/lib/gradients";
import type { Tables } from "@/integrations/supabase/types";

type N = Tables<"names">;

export function NameCard({ name, idx, onClick }: { name: N; idx: number; onClick?: () => void }) {
  const h = cardHeightFor(idx);
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className={`${gradientFor(name.gradient_index ?? idx)} relative w-full rounded-2xl p-4 text-left text-white overflow-hidden shadow-md hover:shadow-xl transition-shadow break-inside-avoid mb-2.5`}
      style={{ minHeight: h }}
    >
      <div className="flex items-start justify-between text-[10px] font-semibold">
        <span className="glass-chip pill px-2 py-0.5">{name.origin}</span>
        {name.ai_vibe_score != null && (
          <span className="glass-chip pill px-2 py-0.5">✨ {name.ai_vibe_score}</span>
        )}
      </div>
      <div className="mt-6">
        <div className="text-[28px] leading-none font-extrabold tracking-tight">{name.name}</div>
        {name.pronunciation && (
          <div className="italic text-[10px] mt-1 text-white/85">/{name.pronunciation}/</div>
        )}
        {name.meaning_short && (
          <div className="text-xs mt-1.5 text-white/90 line-clamp-2">{name.meaning_short}</div>
        )}
      </div>
      <div className="absolute bottom-3 left-3 right-3 flex flex-wrap gap-1">
        {name.rasi && <span className="glass-chip pill px-2 py-0.5 text-[9px]">{name.rasi}</span>}
        {name.star && <span className="glass-chip pill px-2 py-0.5 text-[9px]">{name.star}</span>}
      </div>
    </motion.button>
  );
}
