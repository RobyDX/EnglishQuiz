import { describe, expect, it } from 'vitest';
import {
  estimateLevel,
  buildPlacementSet,
  isPlacementQuestion,
  pickPlacementQuestion,
  PLACEMENT_QUOTAS,
  PLACEMENT_TOTAL,
  type PlacementRecord,
} from './placement';
import { LEVELS, type Level, type Question } from '../types';

const rec = (level: Level, correct: boolean, topic = 't'): PlacementRecord => ({ level, topic, correct });
const many = (level: Level, right: number, wrong: number, topic = 't') => [
  ...Array.from({ length: right }, () => rec(level, true, topic)),
  ...Array.from({ length: wrong }, () => rec(level, false, topic)),
];

const mc = (id: string, level: Level = 'A1'): Question => ({
  id,
  type: 'multiple-choice',
  level,
  topic: 'x',
  prompt: 'p ___',
  explanation: 'e e e e e e',
  options: ['a', 'b', 'c'],
  correct: 0,
});

describe('buildPlacementSet', () => {
  const pool = (level: Level, n: number) => Array.from({ length: n }, (_, i) => mc(`${level}-${i}`, level));
  const pools = Object.fromEntries(LEVELS.map((l) => [l, pool(l, 30)])) as Record<Level, Question[]>;

  it('quotas add up to the total', () => {
    expect(LEVELS.reduce((n, l) => n + PLACEMENT_QUOTAS[l], 0)).toBe(PLACEMENT_TOTAL);
  });

  it('builds 40 distinct questions, easiest level first, following the quotas', () => {
    const set = buildPlacementSet(pools);
    expect(set).toHaveLength(PLACEMENT_TOTAL);
    expect(new Set(set.map((q) => q.id)).size).toBe(PLACEMENT_TOTAL);
    expect(set.map((q) => q.level)).toEqual(LEVELS.flatMap((l) => Array<Level>(PLACEMENT_QUOTAS[l]).fill(l)));
  });

  it('fills a short level from the closest ones and never duplicates', () => {
    const set = buildPlacementSet({ ...pools, C2: pool('C2', 2) });
    expect(set).toHaveLength(PLACEMENT_TOTAL);
    expect(new Set(set.map((q) => q.id)).size).toBe(PLACEMENT_TOTAL);
  });

  it('returns what exists if the catalogue is too small', () => {
    expect(buildPlacementSet({ A1: pool('A1', 3) })).toHaveLength(3);
    expect(buildPlacementSet({})).toEqual([]);
  });
});

describe('estimateLevel', () => {
  it('is the highest level with enough answers and at least 70% correct', () => {
    const r = estimateLevel([...many('A2', 4, 0), ...many('B1', 8, 2), ...many('B2', 3, 3)]);
    expect(r.level).toBe('B1');
    expect(r.perLevel.B1).toEqual({ answered: 10, correct: 8, percent: 80 });
    expect(r.perLevel.B2.percent).toBe(50);
  });

  it('ignores levels with fewer than 5 answers', () => {
    expect(estimateLevel([...many('B1', 6, 0), ...many('C1', 4, 0)]).level).toBe('B1');
  });

  it('reaches C2 when everything is right at C2', () => {
    expect(estimateLevel([...many('B2', 2, 0), ...many('C2', 30, 0)]).level).toBe('C2');
  });

  it('falls back to A1 when no level reaches 70%', () => {
    expect(estimateLevel(many('A1', 1, 9)).level).toBe('A1');
    expect(estimateLevel([]).level).toBe('A1');
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

describe('pickPlacementQuestion', () => {
  it('only uses single-tap types', () => {
    expect(isPlacementQuestion(mc('1'))).toBe(true);
    expect(isPlacementQuestion({ ...mc('2'), type: 'odd-one-out' } as Question)).toBe(true);
    expect(isPlacementQuestion({ ...mc('3'), type: 'fill-blank', text: '___', answers: [['a']] } as unknown as Question)).toBe(false);
  });

  it('skips used questions and prefers the ones not seen recently', () => {
    const pool = [mc('1'), mc('2'), mc('3')];
    for (let i = 0; i < 20; i++) {
      expect(pickPlacementQuestion(pool, new Set(['1']), new Set(['2']))!.id).toBe('3');
    }
    expect(pickPlacementQuestion(pool, new Set(['1', '3']), new Set(['2']))!.id).toBe('2');
  });

  it('returns undefined when nothing is left', () => {
    expect(pickPlacementQuestion([mc('1')], new Set(['1']))).toBeUndefined();
    expect(pickPlacementQuestion([], new Set())).toBeUndefined();
  });
});
