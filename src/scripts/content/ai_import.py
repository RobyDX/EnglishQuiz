"""Imports questions written by hand (ai_<level>_*.txt) and swaps them for the mechanical ones they replace.

Line formats (fields separated by " | ", a wrong answer and its reason by " :: "):
  wb | CAT | sentence with ___ | right | wrong :: reason | wrong :: reason | explanation
  mc | CAT | prompt (with ___ or a question) | right | wrong :: reason | wrong :: reason [| wrong :: reason] | explanation
  fb | CAT | sentence with ___ | right[/other accepted answer] | wrong :: reason | wrong :: reason | explanation
  sc | CAT | correct sentence | wrong sentence :: reason | wrong sentence :: reason | explanation
  oo | CAT | group label | word, word, word | odd word | explanation
CAT: E everyday-life, T travel-places-leisure, W work-education-technology, S society-health-environment.
Lines starting with # and empty lines are ignored.

usage: ai_import.py <level> [--write]
"""
import sys, glob, os, random, json, collections, subprocess
from core import (load_level, save_level, Registry, next_numbers, with_id, new_question, norm, ROOT)

CAT = {'E': 'everyday-life', 'T': 'travel-places-leisure', 'W': 'work-education-technology', 'S': 'society-health-environment'}
HERE = os.path.dirname(os.path.abspath(__file__))


def fail(msg, line):
    raise ValueError(f'{msg}: {line[:90]}')


def pairs(parts, line, minimum=2):
    out = []
    for p in parts:
        if ' :: ' not in p:
            fail('wrong answer without reason', line)
        w, r = [x.strip() for x in p.split(' :: ', 1)]
        if not w or not r:
            fail('empty wrong answer or reason', line)
        out.append((w, r))
    if len(out) < minimum:
        fail('not enough wrong answers', line)
    if len({r for _, r in out}) != len(out):
        fail('repeated reason', line)
    return out


def build(line, level, rng):
    f = [x.strip() for x in line.split(' | ')]
    kind, cat = f[0], CAT[f[1]]
    lv = level.upper()
    if kind in ('wb', 'mc', 'fb'):
        sent, right = f[2], f[3]
        wrongs = pairs(f[4:-1], line, 2)
        expl = f[-1]
        if kind in ('wb', 'fb') and sent.count('___') != 1:
            fail('needs exactly one blank', line)
        if any(norm(w) == norm(right.split('/')[0]) for w, _ in wrongs):
            fail('wrong answer equals right answer', line)
        if kind == 'wb':
            bank = [right] + [w for w, _ in wrongs[:2]]
            rng.shuffle(bank)
            return new_question(lv, 'word-bank', 'vocabulary', [cat], 'Complete the sentence with words from the box.', expl, bank=bank, text=sent,
                                answers=[right], wrongReasons={w: r for w, r in wrongs[:2]})
        if kind == 'mc':
            options = [right] + [w for w, _ in wrongs[:3]]
            rng.shuffle(options)
            return new_question(lv, 'multiple-choice', 'vocabulary', [cat], sent, expl, options=options, correct=options.index(right),
                                wrongReasons={str(options.index(w)): r for w, r in wrongs[:3]})
        answers = [a.strip() for a in right.split('/')]
        return new_question(lv, 'fill-blank', 'vocabulary', [cat], f'Complete the sentence. The missing word starts with "{answers[0][0]}".', expl, text=sent,
                            answers=[answers], wrongReasons={w: r for w, r in wrongs})
    if kind == 'sc':
        right = f[2]
        wrongs = pairs(f[3:-1], line, 2)
        expl = f[-1]
        options = [right] + [w for w, _ in wrongs[:2]]
        if len(set(options)) != len(options):
            fail('repeated option', line)
        rng.shuffle(options)
        return new_question(lv, 'sentence-choice', 'vocabulary', [cat], 'Which sentence is correct?', expl, options=options, correct=options.index(right),
                            wrongReasons={str(options.index(w)): r for w, r in wrongs[:2]})
    if kind == 'oo':
        label, words, odd, expl = f[2], [w.strip() for w in f[3].split(',')], f[4], f[5]
        if len(words) != 3 or odd in words or len(set(words + [odd])) != 4:
            fail('odd-one-out needs 3 words and a different odd word', line)
        options = words + [odd]
        rng.shuffle(options)
        return new_question(lv, 'odd-one-out', 'vocabulary', [cat], 'Which word does not belong to the group?', expl, options=options, correct=options.index(odd), category=label)
    fail('unknown kind', line)


