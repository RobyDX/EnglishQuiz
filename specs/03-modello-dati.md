# Modello dati e storage

## Tipi TypeScript (`src/types/`)

```ts
export type Level = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export type QuestionType =
  | 'multiple-choice' | 'verb-form' | 'fill-blank' | 'verb-conjugate'
  | 'word-bank' | 'place-word' | 'word-order' | 'error-spot' | 'error-correct'
  | 'true-false' | 'reading-mc' | 'match-pairs' | 'odd-one-out'
  | 'sentence-choice' | 'transform';

export interface QuestionBase {
  id: string;           // univoco globalmente, es. "a1-mc-001"
  type: QuestionType;
  level: Level;
  topic: string;
  prompt: string;
  explanation: string;                    // regola, in inglese (obbligatoria)
  wrongReasons?: Record<string, string>;  // perché una risposta sbagliata specifica è errata, in inglese
}

// Question = unione discriminata su `type`; i payload sono definiti in 02-tipologie-domande.md

export interface QuizSession {
  level: Level;
  questions: Question[];
  answers: Record<string, unknown>;   // id domanda -> risposta (tipo dipende da type)
  status: 'answering' | 'submitted';
  showSolutions: boolean;
}

export interface QuizResult {
  total: number;
  correct: number;
  percent: number;                    // intero 0-100
  perQuestion: Record<string, boolean>;
}

export interface HistoryEntry {
  date: string;                       // ISO 8601
  level: Level;
  total: number;
  correct: number;
  percent: number;
}
```

## Forma delle risposte per tipologia

| Tipo | Risposta `A` |
|------|--------------|
| multiple-choice, verb-form, odd-one-out, sentence-choice | `number` (indice opzione) |
| fill-blank, verb-conjugate, word-bank | `string[]` (una per spazio) |
| place-word | `number` (posizione di inserimento) |
| word-order | `string[]` (parole nell'ordine scelto) |
| error-spot | `number` (indice token) |
| error-correct, transform | `string` |
| true-false | `boolean[]` |
| reading-mc | `number[]` |
| match-pairs | `Record<string,string>` (left → right) |

## File dei contenuti
- `src/data/<livello>/<tipo>.json`, ciascuno: `{ "level": "A1", "type": "multiple-choice", "questions": Question[] }`.
- Caricamento lazy di un livello alla volta tramite `import.meta.glob` in `src/data/index.ts`.
- Test di validazione (`src/data/data.test.ts`): vedi `07-contenuti.md`.

## Persistenza (`localStorage`)
| Chiave | Contenuto |
|--------|-----------|
| `eq.prefs` | `{ lastLevel: Level, questionCount: 5\|10\|20 }` |
| `eq.history` | `HistoryEntry[]` (max 50, i più recenti in testa) |
| `eq.seen.<livello>` | `string[]` ultimi ~100 `id` visti, per evitare ripetizioni |

- Il quiz in corso **non** è persistito (MVP).
- Accesso sempre in `try/catch` (modalità privata / storage disabilitato): l'app deve funzionare senza.
- Versioning: le chiavi hanno prefisso `eq.`; eventuali migrazioni future con campo `v`.
