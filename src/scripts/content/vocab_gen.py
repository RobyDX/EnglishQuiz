"""Vocabulary questions (A1) built from the lexicon: definitions, sentences, groups."""
import re
from lex import load
from core import new_question, scramble

LEVEL = 'A1'
TOPIC = 'vocabulary'
GROUPS = load()
ALL = [w for g in GROUPS.values() for w in g.words]

# Groups whose sentences name one item of a closed set (the wrong options come from the same group).
SAME_GROUP = {'months', 'days', 'colours', 'seasons', 'countries', 'nationalities'}
# Feelings overlap too much for a sentence to have a single right answer.
NO_SENTENCE = {'feelings'}
# Group labels that read badly in "Which of these is ...?".
AWKWARD = {'personal', 'environment', 'holiday', 'people', 'health', 'technology', 'workwords', 'school',
           'directions', 'family', 'kitchen', 'weather', 'nature', 'hobbies', 'classroom', 'food'}
# Groups too close in meaning to be used together as "the odd one out" or as separate groups in one question.
RELATED = [
    {'fruit', 'vegetables', 'meat', 'food', 'sweets', 'drinks'},
    {'pets', 'wild', 'sea', 'insects'},
    {'jobs', 'people', 'family'},
    {'sports', 'hobbies'},
    {'weather', 'seasons'},
    {'countries', 'nationalities'},
    {'rooms', 'furniture', 'kitchen'},
    {'body', 'health'},
    {'transport', 'town'},
    {'classroom', 'school', 'subjects'},
    {'technology', 'classroom'},
    {'clothes', 'personal'},
    {'nature', 'environment', 'weather'},
    {'jobs', 'workplaces', 'workwords'},
    {'months', 'days', 'seasons'},
    {'workplaces', 'town', 'school', 'classroom'},
    {'nature', 'holiday'},
    {'hobbies', 'holiday'},
    {'town', 'rooms'},
]


def related(a, b):
    return a == b or any(a in r and b in r for r in RELATED)


def noun(single):
    return re.sub(r'^(a|an) ', '', single)


def parts(w):
    """(surface, before, after, leading?, word before the gap) for the example sentence of w."""
    s = w.sentence
    m = re.search(r'(?<![A-Za-z])' + re.escape(w.text) + r'(?![A-Za-z])', s, re.I)
    before, after = s[:m.start()], s[m.end():]
    pre = before.rstrip().split(' ')[-1].lower() if before.strip() else ''
    return m.group(0), before, after, before.strip() == '', pre


def pick_wrong(w, k, rng, pre='', mode='cross'):
    """k words that cannot replace w in its sentence. mode: cross (other category), same (same group), cat (same category)."""
    pool = []
    for d in ALL:
        if d is w or d.group.key in NO_SENTENCE and mode == 'cross':
            continue
        if mode == 'same' and d.group is not w.group:
            continue
        if mode == 'cross' and (d.cat == w.cat or related(d.group.key, w.group.key)):
            continue
        if mode == 'cat' and (d.cat != w.cat or related(d.group.key, w.group.key)):
            continue
        if (w.number == 'pl') != (d.number == 'pl'):
            continue
        if pre in ('a', 'an') and not (d.number == 'sg' and d.article == pre):
            continue
        if w.text[:1].isupper() != d.text[:1].isupper() and mode != 'cat':
            continue
        pool.append(d)
    if len(pool) < k:
        return None
    return rng.sample(pool, k)


def options_with(correct, wrongs, rng):
    opts = [correct] + wrongs
    rng.shuffle(opts)
    return opts, opts.index(correct)


def sentence_blank(w):
    surface, before, after, lead, pre = parts(w)
    return surface, before + '___' + after


# ---- multiple-choice -------------------------------------------------------------------------------------------

