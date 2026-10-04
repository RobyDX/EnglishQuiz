import { describe, expect, it } from 'vitest';
import { normalize } from './normalize';
import { buildQuiz, prepareQuestion } from './buildQuiz';
import { gradeQuiz } from './gradeQuiz';
import { bandOf, percentOf } from './score';
import { explainWrong, formatAnswer, formatSolution, gradeQuestion, isAnswered, wrongReasonFor } from './rules';
import type { Question } from '../types';

const base = { level: 'A1' as const, topic: 't', prompt: 'p', explanation: 'rule' };

const mc: Question = { ...base, id: 'mc1', type: 'multiple-choice', options: ['a', 'b', 'c'], correct: 1, wrongReasons: { 0: 'because a', 2: 'because c' } };
const fb: Question = { ...base, id: 'fb1', type: 'fill-blank', text: 'I ___ a student and she ___ a teacher.', answers: [['am'], ['is', "'s"]], wrongReasons: { Are: 'no are' } };
const wb: Question = { ...base, id: 'wb1', type: 'word-bank', bank: ['in', 'on'], text: 'It is ___ the table.', answers: ['on'] };
const pw: Question = { ...base, id: 'pw1', type: 'place-word', word: 'always', tokens: ['She', 'goes', 'home'], correctPositions: [1] };
const wo: Question = { ...base, id: 'wo1', type: 'word-order', words: ['she', 'goes'], solutions: [['She', 'goes']] };
const es: Question = { ...base, id: 'es1', type: 'error-spot', tokens: ['He', 'go'], wrongIndex: 1, fix: 'goes' };
const ec: Question = { ...base, id: 'ec1', type: 'error-correct', wrong: 'He go.', solutions: ['He goes.'] };
const tf: Question = { ...base, id: 'tf1', type: 'true-false', passage: 'x', statements: [{ text: 's1', answer: true }, { text: 's2', answer: false }] };
const rm: Question = { ...base, id: 'rm1', type: 'reading-mc', passage: 'x', items: [{ q: 'q', options: ['a', 'b'], correct: 1 }] };
const mp: Question = { ...base, id: 'mp1', type: 'match-pairs', pairs: [{ left: 'big', right: 'large' }, { left: 'hot', right: 'cold' }] };

describe('normalize', () => {
  it('ignores case, spaces, curly quotes and trailing punctuation', () => {
    expect(normalize("  Don’t   GO. ")).toBe("don't go");
  });
});

describe('score', () => {
  it('computes rounded percent and band', () => {
    expect(percentOf(7, 10)).toBe(70);
    expect(percentOf(1, 3)).toBe(33);
    expect(percentOf(0, 0)).toBe(0);
    expect(bandOf(95).label).toBe('Excellent');
    expect(bandOf(70).label).toBe('Good');
    expect(bandOf(50).label).toBe('Pass');
    expect(bandOf(49).label).toBe('Needs review');
  });
});

describe('grading', () => {
  it('multiple choice', () => {
    expect(gradeQuestion(mc, 1)).toBe(true);
    expect(gradeQuestion(mc, 0)).toBe(false);
    expect(gradeQuestion(mc, undefined)).toBe(false);
    expect(wrongReasonFor(mc, 2)).toBe('because c');
    expect(formatAnswer(mc, 2)).toBe('c');
    expect(formatSolution(mc)).toBe('b');
  });
  it('gaps need all answers correct, accept alternatives and normalize', () => {
    expect(gradeQuestion(fb, ['am', 'is'])).toBe(true);
    expect(gradeQuestion(fb, [' AM ', "'s"])).toBe(true);
    expect(gradeQuestion(fb, ['am', 'are'])).toBe(false);
    expect(gradeQuestion(fb, ['am'])).toBe(false);
    expect(isAnswered(fb, ['am', ''])).toBe(false);
    expect(wrongReasonFor(fb, ['am', 'are'])).toBe('no are');
    expect(formatAnswer(fb, ['am', 'are'])).toBe('I am a student and she are a teacher.');
    expect(formatSolution(fb)).toBe('I am a student and she is a teacher.');
  });
  it('word bank', () => {
    expect(gradeQuestion(wb, ['on'])).toBe(true);
    expect(gradeQuestion(wb, ['in'])).toBe(false);
  });
  it('place word', () => {
    expect(gradeQuestion(pw, 1)).toBe(true);
    expect(gradeQuestion(pw, 0)).toBe(false);
    expect(formatSolution(pw)).toBe('She always goes home');
  });
  it('word order', () => {
    expect(gradeQuestion(wo, ['she', 'goes'])).toBe(true);
    expect(gradeQuestion(wo, ['goes', 'she'])).toBe(false);
    expect(isAnswered(wo, ['she'])).toBe(false);
  });
  it('error spot', () => {
    expect(gradeQuestion(es, 1)).toBe(true);
    expect(gradeQuestion(es, 0)).toBe(false);
    expect(formatSolution(es)).toBe('"go" should be "goes"');
  });
  it('error correct / transform', () => {
    expect(gradeQuestion(ec, 'he goes')).toBe(true);
    expect(gradeQuestion(ec, 'He go.')).toBe(false);
    expect(gradeQuestion(ec, '  ')).toBe(false);
  });
  it('true/false needs every statement', () => {
    expect(gradeQuestion(tf, [true, false])).toBe(true);
    expect(gradeQuestion(tf, [true, true])).toBe(false);
    expect(gradeQuestion(tf, [true])).toBe(false);
  });
  it('reading and match pairs', () => {
    expect(gradeQuestion(rm, [1])).toBe(true);
    expect(gradeQuestion(rm, [0])).toBe(false);
    expect(gradeQuestion(mp, { big: 'large', hot: 'cold' })).toBe(true);
    expect(gradeQuestion(mp, { big: 'cold', hot: 'large' })).toBe(false);
    expect(gradeQuestion(mp, { big: 'large' })).toBe(false);
  });
  it('no answer is shown as such', () => {
    for (const q of [mc, fb, pw, wo, es, ec, tf, rm, mp]) expect(formatAnswer(q, undefined)).toBe('No answer');
  });
  it('gradeQuiz counts and rounds', () => {
    const r = gradeQuiz([mc, es, pw], { mc1: 1, es1: 1, pw1: 0 });
    expect(r).toMatchObject({ total: 3, correct: 2, percent: 67 });
    expect(r.perQuestion).toEqual({ mc1: true, es1: true, pw1: false });
  });
});

