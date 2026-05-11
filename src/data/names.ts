export type BabyName = {
  id: string;
  name: string;
  pronunciation: string;
  meaning: string;
  origin: string;
  gender: "girl" | "boy" | "neutral";
  rank: number;
  vibeScore: number;
  vibe: string;
  gradient: string;
};

const GRADIENTS = ["gradient-hero", "gradient-warm", "gradient-cool", "gradient-couple"];

export function mapSupabaseName(row: Record<string, unknown>): BabyName {
  const idx = typeof row.gradient_index === "number" ? row.gradient_index : 1;
  const keywords = typeof row.keywords === "string" ? row.keywords : "";
  const firstKeyword = keywords.split("|")[0]?.trim() || "Unique";
  const gender = row.gender === "girl" ? "girl" : row.gender === "boy" ? "boy" : "neutral";
  return {
    id: String(row.slug ?? row.id ?? row.name),
    name: String(row.name ?? ""),
    pronunciation: String(row.pronunciation ?? ""),
    meaning: String(row.meaning_short ?? ""),
    origin: String(row.origin ?? ""),
    gender,
    rank: Number(row.india_rank ?? 9999),
    vibeScore: Number(row.ai_vibe_score ?? 75),
    vibe: firstKeyword,
    gradient: GRADIENTS[((idx - 1) % GRADIENTS.length + GRADIENTS.length) % GRADIENTS.length],
  };
}

// Fallback static names used while Supabase loads
export const NAMES: BabyName[] = [
  { id: "aarav", name: "Aarav", pronunciation: "AH-rav", meaning: "Peaceful melodious", origin: "Sanskrit", gender: "boy", rank: 1, vibeScore: 96, vibe: "Serene", gradient: "gradient-hero" },
  { id: "aanya", name: "Aanya", pronunciation: "AHN-yah", meaning: "Graceful limitless", origin: "Sanskrit", gender: "girl", rank: 2, vibeScore: 94, vibe: "Elegant", gradient: "gradient-warm" },
  { id: "vivaan", name: "Vivaan", pronunciation: "VIH-vaan", meaning: "Full of life", origin: "Sanskrit", gender: "boy", rank: 3, vibeScore: 91, vibe: "Vibrant", gradient: "gradient-cool" },
  { id: "ananya", name: "Ananya", pronunciation: "ah-NUN-yah", meaning: "Unique matchless", origin: "Sanskrit", gender: "girl", rank: 4, vibeScore: 93, vibe: "Mystic", gradient: "gradient-couple" },
  { id: "reyansh", name: "Reyansh", pronunciation: "REY-ansh", meaning: "First ray of sunlight", origin: "Sanskrit", gender: "boy", rank: 5, vibeScore: 89, vibe: "Radiant", gradient: "gradient-hero" },
  { id: "ishaan", name: "Ishaan", pronunciation: "ih-SHAAN", meaning: "Shiva northeast", origin: "Sanskrit", gender: "boy", rank: 6, vibeScore: 88, vibe: "Bold", gradient: "gradient-warm" },
  { id: "aadya", name: "Aadya", pronunciation: "AAD-yah", meaning: "First primordial", origin: "Sanskrit", gender: "girl", rank: 7, vibeScore: 92, vibe: "Sacred", gradient: "gradient-cool" },
  { id: "arjun", name: "Arjun", pronunciation: "AR-jun", meaning: "Bright white Pandava", origin: "Sanskrit", gender: "boy", rank: 8, vibeScore: 90, vibe: "Heroic", gradient: "gradient-couple" },
];
