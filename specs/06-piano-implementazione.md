# Piano di implementazione

Ordine di lavoro. Ogni fase termina con test verdi e `npm run build` funzionante. Spuntare le voci man mano.

## Fase 0 – Setup
- [x] Progetto Vite + React + TS **dentro `src/`** (root = `src/`), `build.outDir = '../docs'`, `base: './'`
- [x] Dipendenze: `react-bootstrap`, `bootstrap`, `react-router-dom`, `vite-plugin-pwa`, `vitest`, `@testing-library/react`. (ESLint/Prettier non installati: lint = `tsc --noEmit`)
- [x] `dev.bat` e `build.bat` nella radice per avviare la modalità dev e fare la build
- [x] `.gitignore` (node_modules; `docs/` è versionato, vedi decisione 25), script npm: `dev`, `build`, `preview`, `test`, `lint`

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
- [x] A1 – 2000 domande (2000/2000, quote di `07-contenuti.md` rispettate per ogni tipologia; argomenti tra 5,0% e 9,0%, tranne `reading` 6,8% e pochi argomenti residui del set di prova)
- [x] A2 – 2000 domande (2000/2000, quote di `07-contenuti.md` rispettate per ogni tipologia; argomenti tra 5,2% e 7,2%, tranne `reading` 10,8% e `vocabulary` 8,6%; i pochi argomenti residui del set di prova sono sotto l'1%)
- [x] B1 – 2000 domande (2000/2000, quote di `07-contenuti.md` rispettate per ogni tipologia; argomenti tra 5,0% e 10,8%, tranne `frequency` 2,7%, `collocations` 1,6% e `grammar` 0,8%, che sono argomenti stretti di pochi tipi)
  - [x] Lotto 1: +1970 domande (mc 213, vf 163, fb 213, vc 183, wb 98, pw 133, wo 113, tr 133, es 133, ec 133, mp 98, oo 48, sc 98, rm 113, tf 98); testi di lettura 85–145 parole
- [x] B2 – 2000 domande (2000/2000, quote di `07-contenuti.md` rispettate per ogni tipologia; argomenti tra 6,1% e 11,8%, tranne `frequency` al 2,8%)
  - [x] Lotto 1: +1972 domande (mc 218, vf 163, fb 213, vc 163, wb 98, pw 133, wo 98, tr 148, es 148, ec 163, mp 113, sc 83, rm 133, tf 98); testi di lettura 102–132 parole. Restano sotto le 80 parole i testi brevi del set di prova
- [x] C1 – 2000 domande (2000/2000, quote di `07-contenuti.md` rispettate per ogni tipologia; argomenti tra 5,3% e 13,2%)
  - [x] Lotto 1: +1978 domande (mc 263, vf 148, fb 263, vc 148, pw 133, tr 233, es 198, ec 198, mp 133, rm 163, tf 98); testi di lettura 179–212 parole. Restano sotto le 150 parole i 4 testi brevi del set di prova (c1-rm-001/002, c1-tf-001/002)
- [x] C2 – 2000 domande (2000/2000, quote di `07-contenuti.md` rispettate per ogni tipologia; argomenti tra 6,4% e 13,2%)
  - [x] Lotto 1: +100 domande distribuite in proporzione alle quote di `07-contenuti.md` (mc 20, fb 18, tr 15, es 13, ec 13, rm 8, mp 8, tf 5); testi di lettura 165–200 parole
  - [x] Lotto 2: +1884 domande (mc 353, fb 345, tr 283, es 250, ec 250, mp 155, rm 155, tf 93); testi di lettura 169–204 parole. Restano sotto le 150 parole i 4 testi brevi del set di prova (c2-rm-001/002, c2-tf-001/002)

## Fase 5 – PWA
- [x] Manifest + icone
- [x] Service worker + toast aggiornamento
- [x] Pulsante installa
- [ ] Verifica offline

## Fase 6 – Rifinitura
- [x] Accessibilità (tastiera, aria-live): skip link, livelli con frecce, focus mai perso, regione `role="status"` unica in QuizPage (vedi `04-ui-ux.md`)
- [ ] Verifica responsive 360 px / 768 px / 1440 px (anche barra sticky)
- [ ] (Opzionale) Export/Import JSON della cronologia
- [ ] (Opzionale) Messaggio quando un livello ha meno domande di quelle richieste
- [ ] (Opzionale) ESLint + Prettier
- [x] Tema scuro (segue il sistema)
- [x] README con comandi e deploy statico di `docs/`

## Definizione di "fatto"
Soddisfatti i criteri di accettazione in `01-progettazione.md` §9 e la checklist PWA in `05-pwa.md`.

## Decisioni
Le decisioni prese sono nel registro `08-decisioni.md`. Ancora aperte:
1. Hosting previsto (GitHub Pages, Netlify, altro): influisce solo sulle istruzioni di deploy; con `base: './'` + HashRouter va ovunque.
2. Se aggiungere export/import della cronologia (oggi solo `localStorage`).
3. Se aggiungere ESLint/Prettier.
