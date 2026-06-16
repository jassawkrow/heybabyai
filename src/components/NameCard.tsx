import { motion } from "framer-motion";
import { Share2 } from "lucide-react";
import { toast } from "sonner";
import { cardHeightFor } from "@/lib/gradients";
import { sessionGradients } from "@/lib/sessionGradients";
import type { Tables } from "@/integrations/supabase/types";

type N = Tables<"names">;

function getFontSize(name: string) {
  const len = name.length;
  if (len <= 5) return "text-3xl";
  if (len <= 7) return "text-2xl";
  if (len <= 9) return "text-xl";
  if (len <= 12) return "text-lg";
  if (len <= 15) return "text-base";
  return "text-sm";
}

function handleShare(e: React.MouseEvent, name: N) {
  e.stopPropagation();
  const url = `https://heybabyai.com/names/${name.slug}`;
  if (navigator.share) {
    navigator.share({
      title: name.name,
      text: `${name.name} — ${name.meaning_short ?? ""}. Find baby names at heybabyai.com`,
      url,
    }).catch(() => {});
  } else {
    navigator.clipboard.writeText(url);
    toast.success("Link copied!");
  }
}

export function NameCard({ name, idx, onClick }: { name: N; idx: number; onClick?: () => void }) {
  const h = cardHeightFor(idx);
  const gradient = sessionGradients[idx % sessionGradients.length];
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className={`${gradient} relative w-full rounded-2xl p-4 text-left text-white overflow-hidden shadow-md hover:shadow-xl transition-shadow break-inside-avoid mb-2.5 flex flex-col`}
      style={{ minHeight: h }}
    >
      <div className="flex items-start justify-between text-[10px] font-semibold">
        <span className="glass-chip pill px-2 py-0.5">{name.origin}</span>
        <div className="flex items-center gap-1">
          {name.ai_vibe_score != null && (
            <span className="glass-chip pill px-2 py-0.5">✨ {name.ai_vibe_score}</span>
          )}
          <button
            onClick={(e) => handleShare(e, name)}
            className="glass-chip pill px-1.5 py-0.5 flex items-center"
            aria-label="Share"
          >
            <Share2 className="w-3 h-3" />
          </button>
        </div>
      </div>

      <div className="mt-3 flex-1 min-w-0">
        <div className={`${getFontSize(name.name)} font-extrabold leading-tight tracking-tight whitespace-nowrap overflow-hidden text-ellipsis w-full`}>
          {name.name}
        </div>
        {name.pronunciation && (
          <div className="italic text-[10px] mt-1 text-white/85">/{name.pronunciation}/</div>
        )}
        {name.meaning_short && (
          <div className="text-xs mt-1.5 text-white/90 line-clamp-2 break-words">{name.meaning_short}</div>
        )}
      </div>

      <div className="flex flex-wrap gap-1 mt-auto pt-2 flex-shrink-0">
        {name.rasi && <span className="glass-chip pill px-2 py-0.5 text-[9px]">{name.rasi}</span>}
        {name.star && <span className="glass-chip pill px-2 py-0.5 text-[9px]">{name.star}</span>}
      </div>
    </motion.button>
  );
}
