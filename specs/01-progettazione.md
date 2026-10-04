# EnglishQuiz – Progettazione

> **Documento di riferimento.** Ogni scelta di implementazione deve rispettare questo documento e gli altri file in `specs/`. Se serve scostarsi, si **aggiorna prima la specifica** e poi si scrive il codice.

## 1. Obiettivo

Web app **SPA + PWA**, interamente **front-end** (nessun backend), per esercitarsi con l'inglese. L'utente sceglie un livello CEFR (A1, A2, B1, B2, C1, C2), riceve una serie di esercizi, risponde, preme **Invio** e ottiene il numero di risposte corrette e la percentuale. Un secondo pulsante mostra le risposte corrette.

## 2. Requisiti

### 2.1 Funzionali
| ID | Requisito |
|----|-----------|
| F1 | L'utente sceglie il livello tra A1, A2, B1, B2, C1, C2. |
| F2 | L'app genera un quiz di N esercizi (default 10) per il livello scelto, pescati a caso dal catalogo, senza ripetizioni nella stessa sessione. |
| F3 | Gli esercizi appartengono a più tipologie (vedi `02-tipologie-domande.md`). |
| F4 | L'utente compila le risposte e preme **"Check answers"**. Il pulsante sta **alla fine della pagina, non è fisso**: l'utente deve scorrere fino in fondo. Nei campi di testo, Invio passa al campo successivo e, sull'ultimo, invia. |
| F5 | Dopo l'invio l'app mostra **n° risposte corrette / totale** e **percentuale**; ogni domanda è marcata corretta/errata. |
| F6 | Pulsante **"Show correct answers"**: visibile solo dopo l'invio; mostra la soluzione per ogni domanda con la relativa spiegazione. |
| F7 | Dopo l'invio, in fondo alla pagina: **"Try again"** (stesse domande, risposte azzerate), **"New quiz"** (nuove domande, stesso livello) e **"Change level"**. |
| F8 | Si può inviare anche con domande senza risposta: contano come errate (con avviso di conferma se ne mancano). |
| F9 | Cronologia locale degli ultimi 50 risultati (livello, data, punteggio) e ultimo livello scelto, salvati **solo** in `localStorage` del browser (nessun server, nessuna sincronizzazione). Ogni quiz inviato viene registrato **una sola volta** (anche con doppio clic o in StrictMode). Il quiz in corso non viene salvato. |
| F10 | Numero di domande selezionabile (5 / 10 / 20) nella schermata di avvio. |
| F11 | **Feedback sugli errori.** Per ogni risposta errata (o vuota) l'app mostra: la risposta data dall'utente, la risposta corretta, **perché è sbagliata** (*Why it's wrong*) e **la regola** (*Rule*), tutto in inglese. Il feedback compare subito dopo "Check answers", senza dover premere "Show correct answers". Ogni risposta sbagliata ha una spiegazione **propria** (non riusata tra opzioni diverse). Vedi `04-ui-ux.md` e `07-contenuti.md`. |
| F12 | **Barra livello/progresso sempre visibile** durante il quiz (livello, "n / totale answered") sotto la navbar, con a destra un pulsante **"↓ End"** che scorre fino alla fine della pagina. |
| F13 | Nome dell'app: **"English Quiz"** (con lo spazio). La pagina About riporta l'autore: Roberto Nacchia (RobyDx). |

### 2.2 Non funzionali
- **React** (SPA), nessun backend, nessuna chiamata di rete a runtime oltre agli asset dell'app.
- **Bootstrap 5** per la grafica; layout **responsive** mobile-first, usabile da 360 px a desktop.
- **PWA**: installabile, funziona offline dopo il primo caricamento.
- Accessibilità di base: label associate, contrasto sufficiente, navigazione da tastiera, `aria-live` per il risultato.
- **Lingua: tutto in inglese.** Interfaccia, consegne, esercizi, messaggi di errore e spiegazioni sono **solo in inglese**, anche se il pubblico è italiano. Nessuna traduzione in italiano nell'app (nessun i18n). Le spiegazioni usano un inglese semplice, adatto al livello (A1–A2: frasi brevi e lessico base). Questa documentazione in `specs/` resta in italiano.
- Prestazioni: first load < 200 KB gzip di JS (esclusi i dati dei livelli, caricati on demand).

## 3. Stack tecnologico

| Ambito | Scelta |
|--------|--------|
| Linguaggio | TypeScript |
| UI | React 19 + `react-bootstrap` + `bootstrap` 5 (CSS) |
| Bundler | Vite |
| PWA | `vite-plugin-pwa` (Workbox, `generateSW`, `registerType: 'prompt'`) |
| Routing | `react-router-dom` con **HashRouter** (hosting statico senza rewrite) |
| Stato | React state + `useReducer`/Context; nessuna libreria di stato esterna |
| Persistenza | `localStorage` (solo preferenze e cronologia) |
| Test | Vitest + React Testing Library |
| Lint | `tsc --noEmit` (type-check); ESLint/Prettier non ancora configurati |

## 4. Struttura cartelle

**Tutto ciò che è codice o configurazione di progetto sta in `src/`**, compresi `package.json`, `node_modules`, `public`, `index.html` e i file di configurazione. Fuori da `src/` restano solo la documentazione, la build e i file di repository.

```
EnglishQuiz/
├─ specs/                  # documentazione (questa cartella)
├─ build/                  # output di `npm run build` (NON modificare a mano, in .gitignore)
├─ CLAUDE.md, .gitignore, README.md
└─ src/                    # TUTTO il progetto
   ├─ package.json, package-lock.json, node_modules/
   ├─ vite.config.ts, tsconfig.json, vite-env.d.ts, test-setup.ts
   ├─ index.html           # entry di Vite (root = src/)
   ├─ public/              # icone PWA (favicon = pwa-192.png)
   ├─ main.tsx             # entry point
   ├─ App.tsx              # HashRouter + route
   ├─ levels.ts            # nomi/descrizioni dei livelli, opzioni numero domande
   ├─ pages/               # HomePage, QuizPage, HistoryPage, AboutPage
   ├─ components/          # Layout, QuestionCard, ScoreCard, UpdatePrompt
   ├─ questions/           # un componente UI per tipologia + registry.tsx
   ├─ engine/              # logica pura: normalize, rules (correzione), buildQuiz, gradeQuiz, score
   ├─ data/                # contenuti: <livello>/<tipo>.json + index.ts (vedi 07-contenuti.md)
   ├─ hooks/               # store.ts (localStorage), useQuizSession.ts
   ├─ types/               # tipi TypeScript condivisi
   └─ styles/              # override minimi di Bootstrap
```

Regole:
- I comandi npm si eseguono **dentro `src/`**. Vite usa `src/` come root e scrive la build in `../build` (`build.outDir = '../build'`).
- `build/` è un artefatto: non si edita, è in `.gitignore`.
- La logica di correzione è in `src/engine/` ed è **pura** (niente React) per essere testabile.

## 5. Architettura

```
HomePage ──(livello, n° domande)──▶ QuizPage
                                      │ useQuizSession
                                      ▼
                          engine/buildQuiz(level, n)
                                      │
                         ┌────────────┴────────────┐
                         ▼                         ▼
              <QuestionCard/>                engine/gradeQuiz
          (componente da registry +          (usa engine/rules)
           feedback errori)
```

### 5.1 Tipologie: UI e regole separate
- **Regole (puro, in `engine/rules.ts`)**: per ogni tipologia `isAnswered`, `gradeQuestion`, `formatAnswer` (testo della risposta data), `formatSolution` (testo della risposta corretta) e `wrongReasonFor` (spiegazione specifica dell'errore, da `wrongReasons`).
- **UI (React, in `questions/`)**: ogni componente riceve
  ```ts
  interface QuestionProps<Q, A> {
    question: Q; answer: A | undefined; onChange(a: A): void;
    disabled: boolean;      // true dopo l'invio
    onEnter?(): void;       // Invio nell'ultimo campo di testo -> invia il quiz
  }
  ```
  e `questions/registry.tsx` mappa `type -> componente`.
- Il feedback sugli errori (risposta data, risposta corretta, perché è sbagliata, regola) lo mostra `components/QuestionCard`, usando le funzioni di `engine/rules.ts`, quindi i componenti delle tipologie non se ne occupano.

Aggiungere una tipologia = tipo in `types/`, casi in `engine/rules.ts` e `engine/buildQuiz.ts` (se serve shuffle), componente in `questions/` + riga nel registry, schema in `02-tipologie-domande.md`, test.

### 5.2 Modello dati (sintesi; dettagli in `03-modello-dati.md`)
- `Question` = campi comuni (`id`, `type`, `level`, `topic`, `prompt`, `explanation`, `wrongReasons?`) + payload specifico del tipo.
- Sessione (in `hooks/useQuizSession`) = `{ questions[], answers{}, result?: QuizResult, showSolutions }`; lo stato è "submitted" quando `result` è presente.
- `QuizResult` = `{ total, correct, percent, perQuestion{id: boolean} }`.
- **Regola**: niente effetti collaterali (scritture su `localStorage`, ecc.) dentro le funzioni di aggiornamento di `setState`: React può chiamarle due volte (StrictMode). Gli effetti si fanno prima, leggendo lo stato da un `ref`.

### 5.3 Stati del quiz
```
answering ──Check answers──▶ submitted ──Show correct answers──▶ submitted+solutions
    ▲                        │
    └── Try again / New quiz ─┘
```
In `submitted` gli input sono bloccati (read-only). Le risposte corrette si mostrano **sotto** ogni domanda senza perdere la risposta dell'utente.

## 6. Regole di punteggio
- Ogni domanda vale **1 punto**, tutto-o-niente (anche se ha più spazi: tutti giusti = 1).
- `percent = round(correct / total * 100)` (intero, 0–100).
- Feedback testuale per fascia: ≥ 90 "Excellent", 70–89 "Good", 50–69 "Pass", < 50 "Needs review".
- Normalizzazione del testo digitato: trim, spazi multipli → uno, confronto **case-insensitive**, apostrofi tipografici (’) → `'`, punteggiatura finale ignorata. Sono ammesse **risposte alternative** (per i gap `answers[i]` è un elenco di risposte accettate; per le frasi `solutions[]`).

## 7. Generazione del quiz
1. Carica (lazy) i JSON del livello. Dà priorità alle domande non viste di recente (`eq.seen.<livello>`).
2. Filtra le domande valide e mescola (Fisher-Yates).
3. Seleziona N domande cercando di **variare le tipologie** (round-robin sulle tipologie disponibili, poi riempimento casuale).
4. Mescola le opzioni delle scelte (e le parole di `word-order`, le colonne di `match-pairs`), mantenendo coerenti l'indice corretto **e le chiavi di `wrongReasons`**.
5. Se il livello ha meno di N domande, usa quelle disponibili (al momento senza messaggio all'utente: da aggiungere quando i livelli saranno completi).

## 8. Contenuti
- Un file JSON per **livello e tipologia** in `src/data/<livello>/<tipo>.json`, validati da un test che controlla schema, unicità degli `id` e quote.
- Obiettivo: **2000 domande per livello** (12000 totali), distribuite per tipologia e argomento. Quote, regole di qualità e processo di produzione in `07-contenuti.md`. I contenuti sono originali (nessun materiale coperto da copyright).
- Argomenti (`topic`) per livello: vedi `02-tipologie-domande.md` §Argomenti.

## 9. Criteri di accettazione (MVP)
1. Scelgo A1, ottengo 10 domande miste; compilo e premo "Check answers" → vedo "7 / 10 correct – 70%" e, per ogni errore, "Why it's wrong" e "Rule".
2. Premo "Show correct answers" → ogni domanda mostra la soluzione.
3. Funziona su 360×640 e su 1440×900 senza scroll orizzontale.
4. Dopo il primo caricamento, in modalità offline l'app si avvia e si può fare un quiz.
5. `npm run build` produce `build/` e `npm run preview` la serve correttamente.
6. Test di engine e di ogni tipologia verdi.
7. La barra livello/progresso resta visibile mentre scorro, e "↓ End" porta ai pulsanti finali.
8. Un quiz inviato compare **una volta sola** in History.

## 10. Fuori scope (per ora)
Account utente, sincronizzazione cloud, audio/listening, generazione di domande via AI, classifiche.
