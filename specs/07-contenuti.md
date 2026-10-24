# Contenuti: quantità, distribuzione, produzione

## Obiettivo
**5000 domande per livello** (6 livelli → **30000 domande totali**). Con quiz da 10 domande, la probabilità di vedere ripetizioni tra sessioni è praticamente nulla. (Prima: 2000 per livello, vedi decisione 39.)

Una "domanda" è un elemento del catalogo (un `id`), anche se contiene più spazi o sotto-domande (es. `reading-mc`, `true-false`).

## Organizzazione dei file
Per tenere i file gestibili, un file per **livello + tipologia**:

```
src/data/
  a1/ multiple-choice.json, verb-form.json, fill-blank.json, ...
  a2/ ...
  ...
  c2/ ...
  index.ts   # import.meta.glob per livello (caricamento lazy di un livello alla volta)
```
Ogni file: `{ "level": "A1", "type": "multiple-choice", "questions": [...] }`.
Gli `id` seguono `<livello>-<sigla tipo>-<nnn>` (es. `b1-ec-017`), con numerazione progressiva per file.

Sigle: mc, vf (verb-form), fb, vc, wb, pw, wo, es, ec, tf (true-false), rm (reading-mc), mp, oo, sc (sentence-choice), tr (transform).

## Quote per livello e tipologia (somma = 5000 per ogni livello)

| Tipo | A1 | A2 | B1 | B2 | C1 | C2 |
|------|---:|---:|---:|---:|---:|---:|
| multiple-choice | 663 | 575 | 538 | 550 | 663 | 938 |
| verb-form | 588 | 538 | 413 | 413 | 375 | – |
| fill-blank | 663 | 588 | 538 | 538 | 663 | 913 |
| verb-conjugate | 500 | 500 | 463 | 413 | 375 | – |
| word-bank | 500 | 338 | 250 | 250 | – | – |
| place-word | – | 375 | 338 | 338 | 338 | – |
| word-order | 500 | 375 | 287 | 250 | – | – |
| error-spot | – | 338 | 337 | 375 | 500 | 663 |
| error-correct | – | – | 337 | 412 | 500 | 662 |
| true-false | 337 | 287 | 250 | 250 | 250 | 250 |
| reading-mc | – | 250 | 287 | 337 | 412 | 412 |
| match-pairs | 337 | 287 | 250 | 287 | 337 | 412 |
| odd-one-out | 412 | 212 | 125 | – | – | – |
| sentence-choice | 500 | 337 | 250 | 212 | – | – |
| transform | – | – | 337 | 375 | 587 | 750 |
| **Totale** | **5000** | **5000** | **5000** | **5000** | **5000** | **5000** |

Le quote sono un obiettivo di copertura: scostamenti piccoli sono ammessi, ma il totale per livello resta ≥ 5000 e nessuna tipologia prevista dalla matrice (`02-tipologie-domande.md`) può avere 0 domande.

## Copertura per argomento
Ogni domanda ha almeno un argomento (`topics`, vedi `02-tipologie-domande.md`). Obiettivo: **categorie il più possibile equilibrate** dentro il livello, tra il 5% e il 20% delle domande di ciascuna categoria applicabile al livello. Le domande nuove vanno scritte per le categorie più scarse (si alza il livello minimo fino a esaurire le domande da aggiungere, "water-filling"); le categorie già sopra la media non ricevono domande nuove. Una domanda con più argomenti conta in tutti. A1 non ha *conditionals-wishes* né *passive-reported-speech*: non si forzano. Le quote per tipologia restano prioritarie: dove i due obiettivi confliggono (es. `verb-form` e `verb-conjugate` sono quasi solo *verb-tenses*) si accetta uno scostamento e lo si riporta in `06-piano-implementazione.md`.

## Regole di qualità
1. Contenuti **originali**, niente testi o esercizi copiati da libri/siti.
2. Una sola risposta corretta (o tutte le varianti valide elencate).
3. **Nessun duplicato** nel livello, controllato dal test automatico su testo normalizzato (minuscole, senza punteggiatura): (a) stessa domanda, anche con opzioni/parole/coppie in ordine diverso; (b) **stessa frase completa in tipologie diverse** (es. la frase di un `fill-blank` ripetuta in un `word-bank`, in un `word-order` o come opzione corretta di un `sentence-choice`). Vale anche tra domande vecchie e nuove.
4. Lessico e grammatica coerenti col livello CEFR; testi di lettura: A1–A2 40–70 parole, B1–B2 80–150, C1–C2 150–250.
5. **Tutto in inglese** (domande, opzioni, spiegazioni), nessuna parola italiana. `explanation` (la regola con esempio, 1–2 frasi in inglese semplice, adatto al livello) presente sul **100%** delle domande. `wrongReasons` **obbligatorio e diverso per ogni risposta sbagliata**: ogni opzione errata di `multiple-choice`, `verb-form`, `sentence-choice`; ogni parola errata del riquadro di `word-bank` (per ogni spazio); almeno gli errori tipici di `fill-blank`, `verb-conjugate`, `error-correct`. Una spiegazione che vale per una sola risposta sbagliata non va riusata per le altre (es. con *a / an / the*, spiegare separatamente perché `a` e perché `the` non vanno bene).
6. Distrattori plausibili, posizione della risposta corretta distribuita (non sempre la prima: lo shuffle a runtime è comunque obbligatorio).

