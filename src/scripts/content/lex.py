"""Parses the lexicon files into groups and words."""
import re, collections, os

HERE = os.path.dirname(os.path.abspath(__file__))
FILES = ['lex_everyday.txt', 'lex_travel.txt', 'lex_work.txt', 'lex_society.txt']
SENT_FILES = ['sent_everyday.txt', 'sent_travel.txt', 'sent_work.txt', 'sent_society.txt']


class Word:
    def __init__(self, text, definition, group):
        self.flag = ''
        if text[-1] in '*~':
            self.flag, text = text[-1], text[:-1]
        self.text = text
        self.definition = definition
        self.group = group
        self.sentence = None
        # grammatical number: sg (countable singular), pl (plural only), unc (uncountable)
        self.number = {'': 'sg', '*': 'pl', '~': 'unc'}[self.flag]

    @property
    def article(self):
        """'a' / 'an' for countable singular words, '' otherwise."""
        if self.number != 'sg':
            return ''
        from core import a_an
        return a_an(self.text)

    @property
    def cat(self):
        return self.group.cat

    def __repr__(self):
        return self.text


class Group:
    def __init__(self, key, plural, single, cat):
        self.key, self.plural, self.single, self.cat = key, plural, single, cat
        self.words = []


def load():
    groups = collections.OrderedDict()
    seen = {}
    for fn in FILES:
        cur = None
        for line in open(os.path.join(HERE, fn), encoding='utf-8'):
            line = line.rstrip('\n')
            if not line.strip():
                continue
            if line.startswith('@group'):
                key, plural, single, cat = [x.strip() for x in line[len('@group'):].split('|')]
                cur = Group(key, plural, single, cat)
                groups[key] = cur
                continue
            word, definition = [x.strip() for x in line.split('|', 1)]
            w = Word(word, definition, cur)
            low = w.text.lower()
            assert low not in seen, f'duplicate word {w.text!r} in {cur.key} and {seen[low]}'
            seen[low] = cur.key
            cur.words.append(w)
    words = {w.text.lower(): w for g in groups.values() for w in g.words}
    for fn in SENT_FILES:
        for line in open(os.path.join(HERE, fn), encoding='utf-8'):
            if not line.strip():
                continue
            word, sentence = [x.strip() for x in line.split('|', 1)]
            w = words[word.lower()]  # KeyError = sentence for an unknown word
            assert re.search(r'(?<![A-Za-z])' + re.escape(w.text) + r'(?![A-Za-z])', sentence, re.I), f'{w.text!r} not in {sentence!r}'
            w.sentence = sentence
    return groups


if __name__ == '__main__':
    g = load()
    total = 0
    for k, grp in g.items():
        print(f'{k:14s} {grp.cat:28s} {len(grp.words)}')
        total += len(grp.words)
    print('total words', total)
    missing = [w.text for gr in g.values() for w in gr.words if not w.sentence]
    print('without sentence:', missing)
