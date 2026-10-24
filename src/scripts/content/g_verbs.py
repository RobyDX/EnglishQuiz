"""A1 verb questions: tenses, modal verbs, gerund/infinitive, phrasal verbs."""
from core import new_question, scramble
from g_data import ALL_SUBJECTS, S3, NON3, VERBS, wrong_ing, wrong_third, ING_RULE_TEXT

LEVEL = 'A1'
CAT_VT, CAT_MODAL, CAT_GER, CAT_PHR = 'verb-tenses', 'modal-verbs', 'gerunds-infinitives-linking', 'phrasal-collocations-idioms'
ADVERBS = ['every day', 'every morning', 'on Saturdays', 'after school', 'every weekend', 'in the evening']
PERSON_COMPS = ['a student', 'happy', 'from Spain', 'twelve years old', 'my friend', 'tired', 'a good cook', 'at home', 'very tall', 'in the garden']
THING_COMPS = ['in the kitchen', 'very big', 'old', 'at home', 'very small', 'hungry', 'in the garden', 'on the sofa']
PLURAL_COMPS = ['students', 'happy', 'from Spain', 'twelve years old', 'good friends', 'tired', 'at home', 'very tall', 'in the garden']
THINGS = {'It', 'The dog', 'The cat', 'The baby'}
PERSONS = [x for x in ALL_SUBJECTS if x.text not in THINGS]
PERSONS3 = [x for x in S3 if x.text not in THINGS]


def choice(qtype, cats, prompt, explanation, correct, wrongs, rng, topic, **extra):
    texts = [correct] + [w[0] for w in wrongs]
    if len(set(texts)) != len(texts):
        return None
    order = texts[:]
    rng.shuffle(order)
    wr = {str(order.index(t)): r for t, r in wrongs}
    return new_question(LEVEL, qtype, topic, cats, prompt, explanation, options=order, correct=order.index(correct), wrongReasons=wr, **extra)


def gap(qtype, cats, prompt, explanation, text, answers, wrong, topic):
    return new_question(LEVEL, qtype, topic, cats, prompt, explanation, text=text, answers=[[a] for a in answers], wrongReasons=wrong)


def comps_for(s):
    if s.text in THINGS or s.text == 'The baby':
        return THING_COMPS
    return PERSON_COMPS if (s.s3 or s.text in ('I', 'You')) else PLURAL_COMPS


def present_form(s, v):
    base, third = v[0], v[1]
    return third if s.s3 else base


# ---- present simple / continuous (verb-form) --------------------------------------------------------------

def vf_present_simple(rng):
    s, v = rng.choice(PERSONS), rng.choice(VERBS)
    base, third, ing, rest, rule = v
    adv = rng.choice(ADVERBS)
    correct = present_form(s, v)
    wrongs = []
    if s.s3:
        wrongs.append((base, f'"{base}" is the base form. With he, she, it and one person or thing the verb takes -s/-es/-ies: "{third}".'))
    else:
        wrongs.append((third, f'"{third}" has an -s ending, which is only for he, she, it and one person or thing. With "{s.text}" we use the base form: "{base}".'))
    wrongs.append((f'{s.be} {ing}', f'"{s.be} {ing}" is the present continuous (an action happening now). "{adv}" shows a habit, so we use the present simple: "{correct}".'))
    aux = 'does' if s.s3 else 'do'
    wrongs.append((f'{aux} {base}', f'"{aux} {base}" is used in questions and negatives. A positive sentence uses "{correct}".'))
    expl = (f'With he, she, it and one person or thing, the verb takes -s/-es/-ies: {s.lower} {third}.' if s.s3
            else f'With I, you, we, they and plural subjects we use the base form: {s.lower} {base}.')
    return choice('verb-form', [CAT_VT], f'{s.text} ___ {rest} {adv}.', expl, correct, wrongs, rng, 'present-simple', verb=base)


