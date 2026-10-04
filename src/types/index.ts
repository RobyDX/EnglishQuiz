export type Level = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
export const LEVELS: Level[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

export type QuestionType =
  | 'multiple-choice'
  | 'verb-form'
  | 'fill-blank'
  | 'verb-conjugate'
  | 'word-bank'
  | 'place-word'
  | 'word-order'
  | 'error-spot'
  | 'error-correct'
  | 'true-false'
  | 'reading-mc'
  | 'match-pairs'
  | 'odd-one-out'
  | 'sentence-choice'
  | 'transform';

export interface QuestionBase {
  id: string;
  type: QuestionType;
  level: Level;
  topic: string;
  prompt: string;
  /** The rule, in simple English (required). */
  explanation: string;
  /** Why a specific wrong answer is wrong. Key = option index or normalized wrong text. */
  wrongReasons?: Record<string, string>;
}

export interface ChoiceQuestion extends QuestionBase {
  type: 'multiple-choice' | 'verb-form' | 'odd-one-out' | 'sentence-choice';
  options: string[];
  correct: number;
  verb?: string;
  category?: string;
}

export interface GapQuestion extends QuestionBase {
  type: 'fill-blank' | 'verb-conjugate';
  /** Text with one `___` per gap. */
  text: string;
  /** answers[i] = accepted answers for gap i. */
  answers: string[][];
}

export interface WordBankQuestion extends QuestionBase {
  type: 'word-bank';
  bank: string[];
  text: string;
  answers: string[];
}

export interface PlaceWordQuestion extends QuestionBase {
  type: 'place-word';
  word: string;
  tokens: string[];
  correctPositions: number[];
}

export interface WordOrderQuestion extends QuestionBase {
  type: 'word-order';
  words: string[];
  solutions: string[][];
}

export interface ErrorSpotQuestion extends QuestionBase {
  type: 'error-spot';
  tokens: string[];
  wrongIndex: number;
  fix: string;
}

export interface TextQuestion extends QuestionBase {
  type: 'error-correct' | 'transform';
  /** error-correct: the wrong sentence. transform: the original sentence. */
  wrong?: string;
  original?: string;
  keyword?: string;
  template?: string;
  solutions: string[];
}

export interface TrueFalseQuestion extends QuestionBase {
  type: 'true-false';
  passage: string;
  statements: { text: string; answer: boolean }[];
}

export interface ReadingQuestion extends QuestionBase {
  type: 'reading-mc';
  passage: string;
  items: { q: string; options: string[]; correct: number }[];
}

export interface MatchPairsQuestion extends QuestionBase {
  type: 'match-pairs';
  pairs: { left: string; right: string }[];
  /** Right-hand options in display order (shuffled by buildQuiz). */
  rightOptions?: string[];
}

export type Question =
  | ChoiceQuestion
  | GapQuestion
  | WordBankQuestion
  | PlaceWordQuestion
  | WordOrderQuestion
  | ErrorSpotQuestion
  | TextQuestion
  | TrueFalseQuestion
  | ReadingQuestion
  | MatchPairsQuestion;

export type Answers = Record<string, unknown>;

export interface QuizResult {
  total: number;
  correct: number;
  percent: number;
  perQuestion: Record<string, boolean>;
}

export interface HistoryEntry {
  date: string;
  level: Level;
  total: number;
  correct: number;
  percent: number;
}

/** Last placement test, saved in localStorage (`eq.placement`). */
export interface PlacementSaved {
  date: string;
  level: Level;
  perLevel: Record<Level, { answered: number; correct: number }>;
}

export interface QuestionFile {
  level: Level;
  type: QuestionType;
  questions: Question[];
}
