"""A1 articles, pronouns, adjectives and prepositions as rows (sentence with a blank + wrong words with reasons)."""
from rows import Row
from core import a_an

CAT_ART, CAT_PRON, CAT_ADJ, CAT_PREP = 'articles-determiners', 'pronouns-relative-clauses', 'adjectives-adverbs', 'prepositions'

CONS_NOUNS = ['book', 'cat', 'dog', 'house', 'car', 'table', 'bag', 'pen', 'school', 'bike', 'ball', 'chair', 'door', 'flower', 'girl', 'boy', 'teacher',
              'phone', 'window', 'garden', 'tree', 'bed', 'clock', 'cup', 'plate', 'hat', 'shirt', 'king', 'lamp', 'map', 'pencil', 'picture', 'radio', 'ruler',
              'sandwich', 'shop', 'star', 'street', 'town', 'train', 'bus', 'box', 'bridge', 'cake', 'cow', 'dress', 'farm', 'film', 'fish', 'game', 'horse', 'key',
              'letter', 'nurse', 'park', 'pizza', 'queen', 'river', 'room', 'sofa', 'song', 'story', 'ticket', 'toy', 'village', 'watch', 'wall', 'zoo', 'banana',
              'monkey', 'lion', 'dentist', 'doctor', 'singer', 'tent', 'tiger', 'tomato', 'towel', 'wolf', 'yacht', 'university', 'uniform', 'unit', 'European',
              'jacket', 'kitchen', 'mirror', 'paper', 'pig', 'rabbit', 'rose', 'sock', 'spoon', 'bottle', 'carrot', 'desk', 'duck', 'goat', 'guitar', 'piano']
VOWEL_NOUNS = ['apple', 'egg', 'orange', 'umbrella', 'elephant', 'ice cream', 'office', 'engine', 'eagle', 'arm', 'ant', 'actor', 'artist', 'animal', 'aunt',
               'uncle', 'idea', 'island', 'insect', 'invitation', 'envelope', 'exam', 'answer', 'airport', 'address', 'owl', 'onion', 'omelette', 'hour',
               'orchestra', 'ambulance', 'eye', 'ear', 'elbow', 'orange juice', 'old man', 'open door', 'easy question', 'empty box', 'interesting book']
Y_SOUND = {'university', 'uniform', 'unit', 'European', 'yacht'}  # start with a consonant sound, or special
SILENT_H = {'hour'}


def art_sound_reason(noun, wrong):
    art = a_an(noun)
    if wrong == 'a' and art == 'an':
        if noun in SILENT_H:
            return f'"a" is used before a consonant sound. In "{noun}" the "h" is silent, so the word starts with a vowel sound: "an {noun}".'
        return f'"a" is used before a consonant sound. "{noun}" starts with a vowel sound, so we say "an {noun}".'
    if wrong == 'an' and art == 'a':
        if noun in Y_SOUND and noun[0] in 'uUeE':
            return f'"an" is used before a vowel sound. "{noun}" starts with a "y" sound (a consonant sound), so we say "a {noun}".'
        return f'"an" is used before a vowel sound. "{noun}" starts with a consonant sound, so we say "a {noun}".'
    return None


AAN_FRAMES = ['There is ___ {n} in the garden.', 'There is ___ {n} in my bag.', 'There is ___ {n} on the table.', 'There is ___ {n} behind the door.',
              'There is ___ {n} in the kitchen.', 'There is ___ {n} under the bed.', 'Is there ___ {n} in the room?', "There isn't ___ {n} in the box.",
              'There is ___ {n} next to the window.', 'There is ___ {n} near the park.']


def art_aan(rng):
    n = rng.choice(CONS_NOUNS + VOWEL_NOUNS)
    art = a_an(n)
    frame = rng.choice(AAN_FRAMES)
    other = 'an' if art == 'a' else 'a'
    sent = frame.format(n=n)
    wrongs = [(other, art_sound_reason(n, other)),
              ('the', f'"the" is used for a specific thing that both people already know. "There is" introduces something new, so we use "{art}" before "{n}".')]
    expl = f'Use "{art}" before {"a vowel" if art == "an" else "a consonant"} sound: {art} {n}.'
    return Row(sent, art, wrongs, expl, 'articles', CAT_ART)


SECOND_ADJ = ['big', 'small', 'old', 'new', 'red', 'black', 'brown', 'nice', 'blue', 'cheap']
SECOND_NOUNS = ['dog', 'cat', 'bike', 'car', 'house', 'bag', 'book', 'ball', 'hat', 'shirt', 'cake', 'pen', 'clock', 'lamp', 'phone', 'toy', 'kite', 'coat',
                'table', 'chair', 'apple', 'egg', 'umbrella', 'orange', 'elephant', 'owl']
