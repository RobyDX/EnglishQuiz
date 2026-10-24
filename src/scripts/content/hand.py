"""Parser for hand-written questions (compact text lines) of every type.

Fields are separated by " | ". Inside a field: a wrong answer and its reason by " :: ", list items by " ;; ".
CAT codes: E T W S (vocabulary) and VT MOD GER PHR CONF ART PRON ADJ PREP PASS COND (grammar); two topics with a plus, e.g. S+PREP.

  mc   | CAT | prompt | right | wrong :: reason | wrong :: reason [| wrong :: reason] | explanation
  vf   | CAT | sentence with ___ | right | wrong :: reason | wrong :: reason | wrong :: reason | explanation
  fb   | CAT | sentence with ___ | right[/other accepted] | wrong :: reason | ... | explanation
  vc   | CAT | text with ___ (verb) | answer[/other accepted] | wrong :: reason | ... | explanation
  wb   | CAT | sentence with ___ | right | wrong :: reason | wrong :: reason | explanation
  sc   | CAT | correct sentence | wrong sentence :: reason | wrong sentence :: reason | explanation
  oo   | CAT | group label | word, word, word | odd word | explanation
  wo   | CAT | correct sentence | explanation
  pw   | CAT | word | token token token | position[,position] | explanation        (position = index where the word is inserted)
  es   | CAT | sentence with the [wrong] word in brackets | fix | explanation
  tf   | CAT | passage | statement => T ;; statement => F ;; statement => T | explanation
  rm   | CAT | passage | question => option / option* / option ;; question => ... | explanation   (* marks the right option)
  mp   | CAT | prompt | left > right ;; left > right ;; ... | explanation
  ec   | CAT | wrong sentence | solution ;; other solution | reason of the typical mistake | explanation
  tr   | CAT | original sentence | KEYWORD | second sentence with ___ | solution ;; other solution | explanation
"""
from core import new_question, scramble, norm

CAT = {
    'E': 'everyday-life', 'T': 'travel-places-leisure', 'W': 'work-education-technology', 'S': 'society-health-environment',
    'VT': 'verb-tenses', 'MOD': 'modal-verbs', 'GER': 'gerunds-infinitives-linking', 'PHR': 'phrasal-collocations-idioms',
    'CONF': 'confusing-words-word-formation', 'ART': 'articles-determiners', 'PRON': 'pronouns-relative-clauses',
    'ADJ': 'adjectives-adverbs', 'PREP': 'prepositions',
    'PASS': 'passive-reported-speech', 'COND': 'conditionals-wishes', 'CONFW': 'confusing-words-word-formation',
}
LEGACY = {'E': 'vocabulary', 'T': 'vocabulary', 'W': 'vocabulary', 'S': 'vocabulary', 'VT': 'tenses', 'MOD': 'modals', 'GER': 'gerund',
          'PHR': 'phrasal-verbs', 'CONF': 'confusing-words', 'ART': 'articles', 'PRON': 'pronouns', 'ADJ': 'adjectives', 'PREP': 'prepositions',
          'PASS': 'passive', 'COND': 'conditionals', 'CONFW': 'word-formation'}
TYPE_OF = {'mc': 'multiple-choice', 'vf': 'verb-form', 'fb': 'fill-blank', 'vc': 'verb-conjugate', 'wb': 'word-bank', 'sc': 'sentence-choice',
           'oo': 'odd-one-out', 'wo': 'word-order', 'pw': 'place-word', 'es': 'error-spot', 'tf': 'true-false', 'rm': 'reading-mc', 'mp': 'match-pairs',
           'ec': 'error-correct', 'tr': 'transform'}


