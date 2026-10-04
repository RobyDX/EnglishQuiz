import type { ReadingQuestion as Q } from '../types';
import { RadioList, type QuestionProps } from './shared';

export default function ReadingQuestion({ question: q, answer, onChange, disabled }: QuestionProps<Q, (number | undefined)[]>) {
  const values = answer ?? [];
  return (
    <>
      <p className="passage bg-body-tertiary rounded p-3">{q.passage}</p>
      {q.items.map((it, i) => (
        <div key={i} className="mb-3">
          <p className="fw-semibold mb-1">
            {i + 1}. {it.q}
          </p>
          <RadioList
            name={`${q.id}-${i}`}
            options={it.options}
            value={values[i]}
            disabled={disabled}
            legend={it.q}
            onChange={(v) => {
              const next = q.items.map((_, k) => values[k]);
              next[i] = v;
              onChange(next);
            }}
          />
        </div>
      ))}
    </>
  );
}
