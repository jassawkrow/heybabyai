export const GRADIENT_CLASSES = ["grad-1", "grad-2", "grad-3", "grad-4", "grad-5", "grad-6"];
export function gradientFor(idx: number | null | undefined) {
  const i = ((idx ?? 0) % 6 + 6) % 6;
  return GRADIENT_CLASSES[i];
}
export const CARD_HEIGHTS = [200, 160, 180, 150, 220, 170];
export function cardHeightFor(idx: number) {
  return CARD_HEIGHTS[idx % CARD_HEIGHTS.length];
}
