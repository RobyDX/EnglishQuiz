import { Examples, FormTable, Key, Mistakes, Rule, Section } from '../helpers';

export default function WordFormation() {
  return (
    <>
      <Rule>
        <p className="mb-0">
          English builds new words with <strong>prefixes</strong> (at the start) and <strong>suffixes</strong> (at the end). A suffix often changes the word class: noun, verb,
          adjective or adverb.
        </p>
      </Rule>

      <Section title="Prefixes">
        <FormTable
          caption="Common prefixes"
          head={['Prefix', 'Meaning', 'Examples']}
          rows={[
            ['un-', 'not / reverse', 'unhappy, unlock'],
            ['in- / im- / il- / ir-', 'not', 'incorrect, impossible, illegal, irregular'],
            ['dis-', 'not / opposite', 'disagree, dislike'],
            ['mis-', 'wrongly', 'misunderstand, misspell'],
            ['re-', 'again', 'rewrite, rebuild'],
            ['over- / under-', 'too much / too little', 'overwork, underpaid'],
            ['pre- / post-', 'before / after', 'pre-war, postpone'],
          ]}
        />
      </Section>

      <Section title="Suffixes">
        <FormTable
          caption="Common suffixes"
          head={['Makes', 'Suffixes', 'Examples']}
          rows={[
            ['nouns', '-tion, -sion, -ment, -ness, -ity, -er / -or, -ist', 'decision, movement, happiness, ability, teacher, artist'],
            ['adjectives', '-able / -ible, -ful, -less, -ous, -al, -ive', 'comfortable, helpful, careless, famous, national, active'],
            ['adverbs', '-ly', 'quickly, carefully'],
            ['verbs', '-ize / -ise, -en, -ify', 'realise, widen, simplify'],
          ]}
        />
      </Section>

      <Section title="Word families">
        <FormTable
          caption="Word families"
          head={['Verb', 'Noun', 'Adjective', 'Adverb']}
          rows={[
            ['succeed', 'success', 'successful', 'successfully'],
            ['decide', 'decision', 'decisive', 'decisively'],
            ['care', 'care', 'careful / careless', 'carefully / carelessly'],
            ['differ', 'difference', 'different', 'differently'],
          ]}
        />
        <Examples
          items={[
            <>
              She <Key>succeeded</Key>. It was a <Key>success</Key>. She was <Key>successful</Key>. She finished <Key>successfully</Key>.
            </>,
          ]}
        />
      </Section>

      <Section title="Common mistakes">
        <Mistakes
          items={[
            { wrong: 'It is unpossible.', right: 'It is impossible.', why: 'Use im- before p.' },
            { wrong: 'He drives careful.', right: 'He drives carefully.', why: 'A verb needs an adverb, not an adjective.' },
            { wrong: 'a succesful plan', right: 'a successful plan', why: 'Success has double c and double s.' },
            { wrong: 'unhappyness', right: 'unhappiness', why: 'Change y to i before -ness.' },
          ]}
        />
      </Section>
    </>
  );
}
