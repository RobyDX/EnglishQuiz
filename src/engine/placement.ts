import { prepareQuestion } from './buildQuiz';
import { percentOf } from './score';
import { pickRandom, type Rng } from './shuffle';
import { LEVELS, type Level, type Question, type QuestionType } from '../types';

/** Number of questions in a placement test (specs/01 §11). */
export const PLACEMENT_TOTAL = 40;
export const PLACEMENT_START: Level = 'B1';
/** Consecutive correct answers needed to move one level up. */
export const PLACEMENT_UP_AFTER = 2;
/** A level counts as "reached" with at least this percentage of correct answers... */
export const PLACEMENT_PASS_PERCENT = 70;
/** ...given at least this many answers at that level. */
export const PLACEMENT_MIN_ANSWERS = 5;
const WEAK_TOPIC_MIN_WRONG = 2;
const WEAK_TOPICS_MAX = 5;

/** Single-tap types only: choosing an answer is enough to move on to the next question. */
const PLACEMENT_TYPES: ReadonlySet<QuestionType> = new Set(['multiple-choice', 'verb-form', 'sentence-choice', 'odd-one-out']);
export const isPlacementQuestion = (q: Question) => PLACEMENT_TYPES.has(q.type);

export interface Step {
  level: Level;
  /** Correct answers in a row at the current level. */
  streak: number;
}

export const initialStep = (): Step => ({ level: PLACEMENT_START, streak: 0 });

/** Up/down staircase: 2 correct in a row go up one level, 1 wrong goes down one level. */
export function nextStep(step: Step, correct: boolean): Step {
  const i = LEVELS.indexOf(step.level);
  if (!correct) return { level: LEVELS[Math.max(0, i - 1)], streak: 0 };
  const streak = step.streak + 1;
  if (streak >= PLACEMENT_UP_AFTER) return { level: LEVELS[Math.min(LEVELS.length - 1, i + 1)], streak: 0 };
  return { level: step.level, streak };
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

/** Estimated level = the highest one with enough answers and enough correct ones (A1 if none). */
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
 * Picks a random question that is suitable for the placement test, not used yet in this test,
 * preferring the ones not seen recently. Returns undefined if the pool has none left.
 */
export function pickPlacementQuestion(
  pool: Question[],
  used: ReadonlySet<string>,
  seen: ReadonlySet<string> = new Set(),
  rng: Rng = Math.random,
): Question | undefined {
  const candidates = pool.filter((q) => isPlacementQuestion(q) && !used.has(q.id));
  const fresh = candidates.filter((q) => !seen.has(q.id));
  const chosen = pickRandom(fresh.length ? fresh : candidates, rng);
  return chosen && prepareQuestion(chosen, rng);
}
