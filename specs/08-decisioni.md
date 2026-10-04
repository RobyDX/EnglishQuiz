# Registro delle decisioni

Decisioni prese durante la progettazione e l'implementazione. Se una decisione cambia, aggiornare questo file **e** la specifica interessata.

| # | Decisione | Dettaglio / motivo | Dove |
|---|-----------|--------------------|------|
| 1 | App **SPA + PWA front-end only**, React + Bootstrap 5, TypeScript, Vite | Nessun backend; mobile e desktop | 01 |
| 2 | **Tutto il progetto in `src/`** (compresi `package.json`, `node_modules`, `public`, `index.html`, config); build in `build/` | Richiesta esplicita: tutto ciò che è codice in `src`. Vite con `root: 'src'`, `outDir: '../build'`. I comandi npm si lanciano da `src/` (o con `dev.bat`) | 01 §4 |
| 3 | **Tutto in inglese** nell'app (UI, domande, spiegazioni); specs in italiano | Pubblico italiano, ma l'immersione è l'obiettivo. Niente i18n, niente traduzioni (tipo `translate-choice` sostituito da `sentence-choice`) | 01, 02 |
| 4 | **15 tipologie di domanda**, UI separata dalle regole (`questions/` vs `engine/rules.ts`) | Aggiungere un tipo non tocca il motore | 02, 01 §5.1 |
| 5 | **Punteggio**: 1 punto per domanda, tutto o niente; percentuale intera arrotondata | Più spazi nella stessa domanda = tutti giusti | 01 §6 |
| 6 | Quiz da **5 / 10 / 20** domande, default 10; tipologie alternate (round-robin); si evitano le ultime ~100 domande già viste per livello | Meno ripetizioni | 01 §7 |
| 7 | **Feedback sugli errori** subito dopo "Check answers": Your answer, Correct answer, Why it's wrong, Rule | Richiesta esplicita: perché è sbagliato e qual è la regola | 04, 01 F11 |
| 8 | **Ogni risposta sbagliata ha una spiegazione propria** (`wrongReasons`); per `word-bank` una per ogni parola e per ogni spazio (`<n>:<parola>`); se manca, un fallback legato alla risposta | Con *a / an / the*, "the" richiede una spiegazione diversa da "a". I test lo impongono | 02, 07 |
| 9 | **2000 domande per livello** (12000 totali), quote per livello e tipologia | Prima 60, poi 600, poi 2000. Si produce a lotti, un livello alla volta | 07 |
| 10 | Un file JSON per livello e tipologia; caricamento lazy per livello | File gestibili, bundle piccolo (bundle principale ~109 KB gzip) | 07, 03 |
| 11 | Pulsanti Check answers / Show correct answers / Try again / New quiz / Change level **solo alla fine della pagina, non fissi** | L'utente deve scorrere fino in fondo | 04 |
| 12 | **Barra livello/progresso sempre visibile** sotto la navbar + pulsante "↓ End" a destra | Il pulsante porta ai pulsanti finali | 04, 01 F12 |
| 13 | Nome **"English Quiz"** (con spazio); About: fatta da Roberto Nacchia tramite Generative AI per aiutare le persone a esercitarsi in inglese (il soprannome RobyDx è stato tolto) | Nel manifest, titolo, navbar | 04, 05 |
| 14 | **Persistenza solo in `localStorage`** (`eq.prefs`, `eq.history` max 50, `eq.seen.<livello>`); il quiz in corso non si salva; niente sincronizzazione | Nessun backend. Dati per browser/indirizzo | 03 |
| 15 | Ogni quiz si registra in cronologia **una sola volta**; niente effetti collaterali dentro gli updater di `setState`; doppioni storici ignorati al caricamento | Bug trovato: in StrictMode l'updater girava due volte e salvava due voci | 01 §5.2, 03 |
| 16 | **HashRouter** e `base: './'` | Hosting statico ovunque, anche in sottocartelle | 01, 05 |
| 17 | PWA: `registerType: 'prompt'`, precache di tutti gli asset, toast "New version available – Update", pulsante installa in About | Aggiornamenti controllati dall'utente | 05 |
| 18 | Tema chiaro/scuro che segue il sistema (`data-bs-theme`) | Bootstrap 5.3 | 04 |
| 19 | **Lint = `tsc --noEmit`**; ESLint/Prettier rimandati | Nessuna regola di stile richiesta per ora | 06 |
| 20 | Test con Vitest + Testing Library: motore, ogni tipologia, dati (schema, duplicati, parole italiane, spiegazioni complete), flusso UI. Quote 2000/livello verificate solo con `CHECK_QUOTAS=1` | Il set di prova (178 domande) non può rispettare le quote | 07 |
| 21 | Set di prova di 178 domande per verificare tutte le tipologie; il resto dei contenuti si scrive a lotti | Il lavoro editoriale è la parte più lunga | 06 Fase 4 |
| 22 | **Icona**: bandiera britannica con sotto "English Quiz" su due righe, generata da script (`npm run icons`) da SVG; favicon = PNG 192 | Richiesta esplicita; lo script è la fonte unica delle icone PWA e della favicon | 05 |
| 23 | **Tema Bootstrap in blu bandiera inglese** (#012169); nel tema scuro una variante più chiara per la leggibilità; `theme_color` PWA identico | Coerenza con l'icona; override via variabili CSS in `app.css` | 04, 05 |
| 24 | Il test anti-duplicati considera anche le coppie (`pairs`) dei `match-pairs` | Prima due `match-pairs` con lo stesso prompt ma coppie diverse risultavano doppioni; ora il duplicato è solo se prompt **e** coppie coincidono | 07 |

## Ancora aperte
Vedi `06-piano-implementazione.md`, sezione "Decisioni": hosting, export/import cronologia, ESLint/Prettier.