def vf_present_continuous(rng):
    s, v = rng.choice(PERSONS), rng.choice(VERBS)
    base, third, ing, rest, rule = v
    cue = rng.choice(['Look!', 'Listen!', 'Quick!', 'Hurry up!'])
    correct = f'{s.be} {ing}'
    simple = third if s.s3 else base
    aux = 'does' if s.s3 else 'do'
    wrongs = [
        (simple, f'"{simple}" is the present simple, for habits and routines. "{cue}" shows the action is happening now, so we use the present continuous: "{correct}".'),
        (f'{s.be} {base}', f'After "{s.be}" we need the -ing form: "{correct}".'),
        (f'{aux} {ing}', f'"{aux}" goes with the base form, not with -ing, and it is not used in positive sentences. For an action now use "{correct}".'),
    ]
    return choice('verb-form', [CAT_VT], f'{cue} {s.text} ___ {rest}.', f'For an action happening now we use am/is/are + verb-ing: {s.lower} {correct}.',
                  correct, wrongs, rng, 'present-continuous', verb=base)


def _be_wrongs(s):
    reasons = {
        'am': f'"am" is only used with "I". With "{s.text}" we use "{s.be}".',
        'is': f'"is" is used with he, she, it and singular nouns. With "{s.text}" we use "{s.be}".',
        'are': f'"are" is used with you, we, they and plural nouns. With "{s.text}" we use "{s.be}".',
        'be': f'"be" is the base form. In a sentence we use "am", "is" or "are": "{s.text} {s.be}".',
    }
    return [(w, reasons[w]) for w in ('am', 'is', 'are', 'be') if w != s.be]


def vf_be(rng):
    s = rng.choice(ALL_SUBJECTS)
    comp = rng.choice(comps_for(s))
    return choice('verb-form', [CAT_VT], f'{s.text} ___ {comp}.', f'Use "{s.be}" with "{s.text}": {s.lower} {s.be} {comp}.',
                  s.be, _be_wrongs(s), rng, 'to-be', verb='be')


def vf_have(rng):
    s = rng.choice([x for x in ALL_SUBJECTS if x.text not in THINGS])
    obj = rng.choice(['two brothers', 'a new bike', 'a big family', 'a blue bag', 'three cats', 'a small house', 'a red car',
                      'a lot of books', 'two sisters', 'a computer', 'a nice teacher', 'four pens'])
    correct = s.have
    other = 'have' if s.s3 else 'has'
    wrongs = [
        (other, f'"{other}" is used with {"I, you, we, they and plural nouns" if s.s3 else "he, she, it and singular nouns"}. With "{s.text}" we use "{correct}".'),
        ('haves', '"haves" does not exist. The verb "have" changes to "has" with he, she, it.'),
        (f'{s.be} having', f'"{s.be} having" is the present continuous. To talk about what you own or your family we use the simple form "{correct}".'),
    ]
    return choice('verb-form', [CAT_VT], f'{s.text} ___ {obj}.', f'Use "{correct}" with "{s.text}": {s.lower} {correct} {obj}.',
                  correct, wrongs, rng, 'have-has', verb='have')


def vf_negative(rng):
    s, v = rng.choice(PERSONS), rng.choice(VERBS)
    base, third, ing, rest, rule = v
    correct = "doesn't" if s.s3 else "don't"
    other = "don't" if s.s3 else "doesn't"
    wrongs = [
        (other, f'"{other}" is used with {"I, you, we, they and plural nouns" if s.s3 else "he, she, it and one person or thing"}. With "{s.text}" we use "{correct}".'),
        (("isn't" if s.be == 'is' else ("aren't" if s.be == 'are' else "am not")),
         f'"{("isn\'t" if s.be == "is" else ("aren\'t" if s.be == "are" else "am not"))}" goes before a noun or adjective (She isn\'t tired). Before a verb we need "{correct}".'),
        ('not', f'"not" cannot go alone before the verb. We need the helper "{correct}" (do/does + not).'),
    ]
    return choice('verb-form', [CAT_VT], f'{s.text} ___ {base} {rest}.', f'To make a negative with a normal verb we use {correct} + base verb: {s.lower} {correct} {base}.',
                  correct, wrongs, rng, 'negatives', verb=base)