UNIQUE = ['sun', 'moon', 'sky', 'world', 'Earth', 'sea', 'ground', 'weather']
UNIQUE_FRAMES = ['___ {n} is very {adj} today.', 'Look at ___ {n}! It is so {adj}.']
UNIQUE_ADJ = {'sun': ['hot', 'bright'], 'moon': ['bright', 'beautiful'], 'sky': ['blue', 'grey'], 'world': ['big', 'beautiful'],
              'Earth': ['round', 'beautiful'], 'sea': ['blue', 'cold'], 'ground': ['wet', 'hard'], 'weather': ['nice', 'cold']}


def art_the(rng):
    if rng.random() < 0.7:
        n = rng.choice(SECOND_NOUNS)
        adj = rng.choice(SECOND_ADJ)
        first = a_an(n)
        sent = f'I have {first} {n}. ___ {n} is {adj}.'
        wrongs = [('A', f'"A" is used for something new. The {n} was already mentioned, so we use "The".'),
                  ('An', f'"An" is used for something new before a vowel sound. The {n} was already mentioned, so we use "The".')]
        expl = f'Use "the" for something that was already mentioned: I have {first} {n}. The {n} is {adj}.'
        return Row(sent, 'The', wrongs, expl, 'articles', CAT_ART)
    n = rng.choice(UNIQUE)
    adj = rng.choice(UNIQUE_ADJ[n])
    frame = rng.choice(UNIQUE_FRAMES)
    wrongs = [('A', f'"A" is used for one of many things. There is only one {n}, so we use "The".'),
              ('An', f'"An" is used for one of many things before a vowel sound. There is only one {n}, so we use "The".')]
    return Row(frame.format(n=n.lower() if n != 'Earth' else n, adj=adj), 'The', wrongs, f'Use "the" for something unique: the {n.lower() if n != "Earth" else n}.', 'articles', CAT_ART)


COUNT_PL = ['apples', 'books', 'eggs', 'chairs', 'friends', 'pens', 'shoes', 'bananas', 'cats', 'flowers', 'sandwiches', 'toys', 'tomatoes', 'cups', 'bags', 'stamps', 'photos']
UNCOUNT = ['milk', 'water', 'bread', 'rice', 'juice', 'sugar', 'money', 'cheese', 'butter', 'soup', 'coffee', 'tea', 'paper', 'homework']


def art_some_any(rng):
    n = rng.choice(COUNT_PL + UNCOUNT)
    kind = 'plural' if n in COUNT_PL else 'uncountable'
    mode = rng.choice(['aff', 'neg', 'q', 'offer'])
    if mode == 'aff':
        sent, right, other = f'I have ___ {n}.', 'some', 'any'
    elif mode == 'neg':
        sent, right, other = f"There aren't ___ {n}." if kind == 'plural' else f"There isn't ___ {n}.", 'any', 'some'
    elif mode == 'q':
        sent, right, other = f'Do you have ___ {n}?', 'any', 'some'
    else:
        sent, right, other = f'Would you like ___ {n}?', 'some', 'any'
    reasons = {'any': '"any" is used in negative sentences and in questions. In a positive sentence (or an offer) we use "some".',
               'some': '"some" is used in positive sentences and offers. In negatives and questions we use "any".'}
    wrongs = [(other, reasons[other]), ('a', f'"a" is only for one countable thing. "{n}" is {"plural" if kind == "plural" else "uncountable"}, so we use "some" or "any".')]
    expl = f'Use "{right}" here: "some" is for positive sentences and offers, "any" is for negatives and questions.'
    return Row(sent, right, wrongs, expl, 'some-any', CAT_ART)


THIS_NOUNS = ['book', 'pen', 'bag', 'car', 'chair', 'house', 'phone', 'apple', 'hat', 'coat', 'bike', 'dog', 'cat', 'picture', 'ball', 'key', 'cake', 'cup']
PLURALS = {'book': 'books', 'pen': 'pens', 'bag': 'bags', 'car': 'cars', 'chair': 'chairs', 'house': 'houses', 'phone': 'phones', 'apple': 'apples', 'hat': 'hats',
           'coat': 'coats', 'bike': 'bikes', 'dog': 'dogs', 'cat': 'cats', 'picture': 'pictures', 'ball': 'balls', 'key': 'keys', 'cake': 'cakes', 'cup': 'cups'}
DESC = {'This': 'one thing that is near', 'That': 'one thing that is far', 'These': 'two or more things that are near', 'Those': 'two or more things that are far'}


