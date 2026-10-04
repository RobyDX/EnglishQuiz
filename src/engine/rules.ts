import { normalize } from './normalize';
import type { Question } from '../types';

export const GAP = '___';
const NO_ANSWER = 'No answer';

export function countGaps(text: string): number {
  return text.split(GAP).length - 1;
}

/** Replaces each `___` with the corresponding value (left as `___` when empty). */
export function fillGaps(text: string, values: readonly string[]): string {
  let i = 0;
  return text.replace(/___/g, () => values[i++] || GAP);
}

function insertAt(tokens: readonly string[], word: string, pos: number): string {
  const out = tokens.slice();
  out.splice(pos, 0, word);
  return out.join(' ');
}

const isNum = (a: unknown): a is number => typeof a === 'number';
const strs = (a: unknown): string[] => (Array.isArray(a) ? (a as string[]) : []);

/** True when the user has completed the whole question. */
export function isAnswered(q: Question, a: unknown): boolean {
  switch (q.type) {
    case 'multiple-choice':
    case 'verb-form':
    case 'odd-one-out':
    case 'sentence-choice':
    case 'place-word':
    case 'error-spot':
      return isNum(a);
    case 'fill-blank':
    case 'verb-conjugate':
    case 'word-bank': {
      const v = strs(a);
      return Array.from({ length: countGaps(q.text) }, (_, i) => v[i]).every((s) => !!s && s.trim() !== '');
    }
    case 'word-order':
      return strs(a).length === q.words.length;
    case 'error-correct':
    case 'transform':
      return typeof a === 'string' && a.trim() !== '';
    case 'true-false':
      return Array.isArray(a) && q.statements.every((_, i) => typeof a[i] === 'boolean');
    case 'reading-mc':
      return Array.isArray(a) && q.items.every((_, i) => isNum(a[i]));
    case 'match-pairs': {
      const m = (a ?? {}) as Record<string, string>;
      return q.pairs.every((p) => !!m[p.left]);
    }
  }
}

export function gradeQuestion(q: Question, a: unknown): boolean {
  if (!isAnswered(q, a)) return false;
  switch (q.type) {
    case 'multiple-choice':
    case 'verb-form':
    case 'odd-one-out':
    case 'sentence-choice':
      return a === q.correct;
    case 'place-word':
      return q.correctPositions.includes(a as number);
    case 'error-spot':
      return a === q.wrongIndex;
    case 'fill-blank':
    case 'verb-conjugate': {
      const v = strs(a);
      return q.answers.every((acc, i) => acc.map(normalize).includes(normalize(v[i] ?? '')));
    }
    case 'word-bank': {
      const v = strs(a);
      return q.answers.every((ans, i) => normalize(ans) === normalize(v[i] ?? ''));
    }
    case 'word-order': {
      const got = normalize(strs(a).join(' '));
      return q.solutions.some((s) => normalize(s.join(' ')) === got);
    }
    case 'error-correct':
    case 'transform':
      return q.solutions.map(normalize).includes(normalize(a as string));
    case 'true-false':
      return q.statements.every((s, i) => (a as boolean[])[i] === s.answer);
    case 'reading-mc':
      return q.items.every((it, i) => (a as number[])[i] === it.correct);
    case 'match-pairs': {
      const m = a as Record<string, string>;
      return q.pairs.every((p) => m[p.left] === p.right);
    }
  }
}

