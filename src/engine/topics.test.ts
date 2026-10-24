import { describe, expect, it } from 'vitest';
import { countByTopic, filterByTopics } from './topics';
import type { Question } from '../types';

const base = { level: 'A1' as const, topic: 't', prompt: 'p', explanation: 'rule' };
const q = (id: string, topics?: Question['topics']) =>
  ({ ...base, id, type: 'multiple-choice', options: ['a', 'b'], correct: 0, topics }) as Question;

const pool = [
  q('1', ['verb-tenses']),
  q('2', ['verb-tenses', 'prepositions']),
  q('3', ['everyday-life']),
  q('4'),
];

describe('filterByTopics', () => {
  it('keeps every question when no topic is selected', () => {
    expect(filterByTopics(pool)).toHaveLength(4);
    expect(filterByTopics(pool, [])).toHaveLength(4);
  });

  it('keeps the questions tagged with at least one selected topic', () => {
    expect(filterByTopics(pool, ['verb-tenses']).map((x) => x.id)).toEqual(['1', '2']);
    expect(filterByTopics(pool, ['prepositions', 'everyday-life']).map((x) => x.id)).toEqual(['2', '3']);
  });

  it('drops questions without topics when a filter is active', () => {
    expect(filterByTopics(pool, ['everyday-life']).map((x) => x.id)).not.toContain('4');
  });
});

describe('countByTopic', () => {
  it('counts each question in all its topics', () => {
    const counts = countByTopic(pool);
    expect(counts['verb-tenses']).toBe(2);
    expect(counts.prepositions).toBe(1);
    expect(counts['everyday-life']).toBe(1);
    expect(counts['modal-verbs']).toBe(0);
  });
});