def art_this_that(rng):
    n = rng.choice(THIS_NOUNS)
    right = rng.choice(['This', 'That', 'These', 'Those'])
    noun = PLURALS[n] if right in ('These', 'Those') else n
    place = 'here' if right in ('This', 'These') else 'over there'
    verb = 'are' if right in ('These', 'Those') else 'is'
    sent = f'___ {noun} {place} {verb} mine.'
    wrongs = [(w, f'"{w}" is for {DESC[w]}. Here we have {DESC[right]}, so we use "{right}".') for w in ('This', 'That', 'These', 'Those') if w != right]
    rng.shuffle(wrongs)
    return Row(sent, right, wrongs, f'"{right}" is for {DESC[right]}.', 'this-that', CAT_ART)


PLURAL_TABLE = [  # singular, plural, rule
    ('book', 'books', 'regular'), ('bus', 'buses', 'es'), ('box', 'boxes', 'es'), ('watch', 'watches', 'es'), ('dish', 'dishes', 'es'), ('class', 'classes', 'es'),
    ('church', 'churches', 'es'), ('glass', 'glasses', 'es'), ('brush', 'brushes', 'es'), ('baby', 'babies', 'ies'), ('city', 'cities', 'ies'),
    ('country', 'countries', 'ies'), ('story', 'stories', 'ies'), ('party', 'parties', 'ies'), ('family', 'families', 'ies'), ('fly', 'flies', 'ies'),
    ('leaf', 'leaves', 'ves'), ('knife', 'knives', 'ves'), ('wife', 'wives', 'ves'), ('wolf', 'wolves', 'ves'), ('shelf', 'shelves', 'ves'), ('life', 'lives', 'ves'),
    ('man', 'men', 'irregular'), ('woman', 'women', 'irregular'), ('child', 'children', 'irregular'), ('foot', 'feet', 'irregular'), ('tooth', 'teeth', 'irregular'),
    ('mouse', 'mice', 'irregular'), ('person', 'people', 'irregular'), ('sheep', 'sheep', 'same'), ('fish', 'fish', 'same'), ('tomato', 'tomatoes', 'es'),
    ('potato', 'potatoes', 'es'), ('toy', 'toys', 'regular'), ('day', 'days', 'regular'), ('key', 'keys', 'regular'), ('boy', 'boys', 'regular'), ('tree', 'trees', 'regular'),
    ('girl', 'girls', 'regular'), ('dress', 'dresses', 'es'), ('beach', 'beaches', 'es'), ('lady', 'ladies', 'ies'), ('hobby', 'hobbies', 'ies'), ('diary', 'diaries', 'ies'),
    ('thief', 'thieves', 'ves'), ('half', 'halves', 'ves'), ('goose', 'geese', 'irregular'), ('photo', 'photos', 'regular'), ('piano', 'pianos', 'regular'), ('zoo', 'zoos', 'regular'),
]
PLURAL_RULES = {'regular': 'Most nouns just add -s', 'es': 'Nouns that end in -s, -x, -ch, -sh or -o add -es', 'ies': 'After a consonant, -y changes to -ies',
                'ves': 'Many nouns ending in -f or -fe change to -ves', 'irregular': 'This is an irregular plural: you have to learn it', 'same': 'This noun has the same form in the plural'}
PLURAL_FRAMES = ['There are three ___ in the room.', 'I can see many ___ in the picture.', 'We have two ___ at home.', 'She has four ___.', 'Look at the ___!',
                 'There are some ___ in the garden.', 'He counts the ___ on the table.']


def _bad_plurals(sg, pl, rule):
    cands = []
    if rule == 'ies':
        cands += [sg + 's']
    elif rule in ('es',):
        cands += [sg + 's']
    elif rule == 'ves':
        cands += [sg + 's']
    elif rule == 'irregular' or rule == 'same':
        cands += [sg + 's', sg + 'es']
    else:
        cands += [sg + 'es']
    if rule == 'regular':
        cands.append(sg)
    cands.append(sg if rule != 'regular' else sg + 'ss')
    out = []
    for c in cands:
        if c != pl and c not in out:
            out.append(c)
    return out


def art_plural(rng):
    sg, pl, rule = rng.choice(PLURAL_TABLE)
    frame = rng.choice(PLURAL_FRAMES)
    bad = _bad_plurals(sg, pl, rule)
    if len(bad) < 2:
        return None
    wrongs = []
    for w in bad[:3]:
        if w == sg:
            wrongs.append((w, f'"{sg}" is the singular form. After a number or "some" we need the plural: "{pl}".'))
        else:
            wrongs.append((w, f'"{w}" is not the correct plural of "{sg}". {PLURAL_RULES[rule]}: "{pl}".'))
    return Row(frame.replace('___', '___'), pl, wrongs, f'The plural of "{sg}" is "{pl}". {PLURAL_RULES[rule]}.', 'plurals', CAT_ART)


# ---- pronouns ------------------------------------------------------------------------------------------------