/** Human-readable text of the user's answer (partial answers included). */
export function formatAnswer(q: Question, a: unknown): string {
  switch (q.type) {
    case 'multiple-choice':
    case 'verb-form':
    case 'odd-one-out':
    case 'sentence-choice':
      return isNum(a) ? q.options[a] : NO_ANSWER;
    case 'place-word':
      return isNum(a) ? insertAt(q.tokens, q.word, a) : NO_ANSWER;
    case 'error-spot':
      return isNum(a) ? `"${q.tokens[a]}"` : NO_ANSWER;
    case 'fill-blank':
    case 'verb-conjugate':
    case 'word-bank': {
      const v = strs(a);
      return v.some(Boolean) ? fillGaps(q.text, v) : NO_ANSWER;
    }
    case 'word-order':
      return strs(a).length ? strs(a).join(' ') : NO_ANSWER;
    case 'error-correct':
    case 'transform':
      return typeof a === 'string' && a.trim() ? a : NO_ANSWER;
    case 'true-false': {
      const v = (Array.isArray(a) ? a : []) as (boolean | undefined)[];
      if (!v.some((x) => typeof x === 'boolean')) return NO_ANSWER;
      return q.statements.map((_, i) => `${i + 1}. ${v[i] === undefined ? '—' : v[i] ? 'True' : 'False'}`).join('; ');
    }
    case 'reading-mc': {
      const v = (Array.isArray(a) ? a : []) as (number | undefined)[];
      if (!v.some(isNum)) return NO_ANSWER;
      return q.items.map((it, i) => `${i + 1}. ${isNum(v[i]) ? it.options[v[i]] : '—'}`).join('; ');
    }
    case 'match-pairs': {
      const m = (a ?? {}) as Record<string, string>;
      if (!q.pairs.some((p) => m[p.left])) return NO_ANSWER;
      return q.pairs.map((p) => `${p.left} – ${m[p.left] || '—'}`).join('; ');
    }
  }
}

/** Human-readable text of the correct answer. */
export function formatSolution(q: Question): string {
  switch (q.type) {
    case 'multiple-choice':
    case 'verb-form':
    case 'odd-one-out':
    case 'sentence-choice':
      return q.options[q.correct];
    case 'place-word':
      return insertAt(q.tokens, q.word, q.correctPositions[0]);
    case 'error-spot':
      return `"${q.tokens[q.wrongIndex]}" should be "${q.fix}"`;
    case 'fill-blank':
    case 'verb-conjugate':
      return fillGaps(
        q.text,
        q.answers.map((a) => a[0]),
      );
    case 'word-bank':
      return fillGaps(q.text, q.answers);
    case 'word-order':
      return q.solutions[0].join(' ');
    case 'error-correct':
    case 'transform':
      return q.solutions[0];
    case 'true-false':
      return q.statements.map((s, i) => `${i + 1}. ${s.answer ? 'True' : 'False'}`).join('; ');
    case 'reading-mc':
      return q.items.map((it, i) => `${i + 1}. ${it.options[it.correct]}`).join('; ');
    case 'match-pairs':
      return q.pairs.map((p) => `${p.left} – ${p.right}`).join('; ');
  }
}

/** Keys to look up in `wrongReasons` for the given answer. */
function wrongKeys(q: Question, a: unknown): string[] {
  switch (q.type) {
    case 'multiple-choice':
    case 'verb-form':
    case 'odd-one-out':
    case 'sentence-choice':
    case 'place-word':
    case 'error-spot':
      return isNum(a) ? [String(a)] : [];
    case 'fill-blank':
    case 'verb-conjugate':
    case 'word-bank':
      return strs(a).filter(Boolean).map(normalize);
    case 'word-order':
      return [normalize(strs(a).join(' '))];
    case 'error-correct':
    case 'transform':
      return typeof a === 'string' ? [normalize(a)] : [];
    default:
      return [];
  }
}

/** The specific "why it's wrong" text for this answer, if the question provides one. */
export function wrongReasonFor(q: Question, a: unknown): string | undefined {
  if (!q.wrongReasons) return undefined;
  const table = Object.fromEntries(
    Object.entries(q.wrongReasons).map(([k, v]) => [/^\d+$/.test(k) ? k : normalize(k), v]),
  );
  for (const key of wrongKeys(q, a)) {
    if (table[key]) return table[key];
  }
  return undefined;
}
