import { describe, expect, it } from 'vitest';
import { countGaps } from '../engine/rules';
import { LEVELS, TOPICS, type Level, type Question, type QuestionFile } from '../types';

const files = import.meta.glob<QuestionFile>('./*/*.json', { eager: true, import: 'default' });
const entries = Object.entries(files);
const all: { path: string; q: Question }[] = entries.flatMap(([path, f]) => f.questions.map((q) => ({ path, q })));

// Whole-word check: the app must be English only.
const ITALIAN_WORDS = new Set(['della', 'delle', 'gli', 'perché', 'perche', 'molto', 'questo', 'anche', 'nella', 'sono', 'non', 'che', 'il']);

// Levels already brought to 5000 questions with the stricter duplicate rules (specs/06-piano-implementazione.md).
const EXPANDED_LEVELS: Level[] = ['A1', 'A2', 'B1'];

const norm = (v: unknown) =>
  String(v ?? '')
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9 ]+/g, '')
    .trim();

/** Identifies a question regardless of the order of its options, words or pairs. */
function stemOf(q: Question): string {
  const a = q as unknown as Record<string, unknown>;
  const list = (v: unknown) => (Array.isArray(v) ? (v as string[]).map(norm) : []);
  const parts: string[] = [q.type, norm(q.prompt)];
  for (const k of ['text', 'passage', 'wrong', 'original']) if (a[k] !== undefined) parts.push(norm(a[k]));
  if (a.options) parts.push(list(a.options).sort().join('/'));
  if (a.words) parts.push(list(a.words).sort().join(' '));
  if (a.tokens) parts.push(list(a.tokens).join(' '));
  if (a.pairs) parts.push((a.pairs as { left: string; right: string }[]).map((p) => `${norm(p.left)}>${norm(p.right)}`).sort().join('/'));
  if (a.items) parts.push((a.items as { q: string }[]).map((i) => norm(i.q)).join('/'));
  if (a.statements) parts.push((a.statements as { text: string }[]).map((x) => norm(x.text)).sort().join('/'));
  return parts.join('|');
}

/** The question read as one sentence (gaps filled with the right answer), or undefined if it has no such sentence. */
function filledSentence(q: Question): string | undefined {
  switch (q.type) {
    case 'fill-blank':
    case 'verb-conjugate':
    case 'word-bank': {
      let text = q.text;
      for (const ans of q.answers) text = text.replace('___', Array.isArray(ans) ? ans[0] : ans);
      return norm(text);
    }
    case 'multiple-choice':
    case 'verb-form':
      return q.prompt.includes('___') ? norm(q.prompt.replace('___', q.options[q.correct])) : undefined;
    case 'sentence-choice':
      return norm(q.options[q.correct]);
    case 'word-order':
      return norm(q.solutions[0].join(' '));
    default:
      return undefined;
  }
}

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

  it('topics, when present, are non-empty and among the 15 categories', () => {
    for (const { q } of all) {
      if (q.topics === undefined) continue;
      expect(q.topics.length, q.id).toBeGreaterThan(0);
      for (const t of q.topics) expect(TOPICS.includes(t), `${q.id}: ${t}`).toBe(true);
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
  }, 30_000);

  it('has no duplicated question inside a level (option order does not matter)', () => {
    const seen = new Map<string, string>();
    for (const { q } of all) {
      const key = `${q.level}|${stemOf(q)}`;
      expect(seen.has(key), `${q.id} duplicates ${seen.get(key)}`).toBe(false);
      seen.set(key, q.id);
    }
  });

  it.each(EXPANDED_LEVELS)('level %s repeats no sentence across question types and has 5000 questions', (level) => {
    const inLevel = all.filter((x) => x.q.level === level);
    expect(inLevel.length).toBeGreaterThanOrEqual(5000);
    const seen = new Map<string, string>();
    for (const { q } of inLevel) {
      const sentence = filledSentence(q);
      if (!sentence) continue;
      expect(seen.has(sentence), `${q.id} repeats the sentence of ${seen.get(sentence)}: "${sentence}"`).toBe(false);
      seen.set(sentence, q.id);
    }
  });

  it('gives each wrong answer of a question its own explanation', () => {
    for (const { q } of all) {
      const reasons = Object.values(q.wrongReasons ?? {});
      expect(new Set(reasons).size, `${q.id}: a wrongReason is repeated`).toBe(reasons.length);
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
  it.each(LEVELS)('level %s has at least 5000 questions', (level) => {
    expect(all.filter((x) => x.q.level === level).length).toBeGreaterThanOrEqual(5000);
  });
});