MEN = ['Tom', 'Ben', 'Max', 'Jack', 'Sam', 'Paul', 'Leo', 'Dan', 'Omar', 'Luca']
WOMEN = ['Anna', 'Lucy', 'Mia', 'Sara', 'Emma', 'Kate', 'Eva', 'Nina', 'Rosa', 'Julia']
COUNTRIES = ['Spain', 'Italy', 'France', 'Brazil', 'Japan', 'Canada', 'Poland', 'Mexico', 'Greece', 'Egypt']
PRON_DESC = {'He': 'one boy or man', 'She': 'one girl or woman', 'It': 'one thing or animal', 'They': 'two or more people or things',
             'We': 'the speaker and other people', 'You': 'the person you are talking to', 'I': 'the speaker'}
RELS = ['friend', 'cousin', 'neighbour', 'classmate']
THINGS_IT = [('My bike is new.', '___ is red.'), ('I have a dog.', '___ is very friendly.'), ('My house is small.', '___ is near the park.'), ('Look at the cat.', '___ is sleeping.'),
             ('This is my phone.', '___ is old.'), ('I like this book.', '___ is very interesting.'), ('We have a garden.', '___ is big.'), ('My bag is heavy.', '___ is blue.'),
             ('The film is long.', '___ is also very good.'), ('I have a new car.', '___ is white.')]


def pron_subject(rng):
    kind = rng.choice(['m', 'f', 'it', 'they', 'we'])
    if kind in ('m', 'f'):
        name = rng.choice(MEN if kind == 'm' else WOMEN)
        right = 'He' if kind == 'm' else 'She'
        sent = f'{name} is my {rng.choice(RELS)}. ___ is from {rng.choice(COUNTRIES)}.'
    elif kind == 'it':
        a, b = rng.choice(THINGS_IT)
        right, sent = 'It', f'{a} {b}'
    elif kind == 'they':
        n1, n2 = rng.sample(MEN + WOMEN, 2)
        right, sent = 'They', f'{n1} and {n2} are my friends. ___ live in {rng.choice(["London", "Rome", "Paris", "Madrid"])}.'
    else:
        n = rng.choice(MEN + WOMEN)
        right, sent = 'We', f'{n} and I are friends. ___ play {rng.choice(["tennis", "football", "chess", "volleyball"])} together.'
    others = [w for w in ('He', 'She', 'It', 'They', 'We', 'You', 'I') if w != right]
    rng.shuffle(others)
    wrongs = [(w, f'"{w}" is used for {PRON_DESC[w]}. Here we talk about {PRON_DESC[right]}, so we use "{right}".') for w in others[:3]]
    return Row(sent, right, wrongs, f'We use "{right}" for {PRON_DESC[right]}.', 'pronouns', CAT_PRON)


OBJ = {'m': ('him', 'he', 'his', 'a boy or a man'), 'f': ('her', 'she', 'hers', 'a girl or a woman')}
OBJ_FRAMES = ['I like {N}. I often see ___.', '{N} is my friend. Please help ___.', 'This is a present for {N}. Give it to ___.', 'Look at {N}! Do you know ___?',
              '{N} is in the garden. Call ___ for lunch.', 'I love {N}. I call ___ every day.', '{N} is sad. Can you talk to ___?']


def pron_object(rng):
    kind = rng.choice(['m', 'f', 'm', 'f', 'they', 'me', 'us'])
    if kind in ('m', 'f'):
        name = rng.choice(MEN if kind == 'm' else WOMEN)
        right, subj, poss, who = OBJ[kind]
        sent = rng.choice(OBJ_FRAMES).format(N=name)
        wrongs = [(subj, f'"{subj}" is a subject pronoun ({subj.capitalize()} is nice). After a verb or a preposition we need the object pronoun: "{right}".'),
                  (poss, f'"{poss}" shows that something belongs to {who}. Here we need an object pronoun: "{right}".')]
    elif kind == 'they':
        right = 'them'
        sent = rng.choice(['My friends are nice. I help ___ with their homework.', 'The children are tired. Please take ___ home.', 'I love my parents. I call ___ every day.',
                           'Look at those dogs! Do you like ___?', 'The students are late. Can you wait for ___?'])
        wrongs = [('they', '"they" is a subject pronoun (They are nice). After a verb or a preposition we need the object pronoun: "them".'),
                  ('their', '"their" shows that something belongs to them (their house). Here we need an object pronoun: "them".')]
    elif kind == 'me':
        right = 'me'
        sent = rng.choice(['My mother loves ___.', 'Please give ___ the book.', 'Tom and Anna call ___ every Sunday.', 'Can you help ___, please?', 'The teacher asks ___ a question.'])
        wrongs = [('I', '"I" is a subject pronoun (I am happy). After a verb we need the object pronoun: "me".'),
                  ('my', '"my" shows that something belongs to me (my book). Here we need an object pronoun: "me".')]
    else:
        right = 'us'
        sent = rng.choice(['Our teacher helps ___ every day.', 'Our friends invite ___ to the party.', 'Please wait for ___ at the station.', 'Mum cooks dinner for ___.', 'The dog follows ___ to school.'])
        wrongs = [('we', '"we" is a subject pronoun (We are friends). After a verb or a preposition we need the object pronoun: "us".'),
                  ('our', '"our" shows that something belongs to us (our house). Here we need an object pronoun: "us".')]
    return Row(sent, right, wrongs, f'After a verb or a preposition we use the object pronoun: "{right}".', 'pronouns', CAT_PRON)