def mc_definition(w, rng):
    wrongs = pick_wrong(w, 2, rng, mode='cat')
    if not wrongs:
        return None
    opts, ci = options_with(w.text, [d.text for d in wrongs], rng)
    wr = {str(opts.index(d.text)): f'"{d.text}" means "{d.definition}".' for d in wrongs}
    return new_question(LEVEL, 'multiple-choice', TOPIC, [w.cat], f'Which word means "{w.definition}"?',
                        f'"{w.text}" means "{w.definition}".', options=opts, correct=ci, wrongReasons=wr)


def mc_group(w, rng):
    g = w.group
    if g.key in AWKWARD:
        return None
    wrongs = pick_wrong(w, 2, rng, mode='cross')
    if not wrongs:
        return None
    opts, ci = options_with(w.text, [d.text for d in wrongs], rng)
    wr = {str(opts.index(d.text)): f'"{d.text}" is {d.group.single}, not {g.single}.' for d in wrongs}
    return new_question(LEVEL, 'multiple-choice', TOPIC, [w.cat], f'Which of these is {g.single}?',
                        f'"{w.text}" is {g.single}.', options=opts, correct=ci, wrongReasons=wr)


def mc_sentence(w, rng):
    if w.group.key in NO_SENTENCE:
        return None
    surface, before, after, lead, pre = parts(w)
    if lead:
        return None
    mode = 'same' if w.group.key in SAME_GROUP else 'cross'
    wrongs = pick_wrong(w, 2, rng, pre, mode)
    if not wrongs:
        return None
    opts, ci = options_with(surface, [d.text for d in wrongs], rng)
    wr = {str(opts.index(d.text)): f'"{d.text}" means "{d.definition}", so it does not fit this sentence.' for d in wrongs}
    return new_question(LEVEL, 'multiple-choice', TOPIC, [w.cat], before + '___' + after,
                        f'"{surface}" fits here. It means "{w.definition}".', options=opts, correct=ci, wrongReasons=wr)


# ---- fill-blank --------------------------------------------------------------------------------------------------

def fb_definition(w, rng):
    mates = [d for d in w.group.words if d is not w and d.text[:1].islower() == w.text[:1].islower()]
    if len(mates) < 2:
        return None
    wrongs = rng.sample(mates, 2)
    wr = {d.text: f'"{d.text}" means "{d.definition}", not "{w.definition}".' for d in wrongs}
    return new_question(LEVEL, 'fill-blank', TOPIC, [w.cat], 'Complete the sentence with the correct word.',
                        f'"{w.text}" means "{w.definition}".', text=f'The word for {w.definition} is ___.',
                        answers=[[w.text]], wrongReasons=wr)


def fb_sentence(w, rng):
    if w.group.key in NO_SENTENCE:
        return None
    surface, before, after, lead, pre = parts(w)
    if lead:
        return None
    mode = 'same' if w.group.key in SAME_GROUP else 'cross'
    wrongs = pick_wrong(w, 2, rng, pre, mode)
    if not wrongs:
        return None
    wr = {d.text: f'"{d.text}" means "{d.definition}", so it does not fit this sentence.' for d in wrongs}
    return new_question(LEVEL, 'fill-blank', TOPIC, [w.cat], f'Complete the sentence. The missing word starts with "{surface[0]}".',
                        f'"{surface}" fits here. It means "{w.definition}".', text=before + '___' + after,
                        answers=[[surface]], wrongReasons=wr)


# ---- word-bank / sentence-choice / word-order -----------------------------------------------------------

def wb_sentence(w, rng):
    if w.group.key in NO_SENTENCE:
        return None
    surface, before, after, lead, pre = parts(w)
    if lead:
        return None
    mode = 'same' if w.group.key in SAME_GROUP else 'cross'
    wrongs = pick_wrong(w, 2, rng, pre, mode)
    if not wrongs:
        return None
    bank, _ = options_with(surface, [d.text for d in wrongs], rng)
    wr = {d.text: f'"{d.text}" means "{d.definition}", so it does not fit this sentence.' for d in wrongs}
    return new_question(LEVEL, 'word-bank', TOPIC, [w.cat], 'Complete the sentence with words from the box.',
                        f'"{surface}" fits here. It means "{w.definition}".', bank=bank, text=before + '___' + after,
                        answers=[surface], wrongReasons=wr)


