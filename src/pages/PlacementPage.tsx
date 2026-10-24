import { useEffect, useRef, useState } from 'react';
import { Alert, Badge, Button, Card, ProgressBar, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import QuestionCard from '../components/QuestionCard';
import { loadLevel } from '../data';
import { gradeQuestion, isAnswered } from '../engine/rules';
import {
  estimateLevel,
  isSingleTap,
  nextLevel,
  pickAdaptiveQuestion,
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

/** A question the person has moved past: answered (answer is final) or skipped. */
interface Resolved {
  answer?: unknown;
  skipped: boolean;
}

/** What the test logic works on. It lives in a ref so that handlers always see the latest value. */
interface TestState {
  /** Questions asked so far, in order; the last one is the one in progress. */
  asked: Question[];
  /** Outcome of the questions already left behind, by index. */
  resolved: Record<number, Resolved>;
  /** Answer being given to the question in progress. */
  draft: unknown;
}

const emptyTest = (): TestState => ({ asked: [], resolved: {}, draft: undefined });

export default function PlacementPage() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<Phase>('intro');
  const [test, setTest] = useState<TestState>(emptyTest);
  // The question being looked at: the one in progress, or an earlier one (read-only).
  const [view, setView] = useState(0);
  const [review, setReview] = useState<{ questions: Question[]; answers: Record<number, unknown> }>({ questions: [], answers: {} });
  const [showSolutions, setShowSolutions] = useState(false);
  const [result, setResult] = useState<PlacementResult>();
  const [error, setError] = useState<string>();
  // The page's only role="status" region, always mounted.
  const [announcement, setAnnouncement] = useState('');
  const [secondsLeft, setSecondsLeft] = useState(PLACEMENT_TIME_SECONDS);
  const phaseRef = useRef<Phase>('intro');
  const st = useRef<TestState>(test);
  const pools = useRef<Partial<Record<Level, Question[]>>>({});
  const deadline = useRef(0);
  const timeUp = useRef<() => void>(() => {});
  // A ref, not state: a second tap on "Start" must be ignored before the next render.
  const locked = useRef(false);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const resultRef = useRef<HTMLHeadingElement>(null);

  const cur = Object.keys(test.resolved).length; // index of the question in progress
  const reviewing = view < cur;

  useEffect(() => {
    if (phase !== 'running' || test.asked.length === 0) return;
    setAnnouncement(`Question ${view + 1} of ${PLACEMENT_TOTAL}`);
    window.scrollTo({ top: 0 });
    titleRef.current?.focus();
  }, [phase, test.asked.length, view]);

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

  const commit = (next: TestState) => {
    st.current = next;
    setTest(next);
  };

  const start = async () => {
    if (locked.current) return;
    locked.current = true;
    phaseRef.current = 'running';
    setError(undefined);
    try {
      pools.current = Object.fromEntries(await Promise.all(LEVELS.map(async (l) => [l, await loadLevel(l)])));
      const first = pickAdaptiveQuestion(pools.current, LEVELS[0], new Set(), loadSeen);
      if (!first) throw new Error('empty');
      commit({ asked: [first], resolved: {}, draft: undefined });
      setView(0);
      setShowSolutions(false);
      deadline.current = Date.now() + PLACEMENT_TIME_SECONDS * 1000;
      setSecondsLeft(PLACEMENT_TIME_SECONDS);
      setPhase('running');
    } catch {
      phaseRef.current = 'intro';
      setError('Could not load the questions. The level test needs every level: connect to the internet to download them; they will then work offline.');
    } finally {
      locked.current = false;
    }
  };

  /** Scores the questions done so far (plus the one in progress, if it has a complete answer). */
  const finish = () => {
    if (phaseRef.current !== 'running') return;
    const { asked, resolved, draft } = st.current;
    const n = Object.keys(resolved).length;
    const items = asked.slice(0, n).map((question, i) => ({ question, answer: resolved[i].answer, skipped: resolved[i].skipped }));
    const pending = asked[n];
    if (pending && isAnswered(pending, draft)) items.push({ question: pending, answer: draft, skipped: false });
    if (items.length === 0) {
      phaseRef.current = 'intro';
      commit(emptyTest());
      setPhase('intro');
      setError('Time is up before you answered any question. Try again.');
      return;
    }
    phaseRef.current = 'done';
    const records = items.map((it) => ({ level: it.question.level, topic: it.question.topic, correct: !it.skipped && gradeQuestion(it.question, it.answer) }));
    for (const l of LEVELS) addSeen(l, items.filter((it) => it.question.level === l).map((it) => it.question.id));
    const est = estimateLevel(records);
    const perLevel = Object.fromEntries(LEVELS.map((l) => [l, { answered: est.perLevel[l].answered, correct: est.perLevel[l].correct }])) as PlacementSaved['perLevel'];
    savePlacement({ date: new Date().toISOString(), level: est.level, perLevel });
    setReview({
      questions: items.map((it) => it.question),
      answers: Object.fromEntries(items.flatMap((it, i) => (it.skipped ? [] : [[i, it.answer]]))),
    });
    setResult(est);
    setPhase('done');
  };
  timeUp.current = finish;

  /**
   * Leaves the question in progress behind, with its answer or skipped, and asks the next one:
   * one level harder after a right answer, one level easier after a wrong answer or a skip.
   * `qid` is the question the caller meant: a late second tap on the previous question is ignored.
   */
  const resolveCurrent = (qid: string, answer: unknown, skipped: boolean) => {
    if (phaseRef.current !== 'running') return;
    const { asked, resolved } = st.current;
    const i = Object.keys(resolved).length;
    const q = asked[i];
    if (!q || q.id !== qid) return;
    const nextResolved = { ...resolved, [i]: { answer, skipped } };
    if (i + 1 >= PLACEMENT_TOTAL) {
      st.current = { asked, resolved: nextResolved, draft: undefined };
      finish();
      return;
    }
    const outcome = skipped ? 'skipped' : gradeQuestion(q, answer) ? 'correct' : 'wrong';
    const next = pickAdaptiveQuestion(
      pools.current,
      nextLevel(q.level, outcome),
      new Set(asked.map((a) => a.id)),
      loadSeen,
      asked.map((a) => a.type),
    );
    if (!next) {
      st.current = { asked, resolved: nextResolved, draft: undefined };
      finish();
      return;
    }
    commit({ asked: [...asked, next], resolved: nextResolved, draft: undefined });
    setView(i + 1);
  };

  const setDraft = (question: Question, value: unknown) => {
    commit({ ...st.current, draft: value });
    // Single-tap types move on by themselves (but not on the last question, which is closed with "Finish test").
    if (isSingleTap(question) && cur + 1 < PLACEMENT_TOTAL) resolveCurrent(question.id, value, false);
  };

  const goNext = () => {
    const { asked, draft } = st.current;
    const q = asked[Object.keys(st.current.resolved).length];
    if (q && isAnswered(q, draft)) resolveCurrent(q.id, draft, false);
  };

  let body;
  if (phase === 'intro') {
    body = (
      <>
        <h1 className="h3">Find your level</h1>
        <p className="text-secondary">
          {PLACEMENT_TOTAL} questions in {PLACEMENT_TIME_SECONDS / 60} minutes, one at a time. The test starts easy: a right answer makes the next question harder, a wrong answer or a skip makes it easier. You can skip a question you do not know and look back at the earlier ones, but you cannot change your answers.
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
  } else if (phase === 'running' && test.asked.length > 0) {
    const question = test.asked[view];
    const inProgress = test.asked[cur];
    const isLast = cur + 1 >= PLACEMENT_TOTAL;
    const draftReady = !!inProgress && isAnswered(inProgress, test.draft);
    const canFinish = cur > 0 || draftReady;
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
                Question {view + 1} / {PLACEMENT_TOTAL}
              </span>
            </span>
          </div>
          <ProgressBar now={(cur / PLACEMENT_TOTAL) * 100} style={{ height: 6 }} aria-label="Questions done" />
        </div>

        <nav aria-label="Questions" className="d-flex flex-wrap gap-1 mb-3">
          {Array.from({ length: PLACEMENT_TOTAL }, (_, i) => {
            const state = i < cur ? (test.resolved[i].skipped ? 'skipped' : 'answered') : i === cur ? 'current' : 'not reached yet';
            return (
              <Button
                key={i}
                size="sm"
                variant={i === view ? 'primary' : 'outline-secondary'}
                className="px-0 text-nowrap"
                style={{ width: '2.9rem' }}
                disabled={i > cur}
                aria-label={`Question ${i + 1}, ${state}`}
                aria-current={i === view ? 'step' : undefined}
                onClick={() => setView(i)}
              >
                {i + 1}
                {state === 'answered' && (
                  <span className={i === view ? 'ms-1' : 'ms-1 text-success fw-bold'} aria-hidden="true">
                    ✓
                  </span>
                )}
                {state === 'skipped' && (
                  <span className="ms-1" aria-hidden="true">
                    –
                  </span>
                )}
              </Button>
            );
          })}
        </nav>

        {reviewing && (
          <Alert variant="info">
            You are reviewing question {view + 1}. Your answer cannot be changed.
          </Alert>
        )}

        <Card className="mb-3 question-card" as="section" aria-labelledby="placement-question-title">
          <Card.Header>
            <h2 id="placement-question-title" ref={titleRef} tabIndex={-1} className="h6 mb-0">
              Question {view + 1}
              {reviewing && test.resolved[view].skipped && <span className="text-secondary fw-normal"> (skipped)</span>}
            </h2>
          </Card.Header>
          <Card.Body key={question.id}>
            <p className="question-prompt">{question.prompt}</p>
            <QuestionBody
              question={question}
              answer={reviewing ? test.resolved[view].answer : test.draft}
              onChange={(value) => setDraft(question, value)}
              disabled={reviewing}
              onEnter={goNext}
            />
          </Card.Body>
        </Card>
        {error && <p className="text-danger">{error}</p>}

        <div className="action-bar d-grid d-sm-flex justify-content-sm-center gap-2 py-3">
          {reviewing ? (
            <Button variant="primary" onClick={() => setView(cur)}>
              Back to question {cur + 1}
            </Button>
          ) : (
            <>
              <Button variant="outline-secondary" onClick={() => resolveCurrent(question.id, undefined, true)}>
                Skip
              </Button>
              {!isSingleTap(question) && !isLast && (
                <Button variant="primary" disabled={!draftReady} onClick={goNext}>
                  Next
                </Button>
              )}
            </>
          )}
          <Button variant="success" disabled={!canFinish} onClick={finish}>
            Finish test
          </Button>
          <Button variant="outline-secondary" onClick={() => navigate('/')}>
            Quit test
          </Button>
        </div>
        <p className="text-center text-secondary small">
          {reviewing
            ? 'Questions you have not reached yet cannot be opened.'
            : isSingleTap(question) && !isLast
              ? 'Tap an answer to continue, or skip the question.'
              : isLast
                ? 'This is the last question.'
                : 'Complete your answer and press Next, or skip the question.'}
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

        <div className="d-flex justify-content-between align-items-center mb-2">
          <h2 className="h5 mb-0">Review your answers</h2>
          <Button size="sm" variant="outline-secondary" aria-pressed={showSolutions} onClick={() => setShowSolutions(!showSolutions)}>
            {showSolutions ? 'Hide correct answers' : 'Show correct answers'}
          </Button>
        </div>
        {review.questions.map((q, i) => (
          <QuestionCard
            key={q.id}
            index={i}
            question={q}
            answer={review.answers[i]}
            onChange={() => {}}
            submitted
            correct={i in review.answers && gradeQuestion(q, review.answers[i])}
            showSolution={showSolutions}
            onEnter={() => {}}
          />
        ))}

        <div className="action-bar d-grid d-sm-flex gap-2 justify-content-sm-center py-3">
          <Button size="lg" onClick={() => navigate(`/quiz/${result.level}?n=10`)}>
            Practise {result.level}
          </Button>
          <Button
            variant="outline-primary"
            onClick={() => {
              setResult(undefined);
              setReview({ questions: [], answers: {} });
              commit(emptyTest());
              phaseRef.current = 'intro';
              setPhase('intro');
            }}
          >
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
