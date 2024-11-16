export function getEmoji(neighborCount: number): string {
  if (neighborCount <= 2) return "🌱";
  if (neighborCount <= 4) return "🌿";
  return "🌳";
}