def sc_sentence(w, rng):
    if w.group.key in NO_SENTENCE:
        return None
    surface, before, after, lead, pre = parts(w)
    if lead:
        return None
    mode = 'same' if w.group.key in SAME_GROUP else 'cross'
    wrongs = pick_wrong(w, 2, rng, pre, mode)
    if not wrongs:
        return None
    right = before + surface + after
    sentences = [before + d.text + after for d in wrongs]
    opts, ci = options_with(right, sentences, rng)
    wr = {str(opts.index(before + d.text + after)): f'"{d.text}" means "{d.definition}", so this sentence does not make sense.' for d in wrongs}
    return new_question(LEVEL, 'sentence-choice', TOPIC, [w.cat], 'Which sentence is correct?',
                        f'"{surface}" fits here. It means "{w.definition}".', options=opts, correct=ci, wrongReasons=wr)


def wo_sentence(w, rng):
    s = w.sentence
    if ',' in s or w.group.key in NO_SENTENCE:
        return None
    tokens = s.rstrip('.').split(' ')
    if len(tokens) < 4 or len(tokens) > 12:
        return None
    return new_question(LEVEL, 'word-order', TOPIC, [w.cat], 'Put the words in the correct order.',
                        f'The correct sentence is: "{s}" The word "{w.text}" means "{w.definition}".',
                        words=scramble(tokens, rng, tokens), solutions=[tokens])


# ---- odd-one-out / match-pairs -----------------------------------------------------------------------------

def oo_group(cat, rng):
    a_groups = [g for g in GROUPS.values() if g.cat == cat and len(g.words) >= 3 and g.key not in NO_SENTENCE]
    a = rng.choice(a_groups)
    b_groups = [g for g in GROUPS.values() if not related(g.key, a.key) and g.key not in NO_SENTENCE]
    same_cat = [g for g in b_groups if g.cat == a.cat]
    b = rng.choice(same_cat if same_cat and rng.random() < 0.6 else b_groups)
    three = rng.sample(a.words, 3)
    odd = rng.choice(b.words)
    if odd.text[:1].isupper() != three[0].text[:1].isupper():
        return None
    opts = [w.text for w in three] + [odd.text]
    rng.shuffle(opts)
    quoted = ', '.join(f'"{w.text}"' for w in three[:2]) + f' and "{three[2].text}"'
    return new_question(LEVEL, 'odd-one-out', TOPIC, [a.cat], 'Which word does not belong to the group?',
                        f'{quoted} are {a.plural}. "{odd.text}" is {odd.group.single}.',
                        options=opts, correct=opts.index(odd.text), category=a.plural)


def mp_pairs(cat, rng, kind):
    pool = [g for g in GROUPS.values() if g.cat == cat and g.key not in NO_SENTENCE and (kind == 'meaning' or g.key not in AWKWARD or True)]
    chosen = []
    for g in rng.sample(pool, len(pool)):
        if kind == 'meaning' or all(not related(g.key, c.key) for c in chosen):
            chosen.append(g)
        if len(chosen) == 4:
            break
    if len(chosen) < 4:
        return None
    words = [rng.choice(g.words) for g in chosen]
    if len({w.text[:1].isupper() for w in words}) > 1 and kind == 'group':
        pass
    if kind == 'group':
        pairs = [{'left': w.text, 'right': noun(w.group.single)} for w in words]
        prompt = 'Match each word with its group.'
        explanation = '; '.join(f'"{w.text}" is {w.group.single}' for w in words) + '.'
    else:
        pairs = [{'left': w.text, 'right': w.definition} for w in words]
        prompt = 'Match each word with its meaning.'
        explanation = 'Read each meaning and find the word it describes: ' + '; '.join(f'"{w.text}" means "{w.definition}"' for w in words) + '.'
    if len({p['right'] for p in pairs}) < 4:
        return None
    rng.shuffle(pairs)
    return new_question(LEVEL, 'match-pairs', TOPIC, [cat], prompt, explanation, pairs=pairs)
