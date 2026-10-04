/** Normalizes typed text for comparison: case, spaces, typographic quotes, trailing punctuation. */
export function normalize(text: string): string {
  return text
    .replace(/[‘’ʼ]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase()
    .replace(/[.!?]+$/, '')
    .trim();
}