describe('buildQuiz', () => {
  const seq = (values: number[]) => {
    let i = 0;
    return () => values[i++ % values.length];
  };

  it('remaps the correct index and wrongReasons when shuffling options', () => {
    for (let seed = 0; seed < 20; seed++) {
      let s = seed + 1;
      const rng = () => ((s = (s * 16807) % 2147483647) / 2147483647);
      const q = prepareQuestion(mc, rng) as typeof mc & { options: string[]; correct: number };
      expect(q.options[q.correct]).toBe('b');
      const idxA = q.options.indexOf('a');
      expect((q.wrongReasons as Record<string, string>)[String(idxA)]).toBe('because a');
    }
  });

  it('picks the requested number, without duplicates, varying types', () => {
    const pool: Question[] = [];
    for (let i = 0; i < 10; i++) pool.push({ ...mc, id: `m${i}` });
    for (let i = 0; i < 10; i++) pool.push({ ...es, id: `e${i}` });
    const quiz = buildQuiz(pool, 6, new Set(), seq([0.1, 0.9, 0.4, 0.6, 0.3]));
    expect(quiz).toHaveLength(6);
    expect(new Set(quiz.map((q) => q.id)).size).toBe(6);
    expect(quiz.filter((q) => q.type === 'multiple-choice')).toHaveLength(3);
  });

  it('prefers unseen questions and falls back to seen ones', () => {
    const pool: Question[] = Array.from({ length: 5 }, (_, i) => ({ ...mc, id: `m${i}` }));
    const seen = new Set(['m0', 'm1', 'm2']);
    expect(buildQuiz(pool, 2, seen).every((q) => !seen.has(q.id))).toBe(true);
    expect(buildQuiz(pool, 5, seen)).toHaveLength(5);
  });

  it('returns fewer questions when the pool is small', () => {
    expect(buildQuiz([mc], 10)).toHaveLength(1);
    expect(buildQuiz([], 10)).toHaveLength(0);
  });

  it('shuffles match-pairs right options and word order', () => {
    const m = prepareQuestion(mp) as typeof mp & { rightOptions: string[] };
    expect([...m.rightOptions].sort()).toEqual(['cold', 'large']);
    const w = prepareQuestion({ ...wo, words: ['a', 'b', 'c', 'd'], solutions: [['a', 'b', 'c', 'd']] }) as typeof wo;
    expect([...w.words].sort()).toEqual(['a', 'b', 'c', 'd']);
  });
});

describe('explaining wrong answers', () => {
  const elephant: Question = {
    ...base,
    id: 'wb2',
    type: 'word-bank',
    bank: ['a', 'an', 'the'],
    text: 'I saw ___ elephant.',
    answers: ['an'],
    wrongReasons: { a: 'a: consonant sound', the: 'the: not specific' },
  };
  const two: Question = {
    ...base,
    id: 'wb3',
    type: 'word-bank',
    bank: ['is', 'are', 'am'],
    text: 'I ___ happy and my sisters ___ happy.',
    answers: ['am', 'are'],
    wrongReasons: { is: 'is: he/she/it', '0:are': 'gap 1: are is for plural', '1:am': 'gap 2: am only with I' },
  };

  it('gives a different explanation for each wrong word in a word bank', () => {
    expect(explainWrong(elephant, ['a'])).toBe('a: consonant sound');
    expect(explainWrong(elephant, ['the'])).toBe('the: not specific');
  });

  it('uses gap-specific keys and only explains the gaps that are wrong', () => {
    expect(explainWrong(two, ['are', 'are'])).toBe('gap 1: are is for plural');
    expect(explainWrong(two, ['am', 'am'])).toBe('gap 2: am only with I');
    expect(explainWrong(two, ['is', 'are'])).toBe('is: he/she/it');
    expect(explainWrong(two, ['are', 'am'])).toBe('gap 1: are is for plural gap 2: am only with I');
  });

  it('falls back to an answer-specific message when there is no written reason', () => {
    expect(explainWrong(tf, [true, true])).toBe('Statement 2 is false according to the text.');
    expect(explainWrong(es, 0)).toBe('"He" is correct in this sentence. The mistake is "go".');
    expect(explainWrong(mp, { big: 'cold', hot: 'cold' })).toBe('"big" matches "large", not "cold".');
    expect(explainWrong({ ...mc, wrongReasons: undefined } as Question, 0)).toBe('"a" does not fit here.');
    expect(explainWrong(wo, ['goes', 'she'])).toMatch(/right order/);
  });
});
