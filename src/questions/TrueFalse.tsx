import { Button, ButtonGroup } from 'react-bootstrap';
import type { TrueFalseQuestion as Q } from '../types';
import type { QuestionProps } from './shared';

export default function TrueFalse({ question: q, answer, onChange, disabled }: QuestionProps<Q, (boolean | undefined)[]>) {
  const values = answer ?? [];
  const set = (i: number, v: boolean) => {
    const next = q.statements.map((_, k) => values[k]);
    next[i] = v;
    onChange(next);
  };
  return (
    <>
      <p className="passage">{q.passage}</p>
      {q.statements.map((s, i) => (
        <div key={i} className="d-flex flex-wrap align-items-center justify-content-between gap-2 py-2 border-top">
          <span className="me-2">{s.text}</span>
          <ButtonGroup aria-label={`Statement ${i + 1}`}>
            <Button variant={values[i] === true ? 'primary' : 'outline-primary'} disabled={disabled} aria-pressed={values[i] === true} onClick={() => set(i, true)}>
              True
            </Button>
            <Button variant={values[i] === false ? 'primary' : 'outline-primary'} disabled={disabled} aria-pressed={values[i] === false} onClick={() => set(i, false)}>
              False
            </Button>
          </ButtonGroup>
        </div>
      ))}
    </>
  );
}
