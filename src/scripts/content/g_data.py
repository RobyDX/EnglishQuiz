"""Shared grammar data: subjects and verbs with their forms."""

# (text, be, have, third-person-singular?)
SUBJECTS = [
    ('I', 'am', 'have', False), ('You', 'are', 'have', False), ('We', 'are', 'have', False), ('They', 'are', 'have', False),
    ('He', 'is', 'has', True), ('She', 'is', 'has', True), ('It', 'is', 'has', True),
    ('Tom', 'is', 'has', True), ('Anna', 'is', 'has', True), ('Ben', 'is', 'has', True), ('Lucy', 'is', 'has', True),
    ('Max', 'is', 'has', True), ('Sara', 'is', 'has', True), ('Jack', 'is', 'has', True), ('Mia', 'is', 'has', True),
    ('My mother', 'is', 'has', True), ('My father', 'is', 'has', True), ('The dog', 'is', 'has', True),
    ('Our teacher', 'is', 'has', True), ('My brother', 'is', 'has', True), ('The baby', 'is', 'has', True),
    ('My sister', 'is', 'has', True), ('The cat', 'is', 'has', True), ('My friend', 'is', 'has', True),
    ('My parents', 'are', 'have', False), ('The children', 'are', 'have', False), ('Tom and Anna', 'are', 'have', False),
    ('Our friends', 'are', 'have', False), ('The students', 'are', 'have', False), ('My cousins', 'are', 'have', False),
    ('The boys', 'are', 'have', False), ('The girls', 'are', 'have', False),
]


class Subj:
    def __init__(self, t):
        self.text, self.be, self.have, self.s3 = t

    @property
    def lower(self):
        return self.text.lower() if self.text.split(' ')[0] in ('He', 'She', 'It', 'We', 'They', 'You', 'My', 'The', 'Our') else self.text

    @property
    def pronoun_kind(self):
        return 'I' if self.text == 'I' else ('3s' if self.s3 else 'pl')


ALL_SUBJECTS = [Subj(t) for t in SUBJECTS]
S3 = [s for s in ALL_SUBJECTS if s.s3]
NON3 = [s for s in ALL_SUBJECTS if not s.s3]

