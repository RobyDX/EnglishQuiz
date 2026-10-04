# UI / UX

Grafica con **Bootstrap 5**, approccio **mobile-first**. Tema chiaro con supporto `prefers-color-scheme: dark` tramite `data-bs-theme` (Bootstrap 5.3).

## Mappa delle schermate (HashRouter)
| Route | Pagina | Contenuto |
|-------|--------|-----------|
| `#/` | HomePage | Scelta livello, numero domande, pulsante "Start" |
| `#/quiz/:level` | QuizPage | Domande, pulsante "Check answers", risultato |
| `#/history` | HistoryPage | Ultimi risultati, pulsante "Clear history" |
| `#/about` | AboutPage | Info sull'app, autore (Roberto Nacchia, detto RobyDx), versione, come installare l'app |

Navbar sticky con titolo "English Quiz" (scritto con lo spazio) e link Home / History / About (collassa in hamburger su mobile).

## HomePage
- 6 card/pulsanti livello in griglia: `row-cols-2 row-cols-md-3`, ognuna con codice (A1), nome ("Beginner") e breve descrizione.
- Selettore numero domande (`btn-group`: 5 / 10 / 20).
- Pulsante primario "Start" (disabilitato finché non c'è un livello). Il livello è preselezionato dall'ultimo usato.

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
4. **ScoreCard** in cima dopo l'invio (scroll automatico): `"7 / 10 correct – 70%"`, progress bar colorata, messaggio di fascia. Region `aria-live="polite"`.

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
- Dopo l'invio il focus va alla ScoreCard.

## Accessibilità
- Ogni input ha `<label>` o `aria-label`.
- `fieldset`/`legend` per gruppi di radio.
- Contrasto AA con i colori Bootstrap predefiniti.
- Messaggi di esito in `aria-live`.

## Feedback sugli errori (obbligatorio)
Per ogni domanda errata o vuota, subito dopo "Check answers", sotto la domanda compare un riquadro `alert-danger` (o `alert-warning` se vuota) con, in quest'ordine:
1. **Your answer:** la risposta dell'utente (o "No answer").
2. **Correct answer:** la risposta corretta.
3. **Why it's wrong:** la spiegazione scritta per **quella specifica risposta** (`wrongReasons`: ogni parola/opzione sbagliata ha il suo motivo); se manca, il fallback legato alla risposta (vedi `02-tipologie-domande.md`).
4. **Rule:** `explanation` della domanda, con esempio.

Per le domande corrette si mostra solo ✓ Correct. "Show correct answers" mostra Correct answer + Rule per **tutte** le domande, anche quelle giuste.
Tutti i testi, incluse le spiegazioni, sono in **inglese**.

## Testi UI (solo inglese)
Check answers · Show correct answers · Hide correct answers · Try again · New quiz · Change level · You left N questions unanswered. Submit anyway? · Correct answer · Your answer · No answer · Why it's wrong · Rule · Excellent / Good / Pass / Needs review · Start · History · About · Install app · New version available – Update.
