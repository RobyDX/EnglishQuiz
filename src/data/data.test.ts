import { describe, expect, it } from 'vitest';
import { countGaps } from '../engine/rules';
import { LEVELS, type Question, type QuestionFile } from '../types';

const files = import.meta.glob<QuestionFile>('./*/*.json', { eager: true, import: 'default' });
const entries = Object.entries(files);
const all: { path: string; q: Question }[] = entries.flatMap(([path, f]) => f.questions.map((q) => ({ path, q })));

// Whole-word check: the app must be English only.
const ITALIAN_WORDS = new Set(['della', 'delle', 'gli', 'perché', 'perche', 'molto', 'questo', 'anche', 'nella', 'sono', 'non', 'che', 'il']);

function texts(q: Question): string[] {
  const out: string[] = [q.prompt, q.explanation, ...Object.values(q.wrongReasons ?? {})];
  const anyQ = q as unknown as Record<string, unknown>;
  for (const key of ['options', 'text', 'passage', 'tokens', 'words', 'wrong', 'original', 'template']) {
    const v = anyQ[key];
    if (typeof v === 'string') out.push(v);
    if (Array.isArray(v)) out.push(...v.filter((x): x is string => typeof x === 'string'));
  }
  return out;
}

describe('question data', () => {
  it('has data for every level', () => {
    for (const l of LEVELS) expect(all.some((x) => x.q.level === l), l).toBe(true);
  });

  it('has unique ids that match their file', () => {
    const ids = new Set<string>();
    for (const [path, f] of entries) {
      const [, dir, file] = path.match(/\.\/([^/]+)\/([^/]+)\.json$/)!;
      expect(f.level.toLowerCase(), path).toBe(dir);
      expect(f.type, path).toBe(file);
      for (const q of f.questions) {
        expect(q.level, q.id).toBe(f.level);
        expect(q.type, q.id).toBe(f.type);
        expect(q.id.startsWith(`${dir}-`), q.id).toBe(true);
        expect(ids.has(q.id), `duplicate id ${q.id}`).toBe(false);
        ids.add(q.id);
      }
    }
  });

  it('every question has a prompt, a topic and an English explanation', () => {
    for (const { q } of all) {
      expect(q.prompt.trim(), q.id).not.toBe('');
      expect(q.topic.trim(), q.id).not.toBe('');
      expect(q.explanation.trim().length, q.id).toBeGreaterThan(10);
    }
  });

  it('contains no Italian words', () => {
    for (const { q } of all) {
      for (const t of texts(q)) {
        for (const w of t.toLowerCase().match(/[a-zà-ú']+/g) ?? []) {
          expect(ITALIAN_WORDS.has(w), `${q.id}: "${w}"`).toBe(false);
        }
      }
    }
  });

  it('has no duplicated prompts/texts inside a level', () => {
    const seen = new Map<string, string>();
    for (const { q } of all) {
      const anyQ = q as unknown as Record<string, unknown>;
      const key = `${q.level}|${q.type}|${q.prompt}|${anyQ.text ?? ''}|${(anyQ.tokens as string[] | undefined)?.join(' ') ?? ''}|${(anyQ.options as string[] | undefined)?.join('/') ?? ''}|${anyQ.passage ?? ''}|${anyQ.wrong ?? ''}|${anyQ.original ?? ''}|${(anyQ.words as string[] | undefined)?.join(' ') ?? ''}|${(anyQ.pairs as { left: string; right: string }[] | undefined)?.map((p) => `${p.left}>${p.right}`).sort().join('/') ?? ''}`;
      expect(seen.has(key), `${q.id} duplicates ${seen.get(key)}`).toBe(false);
      seen.set(key, q.id);
    }
  });

  it('is structurally valid for every type', () => {
    for (const { q } of all) {
      const id = q.id;
      switch (q.type) {
        case 'multiple-choice':
        case 'verb-form':
        case 'odd-one-out':
        case 'sentence-choice':
          expect(q.options.length, id).toBeGreaterThanOrEqual(3);
          expect(new Set(q.options).size, id).toBe(q.options.length);
          expect(q.correct, id).toBeGreaterThanOrEqual(0);
          expect(q.correct, id).toBeLessThan(q.options.length);
          for (const k of Object.keys(q.wrongReasons ?? {})) {
            expect(Number(k), `${id} wrongReasons key`).toBeLessThan(q.options.length);
            expect(Number(k), `${id} wrongReasons key is the correct option`).not.toBe(q.correct);
          }
          // every distractor explains why it is wrong
          if (q.type !== 'odd-one-out') {
            q.options.forEach((_, i) => {
              if (i !== q.correct) expect(q.wrongReasons?.[i], `${id} missing wrongReason for option ${i}`).toBeTruthy();
            });
          }
          break;
        case 'fill-blank':
        case 'verb-conjugate':
          expect(Object.keys(q.wrongReasons ?? {}).length, `${id}: add wrongReasons for typical mistakes`).toBeGreaterThan(0);
          expect(q.text, id).toContain('___');
          expect(q.answers.length, id).toBe(countGaps(q.text));
          q.answers.forEach((a) => expect(a.length, id).toBeGreaterThan(0));
          break;
        case 'word-bank': {
          expect(q.answers.length, id).toBe(countGaps(q.text));
          q.answers.forEach((a) => expect(q.bank, id).toContain(a));
          // every wrong word, in every gap, must have its own explanation (key `word` or `<gap>:word`)
          const reasons = Object.fromEntries(Object.entries(q.wrongReasons ?? {}).map(([k, v]) => [k.toLowerCase(), v]));
          q.answers.forEach((ans, gap) => {
            for (const w of q.bank) {
              if (w === ans) continue;
              expect(reasons[`${gap}:${w.toLowerCase()}`] ?? reasons[w.toLowerCase()], `${id}: no wrongReason for "${w}" in gap ${gap + 1}`).toBeTruthy();
            }
          });
          break;
        }
        case 'place-word':
          q.correctPositions.forEach((p) => {
            expect(p, id).toBeGreaterThanOrEqual(0);
            expect(p, id).toBeLessThanOrEqual(q.tokens.length);
          });
          expect(q.correctPositions.length, id).toBeGreaterThan(0);
          break;
        case 'word-order': {
          const sorted = q.words.map((w) => w.toLowerCase()).sort().join('|');
          q.solutions.forEach((s) => expect(s.map((w) => w.toLowerCase()).sort().join('|'), id).toBe(sorted));
          break;
        }
        case 'error-spot':
          expect(q.wrongIndex, id).toBeLessThan(q.tokens.length);
          expect(q.fix, id).toBeTruthy();
          break;
        case 'error-correct':
          expect(Object.keys(q.wrongReasons ?? {}).length, `${id}: add wrongReasons for typical mistakes`).toBeGreaterThan(0);
          expect(q.wrong, id).toBeTruthy();
          expect(q.solutions.length, id).toBeGreaterThan(0);
          break;
        case 'transform':
          expect(q.original, id).toBeTruthy();
          expect(q.keyword, id).toBeTruthy();
          expect(q.solutions.length, id).toBeGreaterThan(0);
          break;
        case 'true-false':
          expect(q.statements.length, id).toBeGreaterThan(0);
          break;
        case 'reading-mc':
          q.items.forEach((it) => {
            expect(it.correct, id).toBeLessThan(it.options.length);
          });
          break;
        case 'match-pairs':
          expect(new Set(q.pairs.map((p) => p.left)).size, id).toBe(q.pairs.length);
          expect(new Set(q.pairs.map((p) => p.right)).size, id).toBe(q.pairs.length);
          break;
      }
    }
  });
});

// Content targets (specs/07-contenuti.md). Run with CHECK_QUOTAS=1 once the content is complete.
describe.skipIf(!process.env.CHECK_QUOTAS)('content quotas', () => {
  it.each(LEVELS)('level %s has at least 2000 questions', (level) => {
    expect(all.filter((x) => x.q.level === level).length).toBeGreaterThanOrEqual(2000);
  });
});
