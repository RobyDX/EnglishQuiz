import { forwardRef } from 'react';
import { Card, ProgressBar } from 'react-bootstrap';
import { bandOf } from '../engine/score';
import type { QuizResult } from '../types';

const ScoreCard = forwardRef<HTMLDivElement, { result: QuizResult }>(({ result }, ref) => {
  const band = bandOf(result.percent);
  return (
    // Gets the focus after submitting; the result is announced by the quiz page's status region.
    <Card ref={ref} tabIndex={-1} className="mb-3 score-card" border={band.variant} role="region" aria-labelledby="score-title">
      <Card.Body>
        <h2 id="score-title" className="h4 mb-1">
          {result.correct} / {result.total} correct – {result.percent}%
        </h2>
        <p className={`fw-semibold text-${band.variant} mb-2`}>{band.label}</p>
        <ProgressBar now={result.percent} variant={band.variant} aria-label="Score" />
      </Card.Body>
    </Card>
  );
});
ScoreCard.displayName = 'ScoreCard';
export default ScoreCard;
