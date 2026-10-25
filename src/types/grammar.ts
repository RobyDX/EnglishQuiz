/** Areas of the Grammar section, in the order they appear in the index. */
export const GRAMMAR_AREAS = [
  'Nouns & determiners',
  'Pronouns & adjectives',
  'Tenses',
  'Verb forms & patterns',
  'Sentences & clauses',
  'Prepositions & word use',
  'Spelling & usage',
] as const;
export type GrammarArea = (typeof GRAMMAR_AREAS)[number];

/** Metadata of a theory page; the page itself is a static component (see src/grammar/registry.ts). */
export interface GrammarTopicMeta {
  /** kebab-case, used in the URL: #/grammar/<id> */
  id: string;
  title: string;
  area: GrammarArea;
  /** One line shown in the index. */
  summary: string;
  /** Extra words for the search (synonyms, example words). */
  keywords: string[];
  /** Ids of other topics worth reading next. */
  related?: string[];
}