def fail(msg, line):
    raise ValueError(f'{msg}: {line[:100]}')


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
    kind, code = f[0], f[1]
    codes = code.split('+')
    cat = CAT[codes[0]]
    topic = LEGACY[codes[0]]
    cats = [CAT[c] for c in codes]
    lv = level.upper()
    qtype = TYPE_OF[kind]
    if kind in ('mc', 'vf', 'fb', 'vc', 'wb'):
        sent, right = f[2], f[3]
        wrongs = pairs(f[4:-1], line, 2 if kind in ('mc', 'vf', 'wb') else 1)
        expl = f[-1]
        first = right.split('/')[0]
        if any(w.lower() == first.lower() for w, _ in wrongs):
            fail('wrong answer equals right answer', line)
        if kind in ('wb', 'fb', 'vc', 'vf') and sent.count('___') != 1:
            fail('needs exactly one blank', line)
        if kind in ('mc', 'vf'):
            options = [right] + [w for w, _ in wrongs[:3]]
            if len(set(o.lower() for o in options)) != len(options):
                fail('repeated option', line)
            rng.shuffle(options)
            return new_question(lv, qtype, topic, cats, sent, expl, options=options, correct=options.index(right),
                                wrongReasons={str(options.index(w)): r for w, r in wrongs[:3]})
        if kind == 'wb':
            bank = [right] + [w for w, _ in wrongs[:2]]
            rng.shuffle(bank)
            return new_question(lv, qtype, topic, cats, 'Complete the sentence with words from the box.', expl, bank=bank, text=sent,
                                answers=[right], wrongReasons={w: r for w, r in wrongs[:2]})
        answers = [a.strip() for a in right.split('/')]
        prompt = (f'Complete the sentence. The missing word starts with "{first[0]}".' if kind == 'fb' and topic == 'vocabulary'
                  else ('Complete the sentence.' if kind == 'fb' else
                        ('Write the correct form of the word in brackets.' if codes[0] in ('ADJ', 'PRON', 'ART', 'PREP', 'CONFW') else 'Write the correct form of the verb in brackets.')))
        return new_question(lv, qtype, topic, cats, prompt, expl, text=sent, answers=[answers], wrongReasons={w: r for w, r in wrongs})
    if kind == 'sc':
        right = f[2]
        wrongs = pairs(f[3:-1], line, 2)
        options = [right] + [w for w, _ in wrongs[:2]]
        if len(set(options)) != len(options):
            fail('repeated option', line)
        rng.shuffle(options)
        return new_question(lv, qtype, topic, cats, 'Which sentence is correct?', f[-1], options=options, correct=options.index(right),
                            wrongReasons={str(options.index(w)): r for w, r in wrongs[:2]})
    if kind == 'oo':
        label, words, odd, expl = f[2], [w.strip() for w in f[3].split(',')], f[4], f[5]
        if len(words) != 3 or odd in words or len(set(words + [odd])) != 4:
            fail('odd-one-out needs 3 words and a different odd word', line)
        options = words + [odd]
        rng.shuffle(options)
        return new_question(lv, qtype, topic, cats, 'Which word does not belong to the group?', expl, options=options, correct=options.index(odd), category=label)
    if kind == 'wo':
        sentence = f[2]
        expl = f[3] if len(f) > 3 else f'The correct sentence is: "{sentence}"'
        tokens = sentence.rstrip('.?!').split(' ')
        if len(tokens) < 3:
            fail('word-order sentence too short', line)
        return new_question(lv, qtype, topic, cats, 'Put the words in the correct order.', expl, words=scramble(tokens, rng, tokens), solutions=[tokens])
    if kind == 'pw':
        word, tokens, positions, expl = f[2], f[3].split(' '), [int(x) for x in f[4].split(',')], f[5]
        if any(p < 0 or p > len(tokens) for p in positions):
            fail('position out of range', line)
        return new_question(lv, qtype, topic, cats, 'Where does the word go in the sentence?', expl, word=word, tokens=tokens, correctPositions=positions)
    if kind == 'es':
        raw, fix, expl = f[2], f[3], f[4]
        words = raw.rstrip('.?!').split(' ')
        idx = [i for i, w in enumerate(words) if w.startswith('[') and w.endswith(']')]
        if len(idx) != 1:
            fail('mark exactly one word in brackets', line)
        words[idx[0]] = words[idx[0]][1:-1]
        return new_question(lv, qtype, topic, cats, 'Tap the word that is wrong.', expl, tokens=words, wrongIndex=idx[0], fix=fix)
    if kind == 'tf':
        passage, stmts, expl = f[2], f[3].split(' ;; '), f[4]
        statements = []
        for s in stmts:
            if ' => ' not in s:
                fail('statement without => T/F', line)
            text, ans = [x.strip() for x in s.rsplit(' => ', 1)]
            if ans not in ('T', 'F'):
                fail('statement must end with => T or => F', line)
            statements.append({'text': text, 'answer': ans == 'T'})
        if len(statements) < 3 or len({s['answer'] for s in statements}) < 2:
            fail('need at least 3 statements, true and false mixed', line)
        return new_question(lv, qtype, topic if topic != 'vocabulary' else 'reading', cats, 'Read the text and decide if each sentence is true or false.', expl, passage=passage, statements=statements)
    if kind == 'rm':
        passage, items_raw, expl = f[2], f[3].split(' ;; '), f[4]
        items = []
        for it in items_raw:
            if ' => ' not in it:
                fail('question without =>', line)
            q, opts = [x.strip() for x in it.split(' => ', 1)]
            options = [o.strip() for o in opts.split(' / ')]
            stars = [i for i, o in enumerate(options) if o.endswith('*')]
            if len(stars) != 1 or len(options) < 3:
                fail('need 3+ options and exactly one right option marked with *', line)
            options = [o.rstrip('*').strip() for o in options]
            order = list(range(len(options)))
            rng.shuffle(order)
            items.append({'q': q, 'options': [options[i] for i in order], 'correct': order.index(stars[0])})
        return new_question(lv, qtype, 'reading', cats, 'Read the text and answer the questions.', expl, passage=passage, items=items)
    if kind == 'mp':
        prompt, plist, expl = f[2], f[3].split(' ;; '), f[4]
        prs = []
        for p in plist:
            if ' > ' not in p:
                fail('pair without >', line)
            a, b = [x.strip() for x in p.split(' > ', 1)]
            prs.append({'left': a, 'right': b})
        if len(prs) < 4 or len({p['left'] for p in prs}) != len(prs) or len({p['right'] for p in prs}) != len(prs):
            fail('need 4+ pairs with different words and meanings', line)
        if len(expl) < 40:
            expl = f'{expl.rstrip(".")}: for example, "{prs[0]["left"]}" goes with "{prs[0]["right"]}".'
        rng.shuffle(prs)
        return new_question(lv, qtype, topic, cats, prompt, expl, pairs=prs)
    if kind == 'ec':
        wrong, sols, reason, expl = f[2], [x.strip() for x in f[3].split(' ;; ')], f[4], f[5]
        if wrong.strip() in sols:
            fail('wrong sentence equals a solution', line)
        if len(expl) < 40:
            expl = f'{expl.rstrip(".").strip(chr(34))}: the correct sentence is "{sols[0]}"'
        return new_question(lv, qtype, topic, cats, 'This sentence has a mistake. Rewrite it correctly.', expl, wrong=wrong,
                            solutions=sols, wrongReasons={norm(wrong): reason})
    if kind == 'tr':
        original, keyword, template, sols, expl = f[2], f[3], f[4], [x.strip() for x in f[5].split(' ;; ')], f[6]
        if template.count('___') != 1:
            fail('needs exactly one blank', line)
        return new_question(lv, qtype, topic, cats, 'Complete the second sentence so that it means the same as the first. Use the word given.', expl,
                            original=original, keyword=keyword, template=template, solutions=sols)
    fail('unknown kind', line)
