import { describe, expect, it } from 'vitest';
import {
  estimateLevel,
  isSingleTap,
  nextLevel,
  pickAdaptiveQuestion,
  PLACEMENT_TOTAL,
  type PlacementRecord,
} from './placement';
import { LEVELS, type Level, type Question, type QuestionType } from '../types';

const rec = (level: Level, correct: boolean, topic = 't'): PlacementRecord => ({ level, topic, correct });
const many = (level: Level, right: number, wrong: number, topic = 't') => [
  ...Array.from({ length: right }, () => rec(level, true, topic)),
  ...Array.from({ length: wrong }, () => rec(level, false, topic)),
];

const q = (id: string, level: Level = 'A1', type: QuestionType = 'multiple-choice'): Question =>
  ({
    id,
    type,
    level,
    topic: 'x',
    prompt: 'p ___',
    explanation: 'e e e e e e',
    options: ['a', 'b', 'c'],
    correct: 0,
    text: '___',
    answers: [['a']],
    words: ['a', 'b'],
    solutions: [['a', 'b']],
  }) as unknown as Question;

describe('nextLevel (staircase)', () => {
  it('goes one level up after a right answer and one down after a wrong answer or a skip', () => {
    expect(nextLevel('A1', 'correct')).toBe('A2');
    expect(nextLevel('B1', 'correct')).toBe('B2');
    expect(nextLevel('B2', 'wrong')).toBe('B1');
    expect(nextLevel('B2', 'skipped')).toBe('B1');
  });

  it('never goes below A1 or above C2', () => {
    expect(nextLevel('A1', 'wrong')).toBe('A1');
    expect(nextLevel('A1', 'skipped')).toBe('A1');
    expect(nextLevel('C2', 'correct')).toBe('C2');
  });
});

describe('estimateLevel', () => {
  it('is the highest level with at least 5 questions and at least 70% right', () => {
    const r = estimateLevel([...many('A2', 4, 0), ...many('B1', 8, 2), ...many('B2', 3, 3)]);
    expect(r.level).toBe('B1');
    expect(r.perLevel.B1).toEqual({ answered: 10, correct: 8, percent: 80 });
    expect(r.perLevel.B2.percent).toBe(50);
  });

  it('ignores levels with fewer than 5 questions', () => {
    expect(estimateLevel([...many('B1', 6, 0), ...many('C1', 4, 0)]).level).toBe('B1');
  });

  it('a person who is right at one level and wrong at the next is placed at the first', () => {
    const zigzag = [...many('B1', 15, 1), ...many('B2', 1, 15)];
    expect(estimateLevel(zigzag).level).toBe('B1');
  });

  it('a perfect run (A1, A2, ... C2, C2, ...) ends at C2; all wrong ends at A1; nothing gives A1', () => {
    const climb = [...LEVELS.map((l) => rec(l, true)), ...many('C2', PLACEMENT_TOTAL - LEVELS.length, 0)];
    expect(estimateLevel(climb).level).toBe('C2');
    expect(estimateLevel(many('A1', 0, 40)).level).toBe('A1');
    expect(estimateLevel([]).level).toBe('A1');
  });

  it('counts the questions per level, with the skipped ones as wrong', () => {
    const r = estimateLevel([...many('A1', 2, 1), ...many('A2', 1, 3)]);
    expect(r.perLevel.A1).toEqual({ answered: 3, correct: 2, percent: 67 });
    expect(r.perLevel.A2).toEqual({ answered: 4, correct: 1, percent: 25 });
    expect(r.perLevel.C2.answered).toBe(0);
  });

  it('lists the weakest topics (at least 2 mistakes, most first, max 5)', () => {
    const records = [
      ...many('A1', 0, 3, 'articles'),
      ...many('A1', 0, 2, 'plurals'),
      ...many('A1', 0, 1, 'colours'),
      ...many('A2', 0, 4, 'going-to'),
      ...many('A2', 0, 2, 'b'),
      ...many('A2', 0, 2, 'a'),
      ...many('A2', 0, 2, 'c'),
    ];
    const weak = estimateLevel(records).weakTopics;
    expect(weak.map((w) => w.topic)).toEqual(['going-to', 'articles', 'a', 'b', 'c']);
    expect(weak[0].wrong).toBe(4);
  });
});

describe('isSingleTap', () => {
  it('is true for the types where one tap is the whole answer', () => {
    for (const t of ['multiple-choice', 'verb-form', 'sentence-choice', 'odd-one-out', 'error-spot', 'place-word'] as const) {
      expect(isSingleTap(q('x', 'A1', t)), t).toBe(true);
    }
  });

  it('is false for the types that need more than one action', () => {
    for (const t of ['fill-blank', 'verb-conjugate', 'word-bank', 'word-order', 'error-correct', 'transform', 'true-false', 'reading-mc', 'match-pairs'] as const) {
      expect(isSingleTap(q('x', 'A1', t)), t).toBe(false);
    }
  });
});