POSS_ITEMS = ['bag', 'book', 'dog', 'house', 'car', 'bike', 'phone', 'coat', 'pen', 'room', 'cat', 'ball', 'name', 'friend', 'teacher']


def pron_possessive(rng):
    kind = rng.choice(['m', 'f', 'i', 'we', 'they', 'you'])
    item = rng.choice(POSS_ITEMS)
    if kind in ('m', 'f'):
        name = rng.choice(MEN if kind == 'm' else WOMEN)
        right = 'His' if kind == 'm' else 'Her'
        other = 'Her' if kind == 'm' else 'His'
        subj = 'He' if kind == 'm' else 'She'
        sent = f'This is {name}. ___ {item} is nice.'
        wrongs = [(other, f'"{other}" belongs to {"a woman or a girl" if kind == "m" else "a man or a boy"}. {name} is {"a boy" if kind == "m" else "a girl"}, so we use "{right}".'),
                  (subj, f'"{subj}" is a subject pronoun ({subj} is tall). Before a noun we need a possessive adjective: "{right}".')]
    elif kind == 'i':
        right, sent = 'My', f'I have a {item}. ___ {item} is new.'
        wrongs = [('Me', '"Me" is an object pronoun (help me). Before a noun we need a possessive adjective: "My".'), ('I', '"I" is a subject pronoun (I am happy). Before a noun we need a possessive adjective: "My".')]
    elif kind == 'we':
        right, sent = 'Our', f'We love ___ {item}.'
        wrongs = [('Us', None), ('We', None)]
        wrongs = [('us', '"us" is an object pronoun (help us). Before a noun we need a possessive adjective: "our".'), ('we', '"we" is a subject pronoun (we are friends). Before a noun we need a possessive adjective: "our".')]
        right = 'our'
    elif kind == 'they':
        right, sent = 'their', f'They like ___ {item}.'
        wrongs = [('them', '"them" is an object pronoun (help them). Before a noun we need a possessive adjective: "their".'), ('they', '"they" is a subject pronoun (they are tired). Before a noun we need a possessive adjective: "their".')]
    else:
        right, sent = 'your', f'Is this ___ {item}?'
        wrongs = [('you', '"you" is a subject or object pronoun (you are kind). Before a noun we need a possessive adjective: "your".'), ('yours', '"yours" is used alone, without a noun (it is yours). Before a noun we use "your".')]
    return Row(sent, right, wrongs, f'Before a noun we use a possessive adjective: "{right}".', 'possessives', CAT_PRON)


def pron_genitive(rng):
    name = rng.choice(MEN + WOMEN)
    item = rng.choice(POSS_ITEMS)
    right = f"{name}'s"
    wrongs = [(f'{name}s', f'"{name}s" without an apostrophe is a plural (two {name}s). To show that something belongs to {name} we write "{name}\'s".'),
              (f"{name}s'", f'The apostrophe goes after the "s" only for plural nouns (the girls\' room). For one person we write "{name}\'s".'),
              (name, f'To show possession we need \'s after the name: "{name}\'s {item}".')]
    sent = rng.choice([f'This is ___ {item}.', f'Is that ___ {item}?', f'I like ___ {item}.', f'Where is ___ {item}?'])
    return Row(sent, right, wrongs, f'We add \'s to a name to show possession: {name}\'s {item}.', 'possessives', CAT_PRON)


# ---- adjectives -------------------------------------------------------------------------------------------

# adjective, opposite, noun with the adjective, noun with the opposite
ADJ_PAIRS = [
    ('hot', 'cold', 'soup', 'ice cream'), ('tall', 'short', 'giraffe', 'mouse'), ('fast', 'slow', 'car', 'snail'), ('happy', 'sad', 'baby', 'clown'),
    ('easy', 'difficult', 'game', 'exam'), ('clean', 'dirty', 'kitchen', 'floor'), ('cheap', 'expensive', 'bread', 'diamond'), ('full', 'empty', 'glass', 'bottle'),
    ('early', 'late', 'bus', 'train'), ('heavy', 'light', 'stone', 'feather'), ('thick', 'thin', 'book', 'paper'), ('strong', 'weak', 'elephant', 'mouse'),
    ('rich', 'poor', 'king', 'beggar'), ('hard', 'soft', 'rock', 'pillow'), ('wet', 'dry', 'towel', 'desert'), ('noisy', 'quiet', 'street', 'library'),
    ('safe', 'dangerous', 'house', 'jungle'), ('high', 'low', 'mountain', 'valley'), ('wide', 'narrow', 'river', 'path'), ('sweet', 'sour', 'cake', 'lemon'),
    ('polite', 'rude', 'student', 'boy'), ('bright', 'dark', 'day', 'night'), ('new', 'old', 'bike', 'castle'), ('long', 'short', 'snake', 'worm'),
]
ADJ_ALL = {}
for a, o, n1, n2 in ADJ_PAIRS:
    ADJ_ALL[a] = o
    ADJ_ALL[o] = a
