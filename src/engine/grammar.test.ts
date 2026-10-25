import { describe, expect, it } from 'vitest';
import { adjacentTopics, filterTopics, groupByArea } from './grammar';
import type { GrammarTopicMeta } from '../types/grammar';

const t = (id: string, o: Partial<GrammarTopicMeta> = {}): GrammarTopicMeta => ({
  id,
  title: id,
  area: 'Tenses',
  summary: '',
  keywords: [],
  ...o,
});

const topics = [
  t('articles', { title: 'Articles', area: 'Nouns & determiners', summary: 'a, an and the', keywords: ['determiners'] }),
  t('present-perfect', { title: 'Present perfect', keywords: ['since', 'for'] }),
  t('past-simple', { title: 'Past simple', summary: 'finished actions' }),
];

describe('filterTopics', () => {
  it('returns everything without a query', () => {
    expect(filterTopics(topics)).toHaveLength(3);
  });
  it('searches title, summary and keywords, ignoring case, and requires every word', () => {
    expect(filterTopics(topics, 'PRESENT').map((x) => x.id)).toEqual(['present-perfect']);
    expect(filterTopics(topics, 'finished').map((x) => x.id)).toEqual(['past-simple']);
    expect(filterTopics(topics, 'since').map((x) => x.id)).toEqual(['present-perfect']);
    expect(filterTopics(topics, 'present simple')).toEqual([]);
    expect(filterTopics(topics, '   ')).toHaveLength(3);
  });
});

describe('groupByArea', () => {
  it('follows the order of the areas and leaves empty ones out', () => {
    const groups = groupByArea(topics);
    expect(groups.map((g) => g.area)).toEqual(['Nouns & determiners', 'Tenses']);
    expect(groups[1].topics.map((x) => x.id)).toEqual(['present-perfect', 'past-simple']);
    expect(groupByArea([])).toEqual([]);
  });
});

describe('adjacentTopics', () => {
  it('gives the previous and next topic', () => {
    expect(adjacentTopics(topics, 'present-perfect')).toEqual({ prev: topics[0], next: topics[2] });
  });
  it('has no previous at the start and no next at the end', () => {
    expect(adjacentTopics(topics, 'articles').prev).toBeUndefined();
    expect(adjacentTopics(topics, 'past-simple').next).toBeUndefined();
  });
  it('returns nothing for an unknown id', () => {
    expect(adjacentTopics(topics, 'nope')).toEqual({});
  });
});
