import { useCallback, useEffect, useRef, useState } from 'react';
import { loadLevel } from '../data';
import { buildQuiz } from '../engine/buildQuiz';
import { gradeQuiz } from '../engine/gradeQuiz';
import { isAnswered } from '../engine/rules';
import { addHistory, addSeen, loadSeen } from './store';
import type { Answers, Level, Question, QuizResult } from '../types';

interface Session {
  questions: Question[];
  answers: Answers;
  result?: QuizResult;
  showSolutions: boolean;
}

export function useQuizSession(level: Level, count: number) {
  const [session, setSession] = useState<Session | null>(null);
  const [error, setError] = useState<string>();
  const [round, setRound] = useState(0);
  // Latest session, readable synchronously: side effects must not run inside state updaters
  // (React may call updaters twice, e.g. in StrictMode).
  const sessionRef = useRef<Session | null>(null);
  sessionRef.current = session;

  useEffect(() => {
    let cancelled = false;
    setSession(null);
    setError(undefined);
    loadLevel(level)
      .then((pool) => {
        if (cancelled) return;
        const questions = buildQuiz(pool, count, loadSeen(level));
        if (questions.length === 0) {
          setError('No questions are available for this level yet.');
          return;
        }
        addSeen(level, questions.map((q) => q.id));
        setSession({ questions, answers: {}, showSolutions: false });
      })
      .catch(() => !cancelled && setError('Could not load the questions.'));
    return () => {
      cancelled = true;
    };
  }, [level, count, round]);

  const setAnswer = useCallback((id: string, value: unknown) => {
    setSession((s) => (s && !s.result ? { ...s, answers: { ...s.answers, [id]: value } } : s));
  }, []);

  const submit = useCallback(() => {
    const s = sessionRef.current;
    if (!s || s.result) return;
    const result = gradeQuiz(s.questions, s.answers);
    addHistory({ date: new Date().toISOString(), level, total: result.total, correct: result.correct, percent: result.percent });
    // Mark as submitted right away so a second call (double click) is ignored before the next render.
    sessionRef.current = { ...s, result };
    setSession(sessionRef.current);
  }, [level]);

  const toggleSolutions = useCallback(() => setSession((s) => (s ? { ...s, showSolutions: !s.showSolutions } : s)), []);
  const retry = useCallback(() => setSession((s) => (s ? { ...s, answers: {}, result: undefined, showSolutions: false } : s)), []);
  const newQuiz = useCallback(() => setRound((r) => r + 1), []);

  const unanswered = session ? session.questions.filter((q) => !isAnswered(q, session.answers[q.id])).length : 0;

  return { session, error, setAnswer, submit, toggleSolutions, retry, newQuiz, unanswered };
}