# adjectives whose opposite depends on the noun are not used alone
AMBIGUOUS = {'new', 'old', 'light', 'long', 'short', 'high', 'low', 'dark', 'bright', 'thin', 'thick', 'hard', 'soft', 'full', 'early', 'late'}


def _adj_wrongs(w, rng, k=2):
    pool = [x for x in ADJ_ALL if x not in (w, ADJ_ALL[w]) and ADJ_ALL[x] != w and x not in AMBIGUOUS]
    ds = rng.sample(pool, k)
    return [(d, f'"{d}" is not the opposite of "{w}". The opposite of "{d}" is "{ADJ_ALL[d]}".') for d in ds]


def adj_opposite_mc(rng):
    w = rng.choice([x for x in ADJ_ALL if x not in AMBIGUOUS])
    return Row(f'Which word is the opposite of "{w}"?', ADJ_ALL[w], _adj_wrongs(w, rng), f'The opposite of "{w}" is "{ADJ_ALL[w]}".', 'adjectives', CAT_ADJ)


def adj_opposite_fb(rng):
    w = rng.choice([x for x in ADJ_ALL if x not in AMBIGUOUS])
    return Row(f'The opposite of "{w}" is ___.', ADJ_ALL[w], _adj_wrongs(w, rng), f'The opposite of "{w}" is "{ADJ_ALL[w]}".', 'adjectives', CAT_ADJ)


def adj_contrast(rng):
    a, o, n1, n2 = rng.choice(ADJ_PAIRS)
    if rng.random() < 0.5:
        sent, right, w = f'The {n1} is {a}, but the {n2} is ___.', o, a
    else:
        sent, right, w = f'The {n2} is {o}, but the {n1} is ___.', a, o
    wrongs = _adj_wrongs(w, rng)
    return Row(sent, right, wrongs, f'"{a}" and "{o}" are opposites. A sentence with "but" often compares two opposite things.', 'adjectives', CAT_ADJ)


ADJ_COLOURS = ['red', 'blue', 'green', 'yellow', 'black', 'white', 'pink', 'brown', 'grey', 'purple']
ADJ_SIZES = ['big', 'small', 'tall', 'old', 'new', 'long', 'nice', 'beautiful', 'cheap', 'heavy', 'young', 'happy']
ADJ_NOUNS = ['car', 'bag', 'house', 'dog', 'cat', 'shirt', 'hat', 'book', 'bike', 'phone', 'ball', 'flower', 'pen', 'door', 'tree', 'table', 'chair', 'cake',
              'coat', 'umbrella', 'clock', 'lamp', 'kite', 'bottle', 'towel', 'rabbit']
ADJ_PEOPLE = ['girl', 'boy', 'man', 'woman', 'teacher', 'student', 'doctor', 'baby']
ADJ_PERSON_ADJ = ['tall', 'kind', 'happy', 'young', 'old', 'funny', 'quiet', 'clever', 'tired', 'friendly']


def _starts_vowel(w):
    return a_an(w) == 'an'


def adj_order_row(rng):
    kind = rng.choice(['has', 'person', 'like'])
    if kind == 'has':
        subj = rng.choice(['She', 'He', 'My mother', 'My father', 'Anna', 'Tom', 'My friend', 'My sister'])
        adj, n = rng.choice(ADJ_COLOURS + ADJ_SIZES), rng.choice(ADJ_NOUNS)
        art = a_an(adj)
        right = f'{subj} has {art} {adj} {n}.'
        w1 = f'{subj} has {a_an(n)} {n} {adj}.'
        w2 = f'{subj} has {art} {adj}s {n}.'
        w2r = f'Adjectives do not change in English. We say "{adj} {n}", not "{adj}s {n}".'
        sent = f'{subj} has ___.'
    elif kind == 'person':
        adj, n = rng.choice(ADJ_PERSON_ADJ), rng.choice(ADJ_PEOPLE)
        subj = rng.choice(['She', 'He']) if n in ('girl', 'woman', 'boy', 'man') else rng.choice(['She', 'He'])
        right = f'{subj} is {a_an(adj)} {adj} {n}.'
        w1 = f'{subj} is {a_an(n)} {n} {adj}.'
        w2 = f'{subj} is {a_an(adj)} {adj}s {n}.'
        w2r = f'Adjectives do not change in English. We say "{adj} {n}", not "{adj}s {n}".'
    else:
        adj, n = rng.choice(ADJ_COLOURS + ADJ_SIZES), rng.choice(ADJ_NOUNS)
        right = f'I like my {adj} {n}.'
        w1 = f'I like my {n} {adj}.'
        w2 = f'I like {adj} my {n}.'
        w2r = f'The adjective comes after "my" and before the noun: "my {adj} {n}".'
    w1r = f'In English the adjective comes before the noun, not after it: "{adj} {n}".'
    return right, [(w1, w1r), (w2, w2r)], adj, n


