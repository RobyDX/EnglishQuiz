import { describe, expect, it } from 'vitest';
import { GRAMMAR_TOPICS } from './registry';
import { GRAMMAR_AREAS } from '../types/grammar';

describe('grammar registry', () => {
  it('has unique kebab-case ids', () => {
    const ids = GRAMMAR_TOPICS.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(id).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
  });

  it('has the required fields and a valid area', () => {
    for (const t of GRAMMAR_TOPICS) {
      expect(t.title.trim(), t.id).not.toBe('');
      expect(t.summary.trim(), t.id).not.toBe('');
      expect(t.keywords.length, t.id).toBeGreaterThan(0);
      expect(GRAMMAR_AREAS, t.id).toContain(t.area);
    }
  });

  it('only relates to existing topics, never to itself', () => {
    const ids = new Set(GRAMMAR_TOPICS.map((t) => t.id));
    for (const t of GRAMMAR_TOPICS) {
      for (const r of t.related ?? []) {
        expect(ids.has(r), `${t.id} -> ${r}`).toBe(true);
        expect(r).not.toBe(t.id);
      }
    }
  });

  it('has one page file per registered topic and no orphan page', () => {
    const files = Object.keys(import.meta.glob('./topics/*.tsx'))
      .map((f) => f.replace(/^\.\/topics\//, '').replace(/\.tsx$/, ''))
      .sort();
    expect(files).toEqual(GRAMMAR_TOPICS.map((t) => t.id).sort());
  });
});