def vf_question(rng):
    s, v = rng.choice(PERSONS), rng.choice(VERBS)
    base, third, ing, rest, rule = v
    correct = 'Does' if s.s3 else 'Do'
    other = 'Do' if s.s3 else 'Does'
    be_q = 'Is' if s.be == 'is' else ('Are' if s.be == 'are' else 'Am')
    wrongs = [
        (other, f'"{other}" is used with {"I, you, we, they and plural nouns" if s.s3 else "he, she, it and one person or thing"}. With "{s.text}" we use "{correct}".'),
        (be_q, f'"{be_q}" is the question form of "be" and goes before a noun or adjective. Before a verb we need "{correct}".'),
    ]
    other_be = 'Are' if be_q != 'Are' else 'Is'
    wrongs.append((other_be, f'"{other_be}" is a form of "be", not a helper for normal verbs. Questions with "{base}" start with "{correct}".'))
    return choice('verb-form', [CAT_VT], f'___ {s.lower} {base} {rest}?', f'Questions with normal verbs start with do/does: {correct} {s.lower} {base} {rest}?',
                  correct, wrongs, rng, 'questions', verb=base)


# ---- verb-conjugate ----------------------------------------------------------------------------------------

def vc_present3(rng):
    s, v = rng.choice(PERSONS3), rng.choice(VERBS)
    base, third, ing, rest, rule = v
    adv = rng.choice(ADVERBS)
    wr = {base: f'"{base}" is the base form. With "{s.text}" the verb needs -s/-es/-ies: "{third}".',
          ing: f'"{ing}" needs "{s.be}" before it. A habit uses the present simple: "{third}".'}
    sp = wrong_third(v)
    if sp and sp[0] not in wr and sp[0] != third:
        wr[sp[0]] = sp[1]
    return gap('verb-conjugate', [CAT_VT], 'Write the correct form of the verb in brackets.',
               f'With he, she, it and one person or thing, the verb takes -s/-es/-ies: {s.lower} {third}.',
               f'{s.text} ___ ({base}) {rest} {adv}.', [third], wr, 'present-simple')


def vc_continuous(rng):
    pool = [v for v in VERBS if v[4] != 'regular'] if rng.random() < 0.6 else VERBS
    s, v = rng.choice(PERSONS), rng.choice(pool)
    base, third, ing, rest, rule = v
    simple = third if s.s3 else base
    wr = {base: f'After "{s.be}" we need the -ing form: "{ing}".',
          simple: f'"{simple}" is the present simple (habits). "now" shows the action is happening now, so we use "{s.be} {ing}".'}
    if base == simple:
        wr.pop(simple, None)
        wr[base] = f'After "{s.be}" we need the -ing form: "{ing}".'
    sp = wrong_ing(v)
    if sp and sp[0] not in wr:
        wr[sp[0]] = sp[1]
    return gap('verb-conjugate', [CAT_VT], 'Write the correct form of the verb in brackets.',
               f'For an action happening now we use am/is/are + verb-ing. {ING_RULE_TEXT[rule]}: {ing}.',
               f'{s.text} {s.be} ___ ({base}) {rest} now.', [ing], wr, 'present-continuous')


def vc_have(rng):
    s = rng.choice([x for x in ALL_SUBJECTS if x.text not in THINGS])
    obj = rng.choice(['two brothers', 'a new bike', 'a big family', 'a blue bag', 'three cats', 'a small house', 'a red car',
                      'a lot of books', 'two sisters', 'a computer', 'a nice teacher', 'four pens'])
    other = 'have' if s.s3 else 'has'
    wr = {other: f'"{other}" is used with {"I, you, we, they and plural nouns" if s.s3 else "he, she, it and singular nouns"}. With "{s.text}" we use "{s.have}".',
          'haves': '"haves" does not exist. "have" changes to "has" with he, she, it.',
          'having': f'"having" needs "{s.be}" before it, and we do not use it to talk about what we own. Use "{s.have}".'}
    return gap('verb-conjugate', [CAT_VT], 'Write the correct form of the verb in brackets.',
               f'Use "{s.have}" with "{s.text}": {s.lower} {s.have} {obj}.', f'{s.text} ___ (have) {obj}.', [s.have], wr, 'have-has')


