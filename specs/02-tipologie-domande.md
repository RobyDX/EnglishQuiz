# Tipologie di domande

Ogni tipologia ha: **scopo**, **interazione UI**, **schema JSON**, **regola di correzione**, **livelli consigliati**. Campi comuni a tutte le domande:

```jsonc
{
  "id": "a1-mc-001",        // univoco, formato <livello>-<sigla>-<nnn>
  "type": "multiple-choice",
  "level": "A1",
  "topic": "present-simple", // vedi elenco argomenti
  "prompt": "She ___ to school every day.", // consegna / testo
  "explanation": "With he/she/it, the present simple verb takes -s: she goes.", // OBBLIGATORIA: la regola, in inglese
  "wrongReasons": { "0": "'go' is the base form; it is used with I/you/we/they, not with 'she'." } // opzionale: perché ogni distrattore è sbagliato
}
```

- Tutto il testo (prompt, opzioni, `explanation`, `wrongReasons`) è **in inglese**.
- `explanation` = la **regola** grammaticale/lessicale in 1–2 frasi, con un esempio corretto.
- `wrongReasons` (chiave = indice dell'opzione, per i tipi a scelta) = **perché quella risposta specifica è sbagliata**. Se manca, l'app mostra "Your answer doesn't match the rule below." seguito dalla regola.
- Tipi con testo libero (`fill-blank`, `verb-conjugate`, `error-correct`, `transform`, `word-order`): `wrongReasons` usa come chiave la risposta errata frequente normalizzata (es. `"goed": "'go' is irregular: the past is 'went', not 'goed'."`).

Risposta data dall'utente = `A` (tipo specifico). Domanda non risposta = errata.

---

## 1. `multiple-choice` – Scelta multipla (parola/frase giusta)
- **Scopo**: scegliere la parola o la frase corretta tra 3–4 opzioni.
- **UI**: radio button (Bootstrap `list-group` selezionabile, ampio per il touch).
- **Schema**: `{ "options": ["go","goes","going"], "correct": 1 }`
- **Correzione**: indice scelto === `correct`.
- **Livelli**: A1–C2.

## 2. `verb-form` – Scegli la forma verbale giusta
- **Scopo**: scegliere la forma corretta del verbo (tempo, persona, ausiliare).
- **UI**: come `multiple-choice`, ma la frase mostra il verbo base tra parentesi e lo spazio evidenziato.
- **Schema**: `{ "verb": "go", "options": ["goes","went","has gone","is going"], "correct": 1 }`
  Esempio: *Yesterday he ___ (go) to London.* → `went`
- **Correzione**: indice === `correct`.
- **Livelli**: A1–C1.

## 3. `fill-blank` – Completa digitando
- **Scopo**: scrivere la parola mancante (o più parole).
- **UI**: `<input>` inline nella frase, uno per ogni `___`. Invio sposta al campo successivo / invia sull'ultimo.
- **Schema**: `{ "text": "I ___ a student and she ___ a teacher.", "answers": [["am"], ["is","'s"]] }`
  (`answers[i]` = risposte accettate per lo spazio *i*)
- **Correzione**: **tutti** gli spazi corretti (dopo normalizzazione, §6 progettazione).
- **Livelli**: A1–C2.

## 4. `verb-conjugate` – Coniuga il verbo
- **Scopo**: scrivere la forma corretta del verbo tra parentesi.
- **UI**: input inline, verbo base mostrato come suggerimento.
- **Schema**: `{ "text": "They ___ (not / like) coffee.", "answers": [["don't like","do not like"]] }`
- **Correzione**: come `fill-blank`.
- **Livelli**: A1–C1.

## 5. `word-bank` – Completa con parole da un elenco
- **Scopo**: riempire gli spazi usando le parole di un riquadro (ognuna usata una volta).
- **UI**: per ogni spazio un `<select>` con le parole del riquadro; le parole già usate vengono evidenziate.
- **Schema**: `{ "bank": ["in","on","at","under"], "text": "The book is ___ the table.", "answers": ["on"] }`
- **Correzione**: tutti gli spazi uguali alla risposta.
- **Livelli**: A1–B2 (preposizioni, articoli, connettivi).

## 6. `place-word` – Posiziona la parola giusta nella frase
- **Scopo**: scegliere **dove** inserire una parola data (avverbi di frequenza, aggettivi, ausiliari, *not*…).
- **UI**: la frase è divisa in token; tra un token e l'altro compare un segnaposto cliccabile (▾). Al click, la parola viene inserita e mostrata nella frase; si può riposizionare.
- **Schema**:
  ```json
  { "word": "always",
    "tokens": ["She","goes","to","school","by","bus"],
    "correctPositions": [1] }
  ```
  `correctPositions` = indici di inserimento validi (0 = prima del primo token, n = dopo l'ultimo). Esempio: *She **always** goes…* → posizione 1.
- **Correzione**: la posizione scelta ∈ `correctPositions`.
- **Livelli**: A2–C1.

## 7. `word-order` – Riordina le parole
- **Scopo**: ricostruire una frase corretta da parole mescolate.
- **UI**: "chip" (pulsanti) toccabili: toccando una parola passa nell'area risposta, toccando nell'area risposta torna indietro. (Niente drag-and-drop obbligatorio, per mobile.)
- **Schema**: `{ "words": ["school","to","goes","she"], "solutions": [["she","goes","to","school"]] }`
- **Correzione**: la sequenza (case-insensitive, senza punteggiatura finale) coincide con una delle `solutions`.
- **Livelli**: A1–B2.

## 8. `error-spot` – Trova l'errore
- **Scopo**: individuare la parola sbagliata in una frase.
- **UI**: frase in token cliccabili; se ne seleziona uno.
- **Schema**: `{ "tokens": ["He","don't","like","pizza"], "wrongIndex": 1, "fix": "doesn't" }`
- **Correzione**: indice scelto === `wrongIndex`. La soluzione mostra anche `fix`.
- **Livelli**: A2–C2.

## 9. `error-correct` – Correggi la frase
- **Scopo**: riscrivere correttamente una frase sbagliata.
- **UI**: textarea precompilata con la frase errata.
- **Schema**: `{ "wrong": "She have two brothers.", "solutions": ["She has two brothers."] }`
- **Correzione**: testo normalizzato ∈ `solutions`.
- **Livelli**: B1–C2.

## 10. `true-false` – Vero / Falso (con testo)
- **Scopo**: comprensione di un breve testo.
- **UI**: testo + una o più affermazioni, ciascuna con pulsanti Vero/Falso (btn-group).
- **Schema**: `{ "passage": "Tom lives in Rome…", "statements": [{"text":"Tom lives in Paris.","answer":false}] }`
- **Correzione**: tutte le affermazioni corrette = domanda corretta.
- **Livelli**: A1–C2.

## 11. `reading-mc` – Comprensione con scelta multipla
- **Scopo**: leggere un testo e rispondere a domande.
- **UI**: testo comprimibile (accordion) + sotto-domande a scelta multipla.
- **Schema**: `{ "passage": "…", "items": [{ "q": "…", "options": ["…"], "correct": 0 }] }`
- **Correzione**: tutte le sotto-domande corrette.
- **Livelli**: A2–C2.

## 12. `match-pairs` – Abbina
- **Scopo**: collegare parole ↔ definizioni / sinonimi / contrari (tutto in inglese).
- **UI**: colonna sinistra fissa; per ogni elemento un `<select>` con le opzioni di destra (mobile-friendly, no linee da tracciare).
- **Schema**: `{ "pairs": [{"left":"big","right":"large"},{"left":"happy","right":"glad"}] }` (le opzioni a destra sono mescolate in rendering)
- **Correzione**: tutte le coppie giuste.
- **Livelli**: A1–C2 (vocabolario).

## 13. `odd-one-out` – Trova l'intruso
- **Scopo**: scegliere la parola che non appartiene al gruppo.
- **UI**: gruppo di chip tra cui sceglierne uno.
- **Schema**: `{ "options": ["apple","banana","table","orange"], "correct": 2, "category": "fruit" }`
- **Correzione**: indice === `correct`.
- **Livelli**: A1–B1.

## 14. `sentence-choice` – Scegli la frase corretta
- **Scopo**: tra 3–4 frasi inglesi, scegliere quella grammaticalmente corretta o che meglio esprime un significato descritto **in inglese** (es. *"Which sentence correctly says that the action started in the past and continues now?"*). Niente italiano.
- **UI**: opzioni radio con frasi complete.
- **Schema**: `{ "options": ["…","…","…"], "correct": 0 }` (come `multiple-choice`, ma le opzioni sono frasi intere)
- **Correzione**: indice === `correct`.
- **Livelli**: A1–B2.

## 15. `transform` – Trasforma la frase
- **Scopo**: riscrivere la frase con una parola-guida (stile *key word transformation* B2–C2) o cambiando forma (attivo→passivo, diretto→indiretto).
- **UI**: frase originale, parola-guida in evidenza, textarea.
- **Schema**: `{ "original": "I haven't seen him for years.", "keyword": "LAST", "template": "The last time I ___ him was years ago.", "solutions": ["saw"] }` oppure `solutions` = frasi complete.
- **Correzione**: testo normalizzato ∈ `solutions`.
- **Livelli**: B1–C2.

---

## Argomenti (`topic`) per livello (indicativi)

| Livello | Argomenti |
|---------|-----------|
| A1 | verbo *to be*, present simple, articoli a/an/the, plurali, pronomi, *there is/are*, numeri, colori, famiglia, cibo, preposizioni di luogo |
| A2 | past simple, present continuous, comparativi/superlativi, *going to*, countable/uncountable, *some/any*, avverbi di frequenza, *can/must* |
| B1 | present perfect, past continuous, first conditional, passivo (base), modali (*should, have to*), *used to*, gerundio/infinito |
| B2 | second/third conditional, reported speech, passivo avanzato, relative clauses, phrasal verbs, *wish/if only*, connettivi |
| C1 | inversione, cleft sentences, mixed conditionals, collocazioni, registro formale, participle clauses |
| C2 | sfumature lessicali, idiomi, strutture enfatiche, congiuntivo (*suggest he be*), stile e registro |

## Tipologie per livello (matrice di default)

| Tipo | A1 | A2 | B1 | B2 | C1 | C2 |
|------|----|----|----|----|----|----|
| multiple-choice | ● | ● | ● | ● | ● | ● |
| verb-form | ● | ● | ● | ● | ● | |
| fill-blank | ● | ● | ● | ● | ● | ● |
| verb-conjugate | ● | ● | ● | ● | ● | |
| word-bank | ● | ● | ● | ● | | |
| place-word | | ● | ● | ● | ● | |
| word-order | ● | ● | ● | ● | | |
| error-spot | | ● | ● | ● | ● | ● |
| error-correct | | | ● | ● | ● | ● |
| true-false | ● | ● | ● | ● | ● | ● |
| reading-mc | | ● | ● | ● | ● | ● |
| match-pairs | ● | ● | ● | ● | ● | ● |
| odd-one-out | ● | ● | ● | | | |
| sentence-choice | ● | ● | ● | ● | | |
| transform | | | ● | ● | ● | ● |

## Linee guida per scrivere nuove domande
1. Una sola risposta corretta non ambigua; se ci sono varianti valide, elencarle in `answers`/`solutions`.
2. Distrattori plausibili ma chiaramente errati.
3. Una `explanation` (la regola, 1–2 frasi **in inglese semplice** con esempio) per **ogni** domanda; `wrongReasons` per i distrattori più insidiosi.
4. Nessuna parola italiana nelle domande o nelle spiegazioni (tranne nomi propri).
5. Lessico e grammatica coerenti con il livello dichiarato.
6. Contenuti originali, senza riferimenti a testi protetti da copyright.
