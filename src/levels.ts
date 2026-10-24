import type { Level, Topic } from './types';

export const LEVEL_INFO: Record<Level, { name: string; description: string }> = {
  A1: { name: 'Beginner', description: 'Basic words and simple sentences' },
  A2: { name: 'Elementary', description: 'Everyday situations and the past' },
  B1: { name: 'Intermediate', description: 'Opinions, plans and experiences' },
  B2: { name: 'Upper Intermediate', description: 'Complex ideas and fluent speech' },
  C1: { name: 'Advanced', description: 'Precise, flexible language' },
  C2: { name: 'Proficiency', description: 'Near-native nuance and style' },
};

export const QUESTION_COUNTS = [5, 10, 20, 40] as const;
export type QuestionCount = (typeof QUESTION_COUNTS)[number];

export const TOPIC_LABELS: Record<Topic, string> = {
  'verb-tenses': 'Verb tenses',
  'modal-verbs': 'Modal verbs',
  'conditionals-wishes': 'Conditionals & wishes',
  'passive-reported-speech': 'Passive & reported speech',
  'articles-determiners': 'Articles & determiners',
  'pronouns-relative-clauses': 'Pronouns & relative clauses',
  'adjectives-adverbs': 'Adjectives & adverbs',
  'prepositions': 'Prepositions',
  'gerunds-infinitives-linking': 'Gerunds, infinitives & linking',
  'everyday-life': 'Everyday life',
  'travel-places-leisure': 'Travel, places & leisure',
  'work-education-technology': 'Work, education & technology',
  'society-health-environment': 'Society, health & environment',
  'phrasal-collocations-idioms': 'Phrasal verbs & idioms',
  'confusing-words-word-formation': 'Confusing words & word formation',
};
