import type { ComponentType } from 'react';
import type { Question, QuestionType } from '../types';
import ChoiceQuestion from './ChoiceQuestion';
import GapQuestion from './GapQuestion';
import PlaceWord from './PlaceWord';
import WordOrder from './WordOrder';
import ErrorSpot from './ErrorSpot';
import TextAnswer from './TextAnswer';
import TrueFalse from './TrueFalse';
import ReadingQuestion from './ReadingQuestion';
import MatchPairs from './MatchPairs';
import type { QuestionProps } from './shared';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyProps = QuestionProps<any, any>;

/** question type -> UI component. Grading logic lives in engine/rules.ts. */
export const registry: Record<QuestionType, ComponentType<AnyProps>> = {
  'multiple-choice': ChoiceQuestion,
  'verb-form': ChoiceQuestion,
  'odd-one-out': ChoiceQuestion,
  'sentence-choice': ChoiceQuestion,
  'fill-blank': GapQuestion,
  'verb-conjugate': GapQuestion,
  'word-bank': GapQuestion,
  'place-word': PlaceWord,
  'word-order': WordOrder,
  'error-spot': ErrorSpot,
  'error-correct': TextAnswer,
  transform: TextAnswer,
  'true-false': TrueFalse,
  'reading-mc': ReadingQuestion,
  'match-pairs': MatchPairs,
};

export function QuestionBody(props: Omit<AnyProps, 'question'> & { question: Question }) {
  const Component = registry[props.question.type];
  return <Component {...props} />;
}
