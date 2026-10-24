import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { Accordion, Button, Card, Col, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { loadLevel } from '../data';
import { countByTopic, filterByTopics } from '../engine/topics';
import HistorySection from '../components/HistorySection';
import { loadPrefs, savePrefs } from '../hooks/store';
import { LEVEL_INFO, QUESTION_COUNTS, TOPIC_LABELS, type QuestionCount } from '../levels';
import { LEVELS, TOPICS, type Level, type Question, type Topic } from '../types';

export default function QuizSetupPage() {
  const navigate = useNavigate();
  const prefs = loadPrefs();
  const [level, setLevel] = useState<Level | undefined>(prefs.lastLevel);
  const [topics, setTopics] = useState<Topic[]>([]);
  // All questions of the chosen level, loaded once per level (undefined while loading).
  const [pool, setPool] = useState<Question[]>();
  // True when the level could not be loaded (e.g. offline and never opened before).
  const [failed, setFailed] = useState(false);
  const cards = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!level) return;
    let cancelled = false;
    setPool(undefined);
    setFailed(false);
    loadLevel(level)
      .then((questions) => !cancelled && setPool(questions))
      .catch(() => {
        if (cancelled) return;
        setPool([]);
        setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, [level]);

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

  const counts = pool ? countByTopic(pool) : undefined;
  // Topics with no questions at this level are ignored, even if they were saved earlier.
  const activeTopics = topics.filter((t) => !counts || counts[t] > 0);
  const matched = pool ? filterByTopics(pool, activeTopics).length : undefined;

  // The selection is not saved: every visit starts with no topic selected (all topics).
  const saveTopics = setTopics;
  const toggleTopic = (t: Topic) => saveTopics(topics.includes(t) ? topics.filter((x) => x !== t) : [...topics, t]);

  const start = (n: QuestionCount) => {
    if (!level) return;
    savePrefs({ lastLevel: level, questionCount: n });
    const topicParam = activeTopics.length ? `&topics=${activeTopics.join(',')}` : '';
    navigate(`/quiz/${level}?n=${n}${topicParam}`);
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

      {level && (
        <>
          <Accordion className="mb-2">
            <Accordion.Item eventKey="topics">
              <Accordion.Header as="h2">
                <span className="h5 mb-0 me-2">Topics</span>
                <span className="text-secondary small">{activeTopics.length ? `${activeTopics.length} selected` : 'All topics'}</span>
              </Accordion.Header>
              <Accordion.Body>
                <p className="text-secondary small">Pick one or more topics, or none to practise all of them.</p>
                <div className="d-grid d-sm-flex flex-sm-wrap gap-2" role="group" aria-label="Topics">
                  {TOPICS.map((t) => {
                    const selected = activeTopics.includes(t);
                    const count = counts?.[t];
                    return (
                      <Button
                        key={t}
                        size="sm"
                        className="text-start text-sm-center"
                        variant={selected ? 'primary' : 'outline-primary'}
                        aria-pressed={selected}
                        disabled={count === 0}
                        onClick={() => toggleTopic(t)}
                      >
                        {TOPIC_LABELS[t]}
                        {count !== undefined && <span className="opacity-75"> ({count})</span>}
                      </Button>
                    );
                  })}
                </div>
                {topics.length > 0 && (
                  <Button variant="link" size="sm" className="p-0 mt-2" onClick={() => saveTopics([])}>
                    All topics
                  </Button>
                )}
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
          <p className={`small mt-2 mb-4 ${failed ? 'text-danger' : 'text-secondary'}`} aria-live="polite">
            {failed
              ? 'Could not load this level. Connect to the internet to download it; it will then work offline.'
              : matched === undefined
                ? 'Loading questions…'
                : `${matched} questions match your selection`}
          </p>

          <h2 className="h5">Start a quiz</h2>
          <p className="text-secondary">Tap the number of questions to begin.</p>
          <Row xs={2} md={4} className="g-3 mb-4" role="group" aria-label="Number of questions">
            {QUESTION_COUNTS.map((n) => (
              <Col key={n}>
                <Button
                  variant="outline-primary"
                  className="w-100 py-3"
                  onClick={() => start(n)}
                  disabled={matched === 0}
                  aria-label={`Start with ${n} questions`}
                >
                  <span className="d-block display-6 fw-bold lh-1">{n}</span>
                  <small>questions</small>
                </Button>
              </Col>
            ))}
          </Row>
        </>
      )}

      <HistorySection />
    </div>
  );
}