def vc_be(rng):
    s = rng.choice(ALL_SUBJECTS)
    comp = rng.choice(comps_for(s))
    wr = {w: r for w, r in _be_wrongs(s)}
    return gap('verb-conjugate', [CAT_VT], 'Write the correct form of the verb in brackets.',
               f'Use "{s.be}" with "{s.text}": {s.lower} {s.be} {comp}.', f'{s.text} ___ (be) {comp}.', [s.be], wr, 'to-be')


# ---- modal verbs (can / can't / would like) ----------------------------------------------------------------

def _can_wrongs(s, base):
    return [
        ('cans', 'The verb "can" never changes. There is no -s with he, she, it: "can".'),
        ('can to', f'After "can" we use the base form without "to": "can {base}".'),
        (f'{s.be} can', f'We do not use "{s.be}" before "can". Say "{s.text} can {base}".'),
    ]


def vf_can(rng):
    s, v = rng.choice(PERSONS), rng.choice(VERBS)
    base, third, ing, rest, rule = v
    cue = rng.choice(['very well', 'really well', 'quite well'])
    return choice('verb-form', [CAT_MODAL], f'Wow! {s.text} ___ {base} {rest} {cue}.', f'We use "can" to talk about ability: {s.lower} can {base}. "Can" is the same for every subject.',
                  'can', _can_wrongs(s, base), rng, 'modals', verb='can')


def vf_cant(rng):
    s, v = rng.choice(PERSONS), rng.choice(VERBS)
    base, third, ing, rest, rule = v
    wrongs = [
        ("don't can", f'We do not use "do" before "can". The negative of "can" is "can\'t" (or "cannot").'),
        ("can't to", f'After "can\'t" we use the base form without "to": "can\'t {base}".'),
        ('no can', '"no" cannot be used before a verb like this. The negative of "can" is "can\'t".'),
    ]
    return choice('verb-form', [CAT_MODAL], f'Sorry, {s.lower} ___ {base} {rest} today.', f'The negative of "can" is "can\'t": {s.lower} can\'t {base}.',
                  "can't", wrongs, rng, 'modals', verb='can')


def vf_can_question(rng):
    s, v = rng.choice(PERSONS), rng.choice(VERBS)
    base, third, ing, rest, rule = v
    wrongs = [
        ('Do', f'"Do" is a helper for normal verbs. A question with the modal verb "can" starts with "Can": "Can {s.lower} {base}...?".'),
        ('Does', f'"Does" is a helper for normal verbs. A question with "can" starts with "Can": "Can {s.lower} {base}...?".'),
        (('Is' if s.be == 'is' else ('Are' if s.be == 'are' else 'Am')), f'"{("Is" if s.be == "is" else ("Are" if s.be == "are" else "Am"))}" is a form of "be". A question about ability starts with "Can".'),
    ]
    return choice('verb-form', [CAT_MODAL], f'___ {s.lower} {base} {rest}?', f'A question about ability starts with "Can": Can {s.lower} {base} {rest}?',
                  'Can', wrongs, rng, 'modals', verb='can')


WOULD_ITEMS = ['a coffee', 'a glass of water', 'a pizza', 'a cup of tea', 'an apple', 'some bread', 'a sandwich', 'two tickets', 'a small salad', 'an orange juice']


def vf_would_like(rng):
    s = rng.choice(['I', 'We'])
    item = rng.choice(WOULD_ITEMS)
    wrongs = [
        ('like', '"like" talks about things you enjoy in general. To ask politely for something now we say "would like".'),
        ('am like' if s == 'I' else 'are like', f'"{"am" if s == "I" else "are"} like" means "similar to". To ask for something politely we say "would like".'),
        ('would to like', '"would" is followed by the base form without "to": "would like".'),
    ]
    return choice('verb-form', [CAT_MODAL], f'{s} ___ {item}, please.', f'"I would like" is a polite way to ask for something: {s} would like {item}, please.',
                  'would like', wrongs, rng, 'modals', verb='would like')


