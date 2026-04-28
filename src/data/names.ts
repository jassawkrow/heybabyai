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

export const NAMES: BabyName[] = [
  { id: "1", name: "Aria", pronunciation: "AH-ree-uh", meaning: "Air, melody", origin: "Italian", gender: "girl", rank: 23, vibeScore: 94, vibe: "Lyrical", gradient: "gradient-cool" },
  { id: "2", name: "Kai", pronunciation: "KYE", meaning: "Sea, ocean", origin: "Hawaiian", gender: "neutral", rank: 89, vibeScore: 91, vibe: "Adventurous", gradient: "gradient-hero" },
  { id: "3", name: "Luna", pronunciation: "LOO-nuh", meaning: "Moon", origin: "Latin", gender: "girl", rank: 11, vibeScore: 96, vibe: "Mystical", gradient: "gradient-couple" },
  { id: "4", name: "Atlas", pronunciation: "AT-luhs", meaning: "Bearer of the heavens", origin: "Greek", gender: "boy", rank: 134, vibeScore: 88, vibe: "Bold", gradient: "gradient-warm" },
  { id: "5", name: "Ivy", pronunciation: "EYE-vee", meaning: "Climbing vine", origin: "English", gender: "girl", rank: 56, vibeScore: 89, vibe: "Earthy", gradient: "gradient-cool" },
  { id: "6", name: "Ezra", pronunciation: "EZ-ruh", meaning: "Helper", origin: "Hebrew", gender: "boy", rank: 31, vibeScore: 92, vibe: "Wise", gradient: "gradient-hero" },
  { id: "7", name: "Maeve", pronunciation: "MAYV", meaning: "She who intoxicates", origin: "Irish", gender: "girl", rank: 142, vibeScore: 93, vibe: "Regal", gradient: "gradient-couple" },
  { id: "8", name: "Rumi", pronunciation: "ROO-mee", meaning: "Beauty, friend", origin: "Persian", gender: "neutral", rank: 312, vibeScore: 95, vibe: "Poetic", gradient: "gradient-warm" },
  { id: "9", name: "Theo", pronunciation: "THEE-oh", meaning: "Divine gift", origin: "Greek", gender: "boy", rank: 42, vibeScore: 90, vibe: "Charming", gradient: "gradient-cool" },
  { id: "10", name: "Soraya", pronunciation: "soh-RYE-uh", meaning: "Princess, jewel", origin: "Persian", gender: "girl", rank: 891, vibeScore: 87, vibe: "Radiant", gradient: "gradient-warm" },
  { id: "11", name: "Milo", pronunciation: "MY-loh", meaning: "Soldier, merciful", origin: "Germanic", gender: "boy", rank: 73, vibeScore: 91, vibe: "Playful", gradient: "gradient-hero" },
  { id: "12", name: "Wren", pronunciation: "REN", meaning: "Small bird", origin: "English", gender: "neutral", rank: 254, vibeScore: 89, vibe: "Free-spirited", gradient: "gradient-couple" },
];