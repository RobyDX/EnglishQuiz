"""Shared helpers to add questions to src/data/<level>/<type>.json without duplicates."""
import json, glob, os, re, random, collections

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'data') + os.sep
SIGLA = {
    'multiple-choice': 'mc', 'verb-form': 'vf', 'fill-blank': 'fb', 'verb-conjugate': 'vc',
    'word-bank': 'wb', 'place-word': 'pw', 'word-order': 'wo', 'error-spot': 'es',
    'error-correct': 'ec', 'true-false': 'tf', 'reading-mc': 'rm', 'match-pairs': 'mp',
    'odd-one-out': 'oo', 'sentence-choice': 'sc', 'transform': 'tr',
}


def norm(s):
    return re.sub(r'[^a-z0-9 ]+', '', str(s).lower().replace("'", '').replace('’', '')).strip()


def stem(q):
    """Identifies a question regardless of the order of options / words / pairs (mirrors data.test.ts)."""
    parts = [q['type'], norm(q.get('prompt', ''))]
    for k in ('text', 'passage', 'wrong', 'original'):
        if k in q:
            parts.append(norm(q[k]))
    if 'options' in q:
        parts.append('/'.join(sorted(norm(x) for x in q['options'])))
    if 'words' in q:
        parts.append(' '.join(sorted(norm(w) for w in q['words'])))
    if 'tokens' in q:
        parts.append(' '.join(norm(w) for w in q['tokens']))
    if 'pairs' in q:
        parts.append('/'.join(sorted(norm(p['left']) + '>' + norm(p['right']) for p in q['pairs'])))
    if 'items' in q:
        parts.append('/'.join(norm(i['q']) for i in q['items']))
    if 'statements' in q:
        parts.append('/'.join(sorted(norm(s['text']) for s in q['statements'])))
    return q['level'] + '|' + '|'.join(parts)


def filled(q):
    """The question read as one sentence, or None (mirrors data.test.ts)."""
    t = q['type']
    if t in ('fill-blank', 'verb-conjugate', 'word-bank'):
        text = q['text']
        for a in q['answers']:
            text = text.replace('___', a if isinstance(a, str) else a[0], 1)
        return norm(text)
    if t in ('multiple-choice', 'verb-form') and '___' in q['prompt']:
        return norm(q['prompt'].replace('___', q['options'][q['correct']], 1))
    if t == 'sentence-choice':
        return norm(q['options'][q['correct']])
    if t == 'word-order':
        return norm(' '.join(q['solutions'][0]))
    return None


# When the same sentence exists in several types, keep the question of the type listed first.
KEEP_PRIORITY = ['fill-blank', 'word-bank', 'verb-conjugate', 'verb-form', 'multiple-choice',
                 'sentence-choice', 'word-order']


def load_level(level):
    files = {}
    for path in sorted(glob.glob(f'{ROOT}{level}/*.json')):
        d = json.load(open(path, encoding='utf-8'))
        files[d['type']] = {'path': path, 'level': d['level'], 'questions': d['questions']}
    return files


def save_level(files):
    for t, f in files.items():
        open(f['path'], 'w', encoding='utf-8').write(
            json.dumps({'level': f['level'], 'type': t, 'questions': f['questions']}, indent=2, ensure_ascii=False) + '\n')


def remove_legacy_duplicates(files):
    """Drops duplicated questions already in the level. Returns the removed ids."""
    seen_stem, seen_sent, removed = {}, {}, []
    order = sorted(files, key=lambda t: KEEP_PRIORITY.index(t) if t in KEEP_PRIORITY else 99)
    for t in order:
        keep = []
        for q in files[t]['questions']:
            s, sent = stem(q), filled(q)
            if s in seen_stem or (sent and sent in seen_sent):
                removed.append(q['id'])
                continue
            seen_stem[s] = q['id']
            if sent:
                seen_sent[sent] = q['id']
            keep.append(q)
        files[t]['questions'] = keep
    return removed


class Registry:
    """Remembers every stem and sentence of the level so candidates can be checked against it."""

    def __init__(self, files):
        self.stems, self.sents = set(), set()
        for f in files.values():
            for q in f['questions']:
                self.stems.add(stem(q))
                s = filled(q)
                if s:
                    self.sents.add(s)

    def try_add(self, q):
        s, sent = stem(q), filled(q)
        if s in self.stems or (sent and sent in self.sents):
            return False
        self.stems.add(s)
        if sent:
            self.sents.add(sent)
        return True


def next_numbers(files):
    out = {}
    for t, f in files.items():
        nums = [int(q['id'].rsplit('-', 1)[1]) for q in f['questions']]
        out[t] = max(nums) if nums else 0
    return out


def new_question(level, qtype, topic, topics, prompt, explanation, **payload):
    """Builds a question dict (without id) with the key order used by the existing files."""
    q = {'type': qtype, 'level': level, 'topic': topic, 'topics': list(topics), 'prompt': prompt, 'explanation': explanation}
    wr = payload.pop('wrongReasons', None)
    q.update(payload)
    if wr:
        q['wrongReasons'] = wr
    return q


def with_id(q, n, level):
    out = {'id': f'{level}-{SIGLA[q["type"]]}-{n:03d}'}
    out.update(q)
    return out


def a_an(word):
    w = word.lower()
    if w.startswith(('hour', 'honest', 'heir')):
        return 'an'
    if w.startswith(('uni', 'use', 'usu', 'eu', 'one', 'once', 'ukr')):
        return 'a'
    return 'an' if w[:1] in 'aeiou' else 'a'


def scramble(words, rng, solution):
    for _ in range(20):
        w = words[:]
        rng.shuffle(w)
        if w != solution:
            return w
    return words[::-1]
