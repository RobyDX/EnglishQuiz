import { Form } from 'react-bootstrap';
import type { MatchPairsQuestion as Q } from '../types';
import type { QuestionProps } from './shared';

export default function MatchPairs({ question: q, answer, onChange, disabled }: QuestionProps<Q, Record<string, string>>) {
  const values = answer ?? {};
  const options = q.rightOptions ?? q.pairs.map((p) => p.right);
  return (
    <>
      {q.pairs.map((p) => (
        <div key={p.left} className="row g-2 align-items-center mb-2">
          <div className="col-5 fw-semibold">{p.left}</div>
          <div className="col-7">
            <Form.Select
              aria-label={`Match for ${p.left}`}
              value={values[p.left] ?? ''}
              disabled={disabled}
              onChange={(e) => onChange({ ...values, [p.left]: e.target.value })}
            >
              <option value="">Choose…</option>
              {options.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </Form.Select>
          </div>
        </div>
      ))}
    </>
  );
}