def vc_can(rng):
    s, v = rng.choice(PERSONS), rng.choice(VERBS)
    base, third, ing, rest, rule = v
    neg = rng.random() < 0.4
    cn = "can't" if neg else 'can'
    wr = {third: f'After "{cn}" we always use the base form, never -s: "{base}".',
          ing: f'After "{cn}" we use the base form, not -ing: "{base}".',
          f'to {base}': f'After "{cn}" we do not use "to": "{cn} {base}".'}
    if third == base:
        return None
    return gap('verb-conjugate', [CAT_MODAL], 'Write the correct form of the verb in brackets.',
               f'After "can" and "can\'t" we use the base form of the verb: {s.lower} {cn} {base}.',
               f'{s.text} {cn} ___ ({base}) {rest}.', [base], wr, 'modals')


def mc_can(rng):
    s, v = rng.choice(PERSONS), rng.choice(VERBS)
    base, third, ing, rest, rule = v
    cue = rng.choice(['very well', 'really well', 'quite well', 'fast'])
    wrongs = [('cans', 'The verb "can" never changes. There is no -s with he, she, it: "can".'),
              (f'{s.be} can', f'We do not use "{s.be}" before "can". Say "{s.text} can {base}".')]
    return choice('multiple-choice', [CAT_MODAL], f'{s.text} ___ {base} {rest} {cue}.', f'We use "can" to talk about ability: {s.lower} can {base}.',
                  'can', wrongs, rng, 'modals')


def fb_can(rng):
    s, v = rng.choice(PERSONS), rng.choice(VERBS)
    base, third, ing, rest, rule = v
    if rng.random() < 0.5:
        text, ans = f'Wow! {s.text} ___ {base} {rest} very well.', 'can'
        wr = {'cans': 'The verb "can" never changes. There is no -s with he, she, it: "can".', f'{s.be}': f'We do not use "{s.be}" before "{base}" here. The modal verb "can" shows ability.'}
    else:
        text, ans = f'Sorry, {s.lower} ___ {base} {rest} today.', "can't"
        wr = {"don't": 'We do not use "do" before "can". The negative of "can" is "can\'t".', 'no': '"no" cannot be used before a verb like this. The negative of "can" is "can\'t".'}
    return gap('fill-blank', [CAT_MODAL], 'Write can or can\'t.', f'"Can" shows ability and "can\'t" shows no ability. The verb that follows stays in the base form.', text, [ans], wr, 'modals')


def sc_can(rng):
    s, v = rng.choice(PERSONS), rng.choice(VERBS)
    base, third, ing, rest, rule = v
    if third == base:
        return None
    right = f'{s.text} can {base} {rest}.'
    w1 = f'{s.text} cans {base} {rest}.'
    w2 = f'{s.text} can {third} {rest}.'
    options = [right, w1, w2]
    rng.shuffle(options)
    wr = {str(options.index(w1)): 'The verb "can" never changes. There is no -s with he, she, it: "can".',
          str(options.index(w2)): f'After "can" we use the base form of the verb, never -s: "{base}".'}
    return new_question(LEVEL, 'sentence-choice', 'modals', [CAT_MODAL], 'Which sentence is correct?',
                        f'We use can + base verb: "{right[:-1]}".', options=options, correct=options.index(right), wrongReasons=wr)


def wo_can(rng):
    s, v = rng.choice(PERSONS), rng.choice(VERBS)
    base, third, ing, rest, rule = v
    if rng.random() < 0.5:
        tokens = s.text.split() + ["can't" if rng.random() < 0.5 else 'can', base] + rest.split()
        sentence = ' '.join(tokens) + '.'
    else:
        tokens = ['Can'] + s.lower.split() + [base] + rest.split()
        sentence = ' '.join(tokens) + '?'
    return new_question(LEVEL, 'word-order', 'modals', [CAT_MODAL], 'Put the words in the correct order.',
                        f'The modal verb "can" comes before the base verb: "{sentence}"', words=scramble(tokens, rng, tokens), solutions=[tokens])


# ---- gerund / infinitive -----------------------------------------------------------------------------------

