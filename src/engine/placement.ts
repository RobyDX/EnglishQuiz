import { prepareQuestion } from './buildQuiz';
import { percentOf } from './score';
import { pickRandom, type Rng } from './shuffle';
import { LEVELS, type Level, type Question, type QuestionType } from '../types';

/** Number of questions in a placement test (specs/01 §11). */
export const PLACEMENT_TOTAL = 40;
/** Time limit for the whole test: 60 seconds per question on average. */
export const PLACEMENT_TIME_SECONDS = 40 * 60;
/** A level counts as "reached" with at least this percentage of correct answers... */
export const PLACEMENT_PASS_PERCENT = 70;
/** ...given at least this many questions at that level. */
export const PLACEMENT_MIN_ANSWERS = 5;
const WEAK_TOPIC_MIN_WRONG = 2;
const WEAK_TOPICS_MAX = 5;
/** How many of the latest question types to avoid repeating, when possible. */
const RECENT_TYPES = 2;

/**
 * Types where a single tap is the whole answer: choosing moves on to the next question.
 * The other types have several fields, words to arrange or free text, and need "Next".
 */
const SINGLE_TAP_TYPES: ReadonlySet<QuestionType> = new Set([
  'multiple-choice',
  'verb-form',
  'sentence-choice',
  'odd-one-out',
  'error-spot',
  'place-word',
]);
export const isSingleTap = (q: Question) => SINGLE_TAP_TYPES.has(q.type);

export type Outcome = 'correct' | 'wrong' | 'skipped';

/** Staircase: a right answer makes the next question one level harder; a wrong answer or a skip, one level easier. */
export function nextLevel(level: Level, outcome: Outcome): Level {
  const i = LEVELS.indexOf(level) + (outcome === 'correct' ? 1 : -1);
  return LEVELS[Math.min(LEVELS.length - 1, Math.max(0, i))];
}

export interface PlacementRecord {
  level: Level;
  topic: string;
  correct: boolean;
}

export interface LevelStat {
  answered: number;
  correct: number;
  percent: number;
}

export interface PlacementResult {
  level: Level;
  perLevel: Record<Level, LevelStat>;
  weakTopics: { topic: string; wrong: number }[];
}

/**
 * Estimated level: the highest one with enough questions and enough right answers (A1 if none).
 * With the up/down staircase the questions pile up around the person's level, so that is where the
 * evidence is: a level is reached when most of its questions (skipped ones count as wrong) were right.
 */
export function estimateLevel(records: PlacementRecord[]): PlacementResult {
  const perLevel = Object.fromEntries(LEVELS.map((l) => [l, { answered: 0, correct: 0, percent: 0 }])) as Record<Level, LevelStat>;
  const wrongByTopic = new Map<string, number>();
  for (const r of records) {
    perLevel[r.level].answered++;
    if (r.correct) perLevel[r.level].correct++;
    else wrongByTopic.set(r.topic, (wrongByTopic.get(r.topic) ?? 0) + 1);
  }
  for (const l of LEVELS) perLevel[l].percent = percentOf(perLevel[l].correct, perLevel[l].answered);

  let level: Level = LEVELS[0];
  for (const l of LEVELS) {
    if (perLevel[l].answered >= PLACEMENT_MIN_ANSWERS && perLevel[l].percent >= PLACEMENT_PASS_PERCENT) level = l;
  }

  const weakTopics = [...wrongByTopic.entries()]
    .filter(([, wrong]) => wrong >= WEAK_TOPIC_MIN_WRONG)
    .map(([topic, wrong]) => ({ topic, wrong }))
    .sort((a, b) => b.wrong - a.wrong || a.topic.localeCompare(b.topic))
    .slice(0, WEAK_TOPICS_MAX);
  return { level, perLevel, weakTopics };
}

/**
 * Picks the next question at `level` (any type): not used yet in this test, preferring the ones not seen
 * recently and a type different from the last two. If the level has nothing left, the closest level is used.
 * Returns undefined only if the whole catalogue has run out.
 */
export function pickAdaptiveQuestion(
  pools: Partial<Record<Level, Question[]>>,
  level: Level,
  used: ReadonlySet<string>,
  seenOf: (level: Level) => ReadonlySet<string> = () => new Set(),
  recentTypes: readonly QuestionType[] = [],
  rng: Rng = Math.random,
): Question | undefined {
  const at = LEVELS.indexOf(level);
  const byDistance = [...LEVELS].sort((a, b) => Math.abs(LEVELS.indexOf(a) - at) - Math.abs(LEVELS.indexOf(b) - at));
  for (const l of byDistance) {
    const candidates = (pools[l] ?? []).filter((q) => !used.has(q.id));
    if (candidates.length === 0) continue;
    const seen = seenOf(l);
    const fresh = candidates.filter((q) => !seen.has(q.id));
    const base = fresh.length ? fresh : candidates;
    const avoid = new Set(recentTypes.slice(-RECENT_TYPES));
    const varied = base.filter((q) => !avoid.has(q.type));
    const chosen = pickRandom(varied.length ? varied : base, rng);
    return chosen && prepareQuestion(chosen, rng);
  }
  return undefined;
}
