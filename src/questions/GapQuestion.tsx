import { Badge, Form } from 'react-bootstrap';
import type { GapQuestion as G, WordBankQuestion as W } from '../types';
import { enterNavigation, type QuestionProps } from './shared';

export default function GapQuestion({ question: q, answer, onChange, disabled, onEnter }: QuestionProps<G | W, string[]>) {
  const parts = q.text.split('___');
  const values = answer ?? [];
  const set = (i: number, v: string) => {
    const next = parts.slice(1).map((_, k) => values[k] ?? '');
    next[i] = v;
    onChange(next);
  };
  return (
    <>
      {q.type === 'word-bank' && (
        <p className="mb-2">
          {q.bank.map((w) => (
            <Badge key={w} bg={values.includes(w) ? 'secondary' : 'info'} text="dark" className="me-1 fs-6 fw-normal">
              {w}
            </Badge>
          ))}
        </p>
      )}
      <div className="gap-text">
        {parts.map((part, i) => (
          <span key={i}>
            {part}
            {i < parts.length - 1 &&
              (q.type === 'word-bank' ? (
                <Form.Select
                  size="sm"
                  className="d-inline-block w-auto mx-1"
                  aria-label={`Gap ${i + 1}`}
                  value={values[i] ?? ''}
                  disabled={disabled}
                  onChange={(e) => set(i, e.target.value)}
                >
                  <option value="">…</option>
                  {q.bank.map((w) => (
                    <option key={w} value={w}>
                      {w}
                    </option>
                  ))}
                </Form.Select>
              ) : (
                <Form.Control
                  size="sm"
                  className="d-inline-block mx-1 gap-input"
                  aria-label={`Gap ${i + 1}`}
                  autoComplete="off"
                  autoCapitalize="none"
                  spellCheck={false}
                  data-nav
                  value={values[i] ?? ''}
                  disabled={disabled}
                  onChange={(e) => set(i, e.target.value)}
                  onKeyDown={(e) => enterNavigation(e, onEnter)}
                />
              ))}
          </span>
        ))}
      </div>
    </>
  );
}
