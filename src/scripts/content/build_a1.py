"""Brings A1 to 5000 questions: removes legacy duplicates, then adds balanced, non-duplicated questions.

usage: build_a1.py [--write]
"""
import sys, random, json, collections
from core import (load_level, save_level, remove_legacy_duplicates, Registry, next_numbers, with_id, SIGLA)
import vocab_gen as V
import reading_gen as R
import g_verbs as GV
import g_phrasal_conf as GP
import g_func as GF
from rows import CONVERTERS

LEVEL = 'a1'
SEED = 20260601
WRITE = '--write' in sys.argv
QUOTA = {'multiple-choice': 663, 'verb-form': 588, 'fill-blank': 662, 'verb-conjugate': 500, 'word-bank': 500, 'word-order': 500,
         'true-false': 338, 'match-pairs': 337, 'odd-one-out': 412, 'sentence-choice': 500}
EVE, TRAV, WORK, SOC = 'everyday-life', 'travel-places-leisure', 'work-education-technology', 'society-health-environment'
ART, PRON, ADJ, PREP = 'articles-determiners', 'pronouns-relative-clauses', 'adjectives-adverbs', 'prepositions'
VT, MODAL, GER, PHR, CONF = 'verb-tenses', 'modal-verbs', 'gerunds-infinitives-linking', 'phrasal-collocations-idioms', 'confusing-words-word-formation'

# base design for 3000 new questions: type -> category -> count (scaled to what each type still needs)
BASE = {
    'multiple-choice': {EVE: 33, TRAV: 30, WORK: 30, SOC: 30, ART: 50, PRON: 50, ADJ: 50, PREP: 40, MODAL: 30, PHR: 15, CONF: 40},
    'fill-blank': {EVE: 44, TRAV: 40, WORK: 38, SOC: 38, ART: 40, PRON: 40, ADJ: 40, PREP: 40, MODAL: 25, PHR: 15, CONF: 37},
    'word-bank': {EVE: 38, TRAV: 36, WORK: 35, SOC: 36, ART: 50, PRON: 40, PREP: 50, CONF: 15},
    'word-order': {EVE: 50, TRAV: 43, WORK: 40, SOC: 42, ART: 10, ADJ: 60, PREP: 30, MODAL: 10, PHR: 15},
    'sentence-choice': {EVE: 25, TRAV: 24, WORK: 19, SOC: 27, ART: 40, PRON: 40, ADJ: 40, PREP: 30, MODAL: 15, PHR: 15, CONF: 25},
    'verb-form': {VT: 100, MODAL: 100, GER: 90, PHR: 30, CONF: 33},
    'verb-conjugate': {VT: 100, MODAL: 70, GER: 60, PHR: 70},
    'odd-one-out': {EVE: 62, TRAV: 62, WORK: 61, SOC: 62},
    'match-pairs': {EVE: 48, TRAV: 50, WORK: 52, SOC: 52},
    'true-false': {EVE: 50, TRAV: 55, WORK: 45, SOC: 53},
}
VOCAB_CATS = (EVE, TRAV, WORK, SOC)


def pick(rng, weighted):
    r = rng.random() * sum(w for _, w in weighted)
    for f, w in weighted:
        r -= w
        if r <= 0:
            return f
    return weighted[-1][0]


def rows_gen(weighted_rows, rng, qtype):
    conv = CONVERTERS[qtype]
    row = pick(rng, weighted_rows)(rng)
    return conv(row, rng) if row else None


def adj_sc(rng):
    right, wrongs = GF.adj_order_sc_row(rng)
    options = [right] + [w for w, _ in wrongs]
    rng.shuffle(options)
    wr = {str(options.index(w)): r for w, r in wrongs}
    from core import new_question
    return new_question('A1', 'sentence-choice', 'adjectives', [ADJ], 'Which sentence is correct?', 'In English the adjective comes before the noun and never takes -s.',
                        options=options, correct=options.index(right), wrongReasons=wr)


def adj_wo(rng):
    from core import new_question, scramble
    right, wrongs, adj, n = GF.adj_order_row(rng)
    tokens = right.rstrip('.').split(' ')
    return new_question('A1', 'word-order', 'adjectives', [ADJ], 'Put the words in the correct order.',
                        f'The adjective comes before the noun: "{right}"', words=scramble(tokens, rng, tokens), solutions=[tokens])


ART_ROWS = [(GF.art_aan, 30), (GF.art_the, 15), (GF.art_some_any, 20), (GF.art_this_that, 10), (GF.art_plural, 25)]
PRON_ROWS = [(GF.pron_subject, 30), (GF.pron_object, 25), (GF.pron_possessive, 30), (GF.pron_genitive, 15)]
PREP_ROWS = [(GF.prep_row, 1)]
ADJ_MC = [(GF.adj_opposite_mc, 50), (GF.adj_contrast, 50)]
ADJ_FB = [(GF.adj_opposite_fb, 50), (GF.adj_contrast, 50)]


def vocab_word(rng, cat):
    return rng.choice([w for w in V.ALL if w.cat == cat])