def is_mechanical_weak(q):
    """The mechanical vocabulary questions that the hand-written ones replace."""
    t, voc = q['type'], q['topic'] == 'vocabulary'
    p, tx = q.get('prompt', ''), q.get('text', '')
    if t in ('word-bank', 'sentence-choice') and voc:
        return True
    if t == 'multiple-choice' and voc and not p.startswith(('Which word means', 'Which of these is')):
        return True
    if t == 'fill-blank' and voc and not tx.startswith('The word for'):
        return True
    return t == 'odd-one-out'


def original_ids(level, base_ref):
    ids = set()
    for path in glob.glob(os.path.join(ROOT, level, '*.json')):
        rel = f'src/data/{level}/{os.path.basename(path)}'
        raw = subprocess.run(['git', 'show', f'{base_ref}:{rel}'], capture_output=True, text=True, cwd=os.path.join(HERE, '..', '..', '..')).stdout
        ids |= {q['id'] for q in json.loads(raw)['questions']}
    return ids


TYPE_OF = {'wb': 'word-bank', 'mc': 'multiple-choice', 'fb': 'fill-blank', 'sc': 'sentence-choice', 'oo': 'odd-one-out'}


def main():
    level = sys.argv[1]
    write = '--write' in sys.argv
    base_ref = next((a.split('=', 1)[1] for a in sys.argv if a.startswith('--base=')), None)
    rng = random.Random(7)
    lines = []
    for path in sorted(glob.glob(os.path.join(HERE, f'ai_{level}_*.txt'))):
        for line in open(path, encoding='utf-8'):
            line = line.rstrip('\n')
            if line.strip() and not line.startswith('#'):
                lines.append(line)
    files = load_level(level)
    old = original_ids(level, base_ref) if base_ref else set()
    weak = collections.defaultdict(list)  # (type, cat) -> ids of mechanical questions that can be replaced
    for t, fl in files.items():
        for q in fl['questions']:
            if q['id'] not in old and is_mechanical_weak(q):
                weak[(t, q['topics'][0])].append(q['id'])
    capacity = {k: len(v) for k, v in weak.items()}
    # the mechanical questions that will be removed must not block the new ones: build the registry without them
    removable = {i for ids in weak.values() for i in ids}
    reg = Registry({t: {**fl, 'questions': [q for q in fl['questions'] if q['id'] not in removable]} for t, fl in files.items()})
    accepted = collections.defaultdict(list)
    skipped = collections.Counter()
    for line in lines:
        q = build(line, level, rng)
        key = (q['type'], q['topics'][0])
        if len(accepted[key]) >= capacity.get(key, 0):
            skipped['over capacity'] += 1
            continue
        if not reg.try_add({**q, 'id': 'x'}):
            skipped['duplicate'] += 1
            continue
        accepted[key].append(q)
    print('authored lines', len(lines), 'accepted', sum(len(v) for v in accepted.values()), 'skipped', dict(skipped))
    missing = {k: capacity[k] - len(accepted.get(k, [])) for k in capacity if capacity[k] > len(accepted.get(k, []))}
    print('still to write (type, topic): count ->', {f'{k[0]}/{k[1][:4]}': v for k, v in sorted(missing.items())})
    if write:
        gone = set()
        for key, qs in accepted.items():
            gone |= set(weak[key][:len(qs)])
        last = next_numbers(files)
        for t, fl in files.items():
            fl['questions'] = [q for q in fl['questions'] if q['id'] not in gone]
        for (t, cat), qs in accepted.items():
            rng.shuffle(qs)
            for i, q in enumerate(qs, start=1):
                files[t]['questions'].append(with_id(q, last[t] + i, level))
            last[t] += len(qs)
        save_level(files)
        print('written; replaced', len(gone))


if __name__ == '__main__':
    main()
