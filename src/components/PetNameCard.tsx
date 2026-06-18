import { Link } from "@tanstack/react-router";
import type { Tables } from "@/integrations/supabase/types";

const PET_CARD_GRADIENTS = [
  "linear-gradient(135deg, #F97316, #C2410C)",
  "linear-gradient(135deg, #8B5CF6, #6D28D9)",
  "linear-gradient(135deg, #EAB308, #16A34A)",
  "linear-gradient(135deg, #0EA5E9, #0D9488)",
  "linear-gradient(135deg, #EC4899, #9333EA)",
  "linear-gradient(135deg, #F97316, #FBBF24)",
  "linear-gradient(135deg, #22C55E, #065F46)",
  "linear-gradient(135deg, #1DAFB6, #7928A3)",
  "linear-gradient(135deg, #EA4A35, #EF5C84)",
  "linear-gradient(135deg, #F8A51C, #EA4A35)",
  "linear-gradient(135deg, #7928A3, #1DAFB6)",
  "linear-gradient(135deg, #EF5C84, #7928A3)",
];

const PET_EMOJI: Record<string, string> = {
  dog: "🐕", cat: "🐈", bird: "🐦", fish: "🐠",
  rabbit: "🐇", hamster: "🐹", turtle: "🐢",
};

const HEIGHTS = [
  "min-h-[180px]", "min-h-[150px]", "min-h-[160px]",
  "min-h-[175px]", "min-h-[150px]", "min-h-[165px]",
];

function fontSize(name: string) {
  const l = name.length;
  if (l <= 5) return "text-3xl";
  if (l <= 7) return "text-2xl";
  if (l <= 9) return "text-xl";
  if (l <= 12) return "text-lg";
  return "text-base";
}

interface Props {
  name: Tables<"pet_names">;
  idx: number;
  onClick?: () => void;
}

export function PetNameCard({ name, idx, onClick }: Props) {
  const gradient = PET_CARD_GRADIENTS[idx % PET_CARD_GRADIENTS.length];
  const emoji = PET_EMOJI[name.pet_type] ?? "🐾";
  const height = HEIGHTS[idx % HEIGHTS.length];

  const inner = (
    <div
      className={`${height} rounded-2xl p-3 text-white text-left cursor-pointer hover:scale-[1.03] transition-transform duration-200 flex flex-col justify-between overflow-hidden`}
      style={{ background: gradient }}
      onClick={onClick}
    >
      <div className="flex items-center justify-between gap-1 text-[9px] font-semibold">
        <span className="glass-chip pill px-2 py-0.5">{emoji} {name.pet_type}</span>
        {name.ai_vibe_score != null && (
          <span className="glass-chip pill px-2 py-0.5 shrink-0">✦ {name.ai_vibe_score}</span>
        )}
      </div>

      <div className="my-1">
        <div className={`${fontSize(name.name)} font-extrabold leading-tight`}>{name.name}</div>
        {name.meaning_short && (
          <div className="text-[10px] mt-1 text-white/85 line-clamp-2">{name.meaning_short}</div>
        )}
      </div>

      {name.origin && (
        <div className="flex flex-wrap gap-1 mt-1">
          <span className="glass-chip pill px-2 py-0.5 text-[9px]">{name.origin}</span>
        </div>
      )}
    </div>
  );

  if (onClick) return <div className="break-inside-avoid mb-2.5">{inner}</div>;

  return (
    <div className="break-inside-avoid mb-2.5">
      <Link to="/pets/$slug" params={{ slug: name.slug }}>{inner}</Link>
    </div>
  );
}