GER_OK = {'play', 'watch', 'study', 'go', 'wash', 'fly', 'cook', 'read', 'write', 'eat', 'drink', 'clean', 'listen', 'help', 'walk', 'swim', 'run',
          'sing', 'dance', 'make', 'take', 'ride', 'buy', 'paint', 'visit', 'draw', 'shop', 'use', 'work', 'call', 'open', 'meet', 'try'}
ING_VERBS = [('enjoy', 'enjoys'), ('love', 'loves'), ('like', 'likes'), ('hate', 'hates')]
TO_VERBS = [('want', 'wants'), ('need', 'needs'), ('hope', 'hopes'), ('decide', 'decides'), ('learn', 'learns'), ('plan', 'plans')]


def _ger_parts(rng):
    s = rng.choice(PERSONS)
    v = rng.choice([x for x in VERBS if x[0] in GER_OK])
    return s, v


def vf_gerund(rng):
    s, v = _ger_parts(rng)
    base, third, ing, rest, rule = v
    main, main3 = rng.choice(ING_VERBS)
    m = main3 if s.s3 else main
    wrongs = [(base, f'After "{main}" we use the -ing form: "{m} {ing}".'),
              (third, f'"{third}" is a present simple form. After "{main}" we use the -ing form: "{ing}".'),
              (f'to {ing}', f'"to {ing}" is wrong: after "to" we use the base form. After "{main}" we simply use -ing: "{ing}".')]
    if main in ('enjoy',):
        wrongs[2] = (f'to {base}', f'After "enjoy" we use the -ing form, not "to + verb": "{m} {ing}".')
    return choice('verb-form', [CAT_GER], f'{s.text} {m} ___ {rest}.', f'After enjoy, love, like and hate we can use the -ing form: {s.lower} {m} {ing}.',
                  ing, wrongs, rng, 'gerund', verb=base)


def vf_infinitive(rng):
    s, v = _ger_parts(rng)
    base, third, ing, rest, rule = v
    main, main3 = rng.choice(TO_VERBS)
    m = main3 if s.s3 else main
    wrongs = [(ing, f'After "{main}" we use "to + verb", not -ing: "{m} to {base}".'),
              (base, f'After "{main}" we need "to" before the verb: "{m} to {base}".'),
              (third, f'"{third}" is a present simple form. After "{main}" we use "to + base verb": "to {base}".')]
    return choice('verb-form', [CAT_GER], f'{s.text} {m} ___ {rest}.', f'After want, need, hope, decide, learn and plan we use "to + verb": {s.lower} {m} to {base}.',
                  f'to {base}', wrongs, rng, 'infinitive', verb=base)


def vc_gerund(rng):
    s, v = _ger_parts(rng)
    base, third, ing, rest, rule = v
    if rng.random() < 0.5:
        main, main3 = rng.choice(ING_VERBS)
        m = main3 if s.s3 else main
        wr = {base: f'After "{main}" we use the -ing form: "{ing}".', f'to {base}': f'After "{main}" we use -ing, not "to + verb": "{ing}".'}
        sp = wrong_ing(v)
        if sp and sp[0] not in wr:
            wr[sp[0]] = sp[1]
        return gap('verb-conjugate', [CAT_GER], 'Write the correct form of the verb in brackets.',
                   f'After enjoy, love, like and hate we can use the -ing form. {ING_RULE_TEXT[rule]}: {ing}.', f'{s.text} {m} ___ ({base}) {rest}.', [ing], wr, 'gerund')
    main, main3 = rng.choice(TO_VERBS)
    m = main3 if s.s3 else main
    wr = {ing: f'After "{main}" we use "to + verb", not -ing: "to {base}".', base: f'After "{main}" we need "to" before the verb: "to {base}".'}
    return gap('verb-conjugate', [CAT_GER], 'Write the correct form of the verb in brackets. Remember "to" if you need it.',
               f'After want, need, hope, decide, learn and plan we use "to + verb": to {base}.', f'{s.text} {m} ___ ({base}) {rest}.', [f'to {base}'], wr, 'infinitive')
