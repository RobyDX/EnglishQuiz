"""A 'row' is a sentence with one blank, the right word and the wrong words with their own reasons.
It can be turned into several question types."""
from core import new_question, scramble

LEVEL = 'A1'


class Row:
    def __init__(self, sent, right, wrongs, expl, topic, cat, wb_bank=None):
        self.sent, self.right, self.wrongs, self.expl, self.topic, self.cat = sent, right, wrongs, expl, topic, cat
        self.wb_bank = wb_bank  # optional: wrong words to use in a word bank (defaults to all wrongs)

    @property
    def single(self):
        return self.sent.count('___') == 1 and self.sent.count('. ') == 0 and self.sent.rstrip().endswith(('.', '?', '!'))


def to_mc(row, rng):
    if len(row.wrongs) < 2:
        return None
    wrongs = row.wrongs[:3]
    options = [row.right] + [w for w, _ in wrongs]
    if len(set(options)) != len(options):
        return None
    rng.shuffle(options)
    wr = {str(options.index(w)): r for w, r in wrongs}
    return new_question(LEVEL, 'multiple-choice', row.topic, [row.cat], row.sent, row.expl, options=options, correct=options.index(row.right), wrongReasons=wr)


def to_fb(row, rng):
    wr = {w: r for w, r in row.wrongs}
    return new_question(LEVEL, 'fill-blank', row.topic, [row.cat], 'Complete the sentence.', row.expl, text=row.sent, answers=[[row.right]], wrongReasons=wr)


def to_wb(row, rng):
    if len(row.wrongs) < 2:
        return None
    wrongs = row.wrongs[:2]
    bank = [row.right] + [w for w, _ in wrongs]
    if len(set(bank)) != len(bank):
        return None
    rng.shuffle(bank)
    wr = {w: r for w, r in wrongs}
    return new_question(LEVEL, 'word-bank', row.topic, [row.cat], 'Complete the sentence with words from the box.', row.expl, bank=bank, text=row.sent, answers=[row.right], wrongReasons=wr)


def to_sc(row, rng):
    if not row.single or len(row.wrongs) < 2:
        return None
    wrongs = row.wrongs[:2]
    good = row.sent.replace('___', row.right)
    options = [good] + [row.sent.replace('___', w) for w, _ in wrongs]
    if len(set(options)) != len(options):
        return None
    rng.shuffle(options)
    wr = {str(options.index(row.sent.replace('___', w))): r for w, r in wrongs}
    return new_question(LEVEL, 'sentence-choice', row.topic, [row.cat], 'Which sentence is correct?', row.expl, options=options, correct=options.index(good), wrongReasons=wr)


def to_wo(row, rng):
    if not row.single:
        return None
    sentence = row.sent.replace('___', row.right)
    end = sentence[-1]
    tokens = sentence[:-1].split(' ')
    if len(tokens) < 4 or len(tokens) > 12 or ',' in sentence:
        return None
    return new_question(LEVEL, 'word-order', row.topic, [row.cat], 'Put the words in the correct order.',
                        f'The correct sentence is: "{sentence}" {row.expl}', words=scramble(tokens, rng, tokens), solutions=[tokens])


CONVERTERS = {'multiple-choice': to_mc, 'fill-blank': to_fb, 'word-bank': to_wb, 'sentence-choice': to_sc, 'word-order': to_wo}
