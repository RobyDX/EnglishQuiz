"""A1 phrasal verbs and confusing words."""
from core import new_question, scramble
from g_data import wrong_third, wrong_ing
from g_verbs import PERSONS, PERSONS3, choice, gap, CAT_PHR, LEVEL

CAT_CONF = 'confusing-words-word-formation'

# base, third, ing, particle, rest, meaning
PHRASALS = [
    ('get', 'gets', 'getting', 'up', "at seven o'clock", 'to leave your bed'),
    ('wake', 'wakes', 'waking', 'up', 'early on Sundays', 'to stop sleeping'),
    ('sit', 'sits', 'sitting', 'down', 'on the sofa', 'to move from standing to sitting'),
    ('stand', 'stands', 'standing', 'up', 'when the teacher comes in', 'to move from sitting to standing'),
    ('put', 'puts', 'putting', 'on', 'a warm coat', 'to dress yourself in clothes'),
    ('take', 'takes', 'taking', 'off', 'the shoes at the door', 'to remove clothes'),
    ('turn', 'turns', 'turning', 'on', 'the light in the kitchen', 'to start a light or a machine'),
    ('turn', 'turns', 'turning', 'off', 'the TV before bed', 'to stop a light or a machine'),
    ('come', 'comes', 'coming', 'in', 'through the front door', 'to enter a place'),
    ('go', 'goes', 'going', 'out', 'with friends on Friday', 'to leave your house to do something'),
    ('look', 'looks', 'looking', 'at', 'the pictures', 'to turn your eyes to something'),
    ('listen', 'listens', 'listening', 'to', 'the radio', 'to pay attention to a sound'),
    ('wait', 'waits', 'waiting', 'for', 'the bus', 'to stay until something happens'),
    ('look', 'looks', 'looking', 'for', 'the keys', 'to try to find something'),
    ('pick', 'picks', 'picking', 'up', 'the phone', 'to lift something'),
    ('switch', 'switches', 'switching', 'on', 'the computer', 'to start a machine'),
    ('clean', 'cleans', 'cleaning', 'up', 'the room', 'to make a place tidy'),
    ('come', 'comes', 'coming', 'back', 'home at six', 'to return to a place'),
    ('give', 'gives', 'giving', 'back', 'the book', 'to return something to its owner'),
    ('hurry', 'hurries', 'hurrying', 'up', 'in the morning', 'to be quick'),
    ('fill', 'fills', 'filling', 'in', 'the form', 'to write information on a form'),
    ('write', 'writes', 'writing', 'down', 'the new words', 'to put words on paper'),
    ('try', 'tries', 'trying', 'on', 'a new jacket', 'to put on clothes to see if they fit'),
    ('throw', 'throws', 'throwing', 'away', 'the old paper', 'to put something in the bin'),
    ('get', 'gets', 'getting', 'on', 'the bus at the station', 'to go onto a bus or a train'),
    ('get', 'gets', 'getting', 'off', 'the train in Rome', 'to leave a bus or a train'),
    ('look', 'looks', 'looking', 'up', 'the word in a dictionary', 'to search for information in a book'),
    ('go', 'goes', 'going', 'back', 'to school in September', 'to return to a place'),
    ('slow', 'slows', 'slowing', 'down', 'at the corner', 'to go more slowly'),
    ('speak', 'speaks', 'speaking', 'up', 'in class', 'to talk more loudly'),
    ('wash', 'washes', 'washing', 'up', 'after dinner', 'to clean the plates and cups'),
    ('cheer', 'cheers', 'cheering', 'up', 'a sad friend', 'to make someone feel happier'),
    ('hand', 'hands', 'handing', 'in', 'the homework', 'to give your work to a teacher'),
    ('grow', 'grows', 'growing', 'up', 'in a small town', 'to become an adult'),
]
PARTICLES = ['up', 'down', 'on', 'off', 'in', 'out', 'at', 'to', 'for', 'back', 'away']


def _form(s, e):
    return e[1] if s.s3 else e[0]


def _wrong_particles(e, rng, k=2):
    return rng.sample([p for p in PARTICLES if p != e[3]], k)


