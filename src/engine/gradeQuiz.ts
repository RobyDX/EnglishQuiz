import { gradeQuestion } from './rules';
import { percentOf } from './score';
import type { Answers, Question, QuizResult } from '../types';

export function gradeQuiz(questions: Question[], answers: Answers): QuizResult {
  const perQuestion: Record<string, boolean> = {};
  let correct = 0;
  for (const q of questions) {
    const ok = gradeQuestion(q, answers[q.id]);
    perQuestion[q.id] = ok;
    if (ok) correct++;
  }
  return { total: questions.length, correct, percent: percentOf(correct, questions.length), perQuestion };
}
