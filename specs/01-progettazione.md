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
| F4 | L'utente compila tutte le risposte e preme **Invio** (pulsante "Check answers"). Anche i campi di testo permettono il tasto Invio sull'ultima domanda; in generale il pulsante "Check answers" è sempre visibile. |
| F5 | Dopo l'invio l'app mostra **n° risposte corrette / totale** e **percentuale**; ogni domanda è marcata corretta/errata. |
| F6 | Pulsante **"Show correct answers"**: visibile solo dopo l'invio; mostra la soluzione per ogni domanda con la relativa spiegazione. |
| F7 | Pulsanti **"Riprova"** (stesse domande, risposte azzerate) e **"Nuovo quiz"** (nuove domande, stesso livello) e **"Cambia livello"**. |
| F8 | Si può inviare anche con domande senza risposta: contano come errate (con avviso di conferma se ne mancano). |
| F9 | Cronologia locale degli ultimi risultati (livello, data, punteggio) e ultimo livello scelto, salvati in `localStorage`. |
| F11 | **Feedback sugli errori.** Per ogni risposta errata (o vuota) l'app mostra: la risposta data dall'utente, la risposta corretta, **perché è sbagliata** (*Why it's wrong*) e **la regola** (*Rule*), tutto in inglese. Il feedback compare subito dopo "Check answers", senza dover premere "Show correct answers". Vedi `04-ui-ux.md` e `07-contenuti.md`. |
| F10 | Numero di domande selezionabile (5 / 10 / 20) nella schermata di avvio. |

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
| UI | React 18 + `react-bootstrap` + `bootstrap` 5 (CSS) |
| Bundler | Vite |
| PWA | `vite-plugin-pwa` (Workbox, `generateSW`, `registerType: 'prompt'`) |
| Routing | `react-router-dom` con **HashRouter** (hosting statico senza rewrite) |
| Stato | React state + `useReducer`/Context; nessuna libreria di stato esterna |
| Persistenza | `localStorage` (solo preferenze e cronologia) |
| Test | Vitest + React Testing Library |
| Lint/format | ESLint + Prettier |

## 4. Struttura cartelle

```
EnglishQuiz/
├─ specs/                  # documentazione (questa cartella)
├─ src/                    # TUTTO il codice sorgente
│  ├─ main.tsx             # entry point + registrazione service worker
│  ├─ App.tsx              # routing
│  ├─ pages/               # HomePage, QuizPage, HistoryPage, AboutPage
│  ├─ components/          # componenti UI riusabili (Layout, ScoreCard, ...)
│  ├─ questions/           # un componente per tipologia + registry
│  │   ├─ registry.ts      # type -> { Component, grade }
│  │   ├─ MultipleChoice.tsx ...
│  ├─ engine/              # logica pura: generazione quiz, correzione, scoring
│  ├─ data/                # contenuti: <livello>/<tipo>.json (vedi 07-contenuti.md)
│  ├─ hooks/               # useQuizSession, useLocalStorage
│  ├─ types/               # tipi TypeScript condivisi
│  └─ styles/              # override minimi di Bootstrap
├─ public/                 # icone PWA, favicon
├─ build/                  # output di `npm run build` (NON modificare a mano)
├─ index.html              # richiesto da Vite (root del progetto)
├─ package.json, vite.config.ts, tsconfig.json
└─ CLAUDE.md               # regole per l'assistente
```

Regole:
- Il codice vive **solo** in `src/`; la build va **solo** in `build/` (`build.outDir = 'build'`).
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
              <QuestionRenderer/>            engine/gradeQuiz
          (sceglie componente da registry)   (usa grade() di ogni tipo)
```

### 5.1 Registry delle tipologie
Ogni tipologia espone:
```ts
interface QuestionTypeDef<Q, A> {
  type: string;
  Component: React.FC<{ question: Q; answer: A | undefined; onChange(a: A): void;
                        mode: 'answering' | 'graded' | 'solution'; }>;
  grade(question: Q, answer: A | undefined): boolean;
  solutionOf(question: Q): A;           // risposta corretta da mostrare
  emptyAnswer(question: Q): A;
}
```
Aggiungere una tipologia = nuovo file in `src/questions/` + riga nel registry + schema in `02-tipologie-domande.md`. Nessun'altra modifica al motore.

### 5.2 Modello dati (sintesi; dettagli in `03-modello-dati.md`)
- `Question` = campi comuni (`id`, `type`, `level`, `topic`, `prompt`, `explanation`, `wrongReasons?`) + payload specifico del tipo.
- `QuizSession` = `{ level, questions[], answers{}, status: 'answering'|'submitted', showSolutions: boolean }`.
- `QuizResult` = `{ total, correct, percent, perQuestion[] }`.

### 5.3 Stati del quiz
```
answering ──Check answers──▶ submitted ──Show correct answers──▶ submitted+solutions
    ▲                        │
    └──── Riprova / Nuovo ───┘
```
In `submitted` gli input sono bloccati (read-only). Le risposte corrette si mostrano **sotto** ogni domanda senza perdere la risposta dell'utente.

## 6. Regole di punteggio
- Ogni domanda vale **1 punto**, tutto-o-niente (anche se ha più spazi: tutti giusti = 1).
- `percent = round(correct / total * 100)` (intero, 0–100).
- Feedback testuale per fascia: ≥ 90 "Eccellente", 70–89 "Bene", 50–69 "Sufficiente", < 50 "Da ripassare".
- Normalizzazione del testo digitato: trim, spazi multipli → uno, confronto **case-insensitive**, apostrofi tipografici (’) → `'`, punteggiatura finale ignorata. Sono ammesse **risposte alternative** (`accepted: string[]`).

## 7. Generazione del quiz
1. Carica (lazy) i JSON del livello. Dà priorità alle domande non viste di recente (`eq.seen.<livello>`).
2. Filtra le domande valide e mescola (Fisher-Yates).
3. Seleziona N domande cercando di **variare le tipologie** (round-robin sulle tipologie disponibili, poi riempimento casuale).
4. Mescola le opzioni delle scelte multiple, mantenendo l'indice corretto coerente.
5. Se il livello ha meno di N domande, usa quelle disponibili e informa l'utente.

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

## 10. Fuori scope (per ora)
Account utente, sincronizzazione cloud, audio/listening, generazione di domande via AI, classifiche.