def vc_phrasal(rng):
    s, e = rng.choice(PERSONS), rng.choice(PHRASALS)
    base, third, ing, part, rest, meaning = e
    right = _form(s, e)
    other = base if s.s3 else third
    other_msg = (f'"{base}" is the base form. With "{s.text}" the verb needs -s/-es/-ies: "{third}".' if s.s3
                 else f'"{third}" has an -s ending, which is only for he, she, it and one person or thing. With "{s.text}" use "{base}".')
    wr = {other: other_msg, ing: f'"{ing}" needs "{s.be}" before it. A routine uses the present simple: "{right}".'}
    sp = wrong_third((base, third, ing, '', 'regular'))
    if s.s3 and sp and sp[0] not in wr and sp[0] != third:
        wr[sp[0]] = sp[1]
    return gap('verb-conjugate', [CAT_PHR], 'Write the correct form of the verb in brackets.',
               f'"{base} {part}" means {meaning}. In the present simple, {s.lower} {right} {part}.',
               f'{s.text} usually ___ ({base}) {part} {rest}.', [right], wr, 'phrasal-verbs')


def vf_phrasal(rng):
    s, e = rng.choice(PERSONS), rng.choice(PHRASALS)
    base, third, ing, part, rest, meaning = e
    right = _form(s, e)
    other = base if s.s3 else third
    aux = 'does' if s.s3 else 'do'
    wrongs = [
        (other, f'"{other}" is the wrong form for "{s.text}". With he, she, it and one person the verb takes -s/-es/-ies; with I, you, we, they and plural subjects it does not.'),
        (f'{s.be} {ing}', f'"{s.be} {ing}" is the present continuous (now). "usually" shows a routine, so we use the present simple: "{right}".'),
        (f'{aux} {base}', f'"{aux} {base}" is used in questions and negatives. A positive sentence uses "{right}".'),
    ]
    return choice('verb-form', [CAT_PHR], f'{s.text} usually ___ {part} {rest}.', f'"{base} {part}" means {meaning}: {s.lower} {right} {part}.',
                  right, wrongs, rng, 'phrasal-verbs', verb=base)


def mc_phrasal(rng):
    s, e = rng.choice(PERSONS), rng.choice(PHRASALS)
    base, third, ing, part, rest, meaning = e
    right = _form(s, e)
    wrongs = [(w, f'"{base} {w}" does not mean "{meaning}". For this meaning we say "{base} {part}".') for w in _wrong_particles(e, rng)]
    return choice('multiple-choice', [CAT_PHR], f'{s.text} {right} ___ {rest}. ({meaning[0].upper() + meaning[1:]})', f'"{base} {part}" means {meaning}.',
                  part, wrongs, rng, 'phrasal-verbs')


def fb_phrasal(rng):
    s, e = rng.choice(PERSONS), rng.choice(PHRASALS)
    base, third, ing, part, rest, meaning = e
    right = _form(s, e)
    wr = {w: f'"{base} {w}" does not mean "{meaning}". For this meaning we say "{base} {part}".' for w in _wrong_particles(e, rng)}
    return gap('fill-blank', [CAT_PHR], f'Complete the phrasal verb. It means: {meaning}.', f'"{base} {part}" means {meaning}.',
               f'{s.text} {right} ___ {rest}.', [part], wr, 'phrasal-verbs')


def sc_phrasal(rng):
    s, e = rng.choice(PERSONS), rng.choice(PHRASALS)
    base, third, ing, part, rest, meaning = e
    right = _form(s, e)
    wrong_part = _wrong_particles(e, rng, 1)[0]
    other = base if s.s3 else third
    ok = f'{s.text} {right} {part} {rest}.'
    w1 = f'{s.text} {right} {wrong_part} {rest}.'
    w2 = f'{s.text} {other} {part} {rest}.'
    options = [ok, w1, w2]
    rng.shuffle(options)
    wr = {str(options.index(w1)): f'"{base} {wrong_part}" does not mean "{meaning}". We say "{base} {part}".',
          str(options.index(w2)): f'"{other}" is the wrong form for "{s.text}": we need "{right}".'}
    return new_question(LEVEL, 'sentence-choice', 'phrasal-verbs', [CAT_PHR], 'Which sentence is correct?',
                        f'"{base} {part}" means {meaning}.', options=options, correct=options.index(ok), wrongReasons=wr)


