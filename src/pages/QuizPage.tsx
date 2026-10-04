import { useEffect, useRef, useState } from 'react';
import { Alert, Button, Modal, ProgressBar, Spinner } from 'react-bootstrap';
import { Navigate, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import QuestionCard from '../components/QuestionCard';
import ScoreCard from '../components/ScoreCard';
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
  const scoreRef = useRef<HTMLDivElement>(null);
  const submitted = !!session?.result;

  useEffect(() => {
    if (submitted) {
      scoreRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      scoreRef.current?.focus({ preventScroll: true });
    }
  }, [submitted]);

  if (error) {
    return (
      <Alert variant="warning">
        {error}{' '}
        <Button variant="link" className="p-0 align-baseline" onClick={() => navigate('/')}>
          Change level
        </Button>
      </Alert>
    );
  }
  if (!session) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading…</span>
        </Spinner>
      </div>
    );
  }

  const answered = session.questions.length - unanswered;
  const requestSubmit = () => {
    if (submitted) return;
    if (unanswered > 0) setConfirm(true);
    else submit();
  };

  return (
    <div className="col-12 col-lg-8 mx-auto">
      <div className="quiz-bar mb-3">
        <div className="d-flex justify-content-between align-items-center gap-2 mb-1">
          <h1 className="h5 mb-0 text-truncate">
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
              onClick={() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' })}
            >
              ↓ End
            </Button>
          </div>
        </div>
        <ProgressBar now={(answered / session.questions.length) * 100} style={{ height: 6 }} aria-label="Progress" />
      </div>

      {session.result && <ScoreCard ref={scoreRef} result={session.result} />}

      {session.questions.map((q, i) => (
        <QuestionCard
          key={q.id}
          index={i}
          question={q}
          answer={session.answers[q.id]}
          onChange={(v) => setAnswer(q.id, v)}
          submitted={submitted}
          correct={session.result?.perQuestion[q.id]}
          showSolution={session.showSolutions}
          onEnter={requestSubmit}
        />
      ))}

      <div className="action-bar d-grid d-sm-flex gap-2 justify-content-sm-center py-3">
        {!submitted ? (
          <Button size="lg" onClick={requestSubmit}>
            Check answers
          </Button>
        ) : (
          <>
            <Button variant="outline-primary" aria-pressed={session.showSolutions} onClick={toggleSolutions}>
              {session.showSolutions ? 'Hide correct answers' : 'Show correct answers'}
            </Button>
            <Button variant="outline-secondary" onClick={retry}>
              Try again
            </Button>
            <Button variant="primary" onClick={newQuiz}>
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
