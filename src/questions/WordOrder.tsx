import { Button } from 'react-bootstrap';
import type { WordOrderQuestion as Q } from '../types';
import type { QuestionProps } from './shared';

export default function WordOrder({ question: q, answer, onChange, disabled }: QuestionProps<Q, string[]>) {
  const chosen = answer ?? [];
  const remaining = [...q.words];
  for (const c of chosen) {
    const i = remaining.indexOf(c);
    if (i >= 0) remaining.splice(i, 1);
  }
  return (
    <>
      <div className="answer-area d-flex flex-wrap gap-2 mb-3" aria-label="Your sentence">
        {chosen.length === 0 && <span className="text-secondary">Tap the words below to build the sentence.</span>}
        {chosen.map((w, i) => (
          <Button key={`${w}-${i}`} variant="primary" disabled={disabled} onClick={() => onChange(chosen.filter((_, k) => k !== i))}>
            {w}
          </Button>
        ))}
      </div>
      <div className="d-flex flex-wrap gap-2">
        {remaining.map((w, i) => (
          <Button key={`${w}-${i}`} variant="outline-primary" disabled={disabled} onClick={() => onChange([...chosen, w])}>
            {w}
          </Button>
        ))}
      </div>
    </>
  );
}
