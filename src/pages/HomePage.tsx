import { useRef, useState, type KeyboardEvent } from 'react';
import { Button, ButtonGroup, Card, Col, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { loadPrefs, savePrefs } from '../hooks/store';
import { LEVEL_INFO, QUESTION_COUNTS, type QuestionCount } from '../levels';
import { LEVELS, type Level } from '../types';

export default function HomePage() {
  const navigate = useNavigate();
  const prefs = loadPrefs();
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

  const start = () => {
    if (!level) return;
    savePrefs({ lastLevel: level, questionCount: count });
    navigate(`/quiz/${level}?n=${count}`);
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

      <h2 className="h5">Number of questions</h2>
      <ButtonGroup className="mb-4" aria-label="Number of questions">
        {QUESTION_COUNTS.map((n) => (
          <Button key={n} variant={count === n ? 'primary' : 'outline-primary'} aria-pressed={count === n} onClick={() => setCount(n)}>
            {n}
          </Button>
        ))}
      </ButtonGroup>

      <div className="d-grid d-sm-block">
        <Button size="lg" disabled={!level} onClick={start}>
          Start
        </Button>
      </div>
    </div>
  );
}
