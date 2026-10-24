import { TOPICS, type Question, type Topic } from '../types';

/** Keeps the questions tagged with at least one of the selected topics. No selection = all questions. */
export function filterByTopics(pool: Question[], topics?: readonly Topic[]): Question[] {
  if (!topics || topics.length === 0) return pool;
  return pool.filter((q) => q.topics?.some((t) => topics.includes(t)));
}

/** Number of questions per topic (a question with several topics counts in each of them). */
export function countByTopic(pool: Question[]): Record<Topic, number> {
  const counts = Object.fromEntries(TOPICS.map((t) => [t, 0])) as Record<Topic, number>;
  for (const q of pool) for (const t of q.topics ?? []) counts[t]++;
  return counts;
}
