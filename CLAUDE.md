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

Se una richiesta o un'esigenza tecnica contraddice le specifiche: **segnalalo e aggiorna prima la specifica**, poi il codice. Mantieni spec e codice allineati (nuova tipologia, nuovo campo, nuova pagina ⇒ aggiorna il relativo file in `specs/`). Spunta le voci completate in `06-piano-implementazione.md`.

## Struttura
- Codice **solo** in `src/`. Output di build **solo** in `build/` (mai modificarlo a mano, è ignorato da git).
- Documentazione in `specs/`.
- Logica di correzione/punteggio pura in `src/engine/`, senza dipendenze da React.
- Ogni tipologia di domanda = un file in `src/questions/` + registrazione in `registry.ts`.

## Convenzioni
- TypeScript, componenti funzionali, `react-bootstrap` per la UI; evitare CSS custom se Bootstrap basta.
- **Tutto in inglese nell'app**: interfaccia, esercizi, messaggi e spiegazioni (nessun italiano, nessun i18n). Solo la documentazione in `specs/` è in italiano.
- Ogni risposta errata mostra *Your answer*, *Correct answer*, *Why it's wrong* e *Rule* (vedi `specs/04-ui-ux.md`); ogni domanda ha `explanation` obbligatoria.
- Nessun backend né chiamate di rete a runtime. Persistenza solo `localStorage` (chiavi `eq.*`, sempre in try/catch).
- Router: `HashRouter`. Vite: `base: './'`, `build.outDir: 'build'`.
- Ogni nuova tipologia o regola di correzione richiede test (Vitest).
- Contenuti degli esercizi originali, nessun testo coperto da copyright; 2000 domande per livello in `src/data/<livello>/<tipo>.json`, rispettando le quote di `specs/07-contenuti.md`.

## Comandi (dopo il setup)
`npm run dev` · `npm run build` (→ `build/`) · `npm run preview` · `npm test` · `npm run lint`
