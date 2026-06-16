const BASE_GRADIENTS = [
  "bg-gradient-to-br from-[#1DAFB6] to-[#7928A3]",
  "bg-gradient-to-br from-[#F8A51C] to-[#EA4A35]",
  "bg-gradient-to-br from-[#EF5C84] to-[#7928A3]",
  "bg-gradient-to-br from-[#7928A3] to-[#1DAFB6]",
  "bg-gradient-to-br from-[#EA4A35] to-[#EF5C84]",
  "bg-gradient-to-br from-[#1DAFB6] to-[#F8A51C]",
];

function seededShuffle(arr: string[], seed: number): string[] {
  const a = [...arr];
  let s = seed;
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    const j = Math.abs(s) % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getSessionSeed(): number {
  let seed = sessionStorage.getItem("color_seed");
  if (!seed) {
    seed = Math.floor(Math.random() * 1000).toString();
    sessionStorage.setItem("color_seed", seed);
  }
  return parseInt(seed, 10);
}

// Computed once per page load — all importers share the same shuffled order.
export const sessionGradients: string[] = seededShuffle(BASE_GRADIENTS, getSessionSeed());
