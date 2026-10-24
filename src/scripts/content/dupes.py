import json, glob, os, re, collections, sys

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'data') + os.sep

def norm(s):
    return re.sub(r'[^a-z0-9 ]+', '', str(s).lower().replace("'", '').replace('’', '')).strip()

def filled(q):
    """The question as a plain sentence: gaps filled with the first answer (None if not applicable)."""
    t = q['type']
    if t in ('fill-blank', 'verb-conjugate', 'word-bank'):
        text = q['text']
        answers = [a if isinstance(a, str) else a[0] for a in q['answers']]
        for a in answers:
            text = text.replace('___', a, 1)
        return norm(text)
    if t in ('multiple-choice', 'verb-form') and '___' in q['prompt']:
        return norm(q['prompt'].replace('___', q['options'][q['correct']]))
    if t == 'sentence-choice':
        return norm(q['options'][q['correct']])
    if t == 'word-order':
        return norm(' '.join(q['solutions'][0]))
    return None

def stem(q):
    t = q['type']
    parts = [t, norm(q.get('prompt', ''))]
    for k in ('text', 'passage', 'wrong', 'original'):
        if k in q: parts.append(norm(q[k]))
    for k in ('options',):
        if k in q: parts.append('/'.join(sorted(norm(x) for x in q[k])))
    if 'words' in q: parts.append(' '.join(sorted(norm(w) for w in q['words'])))
    if 'tokens' in q: parts.append(' '.join(norm(w) for w in q['tokens']))
    if 'pairs' in q: parts.append('/'.join(sorted(norm(p['left']) + '>' + norm(p['right']) for p in q['pairs'])))
    if 'items' in q: parts.append('/'.join(norm(i['q']) for i in q['items']))
    if 'statements' in q: parts.append('/'.join(sorted(norm(s['text']) for s in q['statements'])))
    return '|'.join(parts)

if __name__ == '__main__':
    for lv in ['a1', 'a2', 'b1', 'b2', 'c1', 'c2']:
        stems = collections.Counter(); fills = collections.Counter(); n = 0
        for f in glob.glob(f'{ROOT}{lv}/*.json'):
            for q in json.load(open(f, encoding='utf-8'))['questions']:
                n += 1
                stems[stem(q)] += 1
                x = filled(q)
                if x: fills[x] += 1
        print(lv, n, 'dup stems:', sum(v - 1 for v in stems.values() if v > 1), 'dup filled sentences:', sum(v - 1 for v in fills.values() if v > 1))