def wo_phrasal(rng):
    s, e = rng.choice(PERSONS), rng.choice(PHRASALS)
    base, third, ing, part, rest, meaning = e
    right = _form(s, e)
    tokens = s.text.split() + [right, part] + rest.split()
    return new_question(LEVEL, 'word-order', 'phrasal-verbs', [CAT_PHR], 'Put the words in the correct order.',
                        f'The verb and its particle stay together: "{" ".join(tokens)}." The phrase "{base} {part}" means {meaning}.',
                        words=scramble(tokens, rng, tokens), solutions=[tokens])


# ---- confusing words -------------------------------------------------------------------------------------------

MEANING = {
    'to': 'towards a place, or before a verb (to school, to play)', 'too': 'also, or more than you need (too tired)', 'two': 'the number 2',
    'there': 'in that place, or used in "there is / there are"', 'their': 'belonging to them (their teacher)', "they're": 'the short form of "they are"',
    'your': 'belonging to you (your bag)', "you're": 'the short form of "you are"', 'its': 'belonging to it (its food)', "it's": 'the short form of "it is"',
    'here': 'in this place', 'hear': 'to notice a sound with your ears', 'right': 'correct, or the opposite of left', 'write': 'to put words on paper',
    'buy': 'to get something with money', 'by': 'next to, or with (by bus)', 'bye': 'a short word for goodbye', 'know': 'to have information in your head',
    'no': 'the opposite of yes, or zero (no milk)', 'sea': 'the big area of salt water', 'see': 'to notice with your eyes', 'sun': 'the star that gives us light',
    'son': 'your male child', 'meet': 'to see someone for the first time, or by plan', 'meat': 'food from animals, like beef', 'wear': 'to have clothes on your body',
    'where': 'in what place', 'week': 'seven days', 'weak': 'not strong', 'our': 'belonging to us', 'hour': 'sixty minutes', 'for': 'to show who gets something (a gift for you)',
    'four': 'the number 4', 'new': 'not old', 'knew': 'the past of know', 'bee': 'an insect that makes honey', 'be': 'the base form of am, is and are',
    'eye': 'the part of the body you see with', 'I': 'the word you use for yourself', 'made': 'the past of make', 'maid': 'a woman who cleans a hotel',
    'one': 'the number 1', 'won': 'the past of win', 'tail': 'the long part at the back of an animal', 'tale': 'a story', 'wait': 'to stay until something happens',
    'weight': 'how heavy something is', 'blue': 'the colour of the sky', 'blew': 'the past of blow', 'flower': 'the colourful part of a plant', 'flour': 'the white powder used for bread',
    'plain': 'simple, without decoration', 'plane': 'a vehicle that flies', 'dear': 'a word used at the start of a letter', 'deer': 'an animal with antlers',
    'hair': 'the thin threads on your head', 'hare': 'an animal like a big rabbit', 'pair': 'two things together', 'pear': 'a sweet fruit',
    'bored': 'not interested', 'board': 'a flat piece of wood or the teacher\'s writing surface', 'ate': 'the past of eat', 'eight': 'the number 8',
    'do': 'to perform an action or task (do homework)', 'make': 'to create or build something (make a cake)', 'does': 'the he/she/it form of do',
    'makes': 'the he/she/it form of make', 'go': 'to move from one place to another', 'be': 'the base form of am, is and are',
    'look': 'to turn your eyes to something (look at)', 'watch': 'to look at something that moves, for a time (watch TV)', 'see': 'to notice with your eyes',
    'listen': 'to pay attention to a sound (listen to music)', 'hear': 'to notice a sound with your ears', 'say': 'to speak words (say hello)', 'tell': 'to give information to someone (tell me)',
    'are': 'a form of be (you are, they are)', 'at': 'used for clock times and exact places (at seven, at the door)', 'blow': 'to send air out of your mouth', 'deep': 'going far down',
    'far': 'a long way away', 'floor': 'the surface of a room that you walk on', 'her': 'belonging to a woman, or the object form of she', 'it': 'the word for a thing or an animal',
    'mad': 'very angry', 'mate': 'a friend', 'now': 'at this moment', 'on': 'touching the top of a surface', 'plan': 'an idea about what to do', 'she': 'the word for a woman or girl',
    'sound': 'something that you hear', 'tall': 'high (a tall man)', 'way': 'a road or a path', 'were': 'the past of are', 'you': 'the word for the person you speak to',
    'bore': 'to make someone feel bored', 'weed': 'a wild plant that you do not want in a garden', 'night': 'the dark part of the day', 'light': 'what lets you see; not heavy',
    'pen': 'a tool with ink for writing', 'been': 'the past participle of be',
    'speak': 'to use your voice to talk a language', 'much': 'used with uncountable nouns (much milk)', 'many': 'used with plural countable nouns (many apples)', 'a': 'used before one countable thing',
}

