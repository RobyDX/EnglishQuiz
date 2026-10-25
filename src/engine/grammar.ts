import { GRAMMAR_AREAS, type GrammarArea, type GrammarTopicMeta } from '../types/grammar';

/** Topics matching every word of `query` (title, summary, keywords). */
export function filterTopics<T extends GrammarTopicMeta>(topics: T[], query = ''): T[] {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  return topics.filter((t) => {
    if (words.length === 0) return true;
    const haystack = `${t.title} ${t.summary} ${t.keywords.join(' ')}`.toLowerCase();
    return words.every((w) => haystack.includes(w));
  });
}

/** Topics grouped by area, in the order of GRAMMAR_AREAS; empty areas are left out. */
export function groupByArea<T extends GrammarTopicMeta>(topics: T[]): { area: GrammarArea; topics: T[] }[] {
  return GRAMMAR_AREAS.map((area) => ({ area, topics: topics.filter((t) => t.area === area) })).filter((g) => g.topics.length > 0);
}

/** The topics before and after `id` in the given order (undefined at the ends or if `id` is unknown). */
export function adjacentTopics<T extends GrammarTopicMeta>(topics: T[], id: string): { prev?: T; next?: T } {
  const i = topics.findIndex((t) => t.id === id);
  if (i < 0) return {};
  return { prev: topics[i - 1], next: topics[i + 1] };
}
