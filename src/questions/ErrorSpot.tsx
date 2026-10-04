import { Button } from 'react-bootstrap';
import type { ErrorSpotQuestion as Q } from '../types';
import type { QuestionProps } from './shared';

export default function ErrorSpot({ question: q, answer, onChange, disabled }: QuestionProps<Q, number>) {
  return (
    <div className="d-flex flex-wrap gap-2" role="group" aria-label="Sentence words">
      {q.tokens.map((t, i) => (
        <Button
          key={i}
          variant={answer === i ? 'danger' : 'outline-secondary'}
          aria-pressed={answer === i}
          disabled={disabled}
          onClick={() => onChange(i)}
        >
          {t}
        </Button>
      ))}
    </div>
  );
}