# base, third person, -ing, neutral complement, -ing rule
VERBS = [
    ('play', 'plays', 'playing', 'football', 'regular'), ('watch', 'watches', 'watching', 'TV', 'regular'),
    ('study', 'studies', 'studying', 'English', 'regular'), ('go', 'goes', 'going', 'to the park', 'regular'),
    ('wash', 'washes', 'washing', 'the car', 'regular'), ('fly', 'flies', 'flying', 'a kite in the park', 'regular'),
    ('try', 'tries', 'trying', 'new food', 'regular'), ('carry', 'carries', 'carrying', 'a heavy bag', 'regular'),
    ('read', 'reads', 'reading', 'a book', 'regular'), ('write', 'writes', 'writing', 'emails to friends', 'drop-e'),
    ('drink', 'drinks', 'drinking', 'hot tea', 'regular'), ('eat', 'eats', 'eating', 'lunch at school', 'regular'),
    ('cook', 'cooks', 'cooking', 'dinner for the family', 'regular'), ('clean', 'cleans', 'cleaning', 'the kitchen', 'regular'),
    ('listen', 'listens', 'listening', 'to music', 'regular'), ('help', 'helps', 'helping', 'the teacher', 'regular'),
    ('walk', 'walks', 'walking', 'to the shop', 'regular'), ('swim', 'swims', 'swimming', 'in the sea', 'double'),
    ('run', 'runs', 'running', 'in the park', 'double'), ('sit', 'sits', 'sitting', 'on the sofa', 'double'),
    ('stop', 'stops', 'stopping', 'at the red light', 'double'), ('sing', 'sings', 'singing', 'a song', 'regular'),
    ('dance', 'dances', 'dancing', 'at the party', 'drop-e'), ('make', 'makes', 'making', 'a cake', 'drop-e'),
    ('take', 'takes', 'taking', 'photos', 'drop-e'), ('ride', 'rides', 'riding', 'a bike', 'drop-e'),
    ('come', 'comes', 'coming', 'home late', 'drop-e'), ('get', 'gets', 'getting', 'a new phone', 'double'),
    ('buy', 'buys', 'buying', 'bread at the bakery', 'regular'), ('teach', 'teaches', 'teaching', 'maths', 'regular'),
    ('finish', 'finishes', 'finishing', 'work at six', 'regular'), ('fix', 'fixes', 'fixing', 'the bike', 'regular'),
    ('push', 'pushes', 'pushing', 'the door', 'regular'), ('cry', 'cries', 'crying', 'at the film', 'regular'),
    ('copy', 'copies', 'copying', 'the words', 'regular'), ('paint', 'paints', 'painting', 'a picture', 'regular'),
    ('open', 'opens', 'opening', 'the window', 'regular'), ('close', 'closes', 'closing', 'the door', 'drop-e'),
    ('call', 'calls', 'calling', 'a friend', 'regular'), ('ask', 'asks', 'asking', 'a question', 'regular'),
    ('work', 'works', 'working', 'in an office', 'regular'), ('visit', 'visits', 'visiting', 'a museum', 'regular'),
    ('plan', 'plans', 'planning', 'a trip', 'double'), ('shop', 'shops', 'shopping', 'at the market', 'double'),
    ('chat', 'chats', 'chatting', 'with friends', 'double'), ('jump', 'jumps', 'jumping', 'on the bed', 'regular'),
    ('draw', 'draws', 'drawing', 'a house', 'regular'), ('wait', 'waits', 'waiting', 'for the bus', 'regular'),
    ('meet', 'meets', 'meeting', 'friends in town', 'regular'), ('learn', 'learns', 'learning', 'new words', 'regular'),
    ('pay', 'pays', 'paying', 'for the tickets', 'regular'), ('kiss', 'kisses', 'kissing', 'the baby', 'regular'),
    ('use', 'uses', 'using', 'a computer', 'drop-e'), ('hope', 'hopes', 'hoping', 'for good weather', 'drop-e'),
    ('rest', 'rests', 'resting', 'on the beach', 'regular'), ('lie', 'lies', 'lying', 'on the grass', 'ie-ying'),
    ('wear', 'wears', 'wearing', 'a red hat', 'regular'), ('clap', 'claps', 'clapping', 'for the singer', 'double'),
]

ING_RULE_TEXT = {
    'regular': 'Most verbs just add -ing',
    'drop-e': 'Verbs that end in -e lose the -e before -ing',
    'double': 'Short verbs ending in vowel + consonant double the last letter before -ing',
    'ie-ying': 'Verbs that end in -ie change to -ying',
}


def wrong_ing(v):
    """A typical wrong -ing spelling for the verb, with the rule that explains it (or None)."""
    base, third, ing, rest, rule = v
    if rule == 'drop-e':
        return base + 'ing', f'"{base}ing" is wrong. {ING_RULE_TEXT[rule]}: {ing}.'
    if rule == 'double':
        return base + 'ing', f'"{base}ing" is wrong. {ING_RULE_TEXT[rule]}: {ing}.'
    if rule == 'ie-ying':
        return base + 'ing', f'"{base}ing" is wrong. {ING_RULE_TEXT[rule]}: {ing}.'
    return None


def wrong_third(v):
    """A typical wrong third-person spelling with the rule that explains it (or None)."""
    base, third, ing, rest, rule = v
    if third == 'has':
        return 'haves', '"have" changes to "has" with he, she, it.'
    if third.endswith('ies'):
        return base + 's', f'After a consonant, -y changes to -ies: {third}.'
    if third.endswith('es') and base not in ('make', 'dance', 'ride', 'take', 'come', 'close', 'use', 'hope', 'like', 'live', 'love', 'write'):
        return base + 's', f'Verbs that end in -ch, -sh, -s, -x or -o add -es: {third}.'
    return base + 'es', f'Most verbs just add -s: {third}.'
