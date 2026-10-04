import { shuffle, type Rng } from './shuffle';
import type { Question } from '../types';

function remapChoices(options: string[], correct: number, wrong: Record<string, string> | undefined, rng: Rng) {
  const order = shuffle(
    options.map((_, i) => i),
    rng,
  );
  const newOptions = order.map((i) => options[i]);
  const newCorrect = order.indexOf(correct);
  let newWrong: Record<string, string> | undefined;
  if (wrong) {
    newWrong = {};
    for (const [k, v] of Object.entries(wrong)) {
      newWrong[/^\d+$/.test(k) ? String(order.indexOf(Number(k))) : k] = v;
    }
  }
  return { options: newOptions, correct: newCorrect, wrongReasons: newWrong };
}

/** Returns a copy of the question with shuffled options / words, ready to be shown. */
export function prepareQuestion(q: Question, rng: Rng = Math.random): Question {
  switch (q.type) {
    case 'multiple-choice':
    case 'verb-form':
    case 'odd-one-out':
    case 'sentence-choice':
      return { ...q, ...remapChoices(q.options, q.correct, q.wrongReasons, rng) };
    case 'reading-mc':
      return {
        ...q,
        items: q.items.map((it) => {
          const r = remapChoices(it.options, it.correct, undefined, rng);
          return { ...it, options: r.options, correct: r.correct };
        }),
      };
    case 'match-pairs':
      return {
        ...q,
        rightOptions: shuffle(
          q.pairs.map((p) => p.right),
          rng,
        ),
      };
    case 'word-order': {
      const solved = q.solutions.map((s) => s.join(' '));
      let words = shuffle(q.words, rng);
      for (let i = 0; i < 5 && solved.includes(words.join(' ')); i++) words = shuffle(q.words, rng);
      return { ...q, words };
    }
    default:
      return q;
  }
}

/**
 * Picks `count` questions, varying the types (round-robin) and preferring
 * questions not seen recently.
 */
export function buildQuiz(
  pool: Question[],
  count: number,
  seen: ReadonlySet<string> = new Set(),
  rng: Rng = Math.random,
): Question[] {
  const shuffled = shuffle(pool, rng);
  const unseen = shuffled.filter((q) => !seen.has(q.id));
  const candidates = unseen.length >= count ? unseen : [...unseen, ...shuffled.filter((q) => seen.has(q.id))];

  const byType = new Map<string, Question[]>();
  for (const q of candidates) {
    if (!byType.has(q.type)) byType.set(q.type, []);
    byType.get(q.type)!.push(q);
  }
  const queues = shuffle([...byType.values()], rng);
  const picked: Question[] = [];
  while (picked.length < count && queues.some((x) => x.length)) {
    for (const queue of queues) {
      if (picked.length >= count) break;
      const next = queue.shift();
      if (next) picked.push(next);
    }
  }
  return shuffle(picked, rng).map((q) => prepareQuestion(q, rng));
}
