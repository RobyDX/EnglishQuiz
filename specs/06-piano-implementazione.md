# Piano di implementazione

Ordine di lavoro. Ogni fase termina con test verdi e `npm run build` funzionante. Spuntare le voci man mano.

## Fase 0 – Setup
- [x] Progetto Vite + React + TS **dentro `src/`** (root = `src/`), `build.outDir = '../build'`, `base: './'`
- [x] Dipendenze: `react-bootstrap`, `bootstrap`, `react-router-dom`, `vite-plugin-pwa`, `vitest`, `@testing-library/react`. (ESLint/Prettier non installati: lint = `tsc --noEmit`)
- [x] `dev.bat` e `build.bat` nella radice per avviare la modalità dev e fare la build
- [x] `.gitignore` (node_modules, build), script npm: `dev`, `build`, `preview`, `test`, `lint`

## Fase 1 – Motore (logica pura, TDD)
- [x] Tipi in `src/types/`
- [x] `engine/normalize.ts` (normalizzazione testo)
- [x] `engine/buildQuiz.ts` (selezione, mix tipologie, shuffle)
- [x] `engine/gradeQuiz.ts` + `engine/rules.ts` (regole di correzione per tipo)
- [x] `engine/score.ts` (percentuale, fascia)

## Fase 2 – Tipologie (una alla volta: componente + grade + test)
Ordine: multiple-choice → verb-form → fill-blank → verb-conjugate → word-bank → true-false → word-order → place-word → error-spot → match-pairs → odd-one-out → sentence-choice → error-correct → reading-mc → transform.
- [x] Tutte le 15 tipologie implementate (componente + regole + test)
- [x] Registry `src/questions/registry.tsx`
- [x] `QuestionCard` con feedback errori (Your answer / Correct answer / Why it's wrong / Rule)

## Fase 3 – Pagine e UI
- [x] Layout + Navbar + HashRouter
- [x] HomePage (livelli, n° domande, preferenze)
- [x] QuizPage (sessione, Check answers, ScoreCard, Show correct answers, Try again/New quiz/Change level, pannello errori Why/Rule)
- [x] HistoryPage, AboutPage
- [x] Modal di conferma domande mancanti
- [x] Barra livello/progresso sticky + pulsante "↓ End"; pulsanti di azione solo alla fine
- [x] Cronologia salvata una sola volta (test di regressione in StrictMode)

## Fase 4 – Contenuti
Dettagli e quote in `07-contenuti.md`. Per ogni livello: scrivere i lotti per tipologia, validare, revisionare a campione.
- [x] Infrastruttura: `src/data/index.ts`, `data.test.ts` (schema, duplicati, inglese, quote con `CHECK_QUOTAS=1`)
- [x] Set di prova: 178 domande (A1 46, A2 36, B1 30, B2 28, C1 22, C2 16), tutte le tipologie coperte. Da espandere a 2000 per livello.
- [ ] A1 – 2000 domande
- [ ] A2 – 2000 domande
- [ ] B1 – 2000 domande
- [ ] B2 – 2000 domande
- [ ] C1 – 2000 domande
- [ ] C2 – 2000 domande

## Fase 5 – PWA
- [x] Manifest + icone
- [x] Service worker + toast aggiornamento
- [x] Pulsante installa
- [ ] Verifica offline

## Fase 6 – Rifinitura
- [ ] Accessibilità (tastiera, aria-live)
- [ ] Verifica responsive 360 px / 768 px / 1440 px (anche barra sticky)
- [ ] (Opzionale) Export/Import JSON della cronologia
- [ ] (Opzionale) Messaggio quando un livello ha meno domande di quelle richieste
- [ ] (Opzionale) ESLint + Prettier
- [x] Tema scuro (segue il sistema)
- [x] README con comandi e deploy statico di `build/`

## Definizione di "fatto"
Soddisfatti i criteri di accettazione in `01-progettazione.md` §9 e la checklist PWA in `05-pwa.md`.

## Decisioni
Le decisioni prese sono nel registro `08-decisioni.md`. Ancora aperte:
1. Hosting previsto (GitHub Pages, Netlify, altro): influisce solo sulle istruzioni di deploy; con `base: './'` + HashRouter va ovunque.
2. Se aggiungere export/import della cronologia (oggi solo `localStorage`).
3. Se aggiungere ESLint/Prettier.
