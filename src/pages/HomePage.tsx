import { useRef, useState, type KeyboardEvent } from 'react';
import { Button, Card, Col, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { loadPlacement, loadPrefs, savePrefs } from '../hooks/store';
import { LEVEL_INFO, QUESTION_COUNTS, type QuestionCount } from '../levels';
import { LEVELS, type Level } from '../types';

export default function HomePage() {
  const navigate = useNavigate();
  const prefs = loadPrefs();
  const placement = loadPlacement();
  const [level, setLevel] = useState<Level | undefined>(prefs.lastLevel);
  const [count, setCount] = useState<QuestionCount>(prefs.questionCount);
  const cards = useRef<(HTMLDivElement | null)[]>([]);

  // Radio group keyboard pattern: arrows move and select, Home/End go to the first/last level.
  const onLevelKey = (e: KeyboardEvent, i: number) => {
    const keys: Record<string, number> = {
      ArrowRight: i + 1,
      ArrowDown: i + 1,
      ArrowLeft: i - 1,
      ArrowUp: i - 1,
      Home: 0,
      End: LEVELS.length - 1,
    };
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setLevel(LEVELS[i]);
    } else if (e.key in keys) {
      e.preventDefault();
      const next = (keys[e.key] + LEVELS.length) % LEVELS.length;
      setLevel(LEVELS[next]);
      cards.current[next]?.focus();
    }
  };
  // Only one level is in the Tab order: the selected one, or the first if none is selected.
  const tabbable = level ?? LEVELS[0];

  const start = (n: QuestionCount) => {
    if (!level) return;
    setCount(n);
    savePrefs({ lastLevel: level, questionCount: n });
    navigate(`/quiz/${level}?n=${n}`);
  };

  return (
    <div className="col-12 col-lg-8 mx-auto">
      <h1 className="h3">Practise your English</h1>
      <p className="text-secondary">Choose your level, answer the questions and check your score.</p>

      <h2 className="h5">Level</h2>
      <Row xs={2} md={3} className="g-3 mb-4" role="radiogroup" aria-label="Level">
        {LEVELS.map((l, i) => (
          <Col key={l}>
            <Card
              ref={(el: HTMLDivElement | null) => {
                cards.current[i] = el;
              }}
              role="radio"
              aria-checked={level === l}
              tabIndex={l === tabbable ? 0 : -1}
              border={level === l ? 'primary' : undefined}
              className={`h-100 level-card ${level === l ? 'selected' : ''}`}
              onClick={() => setLevel(l)}
              onKeyDown={(e) => onLevelKey(e, i)}
            >
              <Card.Body>
                <Card.Title className="mb-0">{l}</Card.Title>
                <div className="fw-semibold">{LEVEL_INFO[l].name}</div>
                <small className="text-secondary">{LEVEL_INFO[l].description}</small>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <h2 className="h5">Start a quiz</h2>
      <p className="text-secondary">{level ? 'Tap the number of questions to begin.' : 'Choose a level, then tap the number of questions to begin.'}</p>
      <Row xs={2} md={4} className="g-3 mb-4" role="group" aria-label="Number of questions">
        {QUESTION_COUNTS.map((n) => (
          <Col key={n}>
            <Button variant={count === n ? 'primary' : 'outline-primary'} className="w-100 py-3" disabled={!level} onClick={() => start(n)} aria-label={`Start with ${n} questions`}>
              <span className="d-block display-6 fw-bold lh-1">{n}</span>
              <small>questions</small>
            </Button>
          </Col>
        ))}
      </Row>

      <Card className="mt-4">
        <Card.Body className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-2">
          <div>
            {placement ? (
              <>
                <h2 className="h6 mb-0">Your level: {placement.level}</h2>
                <small className="text-secondary">Tested on {new Date(placement.date).toLocaleDateString()}</small>
              </>
            ) : (
              <>
                <h2 className="h6 mb-0">Not sure about your level?</h2>
                <small className="text-secondary">Answer 40 questions and find out.</small>
              </>
            )}
          </div>
          <Button variant="outline-primary" onClick={() => navigate('/placement')}>
            {placement ? 'Retake the test' : 'Find your level'}
          </Button>
        </Card.Body>
      </Card>
    </div>
  );
}
