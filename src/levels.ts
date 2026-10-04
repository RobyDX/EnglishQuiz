import type { Level } from './types';

export const LEVEL_INFO: Record<Level, { name: string; description: string }> = {
  A1: { name: 'Beginner', description: 'Basic words and simple sentences' },
  A2: { name: 'Elementary', description: 'Everyday situations and the past' },
  B1: { name: 'Intermediate', description: 'Opinions, plans and experiences' },
  B2: { name: 'Upper Intermediate', description: 'Complex ideas and fluent speech' },
  C1: { name: 'Advanced', description: 'Precise, flexible language' },
  C2: { name: 'Proficiency', description: 'Near-native nuance and style' },
};

export const QUESTION_COUNTS = [5, 10, 20] as const;
export type QuestionCount = (typeof QUESTION_COUNTS)[number];
