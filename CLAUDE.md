# EnglishQuiz

SPA + PWA React (front-end only) per esercizi di inglese per livello CEFR (A1–C2). Grafica Bootstrap 5, responsive mobile/desktop.

## Regola principale
**Segui sempre la progettazione in `specs/`.** Prima di scrivere o modificare codice leggi i file rilevanti:

- `specs/01-progettazione.md` – requisiti, stack, architettura, punteggio (documento di riferimento)
- `specs/02-tipologie-domande.md` – tipologie di domande, schemi JSON, regole di correzione
- `specs/03-modello-dati.md` – tipi TypeScript, forma delle risposte, storage
- `specs/04-ui-ux.md` – schermate, layout, accessibilità, testi
- `specs/05-pwa.md` – manifest, service worker, offline
- `specs/06-piano-implementazione.md` – fasi e checklist
- `specs/07-contenuti.md` – 2000 domande per livello, quote per tipologia, qualità, validazione
- `specs/08-decisioni.md` – registro delle decisioni prese (leggerlo prima di cambiare comportamento)

Se una richiesta o un'esigenza tecnica contraddice le specifiche: **segnalalo e aggiorna prima la specifica**, poi il codice. Mantieni spec e codice allineati (nuova tipologia, nuovo campo, nuova pagina ⇒ aggiorna il relativo file in `specs/`). Spunta le voci completate in `06-piano-implementazione.md`.

## Struttura
- **Tutto ciò che è codice sta in `src/`**, compresi `package.json`, `node_modules`, `public`, `index.html` e le configurazioni (Vite usa `src/` come root). Fuori da `src/` solo `specs/`, `build/` e i file di repository.
- Output di build **solo** in `build/` (mai modificarlo a mano, è ignorato da git).
- Documentazione in `specs/`.
- Logica di correzione/punteggio pura in `src/engine/`, senza dipendenze da React.
- Ogni tipologia di domanda = componente in `src/questions/` + riga in `registry.tsx` + regole in `src/engine/rules.ts`.

## Convenzioni
- TypeScript, componenti funzionali, `react-bootstrap` per la UI; evitare CSS custom se Bootstrap basta.
- **Tutto in inglese nell'app**: interfaccia, esercizi, messaggi e spiegazioni (nessun italiano, nessun i18n). Solo la documentazione in `specs/` è in italiano.
- Ogni risposta errata mostra *Your answer*, *Correct answer*, *Why it's wrong* e *Rule* (vedi `specs/04-ui-ux.md`); ogni domanda ha `explanation` obbligatoria.
- Nessun backend né chiamate di rete a runtime. Persistenza solo `localStorage` (chiavi `eq.*`, sempre in try/catch).
- Router: `HashRouter`. Vite: `root` = `src/`, `base: './'`, `build.outDir: '../build'`.
- Ogni nuova tipologia o regola di correzione richiede test (Vitest).
- Nessun effetto collaterale (localStorage, ecc.) dentro gli updater di `setState`: leggere lo stato da un `ref` (React li chiama due volte in StrictMode).
- Ogni risposta sbagliata di una domanda a scelta / `word-bank` ha la **sua** spiegazione in `wrongReasons` (mai riusata tra opzioni diverse); `explanation` obbligatoria su ogni domanda.
- Pulsanti di azione del quiz solo in fondo alla pagina; la barra livello/progresso è sticky con il pulsante "↓ End".
- Contenuti degli esercizi originali, nessun testo coperto da copyright; 2000 domande per livello in `src/data/<livello>/<tipo>.json`, rispettando le quote di `specs/07-contenuti.md`.

## Comandi (da eseguire in `src/`)
`npm run dev` · `npm run build` (→ `build/`) · `npm run preview` · `npm test` · `npm run lint`
