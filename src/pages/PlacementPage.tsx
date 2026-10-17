import { useEffect, useRef, useState } from 'react';
import { Badge, Button, Card, ProgressBar, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { loadLevel } from '../data';
import { gradeQuestion } from '../engine/rules';
import {
  buildPlacementSet,
  estimateLevel,
  PLACEMENT_TIME_SECONDS,
  PLACEMENT_TOTAL,
  type PlacementResult,
} from '../engine/placement';
import { addSeen, loadSeen, savePlacement } from '../hooks/store';
import { LEVEL_INFO } from '../levels';
import { QuestionBody } from '../questions/registry';
import { LEVELS, type Level, type PlacementSaved, type Question } from '../types';

const formatTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

type Phase = 'intro' | 'running' | 'done';

export default function PlacementPage() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<Phase>('intro');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<number, unknown>>({});
  const [index, setIndex] = useState(0);
  const [result, setResult] = useState<PlacementResult>();
  const [error, setError] = useState<string>();
  // The page's only role="status" region, always mounted.
  const [announcement, setAnnouncement] = useState('');
  const [secondsLeft, setSecondsLeft] = useState(PLACEMENT_TIME_SECONDS);
  const phaseRef = useRef<Phase>('intro');
  // The latest test, readable from the timer callback and the finish handler.
  const latest = useRef({ questions, answers });
  latest.current = { questions, answers };
  const deadline = useRef(0);
  const timeUp = useRef<() => void>(() => {});
  // A ref, not state: a second tap on "Start" must be ignored before the next render.
  const locked = useRef(false);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const resultRef = useRef<HTMLHeadingElement>(null);
  const total = questions.length;
  const answeredCount = Object.keys(answers).length;

  useEffect(() => {
    if (phase !== 'running' || total === 0) return;
    setAnnouncement(`Question ${index + 1} of ${total}`);
    window.scrollTo({ top: 0 });
    titleRef.current?.focus();
  }, [phase, total, index]);

  useEffect(() => {
    if (phase !== 'done' || !result) return;
    setAnnouncement(`Your level is ${result.level}, ${LEVEL_INFO[result.level].name}.`);
    window.scrollTo({ top: 0 });
    resultRef.current?.focus();
  }, [phase, result]);

  // Countdown against a fixed deadline (robust to throttled timers); at zero the test stops.
  useEffect(() => {
    if (phase !== 'running') return;
    const id = setInterval(() => {
      const left = Math.max(0, Math.ceil((deadline.current - Date.now()) / 1000));
      setSecondsLeft(left);
      if (left === 0) timeUp.current();
    }, 1000);
    return () => clearInterval(id);
  }, [phase]);

  const start = async () => {
    if (locked.current) return;
    locked.current = true;
    phaseRef.current = 'running';
    setError(undefined);
    try {
      const pools = Object.fromEntries(await Promise.all(LEVELS.map(async (l) => [l, await loadLevel(l)]))) as Record<Level, Question[]>;
      const set = buildPlacementSet(pools, loadSeen);
      if (set.length === 0) throw new Error('empty');
      setQuestions(set);
      setAnswers({});
      setIndex(0);
      deadline.current = Date.now() + PLACEMENT_TIME_SECONDS * 1000;
      setSecondsLeft(PLACEMENT_TIME_SECONDS);
      setPhase('running');
    } catch {
      phaseRef.current = 'intro';
      setError('Could not load the questions.');
    } finally {
      locked.current = false;
    }
  };

  /** Scores the answers given so far; the questions left unanswered do not count. */
  const finish = () => {
    if (phaseRef.current === 'done') return;
    const { questions: qs, answers: given } = latest.current;
    const records = qs.flatMap((q, i) => (i in given ? [{ level: q.level, topic: q.topic, correct: gradeQuestion(q, given[i]) }] : []));
    if (records.length === 0) {
      phaseRef.current = 'intro';
      setQuestions([]);
      setPhase('intro');
      setError('Time is up before you answered any question. Try again.');
      return;
    }
    phaseRef.current = 'done';
    for (const l of LEVELS) addSeen(l, qs.filter((q, i) => q.level === l && i in given).map((q) => q.id));
    const est = estimateLevel(records);
    const perLevel = Object.fromEntries(LEVELS.map((l) => [l, { answered: est.perLevel[l].answered, correct: est.perLevel[l].correct }])) as PlacementSaved['perLevel'];
    savePlacement({ date: new Date().toISOString(), level: est.level, perLevel });
    setResult(est);
    setPhase('done');
  };
  timeUp.current = finish;

  let body;
  if (phase === 'intro') {
    body = (
      <>
        <h1 className="h3">Find your level</h1>
        <p className="text-secondary">
          {PLACEMENT_TOTAL} questions in {PLACEMENT_TIME_SECONDS / 60} minutes, one at a time, from easier to harder. You can move between the questions, skip some and change your answers before you finish.
        </p>
        {error && <p className="text-danger">{error}</p>}
        <div className="d-grid d-sm-flex gap-2">
          <Button size="lg" onClick={start}>
            Start the test
          </Button>
          <Button size="lg" variant="outline-secondary" onClick={() => navigate('/')}>
            Home
          </Button>
        </div>
      </>
    );
  } else if (phase === 'running' && total > 0) {
    const question = questions[index];
    const unanswered = total - answeredCount;
    body = (
      <>
        <div className="quiz-bar mb-3">
          <div className="d-flex justify-content-between align-items-center mb-1">
            <h1 className="h5 mb-0">Find your level</h1>
            <span className="text-secondary">
              <span className={secondsLeft <= 60 ? 'text-danger fw-semibold' : ''} role="timer" aria-label="Time left">
                {formatTime(secondsLeft)}
              </span>
              {' · '}
              <span>
                Question {index + 1} / {total}
              </span>
            </span>
          </div>
          <ProgressBar now={(answeredCount / total) * 100} style={{ height: 6 }} aria-label="Answered" />
        </div>

        <nav aria-label="Questions" className="d-flex flex-wrap gap-1 mb-3">
          {questions.map((q, i) => {
            const done = i in answers;
            return (
              <Button
                key={q.id}
                size="sm"
                variant={i === index ? 'primary' : 'outline-secondary'}
                className="px-0 text-nowrap"
                style={{ width: '2.9rem' }}
                aria-label={`Question ${i + 1}, ${done ? 'answered' : 'not answered'}`}
                aria-current={i === index ? 'step' : undefined}
                onClick={() => setIndex(i)}
              >
                {i + 1}
                {done && (
                  <span className={i === index ? 'ms-1' : 'ms-1 text-success fw-bold'} aria-hidden="true">
                    ✓
                  </span>
                )}
              </Button>
            );
          })}
        </nav>

        <Card className="mb-3 question-card" as="section" aria-labelledby="placement-question-title">
          <Card.Header>
            <h2 id="placement-question-title" ref={titleRef} tabIndex={-1} className="h6 mb-0">
              Question {index + 1}
            </h2>
          </Card.Header>
          <Card.Body key={question.id}>
            <p className="question-prompt">{question.prompt}</p>
            <QuestionBody question={question} answer={answers[index]} onChange={(value) => setAnswers((a) => ({ ...a, [index]: value }))} disabled={false} />
          </Card.Body>
        </Card>
        {error && <p className="text-danger">{error}</p>}

        <div className="action-bar d-grid d-sm-flex justify-content-sm-center gap-2 py-3">
          <Button variant="outline-primary" disabled={index === 0} onClick={() => setIndex(index - 1)}>
            Previous
          </Button>
          <Button variant="outline-primary" disabled={index === total - 1} onClick={() => setIndex(index + 1)}>
            Next
          </Button>
          <Button variant="success" disabled={answeredCount === 0} onClick={finish}>
            Finish test
          </Button>
          <Button variant="outline-secondary" onClick={() => navigate('/')}>
            Quit test
          </Button>
        </div>
        <p className="text-center text-secondary small">
          {unanswered === 0 ? 'All questions answered.' : `${unanswered} ${unanswered === 1 ? 'question is' : 'questions are'} not answered yet; they will not count.`}
        </p>
      </>
    );
  } else if (phase === 'done' && result) {
    const weak = result.weakTopics;
    body = (
      <>
        <h1 ref={resultRef} tabIndex={-1} className="h3">
          Your level
        </h1>
        <Card className="text-center mb-4">
          <Card.Body>
            <div className="display-3 fw-bold text-primary">{result.level}</div>
            <div className="h5 mb-0">{LEVEL_INFO[result.level].name}</div>
            <small className="text-secondary">{LEVEL_INFO[result.level].description}</small>
          </Card.Body>
        </Card>

        <h2 className="h5">Score by level</h2>
        <ul className="list-unstyled mb-4">
          {LEVELS.map((l) => {
            const s = result.perLevel[l];
            return (
              <li key={l} className="mb-2">
                <div className="d-flex justify-content-between">
                  <strong>{l}</strong>
                  <span className="text-secondary">{s.answered ? `${s.correct} / ${s.answered} correct` : 'Not tested'}</span>
                </div>
                <ProgressBar
                  now={s.answered ? s.percent : 0}
                  variant={s.percent >= 70 ? 'success' : 'warning'}
                  style={{ height: 8 }}
                  aria-label={`${l}: ${s.answered ? `${s.percent}% correct` : 'not tested'}`}
                />
              </li>
            );
          })}
        </ul>

        {weak.length > 0 && (
          <>
            <h2 className="h5">Topics to review</h2>
            <p>
              {weak.map((w) => (
                <Badge key={w.topic} bg="secondary" className="me-2 mb-1 fw-normal">
                  {w.topic} · {w.wrong} mistakes
                </Badge>
              ))}
            </p>
          </>
        )}

        <div className="action-bar d-grid d-sm-flex gap-2 justify-content-sm-center py-3">
          <Button size="lg" onClick={() => navigate(`/quiz/${result.level}?n=10`)}>
            Practise {result.level}
          </Button>
          <Button variant="outline-primary" onClick={() => { setResult(undefined); setQuestions([]); phaseRef.current = 'intro'; setPhase('intro'); }}>
            Retake the test
          </Button>
          <Button variant="outline-secondary" onClick={() => navigate('/')}>
            Home
          </Button>
        </div>
      </>
    );
  } else {
    body = (
      <div className="text-center py-5">
        <Spinner animation="border">
          <span className="visually-hidden">Loading…</span>
        </Spinner>
      </div>
    );
  }

  return (
    <div className="col-12 col-lg-8 mx-auto">
      {body}
      <div role="status" aria-live="polite" className="visually-hidden">
        {announcement}
      </div>
    </div>
  );
}
