import { useEffect, useRef, useState } from 'react';
import { Badge, Button, Card, ProgressBar, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { loadLevel } from '../data';
import { gradeQuestion } from '../engine/rules';
import {
  estimateLevel,
  initialStep,
  nextStep,
  pickPlacementQuestion,
  PLACEMENT_TOTAL,
  type PlacementRecord,
  type PlacementResult,
  type Step,
} from '../engine/placement';
import { addSeen, loadSeen, savePlacement } from '../hooks/store';
import { LEVEL_INFO } from '../levels';
import { QuestionBody } from '../questions/registry';
import { LEVELS, type Level, type PlacementSaved, type Question } from '../types';

interface Run {
  step: Step;
  records: PlacementRecord[];
  used: Set<string>;
  pools: Partial<Record<Level, Question[]>>;
}

const newRun = (): Run => ({ step: initialStep(), records: [], used: new Set(), pools: {} });

/** The levels ordered by distance from `level` (itself first): used if a level has no question left. */
const byDistance = (level: Level) => [...LEVELS].sort((a, b) => Math.abs(LEVELS.indexOf(a) - LEVELS.indexOf(level)) - Math.abs(LEVELS.indexOf(b) - LEVELS.indexOf(level)));

async function nextQuestion(run: Run): Promise<Question | undefined> {
  for (const level of byDistance(run.step.level)) {
    run.pools[level] ??= await loadLevel(level);
    const q = pickPlacementQuestion(run.pools[level]!, run.used, loadSeen(level));
    if (q) return q;
  }
  return undefined;
}

type Phase = 'intro' | 'running' | 'done';

export default function PlacementPage() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<Phase>('intro');
  const [question, setQuestion] = useState<Question>();
  const [answered, setAnswered] = useState(0);
  const [waiting, setWaiting] = useState(false);
  const [result, setResult] = useState<PlacementResult>();
  const [error, setError] = useState<string>();
  // The page's only role="status" region, always mounted.
  const [announcement, setAnnouncement] = useState('');
  const run = useRef<Run>(newRun());
  // Refs, not state: a second tap must be ignored before the next render.
  const locked = useRef(false);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const resultRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (phase !== 'running' || !question) return;
    setAnnouncement(`Question ${answered + 1} of ${PLACEMENT_TOTAL}`);
    window.scrollTo({ top: 0 });
    titleRef.current?.focus();
  }, [phase, question, answered]);

  useEffect(() => {
    if (phase !== 'done' || !result) return;
    setAnnouncement(`Your level is ${result.level}, ${LEVEL_INFO[result.level].name}.`);
    window.scrollTo({ top: 0 });
    resultRef.current?.focus();
  }, [phase, result]);

  const start = async () => {
    if (locked.current) return;
    locked.current = true;
    run.current = newRun();
    setError(undefined);
    try {
      const q = await nextQuestion(run.current);
      if (!q) throw new Error('empty');
      setAnswered(0);
      setQuestion(q);
      setPhase('running');
    } catch {
      setError('Could not load the questions.');
    } finally {
      locked.current = false;
    }
  };

  const finish = (r: Run) => {
    const est = estimateLevel(r.records);
    const perLevel = Object.fromEntries(LEVELS.map((l) => [l, { answered: est.perLevel[l].answered, correct: est.perLevel[l].correct }])) as PlacementSaved['perLevel'];
    savePlacement({ date: new Date().toISOString(), level: est.level, perLevel });
    setResult(est);
    setPhase('done');
  };

  const onAnswer = async (value: unknown) => {
    const r = run.current;
    if (locked.current || !question) return;
    locked.current = true;
    setWaiting(true);
    r.records.push({ level: question.level, topic: question.topic, correct: gradeQuestion(question, value) });
    r.used.add(question.id);
    addSeen(question.level, [question.id]);
    r.step = nextStep(r.step, r.records[r.records.length - 1].correct);

    if (r.records.length >= PLACEMENT_TOTAL) {
      finish(r);
    } else {
      try {
        const q = await nextQuestion(r);
        if (q) {
          setQuestion(q);
          setAnswered(r.records.length);
        } else {
          finish(r); // no question left at all: finish with what we have
        }
      } catch {
        setError('Could not load the questions.');
      }
    }
    setWaiting(false);
    locked.current = false;
  };

  let body;
  if (phase === 'intro') {
    body = (
      <>
        <h1 className="h3">Find your level</h1>
        <p className="text-secondary">
          {PLACEMENT_TOTAL} questions, one at a time. The next question appears as soon as you answer, and you cannot go back. The questions get easier or harder depending on your answers.
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
  } else if (phase === 'running' && question) {
    body = (
      <>
        <div className="quiz-bar mb-3">
          <div className="d-flex justify-content-between align-items-center mb-1">
            <h1 className="h5 mb-0">Find your level</h1>
            <span className="text-secondary">
              Question {answered + 1} / {PLACEMENT_TOTAL}
            </span>
          </div>
          <ProgressBar now={(answered / PLACEMENT_TOTAL) * 100} style={{ height: 6 }} aria-label="Progress" />
        </div>

        <Card className="mb-3 question-card" as="section" aria-labelledby="placement-question-title">
          <Card.Header>
            <h2 id="placement-question-title" ref={titleRef} tabIndex={-1} className="h6 mb-0">
              Question {answered + 1}
            </h2>
          </Card.Header>
          <Card.Body key={question.id}>
            <p className="question-prompt">{question.prompt}</p>
            <QuestionBody question={question} answer={undefined} onChange={onAnswer} disabled={waiting} />
          </Card.Body>
        </Card>
        {error && <p className="text-danger">{error}</p>}
        {waiting && !error && (
          <div className="text-center text-secondary" aria-hidden="true">
            <Spinner size="sm" animation="border" />
          </div>
        )}

        <div className="action-bar d-grid d-sm-flex justify-content-sm-center py-3">
          <Button variant="outline-secondary" onClick={() => navigate('/')}>
            Quit test
          </Button>
        </div>
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
          <Button variant="outline-primary" onClick={() => { setResult(undefined); setQuestion(undefined); setPhase('intro'); }}>
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
