import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Alert, Button, Modal, ProgressBar, Spinner } from 'react-bootstrap';
import { Navigate, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import QuestionCard from '../components/QuestionCard';
import ScoreCard from '../components/ScoreCard';
import { bandOf } from '../engine/score';
import { useQuizSession } from '../hooks/useQuizSession';
import { LEVEL_INFO } from '../levels';
import { LEVELS, type Level } from '../types';

export default function QuizPage() {
  const { level } = useParams();
  if (!LEVELS.includes(level as Level)) return <Navigate to="/" replace />;
  return <Quiz level={level as Level} />;
}

function Quiz({ level }: { level: Level }) {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const count = [5, 10, 20].includes(Number(params.get('n'))) ? Number(params.get('n')) : 10;
  const { session, error, setAnswer, submit, toggleSolutions, retry, newQuiz, unanswered } = useQuizSession(level, count);
  const [confirm, setConfirm] = useState(false);
  // Text read by screen readers: the page's only role="status" region, always mounted.
  const [announcement, setAnnouncement] = useState('');
  // Set by Try again / New quiz: once the questions are ready, focus the title and announce it.
  const restart = useRef<'retry' | 'new' | null>(null);
  const scoreRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);
  const result = session?.result;

  useEffect(() => {
    if (!result) return;
    setAnnouncement(`Answers checked. ${result.correct} / ${result.total} correct – ${result.percent}%. ${bandOf(result.percent).label}.`);
    scoreRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    scoreRef.current?.focus({ preventScroll: true });
  }, [result]);

  useEffect(() => {
    if (!session || session.result || !restart.current) return;
    setAnnouncement(restart.current === 'retry' ? 'Answers cleared. Try again.' : `New quiz ready: ${session.questions.length} questions.`);
    restart.current = null;
    window.scrollTo({ top: 0 });
    titleRef.current?.focus();
  }, [session]);

  let body: ReactNode;
  if (error) {
    body = (
      <Alert variant="warning">
        {error}{' '}
        <Button variant="link" className="p-0 align-baseline" onClick={() => navigate('/')}>
          Change level
        </Button>
      </Alert>
    );
  } else if (!session) {
    body = (
      <div className="text-center py-5">
        <Spinner animation="border">
          <span className="visually-hidden">Loading…</span>
        </Spinner>
      </div>
    );
  } else {
    const submitted = !!result;
    const answered = session.questions.length - unanswered;
    const requestSubmit = () => {
      if (submitted) return;
      if (unanswered > 0) setConfirm(true);
      else submit();
    };

    body = (
      <div className="col-12 col-lg-8 mx-auto">
        <div className="quiz-bar mb-3">
          <div className="d-flex justify-content-between align-items-center gap-2 mb-1">
            <h1 ref={titleRef} tabIndex={-1} className="h5 mb-0 text-truncate">
              Level {level} <small className="text-secondary d-none d-sm-inline">{LEVEL_INFO[level].name}</small>
            </h1>
            <div className="d-flex align-items-center gap-2 flex-shrink-0">
              <span className="text-secondary">
                {answered} / {session.questions.length} answered
              </span>
              <Button
                size="sm"
                variant="outline-primary"
                aria-label="Go to the end of the page"
                title="Go to the end of the page"
                onClick={() => {
                  window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
                  actionsRef.current?.querySelector('button')?.focus({ preventScroll: true });
                }}
              >
                ↓ End
              </Button>
            </div>
          </div>
          <ProgressBar now={(answered / session.questions.length) * 100} style={{ height: 6 }} aria-label="Progress" />
        </div>

        {result && <ScoreCard ref={scoreRef} result={result} />}

        {session.questions.map((q, i) => (
          <QuestionCard
            key={q.id}
            index={i}
            question={q}
            answer={session.answers[q.id]}
            onChange={(v) => setAnswer(q.id, v)}
            submitted={submitted}
            correct={result?.perQuestion[q.id]}
            showSolution={session.showSolutions}
            onEnter={requestSubmit}
          />
        ))}

        <div ref={actionsRef} className="action-bar d-grid d-sm-flex gap-2 justify-content-sm-center py-3">
          {!submitted ? (
            <Button size="lg" onClick={requestSubmit}>
              Check answers
            </Button>
          ) : (
            <>
              {/* The label changes with the state, so no aria-pressed: the change is announced instead. */}
              <Button
                variant="outline-primary"
                onClick={() => {
                  setAnnouncement(session.showSolutions ? 'Correct answers hidden.' : 'Correct answers shown.');
                  toggleSolutions();
                }}
              >
                {session.showSolutions ? 'Hide correct answers' : 'Show correct answers'}
              </Button>
              <Button
                variant="outline-secondary"
                onClick={() => {
                  restart.current = 'retry';
                  retry();
                }}
              >
                Try again
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  restart.current = 'new';
                  newQuiz();
                }}
              >
                New quiz
              </Button>
              <Button variant="outline-secondary" onClick={() => navigate('/')}>
                Change level
              </Button>
            </>
          )}
        </div>

        <Modal show={confirm} onHide={() => setConfirm(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Check answers</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            You left {unanswered} question{unanswered === 1 ? '' : 's'} unanswered. Submit anyway?
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setConfirm(false)}>
              Keep going
            </Button>
            <Button
              onClick={() => {
                setConfirm(false);
                submit();
              }}
            >
              Submit anyway
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }

  return (
    <>
      {body}
      <div role="status" aria-live="polite" className="visually-hidden">
        {announcement}
      </div>
    </>
  );
}
