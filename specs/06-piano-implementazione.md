# Piano di implementazione

Ordine di lavoro. Ogni fase termina con test verdi e `npm run build` funzionante. Spuntare le voci man mano.

## Fase 0 – Setup
- [ ] `npm create vite` (template react-ts) adattato: codice in `src/`, `build.outDir = 'build'`, `base: './'`
- [ ] Dipendenze: `react-bootstrap`, `bootstrap`, `react-router-dom`, `vite-plugin-pwa`, `vitest`, `@testing-library/react`, `eslint`, `prettier`
- [ ] `.gitignore` (node_modules, build), script npm: `dev`, `build`, `preview`, `test`, `lint`

## Fase 1 – Motore (logica pura, TDD)
- [ ] Tipi in `src/types/`
- [ ] `engine/normalize.ts` (normalizzazione testo)
- [ ] `engine/buildQuiz.ts` (selezione, mix tipologie, shuffle)
- [ ] `engine/gradeQuiz.ts` (usa il registry)
- [ ] `engine/score.ts` (percentuale, fascia)

## Fase 2 – Tipologie (una alla volta: componente + grade + test)
Ordine: multiple-choice → verb-form → fill-blank → verb-conjugate → word-bank → true-false → word-order → place-word → error-spot → match-pairs → odd-one-out → sentence-choice → error-correct → reading-mc → transform.
- [ ] Registry `src/questions/registry.ts`
- [ ] `QuestionRenderer` con le tre modalità (answering/graded/solution)

## Fase 3 – Pagine e UI
- [ ] Layout + Navbar + HashRouter
- [ ] HomePage (livelli, n° domande, preferenze)
- [ ] QuizPage (sessione, Check answers, ScoreCard, Show correct answers, Try again/New quiz/Change level, pannello errori Why/Rule)
- [ ] HistoryPage, AboutPage
- [ ] Modal di conferma domande mancanti

## Fase 4 – Contenuti
Dettagli e quote in `07-contenuti.md`. Per ogni livello: scrivere i lotti per tipologia, validare, revisionare a campione.
- [ ] Infrastruttura: `src/data/index.ts`, `data.test.ts` (schema, duplicati, quote)
- [ ] A1 – 2000 domande
- [ ] A2 – 2000 domande
- [ ] B1 – 2000 domande
- [ ] B2 – 2000 domande
- [ ] C1 – 2000 domande
- [ ] C2 – 2000 domande

## Fase 5 – PWA
- [ ] Manifest + icone
- [ ] Service worker + toast aggiornamento
- [ ] Pulsante installa
- [ ] Verifica offline

## Fase 6 – Rifinitura
- [ ] Accessibilità (tastiera, aria-live)
- [ ] Verifica responsive 360 px / 768 px / 1440 px
- [ ] Tema scuro
- [ ] README con comandi e deploy statico di `build/`

## Definizione di "fatto"
Soddisfatti i criteri di accettazione in `01-progettazione.md` §9 e la checklist PWA in `05-pwa.md`.

## Decisioni aperte (da confermare prima di partire)
1. TypeScript vs JavaScript → **proposta: TypeScript**.
2. Hosting previsto (GitHub Pages, Netlify, altro) → influisce solo su `base` e istruzioni di deploy; con `base: './'` + HashRouter va ovunque.
3. Numero di domande per livello → **deciso: 2000** (vedi `07-contenuti.md`). Si può rilasciare un MVP con A1–B1 completi e gli altri livelli in arrivo.
