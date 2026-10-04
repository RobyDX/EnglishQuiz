import { beforeEach, describe, expect, it } from 'vitest';
import { addHistory, loadHistory } from './store';

const entry = (date: string, correct = 7) => ({ date, level: 'A1' as const, total: 10, correct, percent: correct * 10 });

beforeEach(() => localStorage.clear());

describe('history', () => {
  it('keeps the most recent first and caps the list at 50', () => {
    for (let i = 0; i < 55; i++) addHistory(entry(new Date(2026, 0, 1, 0, 0, i * 10).toISOString(), i % 10));
    const h = loadHistory();
    expect(h).toHaveLength(50);
    expect(new Date(h[0].date).getTime()).toBeGreaterThan(new Date(h[1].date).getTime());
  });

  it('ignores duplicates saved a few ms apart by older versions, but not real repeats', () => {
    localStorage.setItem(
      'eq.history',
      JSON.stringify([
        entry('2026-01-01T10:00:00.010Z'),
        entry('2026-01-01T10:00:00.000Z'), // duplicate of the first
        entry('2026-01-01T09:00:00.000Z'), // same score one hour earlier: a real, different quiz
      ]),
    );
    expect(loadHistory().map((e) => e.date)).toEqual(['2026-01-01T10:00:00.010Z', '2026-01-01T09:00:00.000Z']);
  });
});
