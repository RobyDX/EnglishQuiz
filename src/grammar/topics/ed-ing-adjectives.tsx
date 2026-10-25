import { Examples, FormTable, Key, Mistakes, Rule, Section } from '../helpers';

export default function EdIngAdjectives() {
  return (
    <>
      <Rule>
        <p className="mb-0">
          Adjectives in <strong>-ed</strong> describe how a person <em>feels</em> (bored). Adjectives in <strong>-ing</strong> describe what <em>causes</em> the feeling (boring).
        </p>
      </Rule>

      <Section title="Pairs">
        <FormTable
          caption="-ed and -ing adjectives"
          head={['Feeling (-ed)', 'Cause (-ing)']}
          rows={[
            ['bored', 'boring'],
            ['interested', 'interesting'],
            ['excited', 'exciting'],
            ['tired', 'tiring'],
            ['surprised', 'surprising'],
            ['confused', 'confusing'],
            ['worried', 'worrying'],
            ['frightened', 'frightening'],
          ]}
        />
        <Examples
          items={[
            <>
              I was <Key>bored</Key> because the film was <Key>boring</Key>.
            </>,
            <>
              The news was <Key>surprising</Key>. We were all <Key>surprised</Key>.
            </>,
            <>
              It was a <Key>tiring</Key> journey, so I feel <Key>tired</Key>.
            </>,
          ]}
        />
        <p>
          Be careful with people: <em>He is boring</em> means he makes other people bored; <em>He is bored</em> means he feels bored.
        </p>
      </Section>

      <Section title="Common mistakes">
        <Mistakes
          items={[
            { wrong: 'I am very boring today.', right: 'I am very bored today.', why: 'You feel bored. "Boring" means you bore other people.' },
            { wrong: 'The film was really excited.', right: 'The film was really exciting.', why: 'The film causes the feeling: -ing.' },
            { wrong: 'She is interesting in art.', right: 'She is interested in art.', why: 'Her feeling: -ed (and the preposition is in).' },
            { wrong: 'I am confusing by this rule.', right: 'I am confused by this rule.', why: 'Use -ed for how you feel.' },
          ]}
        />
      </Section>
    </>
  );
}
