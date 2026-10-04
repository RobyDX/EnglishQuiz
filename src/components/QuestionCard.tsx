import { Alert, Badge, Card } from 'react-bootstrap';
import { explainWrong, formatAnswer, formatSolution, isAnswered } from '../engine/rules';
import { QuestionBody } from '../questions/registry';
import type { Question } from '../types';

const TYPE_LABEL: Record<Question['type'], string> = {
  'multiple-choice': 'Multiple choice',
  'verb-form': 'Verb form',
  'fill-blank': 'Fill in the gap',
  'verb-conjugate': 'Conjugate the verb',
  'word-bank': 'Word bank',
  'place-word': 'Place the word',
  'word-order': 'Word order',
  'error-spot': 'Spot the mistake',
  'error-correct': 'Correct the sentence',
  'true-false': 'True or false',
  'reading-mc': 'Reading',
  'match-pairs': 'Match',
  'odd-one-out': 'Odd one out',
  'sentence-choice': 'Choose the sentence',
  transform: 'Transform the sentence',
};

interface Props {
  index: number;
  question: Question;
  answer: unknown;
  onChange: (value: unknown) => void;
  submitted: boolean;
  correct?: boolean;
  showSolution: boolean;
  onEnter: () => void;
}

export default function QuestionCard({ index, question: q, answer, onChange, submitted, correct, showSolution, onEnter }: Props) {
  const border = !submitted ? '' : correct ? 'border-success' : 'border-danger';
  const wrong = submitted && !correct;
  const empty = !isAnswered(q, answer) && formatAnswer(q, answer) === 'No answer';

  return (
    <Card className={`mb-3 question-card ${border}`} as="section" aria-labelledby={submitted ? `${q.id}-title ${q.id}-result` : `${q.id}-title`}>
      <Card.Header className="d-flex justify-content-between align-items-center gap-2">
        <span id={`${q.id}-title`} className="fw-semibold">
          {index + 1}. <span className="text-secondary fw-normal">{TYPE_LABEL[q.type]}</span>
        </span>
        {submitted && (
          <Badge id={`${q.id}-result`} bg={correct ? 'success' : 'danger'}>{correct ? '✓ Correct' : '✗ Incorrect'}</Badge>
        )}
      </Card.Header>
      <Card.Body>
        <p className="question-prompt">{q.prompt}</p>
        <QuestionBody question={q} answer={answer} onChange={onChange} disabled={submitted} onEnter={onEnter} />

        {wrong && (
          <Alert variant={empty ? 'warning' : 'danger'} className="mt-3 mb-0 feedback">
            <p className="mb-1">
              <strong>Your answer:</strong> {formatAnswer(q, answer)}
            </p>
            <p className="mb-1">
              <strong>Correct answer:</strong> {formatSolution(q)}
            </p>
            {!empty && (
              <p className="mb-1">
                <strong>Why it&apos;s wrong:</strong> {explainWrong(q, answer)}
              </p>
            )}
            <p className="mb-0">
              <strong>Rule:</strong> {q.explanation}
            </p>
          </Alert>
        )}

        {!wrong && submitted && showSolution && (
          <Alert variant="info" className="mt-3 mb-0 feedback">
            <p className="mb-1">
              <strong>Correct answer:</strong> {formatSolution(q)}
            </p>
            <p className="mb-0">
              <strong>Rule:</strong> {q.explanation}
            </p>
          </Alert>
        )}
      </Card.Body>
    </Card>
  );
}
