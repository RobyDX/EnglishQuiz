import { Button } from 'react-bootstrap';
import type { ChoiceQuestion as Q } from '../types';
import { RadioList, type QuestionProps } from './shared';

export default function ChoiceQuestion({ question: q, answer, onChange, disabled }: QuestionProps<Q, number>) {
  if (q.type === 'odd-one-out') {
    return (
      <div className="d-flex flex-wrap gap-2" role="group" aria-label={q.prompt}>
        {q.options.map((o, i) => (
          <Button
            key={i}
            variant={answer === i ? 'primary' : 'outline-primary'}
            aria-pressed={answer === i}
            disabled={disabled}
            onClick={() => onChange(i)}
          >
            {o}
          </Button>
        ))}
      </div>
    );
  }
  return (
    <>
      {q.verb && (
        <p className="text-secondary small mb-2">
          Verb: <strong>{q.verb}</strong>
        </p>
      )}
      <RadioList name={q.id} options={q.options} value={answer} onChange={onChange} disabled={disabled} legend={q.prompt} />
    </>
  );
}
