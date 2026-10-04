import { useState } from 'react';
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
        {LEVELS.map((l) => (
          <Col key={l}>
            <Card
              role="radio"
              aria-checked={level === l}
              tabIndex={0}
              border={level === l ? 'primary' : undefined}
              className={`h-100 level-card ${level === l ? 'selected' : ''}`}
              onClick={() => setLevel(l)}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), setLevel(l))}
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