# sentence with a blank, right word, wrong candidates
HOMO_ROWS = [
    ('I have ___ brothers.', 'two', ['to', 'too']), ('She is ___ tired to play today.', 'too', ['to', 'two']), ('I go ___ school by bus.', 'to', ['too', 'two']),
    ('We want ___ visit the museum.', 'to', ['too', 'two']), ('This soup is ___ hot to eat.', 'too', ['to', 'two']), ('I buy ___ apples at the market.', 'two', ['to', 'too']),
    ('___ is a cat on the sofa.', 'There', ['Their', "They're"]), ('The children love ___ teacher.', 'their', ['there', "they're"]), ("___ my best friends.", "They're", ['There', 'Their']),
    ('My parents say ___ house is very old.', 'their', ['there', "they're"]), ('Look! ___ is a bird in the tree.', 'There', ['Their', "They're"]),
    ("I think ___ in the garden now.", "they're", ['there', 'their']), ('___ bag is on the chair.', 'Your', ["You're", 'Here']), ("___ very kind to me.", "You're", ['Your', 'Her']),
    ('Is this ___ pencil case?', 'your', ["you're", 'hear']), ("Tom, ___ late for school!", "you're", ['your', 'you']), ('The dog wants ___ food.', 'its', ["it's", 'it']),
    ("___ a sunny day today.", "It's", ['Its', 'It']), ('The cat washes ___ face.', 'its', ["it's", 'it']), ("I think ___ going to rain.", "it's", ['its', 'it']),
    ('Come ___, please!', 'here', ['hear', 'her']), ('I can ___ a noise outside.', 'hear', ['here', 'her']), ('Turn ___ at the corner.', 'right', ['write', 'night']),
    ('Please ___ your name on the paper.', 'write', ['right', 'light']), ('Is this answer ___ or wrong?', 'right', ['write', 'night']), ('I ___ bread at the bakery.', 'buy', ['by', 'bye']),
    ('I go to school ___ bus.', 'by', ['buy', 'bye']), ('Goodbye! ___ !', 'Bye', ['By', 'Buy']), ('I ___ the answer to this question.', 'know', ['no', 'now']),
    ('There is ___ milk in the fridge.', 'no', ['know', 'now']), ('Do you ___ my brother?', 'know', ['no', 'knew']), ('We swim in the ___ in summer.', 'sea', ['see', 'she']),
    ('I can ___ a big ship.', 'see', ['sea', 'she']), ('My ___ is five years old.', 'son', ['sun', 'sound']), ('The ___ is hot in July.', 'sun', ['son', 'sound']),
    ('Nice to ___ you!', 'meet', ['meat', 'mate']), ('I do not eat ___.', 'meat', ['meet', 'mate']), ('___ is the station, please?', 'Where', ['Wear', 'Were']),
    ('I ___ a coat in winter.', 'wear', ['where', 'were']), ('I have English class once a ___.', 'week', ['weak', 'weed']), ('The baby is ___ and cannot walk yet.', 'weak', ['week', 'weed']),
    ('___ house is next to the park.', 'Our', ['Hour', 'Are']), ('The lesson lasts one ___.', 'hour', ['our', 'are']), ('This present is ___ you.', 'for', ['four', 'far']),
    ('I have ___ cats.', 'four', ['for', 'far']), ('I like my ___ shoes.', 'new', ['knew', 'now']), ('We keep a ___ in the garden for honey.', 'bee', ['be', 'been']),
    ('I want to ___ a doctor.', 'be', ['bee', 'by']), ('She has a ___ shirt.', 'blue', ['blew', 'blow']), ('The wind ___ my hat away.', 'blew', ['blue', 'blow']),
    ('The dog wags its ___.', 'tail', ['tale', 'tall']), ('My mother tells me a ___ at night.', 'tale', ['tail', 'tall']), ('Please ___ for me at the station.', 'wait', ['weight', 'way']),
    ('A baby has a small ___.', 'weight', ['wait', 'way']), ('I put ___ in the bread.', 'flour', ['flower', 'floor']), ('She gives me a red ___.', 'flower', ['flour', 'floor']),
    ('We travel by ___ to Spain.', 'plane', ['plain', 'plan']), ('A ___ is a very simple dress.', 'plain', ['plane', 'plan']), ('A ___ lives in the forest.', 'deer', ['dear', 'deep']),
    ('___ Anna, thank you for the gift.', 'Dear', ['Deer', 'Deep']), ('She brushes her long ___.', 'hair', ['hare', 'her']), ('A ___ is a pair of shoes.', 'pair', ['pear', 'pen']),
    ('I eat a sweet ___ for dessert.', 'pear', ['pair', 'pen']), ('I ___ breakfast at seven this morning.', 'ate', ['eight', 'at']), ('I have ___ books on my desk.', 'eight', ['ate', 'at']),
    ('The teacher writes on the ___.', 'board', ['bored', 'bore']), ('I am ___ in this lesson.', 'bored', ['board', 'bore']), ('She ___ a cake for my birthday.', 'made', ['maid', 'mad']),
    ('I have ___ brother and one sister.', 'one', ['won', 'on']), ('Our team ___ the match yesterday.', 'won', ['one', 'on']),
]

