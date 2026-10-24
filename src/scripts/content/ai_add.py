"""Adds hand-written questions (ai_<level>_*.txt) to a level and removes the duplicates that are already in it.

usage: ai_add.py <level> [--write] [--keep-legacy]
Reports the count per type and per topic so the content can be balanced.
"""
import sys, glob, os, random, collections
from core import load_level, save_level, remove_legacy_duplicates, Registry, next_numbers, with_id
from hand import build

HERE = os.path.dirname(os.path.abspath(__file__))


def main():
    level = sys.argv[1]
    write = '--write' in sys.argv
    rng = random.Random(11)
    files = load_level(level)
    if '--keep-legacy' not in sys.argv:
        removed = remove_legacy_duplicates(files)
        print('legacy duplicates removed:', len(removed))
    reg = Registry(files)
    accepted, skipped = [], collections.Counter()
    for path in sorted(glob.glob(os.path.join(HERE, f'ai_{level}_*.txt'))):
        for n, line in enumerate(open(path, encoding='utf-8'), start=1):
            line = line.rstrip('\n')
            if not line.strip() or line.startswith('#'):
                continue
            try:
                q = build(line, level, rng)
            except (ValueError, KeyError, IndexError) as e:
                print(f'ERROR {os.path.basename(path)}:{n}: {e}')
                skipped['error'] += 1
                continue
            if not reg.try_add({**q, 'id': 'x'}):
                skipped['duplicate'] += 1
                continue
            accepted.append(q)
    print('accepted', len(accepted), 'skipped', dict(skipped))
    by_type = collections.Counter(q['type'] for q in accepted)
    by_cat = collections.Counter(q['topics'][0] for q in accepted)
    print('by type:', dict(sorted(by_type.items())))
    print('by topic:', dict(by_cat.most_common()))
    total = sum(len(f['questions']) for f in files.values()) + len(accepted)
    print('level total after adding:', total)
    if write:
        last = next_numbers(files)
        rng.shuffle(accepted)
        per = collections.defaultdict(list)
        for q in accepted:
            per[q['type']].append(q)
        for t, qs in per.items():
            for i, q in enumerate(qs, start=1):
                files[t]['questions'].append(with_id(q, last[t] + i, level))
        save_level(files)
        print('written')


if __name__ == '__main__':
    main()