def adj_order_sc_row(rng):
    right, wrongs, adj, n = adj_order_row(rng)
    return right, wrongs


# ---- prepositions --------------------------------------------------------------------------------------------

USE = {'at': 'is used for clock times and exact places', 'on': 'is used for days, dates and surfaces', 'in': 'is used for months, seasons, years and enclosed places',
       'to': 'shows movement towards a place', 'from': 'shows the starting point or origin', 'by': 'is used for means of transport and for "next to"',
       'with': 'means "together with" or "using"', 'for': 'shows who gets something or the purpose', 'of': 'links a part or a container to a thing', 'into': 'shows movement to the inside of a place'}
RULE = {
    'time-at': 'For clock times and fixed points of time we use "at": at seven o\'clock, at night.',
    'time-on': 'For days and dates we use "on": on Monday, on 5 May.',
    'time-in': 'For months, seasons, years and parts of the day we use "in": in June, in summer, in the morning.',
    'place-at': 'For a point or an exact place (home, school, the door) we use "at".',
    'place-on': 'For a surface and for buses, trains and planes we use "on": on the wall, on the bus.',
    'place-in': 'For a closed space, a town or a country we use "in": in the kitchen, in Spain.',
    'motion-to': 'To show movement towards a place we use "to": go to school.',
    'motion-from': 'To say where someone comes from we use "from": from Italy.',
    'motion-into': 'To show movement to the inside of a place we use "into": walk into the room.',
    'other-by': 'For means of transport we use "by": by bus, by train.',
    'other-with': 'To say "together with" or "using" we use "with".',
    'other-for': 'To show who gets something we use "for": a present for you.',
    'other-of': 'After a container or a quantity we use "of": a glass of water.',
}
CLOCK = ["seven o'clock", "half past seven", "eight o'clock", "nine o'clock", "ten o'clock", "noon", "midnight", "half past six", "six o'clock", "five o'clock",
         "quarter past eight", "quarter to nine", "three o'clock", "one o'clock", "eleven o'clock", "night", "lunchtime", "dinner time", "half past two", "quarter past four"]
DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Monday morning', 'Friday evening', 'my birthday', 'Christmas Day', '5 May', '1 June', '14 February']
MONTHS_ETC = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December', 'summer', 'winter', 'spring', 'autumn',
              'the morning', 'the afternoon', 'the evening', '2020', '1999', 'the summer', 'the winter']
PLACE_AT = ['home', 'school', 'work', 'the bus stop', 'the party', 'the desk', 'the gate', 'the door']
PLACE_IN = ['the kitchen', 'the garden', 'bed', 'London', 'Spain', 'the sky', 'the picture', 'the classroom', 'my room', 'the bathroom', 'the bedroom', 'the living room', 'Rome', 'Paris', 'the city']
ON_THINGS = {'the wall': ['picture', 'clock', 'map'], 'the floor': ['carpet', 'toy', 'ball'], 'the table': ['book', 'cup', 'lamp'], 'the sofa': ['cat', 'pillow', 'blanket'],
             'the roof': ['bird', 'cat'], 'the shelf': ['book', 'toy', 'plant'], 'the grass': ['ball', 'bird'], 'the desk': ['computer', 'lamp', 'pen'], 'the board': ['word', 'picture']}