FRAMES_DOMAKE = ['I ___ {c} every day.', 'We ___ {c} on Saturdays.', 'They ___ {c} after school.', 'I never ___ {c} in the evening.']
DO_COLL = ['my homework', 'the dishes', 'the shopping', 'my best', 'the washing', 'some exercise', 'the cleaning', 'the ironing', 'sport', 'a job']
MAKE_COLL = ['a cake', 'a mistake', 'breakfast', 'the bed', 'a phone call', 'a noise', 'a plan', 'friends', 'a cup of tea', 'a sandwich', 'a drawing', 'lunch', 'money', 'a salad']
VERB_ROWS = [
    ('___ at me, please!', 'Look', ['Watch', 'See']), ('I ___ TV every evening.', 'watch', ['look', 'see']), ("I can't ___ without my glasses.", 'see', ['look', 'watch']),
    ('___ at the picture on the wall.', 'Look', ['Watch', 'See']), ('We ___ cartoons on Saturday morning.', 'watch', ['look', 'see']), ('Can you ___ the bus? Is it coming?', 'see', ['look', 'watch']),
    ('I like to ___ to music on the bus.', 'listen', ['hear', 'see']), ('I can ___ a noise outside.', 'hear', ['listen', 'look']), ('Please ___ to the teacher.', 'listen', ['hear', 'look']),
    ("I can't ___ you. It is too noisy.", 'hear', ['listen', 'look']), ('Please ___ me your name.', 'tell', ['say', 'speak']), ('I ___ hello to my teacher every day.', 'say', ['tell', 'speak']),
    ('Can you ___ me the time?', 'tell', ['say', 'speak']), ('We ___ good morning to our neighbours.', 'say', ['tell', 'speak']), ('I ___ English and Spanish.', 'speak', ['say', 'tell']),
    ('Please ___ slowly, I am learning English.', 'speak', ['say', 'tell']),
    ('How ___ apples do you want?', 'many', ['much', 'a']), ('How ___ milk do you want?', 'much', ['many', 'a']), ('How ___ friends do you have?', 'many', ['much', 'a']),
    ('How ___ money do you have?', 'much', ['many', 'a']), ('There are not ___ chairs in the room.', 'many', ['much', 'a']), ('There is not ___ water in the bottle.', 'much', ['many', 'a']),
    ('How ___ eggs do we need?', 'many', ['much', 'a']), ('How ___ time do we have?', 'much', ['many', 'a']), ('How ___ brothers do you have?', 'many', ['much', 'a']),
    ('How ___ rice do you eat?', 'much', ['many', 'a']), ('How ___ pens are in your bag?', 'many', ['much', 'a']), ('How ___ juice is in the glass?', 'much', ['many', 'a']),
]


def _reason(wrong, right):
    w = wrong.lower().rstrip('-')
    r = right.lower()
    return f'"{wrong}" means {MEANING.get(w, "something different")}. Here we need "{right}", which means {MEANING.get(r, "the right word")}.'


def _row_ok(row):
    sent, right, wrongs = row
    return all(w.lower() in MEANING for w in wrongs) and right.lower() in MEANING


def _usable(rows):
    return [r for r in rows if _row_ok(r)]


