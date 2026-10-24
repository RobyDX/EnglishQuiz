# UI / UX

Grafica con **Bootstrap 5**, approccio **mobile-first**. **Colore del tema: il blu della bandiera inglese (#012169)** al posto del blu primario di Bootstrap (`--bs-primary`, pulsanti `btn-primary`/`btn-outline-primary`, link, focus, radio/checkbox, navbar). Nel tema scuro si usa una variante di blu più chiaro (#2f56b3 per i riempimenti, #9db6ec per testi e contorni) per mantenere la leggibilità. Gli override sono in `src/styles/app.css`. Tema chiaro con supporto `prefers-color-scheme: dark` tramite `data-bs-theme` (Bootstrap 5.3).

## Mappa delle schermate (HashRouter)
| Route | Pagina | Contenuto |
|-------|--------|-----------|
| `#/` | HomePage | Scelta livello, tile del numero di domande (avviano il quiz) |
| `#/quiz/:level` | QuizPage | Domande, pulsante "Check answers", risultato |
| `#/placement` | PlacementPage | Test di livello adattivo: 40 domande una alla volta in sequenza, risultato con livello stimato |
| `#/history` | HistoryPage | Ultimi risultati, pulsante "Clear history" |
| `#/install` | InstallPage | Spiega che installando l'app si apre come app su PC e smartphone (anche offline); pulsante "Install app" (evento `beforeinstallprompt`) oppure, dove non disponibile, istruzioni (iOS: Share → Add to Home Screen). Se già installata lo dice |
| `#/about` | AboutPage | Info sull'app, come è stata fatta (Roberto Nacchia, tramite Generative AI, per aiutare a esercitarsi in inglese), versione, come installare l'app |

Navbar sticky con l'icona dell'app (`pwa-192.png`, 32 px) davanti al titolo "English Quiz" (scritto con lo spazio) e una **pulsantiera sempre visibile, solo icone** (nome in `aria-label` e tooltip) (niente hamburger/accordion, va a capo su mobile): **Home** (icona "?" dei quiz), **History** (orologio), **About** (info) e **Install** (freccia di download; solo se l'app non è già installata, cioè non in `display-mode: standalone`). Install porta a `#/install`.

## HomePage
- 6 card/pulsanti livello in griglia: `row-cols-2 row-cols-md-3`, ognuna con codice (A1), nome ("Beginner") e breve descrizione.
- Numero di domande come **tile** (5 / 10 / 20 / 40, numero grande + "questions"): **la pressione avvia subito il quiz** (nessun pulsante "Start"). Le tile **compaiono solo dopo che è stato scelto un livello** (quello dell'ultimo quiz è preselezionato) e **nessuna è mai evidenziata/selezionata**: sono pulsanti d'azione, non una scelta.
- Sotto le tile, un riquadro **"Not sure about your level?"** con il pulsante **"Find your level"** (porta a `#/placement`). Se c'è un risultato salvato (`eq.placement`) il riquadro mostra "Your level: B1" con la data del test e il pulsante **"Retake the test"**.

| Livello | Nome |
|---------|------|
| A1 | Beginner |
| A2 | Elementary |
| B1 | Intermediate |
| B2 | Upper Intermediate |
| C1 | Advanced |
| C2 | Proficiency |

## QuizPage
**Layout**: `container` con `col-12 col-lg-8 mx-auto`.

1. **Barra livello/progresso sempre visibile** (`position: sticky` subito sotto la navbar, che è anch'essa fissa): livello, "n / totale answered", barra `progress`. **A destra, un pulsante "↓ End"** che scorre fino alla fine della pagina (dove sono i pulsanti di invio). L'altezza della navbar è letta a runtime (`--navbar-height`).
2. Elenco di `card`, una per domanda: numero, consegna, componente della tipologia.
3. Barra azioni **alla fine dell'elenco di domande, non fissa (niente sticky)**: l'utente deve scorrere fino in fondo per inviare. I pulsanti non restano visibili durante la compilazione:
   - **Check answers** (primario, in `answering`) – chiede conferma se mancano risposte (modal Bootstrap).
   - Dopo l'invio: **Show correct answers** (secondario, toggle), **Try again**, **New quiz**, **Change level**.
4. **ScoreCard** in cima dopo l'invio (scroll automatico): `"7 / 10 correct – 70%"`, progress bar colorata, messaggio di fascia. Riceve il focus; il risultato è annunciato dalla regione `role="status"` della pagina (vedi Accessibilità).

## PlacementPage (`#/placement`)
**Layout**: `col-12 col-lg-8 mx-auto`. Tre stati:
1. **Intro**: titolo "Find your level", testo breve (40 questions in 40 minutes, one at a time; it starts easy, a right answer makes the next question harder, a wrong answer or a skip makes it easier; you can skip a question and look back at the earlier ones, but you cannot change your answers) e pulsante primario **"Start the test"**.
2. **Test**: barra di avanzamento sticky (`quiz-bar`) con il **timer a ritroso** (`role="timer"`, m:ss, rosso nell'ultimo minuto), "Question n / 40" e `progress` (= domande risolte) (a tempo scaduto il test si interrompe e si mostra il risultato calcolato sulle domande fatte; se non ne è stata fatta nessuna si torna all'intro con un avviso e non si salva nulla; senza "↓ End": la pagina è corta). Sotto, **40 tile** numerate (`aria-label` "Question n, answered / skipped / current / not reached yet"): ✓ verde = risposta data, – = saltata, la tile della domanda mostrata è evidenziata, **le non ancora raggiunte sono disattivate**; toccare una tile passata mostra quella domanda **in sola lettura** (con un avviso "You are reviewing question n. Your answer cannot be changed." e il pulsante **"Back to question m"**, senza dire se era giusta). Sotto, **una sola card** con tipologia, consegna e la risposta (qualsiasi tipologia). Per le tipologie a tocco singolo scegliere la risposta **porta subito alla domanda successiva**; per le altre c'è **"Next"**, attivo solo con la risposta completa (Invio nell'ultimo campo di testo equivale a Next). La risposta è definitiva una volta passati oltre; nessun feedback sulla correttezza (si vede solo alla fine). In fondo alla pagina: **"Skip"** (salta la domanda in corso), **"Next"** (solo per le tipologie che lo richiedono, non sull'ultima), **"Finish test"** (valuta sulle domande fatte più quella in corso se ha una risposta completa; sull'ultima domanda chiude il test) e il secondario **"Quit test"** (torna alla Home, il test non viene salvato).
3. **Risultato**: titolo "Your level", il livello stimato in grande (es. **B1** + nome), una barra `progress` per ogni livello con "giuste / fatte" (i livelli non toccati sono grigi: il test adattivo non tocca tutti i livelli), l'elenco degli **argomenti più deboli** (se ce ne sono) poi la sezione **"Review your answers"**: tutte le domande con le `QuestionCard` in stato corretto/errato come nei quiz (con *Your answer*, *Correct answer*, *Why it's wrong*, *Rule*; quelle senza risposta mostrano "No answer" e non contano nel punteggio) e il pulsante **"Show correct answers"** (toggle) che mostra la soluzione anche per le giuste; in fondo i pulsanti **"Practise B1"** (apre un quiz normale di quel livello, 10 domande), **"Retake the test"** e **"Home"**.

**Accessibilità.** Una sola regione `role="status"` sempre montata annuncia "Question n of 40" a ogni nuova domanda e il livello stimato alla fine; a ogni nuova domanda (o rivista dalle tile) il focus va al titolo della card (`tabIndex=-1`); a fine test il focus va al titolo del risultato. Le opzioni sono i normali radio / pulsanti delle domande a scelta, usabili da tastiera.

### Stati visivi di una domanda
| Stato | Aspetto |
|-------|---------|
| answering | bordo neutro |
| graded corretta | bordo/badge `success`, icona ✓ |
| graded errata | bordo/badge `danger`, icona ✗, mostra risposta utente |
| solution visibile | riquadro `alert-info` "Correct answer: …" + "Rule: …" |

Colori mai come unico segnale: sempre anche icona e testo (✓ Correct / ✗ Incorrect).

## Responsive
| Breakpoint | Comportamento |
|-----------|----------------|
| < 576 px | colonna singola, target touch ≥ 44 px, azioni a larghezza piena |
| 576–991 px | contenuto centrato, margini maggiori |
| ≥ 992 px | colonna centrale `col-lg-8`; pulsanti affiancati |

Nessuno scroll orizzontale a 360 px. Font base 16 px (evita lo zoom automatico degli input su iOS).

## Interazione e tastiera
- Invio nei campi testo: passa al campo successivo; sull'ultimo invia (con conferma se incompleto).
- Tab order naturale; focus visibile; chip/token sono `<button>`.
- **Skip link** "Skip to main content" come primo elemento della pagina (visibile solo col focus), porta al `<main>`.
- **Livelli in HomePage**: `radiogroup` con *roving tabindex* (un solo Tab per entrare nel gruppo, frecce ←/→/↑/↓ per cambiare livello, Home/End per primo/ultimo).
- **"↓ End"**: scorre fino in fondo **e** sposta il focus sul primo pulsante della barra azioni (Check answers).
- **Il focus non si perde mai** quando l'elemento che lo aveva sparisce:
  - Dopo l'invio il focus va alla ScoreCard.
  - Dopo *Try again* o *New quiz* (quando le nuove domande sono pronte) il focus va al titolo del quiz (`h1`, `tabIndex=-1`) e la pagina torna in cima.
  - `word-order`: dopo aver spostato una parola il focus va alla parola successiva nello stesso elenco (o alla precedente se era l'ultima; se l'elenco si svuota, all'altro elenco).
  - HistoryPage: dopo *Clear history* il focus va al titolo.

## Accessibilità
- Ogni input ha `<label>` o `aria-label`.
- `fieldset`/`legend` per gruppi di radio; gruppi di pulsanti (`role="group"`) con nome: in `true-false` il gruppo True/False ha come nome il testo dell'affermazione; in `word-order` i due elenchi si chiamano "Your sentence" e "Words to use".
- Contrasto AA con i colori Bootstrap predefiniti.
- Colori mai come unico segnale: nel `word-bank` le parole già usate sono anche barrate e hanno il testo nascosto "(used)".
- **Annunci per screen reader**: in QuizPage c'è **una sola** regione `role="status"` (`aria-live="polite"`, visivamente nascosta) sempre presente, che annuncia:
  - dopo l'invio: `Answers checked. 7 / 10 correct – 70%. Good.`
  - *Show/Hide correct answers*: `Correct answers shown.` / `Correct answers hidden.`
  - *Try again*: `Answers cleared. Try again.`
  - *New quiz*: `New quiz ready: 10 questions.`
  La ScoreCard è una `region` con nome (il suo titolo) e riceve il focus; non è essa stessa `aria-live` (una regione live inserita già piena spesso non viene letta).
- Il pulsante *Show/Hide correct answers* cambia testo, quindi non usa `aria-pressed`.
- Dopo l'invio ogni domanda ha come nome accessibile anche l'esito ("1. Multiple choice ✓ Correct").

## Feedback sugli errori (obbligatorio)
Per ogni domanda errata o vuota, subito dopo "Check answers", sotto la domanda compare un riquadro `alert-danger` (o `alert-warning` se vuota) con, in quest'ordine:
1. **Your answer:** la risposta dell'utente (o "No answer").
2. **Correct answer:** la risposta corretta.
3. **Why it's wrong:** la spiegazione scritta per **quella specifica risposta** (`wrongReasons`: ogni parola/opzione sbagliata ha il suo motivo); se manca, il fallback legato alla risposta (vedi `02-tipologie-domande.md`).
4. **Rule:** `explanation` della domanda, con esempio.

Per le domande corrette si mostra solo ✓ Correct. "Show correct answers" mostra Correct answer + Rule per **tutte** le domande, anche quelle giuste.
Tutti i testi, incluse le spiegazioni, sono in **inglese**.

## Testi UI (solo inglese)
Find your level · Not sure about your level? · Start the test · Quit test · Your level · Practise · Retake the test · Check answers · Show correct answers · Hide correct answers · Skip to main content · Try again · New quiz · Change level · You left N questions unanswered. Submit anyway? · Correct answer · Your answer · No answer · Why it's wrong · Rule · Excellent / Good / Pass / Needs review · History · About · Install app · New version available – Update.