## Validazione automatica (`src/data/data.test.ts`)
- schema per tipo (campi obbligatori, indici entro i limiti, `answers` non vuoti);
- `id` univoci globalmente e coerenti con livello/tipo del file;
- conteggio per livello ≥ 5000 e per tipologia ≥ 90% della quota;
- nessun duplicato nel livello (a) per domanda a opzioni ordinate e (b) per frase completa tra tipologie (vedi regola 3);
- `wrongReasons` diversi tra le opzioni della stessa domanda (mai la stessa frase per due risposte sbagliate);
- `topics`, se presente, non vuoto e con slug validi (`TOPICS`); a migrazione completa: ogni domanda ha almeno un argomento e ogni categoria è al 5–20% del livello;
- `wrongReasons` completi: una voce per ogni distrattore delle domande a scelta e per ogni parola errata (per spazio) di `word-bank`; almeno una voce per `fill-blank`, `verb-conjugate`, `error-correct`;
- `explanation` non vuota su ogni domanda; chiavi di `wrongReasons` valide (indici esistenti, mai la risposta corretta); controllo euristico di assenza di parole italiane comuni (es. "il", "della", "perché", "che");
- ogni `place-word`: `correctPositions` valide; ogni `word-order`: le parole in `words` ricompongono una delle `solutions`.

## Produzione (processo)
Lavoro a lotti, un livello alla volta (A1 → C2). Le 3000 domande in più per livello si producono con script che combinano tabelle di contenuto scritte a mano (lessico con definizioni, verbi, frasi-modello, testi di lettura) e deducono risposta, spiegazione e `wrongReasons` dalla regola, così la correttezza è garantita per costruzione; lo script scarta ogni candidato duplicato (anche rispetto alle domande esistenti) e riempie la tabella argomento × tipologia. Prima di aggiungere, si rimuovono i duplicati già presenti nel livello. Per ogni livello:
1. Per ogni file livello+tipologia si scrive il lotto di domande in JSON.
2. Si esegue la validazione automatica; si correggono gli errori.
3. Revisione a campione (≥ 10% per lotto) di correttezza grammaticale e livello.
4. Si spunta il lotto in `06-piano-implementazione.md`.

## Strumenti di produzione
`src/scripts/content/`: lessico (`lex_*.txt`: parola, gruppo, definizione; `sent_*.txt`: frase d'esempio per parola), generatori per tipologia (`vocab_gen.py`, `reading_gen.py`, `g_verbs.py`, `g_phrasal_conf.py`, `g_func.py`), `core.py` (registro anti-duplicati, ID, scrittura) e `build_a1.py`. Ogni generatore ricava risposta, `explanation` e `wrongReasons` dalla regola (non da testo libero), così le risposte sono corrette per costruzione e ogni opzione sbagliata ha il suo motivo. Per gli altri livelli si riusa `core.py` e si scrivono nuove tabelle e generatori (un `build_<livello>.py`). I testi vanno comunque riletti a campione (vedi "Produzione").

**Domande scritte a mano.** Dove il metodo meccanico dà domande deboli (opzioni sbagliate casuali, intrusi facili) si scrivono le domande direttamente in file di testo compatti `ai_<livello>_*.txt` (formato in `ai_import.py`) e `ai_import.py <livello> --base=<commit prima dell'espansione> --write` le valida (una sola risposta giusta, motivo diverso per ogni opzione sbagliata, nessun duplicato) e sostituisce le domande meccaniche corrispondenti, tipologia per tipologia e argomento per argomento, senza cambiare i totali. Criterio: le alternative sbagliate devono venire dallo stesso campo semantico (coltello/cucchiaio/forchetta) e non da categorie estranee.

## Impatto tecnico
- Dimensione stimata con 5000 domande: ~2–2,5 MB di JSON per livello (non compresso), ~350–450 KB gzip; i dati non sono più in precache (decisione 38) ma si scaricano per livello al primo uso. Budget: massimo ~500 KB gzip per livello. Il test di livello scarica tutti i livelli (~2,5 MB gzip): da rivedere se cresce (es. indice degli argomenti separato, caricamento per tipologia).
- Il caricamento lazy è **per livello**; se il livello scelto supera ~250 KB gzip si carica solo il file delle tipologie necessarie (`import.meta.glob` per file, non per cartella).
- Caricamento lazy per livello: si scarica solo il livello scelto. Il service worker non li precachea: li mette in cache al primo uso (`specs/05-pwa.md`), quindi offline funzionano solo i livelli già aperti.
- Per ridurre ripetizioni tra sessioni consecutive: in `localStorage` (`eq.seen.<livello>`) si tengono gli ultimi ~100 `id` visti, e `buildQuiz` li evita finché restano domande non viste.