def conf_rows():
    rows = _usable(HOMO_ROWS + VERB_ROWS)
    for c in DO_COLL:
        for f in FRAMES_DOMAKE:
            rows.append((f.format(c=c), 'do', ['make', 'go']))
    for c in MAKE_COLL:
        for f in FRAMES_DOMAKE:
            rows.append((f.format(c=c), 'make', ['do', 'be']))
    return rows


def _row_reasons(row, rng, kind):
    sent, right, wrongs = row
    if sent.count('___') != 1:
        return None
    if kind == 'domake':
        pass
    return {w: _reason(w, right) for w in wrongs}


def _collocation_reason(row, wrong):
    sent, right, wrongs = row
    coll = sent.split('___')[1].strip(' .')
    for lead in ('every day', 'on Saturdays', 'after school', 'in the evening'):
        coll = coll.replace(lead, '').strip()
    return f'We say "{right} {coll}", not "{wrong} {coll}".'


def _is_domake(row):
    return row[1] in ('do', 'make') and row[2][0] in ('make', 'do')


def conf_reason(row, wrong):
    if _is_domake(row):
        return _collocation_reason(row, wrong)
    return _reason(wrong, row[1])


def conf_mc(row, rng):
    sent, right, wrongs = row
    options = [right] + wrongs
    rng.shuffle(options)
    wr = {str(options.index(w)): conf_reason(row, w) for w in wrongs}
    return new_question(LEVEL, 'multiple-choice', 'confusing-words', [CAT_CONF], sent, f'"{right}" is the word that fits here: it means {MEANING.get(right.lower(), "the right word")}.',
                        options=options, correct=options.index(right), wrongReasons=wr)


def conf_fb(row, rng):
    sent, right, wrongs = row
    wr = {w: conf_reason(row, w) for w in wrongs}
    return gap('fill-blank', [CAT_CONF], 'Complete the sentence with the correct word.', f'"{right}" is the word that fits here: it means {MEANING.get(right.lower(), "the right word")}.',
               sent, [right], wr, 'confusing-words')


def conf_wb(row, rng):
    sent, right, wrongs = row
    bank = [right] + wrongs
    rng.shuffle(bank)
    wr = {w: conf_reason(row, w) for w in wrongs}
    return new_question(LEVEL, 'word-bank', 'confusing-words', [CAT_CONF], 'Complete the sentence with words from the box.',
                        f'"{right}" is the word that fits here: it means {MEANING.get(right.lower(), "the right word")}.', bank=bank, text=sent, answers=[right], wrongReasons=wr)


def conf_sc(row, rng):
    sent, right, wrongs = row
    good = sent.replace('___', right)
    bad = [sent.replace('___', w) for w in wrongs]
    options = [good] + bad
    rng.shuffle(options)
    wr = {str(options.index(sent.replace('___', w))): conf_reason(row, w) for w in wrongs}
    return new_question(LEVEL, 'sentence-choice', 'confusing-words', [CAT_CONF], 'Which sentence is correct?',
                        f'"{right}" is the word that fits here: it means {MEANING.get(right.lower(), "the right word")}.', options=options, correct=options.index(good), wrongReasons=wr)


def vf_domake(rng):
    s = rng.choice(PERSONS)
    right = rng.choice(['do', 'make'])
    c = rng.choice(DO_COLL if right == 'do' else MAKE_COLL)
    other = 'make' if right == 'do' else 'do'
    third = {'do': 'does', 'make': 'makes'}
    form = lambda v: third[v] if s.s3 else v
    adv = rng.choice(['every day', 'on Saturdays', 'after school', 'every weekend'])
    go = 'goes' if s.s3 else 'go'
    wrongs = [
        (form(other), f'We say "{right} {c}", not "{other} {c}".'),
        (go, f'"{go}" does not combine with "{c}". We say "{right} {c}".'),
        (f'{s.be} {"doing" if right == "do" else "making"}', f'"{s.be} {"doing" if right == "do" else "making"}" is the present continuous (an action now). "{adv}" shows a habit, so we use "{form(right)}".'),
    ]
    return choice('verb-form', [CAT_CONF], f'{s.text} ___ {c} {adv}.', f'We say "{right} {c}": it is a fixed phrase. "{right}" means {MEANING[right]}.',
                  form(right), wrongs, rng, 'confusing-words', verb=right)
