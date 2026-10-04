import { Badge, Button } from 'react-bootstrap';
import type { PlaceWordQuestion as Q } from '../types';
import type { QuestionProps } from './shared';

export default function PlaceWord({ question: q, answer, onChange, disabled }: QuestionProps<Q, number>) {
  const slots = Array.from({ length: q.tokens.length + 1 }, (_, i) => i);
  return (
    <>
      <p className="mb-2">
        Place the word{' '}
        <Badge bg="primary" className="fs-6">
          {q.word}
        </Badge>{' '}
        in the sentence. Tap the spot where it belongs.
      </p>
      <div className="d-flex flex-wrap align-items-center gap-1 place-word">
        {slots.map((pos) => (
          <span key={pos} className="d-inline-flex align-items-center gap-1">
            {answer === pos ? (
              <Button size="sm" variant="primary" disabled={disabled} onClick={() => onChange(pos)} aria-label={`${q.word} is placed here`}>
                {q.word}
              </Button>
            ) : (
              <Button
                size="sm"
                variant="outline-secondary"
                className="slot"
                disabled={disabled}
                onClick={() => onChange(pos)}
                aria-label={`Insert "${q.word}" ${pos === 0 ? 'at the start' : `after "${q.tokens[pos - 1]}"`}`}
              >
                ▾
              </Button>
            )}
            {pos < q.tokens.length && <span>{q.tokens[pos]}</span>}
          </span>
        ))}
      </div>
    </>
  );
}