def make_generator(qtype, cat, rng, conf_rows):
    """Returns a function () -> question or None for the (type, category) cell."""
    if cat in VOCAB_CATS:
        if qtype == 'multiple-choice':
            return lambda: pick(rng, [(V.mc_definition, 35), (V.mc_group, 20), (V.mc_sentence, 45)])(vocab_word(rng, cat), rng)
        if qtype == 'fill-blank':
            return lambda: pick(rng, [(V.fb_definition, 60), (V.fb_sentence, 40)])(vocab_word(rng, cat), rng)
        if qtype == 'word-bank':
            return lambda: V.wb_sentence(vocab_word(rng, cat), rng)
        if qtype == 'word-order':
            return lambda: V.wo_sentence(vocab_word(rng, cat), rng)
        if qtype == 'sentence-choice':
            return lambda: V.sc_sentence(vocab_word(rng, cat), rng)
        if qtype == 'odd-one-out':
            return lambda: V.oo_group(cat, rng)
        if qtype == 'match-pairs':
            return lambda: V.mp_pairs(cat, rng, rng.choice(['group', 'meaning']))
        if qtype == 'true-false':
            return lambda: rng.choice(R.TEMPLATES[cat])(rng)
    if cat == VT:
        if qtype == 'verb-form':
            return lambda: pick(rng, [(GV.vf_present_simple, 30), (GV.vf_present_continuous, 20), (GV.vf_be, 20), (GV.vf_have, 10), (GV.vf_negative, 10), (GV.vf_question, 10)])(rng)
        if qtype == 'verb-conjugate':
            return lambda: pick(rng, [(GV.vc_present3, 45), (GV.vc_continuous, 35), (GV.vc_have, 10), (GV.vc_be, 10)])(rng)
    if cat == MODAL:
        table = {'verb-form': [(GV.vf_can, 30), (GV.vf_cant, 25), (GV.vf_can_question, 20), (GV.vf_would_like, 5)], 'verb-conjugate': [(GV.vc_can, 1)],
                 'multiple-choice': [(GV.mc_can, 1)], 'fill-blank': [(GV.fb_can, 1)], 'sentence-choice': [(GV.sc_can, 1)], 'word-order': [(GV.wo_can, 1)]}
        if qtype in table:
            return lambda: pick(rng, table[qtype])(rng)
    if cat == GER:
        if qtype == 'verb-form':
            return lambda: pick(rng, [(GV.vf_gerund, 50), (GV.vf_infinitive, 50)])(rng)
        if qtype == 'verb-conjugate':
            return lambda: GV.vc_gerund(rng)
    if cat == PHR:
        table = {'verb-form': GP.vf_phrasal, 'verb-conjugate': GP.vc_phrasal, 'multiple-choice': GP.mc_phrasal, 'fill-blank': GP.fb_phrasal,
                 'sentence-choice': GP.sc_phrasal, 'word-order': GP.wo_phrasal}
        if qtype in table:
            return lambda: table[qtype](rng)
    if cat == CONF:
        if qtype == 'verb-form':
            return lambda: GP.vf_domake(rng)
        conf = {'multiple-choice': GP.conf_mc, 'fill-blank': GP.conf_fb, 'word-bank': GP.conf_wb, 'sentence-choice': GP.conf_sc}
        if qtype in conf:
            return lambda: conf[qtype](rng.choice(conf_rows), rng)
    if cat == ART:
        return lambda: rows_gen(ART_ROWS, rng, qtype)
    if cat == PRON:
        return lambda: rows_gen(PRON_ROWS, rng, qtype)
    if cat == PREP:
        return lambda: rows_gen(PREP_ROWS, rng, qtype)
    if cat == ADJ:
        if qtype == 'multiple-choice':
            return lambda: CONVERTERS['multiple-choice'](pick(rng, ADJ_MC)(rng), rng)
        if qtype == 'fill-blank':
            return lambda: CONVERTERS['fill-blank'](pick(rng, ADJ_FB)(rng), rng)
        if qtype == 'sentence-choice':
            return lambda: adj_sc(rng)
        if qtype == 'word-order':
            return lambda: adj_wo(rng)
    raise KeyError((qtype, cat))


def main():
    rng = random.Random(SEED)
    files = load_level(LEVEL)
    removed = remove_legacy_duplicates(files)
    print(f'legacy duplicates removed: {len(removed)}')
    have = {t: len(f['questions']) for t, f in files.items()}
    need = {t: QUOTA[t] - have[t] for t in QUOTA}
    print('need per type:', need, 'total', sum(need.values()))
    reg = Registry(files)
    conf_rows = GP.conf_rows()
    new = collections.defaultdict(list)
    short = []
    for qtype, cells in BASE.items():
        base_total = sum(cells.values())
        scale = need[qtype] / base_total
        counts = {cat: int(round(n * scale)) for cat, n in cells.items()}
        diff = need[qtype] - sum(counts.values())
        cats = list(counts)
        i = 0
        while diff != 0:
            counts[cats[i % len(cats)]] += 1 if diff > 0 else -1
            diff += -1 if diff > 0 else 1
            i += 1
        for cat, n in counts.items():
            gen = make_generator(qtype, cat, rng, conf_rows)
            got, attempts = 0, 0
            while got < n and attempts < 400 * n + 400:
                attempts += 1
                try:
                    q = gen()
                except (KeyError, ValueError, IndexError) as e:  # a generator may not fit a random choice
                    q = None
                if q and reg.try_add({**q, 'id': 'x'}):
                    new[qtype].append(q)
                    got += 1
            if got < n:
                short.append((qtype, cat, n, got))
    for s in short:
        print('SHORT', s)
    # assign ids and append
    last = next_numbers(files)
    for qtype, qs in new.items():
        rng.shuffle(qs)
        for i, q in enumerate(qs, start=1):
            files[qtype]['questions'].append(with_id(q, last[qtype] + i, 'a1'))
    total = sum(len(f['questions']) for f in files.values())
    print('total questions', total)
    cats = collections.Counter(c for f in files.values() for q in f['questions'] for c in q['topics'])
    print(json.dumps(dict(cats.most_common()), indent=1))
    print({t: len(f['questions']) for t, f in files.items()})
    if WRITE:
        save_level(files)
        print('written')


if __name__ == '__main__':
    main()
