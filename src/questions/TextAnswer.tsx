import { Badge, Form } from 'react-bootstrap';
import type { TextQuestion as Q } from '../types';
import { enterNavigation, type QuestionProps } from './shared';

export default function TextAnswer({ question: q, answer, onChange, disabled, onEnter }: QuestionProps<Q, string>) {
  const source = q.type === 'error-correct' ? q.wrong : q.original;
  return (
    <>
      <blockquote className="border-start border-3 ps-3 mb-2">{source}</blockquote>
      {q.keyword && (
        <p className="mb-2">
          Use the word{' '}
          <Badge bg="primary" className="fs-6">
            {q.keyword}
          </Badge>
        </p>
      )}
      {q.template && <p className="mb-2 fst-italic">{q.template}</p>}
      <Form.Control
        aria-label="Your answer"
        autoComplete="off"
        spellCheck={false}
        data-nav
        value={answer ?? ''}
        disabled={disabled}
        placeholder={q.template ? 'Write the missing words' : 'Write the correct sentence'}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => enterNavigation(e, onEnter)}
      />
    </>
  );
}