describe('pickAdaptiveQuestion', () => {
  const pool = (level: Level, n: number, type: QuestionType = 'multiple-choice') =>
    Array.from({ length: n }, (_, i) => q(`${level}-${type}-${i}`, level, type));

  it('picks a question of the requested level, of any type', () => {
    const pools = { A1: pool('A1', 5), B1: pool('B1', 5, 'fill-blank') };
    for (let i = 0; i < 20; i++) {
      const picked = pickAdaptiveQuestion(pools, 'B1', new Set())!;
      expect(picked.level).toBe('B1');
      expect(picked.type).toBe('fill-blank');
    }
  });

  it('skips used questions and prefers the ones not seen recently', () => {
    const pools = { A1: [q('1'), q('2'), q('3')] };
    for (let i = 0; i < 20; i++) {
      expect(pickAdaptiveQuestion(pools, 'A1', new Set(['1']), () => new Set(['2']))!.id).toBe('3');
    }
    expect(pickAdaptiveQuestion(pools, 'A1', new Set(['1', '3']), () => new Set(['2']))!.id).toBe('2');
  });

  it('prefers a type different from the last two, when there is one', () => {
    const pools = { A1: [...pool('A1', 5, 'multiple-choice'), ...pool('A1', 5, 'fill-blank'), ...pool('A1', 5, 'word-order')] };
    for (let i = 0; i < 30; i++) {
      expect(pickAdaptiveQuestion(pools, 'A1', new Set(), undefined, ['multiple-choice', 'fill-blank'])!.type).toBe('word-order');
    }
    // only the last two types count
    const types = new Set<string>();
    for (let i = 0; i < 60; i++) types.add(pickAdaptiveQuestion(pools, 'A1', new Set(), undefined, ['multiple-choice', 'multiple-choice', 'fill-blank'])!.type);
    expect(types.has('fill-blank')).toBe(false);
    expect(types.has('multiple-choice')).toBe(false);
    // if every type was just used, any type will do
    expect(pickAdaptiveQuestion({ A1: pool('A1', 3, 'fill-blank') }, 'A1', new Set(), undefined, ['fill-blank', 'fill-blank'])).toBeDefined();
  });

  it('uses the closest level when the requested one has nothing left', () => {
    const pools = { A1: [q('a', 'A1')], B2: [q('b', 'B2')], C2: [q('c', 'C2')] };
    expect(pickAdaptiveQuestion(pools, 'B1', new Set(['x']))!.level).toBe('B2'); // distance 1
    expect(pickAdaptiveQuestion(pools, 'B2', new Set(['b']))!.level).toBe('C2'); // C2 is closer to B2 than A1
    expect(pickAdaptiveQuestion(pools, 'C2', new Set(['c', 'b']))!.level).toBe('A1');
  });

  it('returns undefined when nothing is left', () => {
    expect(pickAdaptiveQuestion({ A1: [q('1')] }, 'A1', new Set(['1']))).toBeUndefined();
    expect(pickAdaptiveQuestion({}, 'A1', new Set())).toBeUndefined();
  });
});

describe('the whole staircase', () => {
  const pools = Object.fromEntries(
    LEVELS.map((l) => [l, Array.from({ length: 60 }, (_, i) => q(`${l}-${i}`, l, (['multiple-choice', 'fill-blank', 'word-order'] as const)[i % 3]))]),
  ) as Record<Level, Question[]>;

  /** A person who answers right every question up to `known` and wrong every question above it. */
  const run = (known: Level, skipAbove = false) => {
    const used = new Set<string>();
    const types: QuestionType[] = [];
    const records: PlacementRecord[] = [];
    let level: Level = 'A1';
    const asked: Level[] = [];
    for (let n = 0; n < PLACEMENT_TOTAL; n++) {
      const picked = pickAdaptiveQuestion(pools, level, used, undefined, types)!;
      used.add(picked.id);
      types.push(picked.type);
      asked.push(picked.level);
      const correct = LEVELS.indexOf(picked.level) <= LEVELS.indexOf(known);
      records.push({ level: picked.level, topic: 't', correct });
      level = nextLevel(picked.level, correct ? 'correct' : skipAbove ? 'skipped' : 'wrong');
    }
    return { level: estimateLevel(records).level, asked };
  };

  it.each(LEVELS)('finds the level of a person who knows everything up to %s', (known) => {
    expect(run(known).level).toBe(known);
    expect(run(known, true).level).toBe(known);
  });

  it('starts at A1, climbs one level at a time, then hovers around the level of the person', () => {
    const { asked } = run('B1');
    expect(asked.slice(0, 4)).toEqual(['A1', 'A2', 'B1', 'B2']);
    expect(new Set(asked.slice(10))).toEqual(new Set(['B1', 'B2']));
  });
});
