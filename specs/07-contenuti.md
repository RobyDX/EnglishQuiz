# Contenuti: quantità, distribuzione, produzione

## Obiettivo
**2000 domande per livello** (6 livelli → **12000 domande totali**). Con quiz da 10 domande, la probabilità di vedere ripetizioni tra sessioni è praticamente nulla.

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

## Quote per livello e tipologia (somma = 2000 per ogni livello)

| Tipo | A1 | A2 | B1 | B2 | C1 | C2 |
|------|---:|---:|---:|---:|---:|---:|
| multiple-choice | 265 | 230 | 215 | 220 | 265 | 375 |
| verb-form | 235 | 215 | 165 | 165 | 150 | – |
| fill-blank | 265 | 235 | 215 | 215 | 265 | 365 |
| verb-conjugate | 200 | 200 | 185 | 165 | 150 | – |
| word-bank | 200 | 135 | 100 | 100 | – | – |
| place-word | – | 150 | 135 | 135 | 135 | – |
| word-order | 200 | 150 | 115 | 100 | – | – |
| error-spot | – | 135 | 135 | 150 | 200 | 265 |
| error-correct | – | – | 135 | 165 | 200 | 265 |
| true-false | 135 | 115 | 100 | 100 | 100 | 100 |
| reading-mc | – | 100 | 115 | 135 | 165 | 165 |
| match-pairs | 135 | 115 | 100 | 115 | 135 | 165 |
| odd-one-out | 165 | 85 | 50 | – | – | – |
| sentence-choice | 200 | 135 | 100 | 85 | – | – |
| transform | – | – | 135 | 150 | 235 | 300 |
| **Totale** | **2000** | **2000** | **2000** | **2000** | **2000** | **2000** |

Le quote sono un obiettivo di copertura: scostamenti piccoli sono ammessi, ma il totale per livello resta ≥ 2000 e nessuna tipologia prevista dalla matrice (`02-tipologie-domande.md`) può avere 0 domande.

## Copertura per argomento
Dentro ogni livello, le domande sono distribuite sugli argomenti elencati in `02-tipologie-domande.md`: nessun argomento sotto il 5% né sopra il 20% del livello. Il campo `topic` è obbligatorio per misurarlo.

## Regole di qualità
1. Contenuti **originali**, niente testi o esercizi copiati da libri/siti.
2. Una sola risposta corretta (o tutte le varianti valide elencate).
3. Nessun duplicato: stesso `prompt`/frase non ripetuto nel livello (test automatico su testo normalizzato).
4. Lessico e grammatica coerenti col livello CEFR; testi di lettura: A1–A2 40–70 parole, B1–B2 80–150, C1–C2 150–250.
5. **Tutto in inglese** (domande, opzioni, spiegazioni), nessuna parola italiana. `explanation` (la regola con esempio, 1–2 frasi in inglese semplice, adatto al livello) presente sul **100%** delle domande. `wrongReasons` **obbligatorio e diverso per ogni risposta sbagliata**: ogni opzione errata di `multiple-choice`, `verb-form`, `sentence-choice`; ogni parola errata del riquadro di `word-bank` (per ogni spazio); almeno gli errori tipici di `fill-blank`, `verb-conjugate`, `error-correct`. Una spiegazione che vale per una sola risposta sbagliata non va riusata per le altre (es. con *a / an / the*, spiegare separatamente perché `a` e perché `the` non vanno bene).
6. Distrattori plausibili, posizione della risposta corretta distribuita (non sempre la prima: lo shuffle a runtime è comunque obbligatorio).

## Validazione automatica (`src/data/data.test.ts`)
- schema per tipo (campi obbligatori, indici entro i limiti, `answers` non vuoti);
- `id` univoci globalmente e coerenti con livello/tipo del file;
- conteggio per livello ≥ 2000 e per tipologia ≥ 90% della quota;
- nessun prompt duplicato nel livello;
- quota `topic` entro il 5–20%;
- `wrongReasons` completi: una voce per ogni distrattore delle domande a scelta e per ogni parola errata (per spazio) di `word-bank`; almeno una voce per `fill-blank`, `verb-conjugate`, `error-correct`;
- `explanation` non vuota su ogni domanda; chiavi di `wrongReasons` valide (indici esistenti, mai la risposta corretta); controllo euristico di assenza di parole italiane comuni (es. "il", "della", "perché", "che");
- ogni `place-word`: `correctPositions` valide; ogni `word-order`: le parole in `words` ricompongono una delle `solutions`.

## Produzione (processo)
Lavoro a lotti, un livello alla volta (A1 → C2), con lotti di ~50 domande per file così da validare e rivedere spesso (≈ 40 lotti per livello):
1. Per ogni file livello+tipologia si scrive il lotto di domande in JSON.
2. Si esegue la validazione automatica; si correggono gli errori.
3. Revisione a campione (≥ 10% per lotto) di correttezza grammaticale e livello.
4. Si spunta il lotto in `06-piano-implementazione.md`.

## Impatto tecnico
- Dimensione stimata: ~0,8–1 MB di JSON per livello (non compresso), ~150–200 KB gzip; totale precache ≈ 1 MB gzip: accettabile per una PWA, ma da misurare (budget massimo: 1,5 MB gzip di dati).
- Il caricamento lazy è **per livello**; se il livello scelto supera ~250 KB gzip si carica solo il file delle tipologie necessarie (`import.meta.glob` per file, non per cartella).
- Caricamento lazy per livello: si scarica solo il livello scelto (offline: tutti precacheati dal service worker).
- Per ridurre ripetizioni tra sessioni consecutive: in `localStorage` (`eq.seen.<livello>`) si tengono gli ultimi ~100 `id` visti, e `buildQuiz` li evita finché restano domande non viste.
