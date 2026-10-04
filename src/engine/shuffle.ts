export type Rng = () => number;

/** Fisher-Yates; returns a new array. */
export function shuffle<T>(items: readonly T[], rng: Rng = Math.random): T[] {
  const a = items.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** A random element of the list (undefined if it is empty). */
export function pickRandom<T>(items: readonly T[], rng: Rng = Math.random): T | undefined {
  return items.length ? items[Math.min(items.length - 1, Math.floor(rng() * items.length))] : undefined;
}