LOC_ON = ['the left', 'the right', 'the first floor', 'the second floor', 'the ground floor']
TIME_FRAMES = {
    'time-at': ['I get up ___ {x}.', 'The lesson starts ___ {x}.', 'We have dinner ___ {x}.', 'The shop closes ___ {x}.', 'The film starts ___ {x}.', 'They arrive ___ {x}.'],
    'time-on': ['I play football ___ {x}.', 'We have English ___ {x}.', 'The party is ___ {x}.', 'She visits her grandmother ___ {x}.', 'The exam is ___ {x}.', 'We meet ___ {x}.'],
    'time-in': ['My birthday is ___ {x}.', 'We go on holiday ___ {x}.', 'I read a book ___ {x}.', 'It is cold ___ {x}.', 'They get married ___ {x}.', 'We play outside ___ {x}.'],
    'place-at': ['I am ___ {x}.', 'She waits ___ {x}.', 'We are ___ {x} now.', 'He is ___ {x} at the moment.'],
    'place-in': ['The children are ___ {x}.', 'She is ___ {x}.', 'We are ___ {x} now.', 'I can see my friend ___ {x}.'],
}
TO_PLACES = ['school', 'work', 'the park', 'the market', 'the station', 'London', 'bed', 'the shop', 'the cinema']
FROM_PLACES = ['Italy', 'Spain', 'Japan', 'Brazil', 'Egypt', 'Canada', 'Poland', 'Greece']
INTO_PLACES = ['the room', 'the kitchen', 'the shop', 'the classroom', 'the house', 'the garden']
OTHER = [('by', ['bus', 'train', 'car', 'bike', 'plane', 'boat', 'taxi'], ['I go to school ___ {x}.', 'We travel ___ {x}.', 'She comes to work ___ {x}.'], ['with', 'of', 'for']),
         ('with', ['my friend', 'my sister', 'a pen', 'a spoon', 'my family', 'a knife'], ['I play football ___ {x}.', 'She eats the soup ___ {x}.', 'He lives ___ {x}.'], ['by', 'of', 'in']),
         ('for', ['you', 'my mother', 'the teacher', 'the baby', 'your birthday'], ['This present is ___ {x}.', 'I buy a cake ___ {x}.', 'We wait ___ {x}.'], ['of', 'by', 'in']),
         ('of', ['water', 'milk', 'tea', 'juice', 'rice'], ['I drink a glass ___ {x}.', 'She wants a cup ___ {x}.', 'He buys a bottle ___ {x}.'], ['for', 'by', 'in'])]


def prep_row(rng):
    cat = rng.choice(['time-at', 'time-on', 'time-in', 'place-at', 'place-on', 'place-in', 'motion', 'other'])
    if cat in ('time-at', 'time-on', 'time-in'):
        items = {'time-at': CLOCK, 'time-on': DAYS, 'time-in': MONTHS_ETC}[cat]
        sent = rng.choice(TIME_FRAMES[cat]).format(x=rng.choice(items))
        right = cat.split('-')[1]
        wrong_set = [p for p in ('at', 'on', 'in') if p != right]
    elif cat == 'place-at':
        sent = rng.choice(TIME_FRAMES[cat]).format(x=rng.choice(PLACE_AT))
        right, wrong_set = 'at', ['on', 'in']
    elif cat == 'place-in':
        sent = rng.choice(TIME_FRAMES[cat]).format(x=rng.choice(PLACE_IN))
        right, wrong_set = 'in', ['at', 'on']
    elif cat == 'place-on':
        if rng.random() < 0.7:
            x = rng.choice(list(ON_THINGS))
            thing = rng.choice(ON_THINGS[x])
            sent = rng.choice([f'There is {a_an(thing)} {thing} ___ {x}.', f'I can see {a_an(thing)} {thing} ___ {x}.'])
        else:
            sent = rng.choice(['My room is ___ {x}.', 'The bank is ___ {x}.', 'The shop is ___ {x}.']).format(x=rng.choice(LOC_ON))
        right, wrong_set = 'on', ['at', 'in']
    elif cat == 'motion':
        kind = rng.choice(['to', 'from', 'into'])
        if kind == 'to':
            sent = rng.choice(['I go ___ {x} every day.', 'We walk ___ {x} together.', 'She runs ___ {x} now.']).format(x=rng.choice(TO_PLACES))
            right, wrong_set = 'to', ['from', 'at', 'on']
        elif kind == 'from':
            sent = rng.choice(['She comes ___ {x}, but now she lives in Rome.', 'My teacher comes ___ {x}, but he lives here now.']).format(x=rng.choice(FROM_PLACES))
            right, wrong_set = 'from', ['to', 'at', 'on']
        else:
            sent = rng.choice(['He walks ___ {x}.', 'The children run ___ {x}.', 'She goes ___ {x}.']).format(x=rng.choice(INTO_PLACES))
            right, wrong_set = 'into', ['from', 'at', 'on']
        cat = 'motion-' + right
    else:
        right, items, frames, wrong_set = rng.choice(OTHER)
        sent = rng.choice(frames).format(x=rng.choice(items))
        cat = 'other-' + right
    rng.shuffle(wrong_set)
    wrongs = [(w, f'"{w}" {USE.get(w, "is used in other situations")}. {RULE[cat]}') for w in wrong_set[:3]]
    return Row(sent, right, wrongs, RULE[cat], 'prepositions', CAT_PREP)
