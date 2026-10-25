import { Examples, FormTable, Key, Mistakes, Rule, Section } from '../helpers';

export default function Possessives() {
  return (
    <>
      <Rule>
        <p className="mb-0">
          <strong>Possessive adjectives</strong> (my, your…) go before a noun. <strong>Possessive pronouns</strong> (mine, yours…) replace the noun.
          They agree with the <em>owner</em>, not with the thing.
        </p>
      </Rule>

      <Section title="Forms">
        <FormTable
          caption="Possessive adjectives and pronouns"
          head={['Owner', 'Adjective (+ noun)', 'Pronoun (no noun)']}
          rows={[
            ['I', 'my book', 'mine'],
            ['you', 'your book', 'yours'],
            ['he', 'his book', 'his'],
            ['she', 'her book', 'hers'],
            ['it', 'its tail', '—'],
            ['we', 'our book', 'ours'],
            ['they', 'their book', 'theirs'],
          ]}
        />
      </Section>

      <Section title="Use">
        <Examples
          items={[
            <>
              Mary loves <Key>her</Key> husband. John loves <Key>his</Key> wife.
            </>,
            <>
              This is not my pen. It's <Key>yours</Key>.
            </>,
            <>
              A friend <Key>of mine</Key> called. (one of my friends)
            </>,
            <>
              I washed <Key>my</Key> hands. (body parts take a possessive)
            </>,
          ]}
        />
        <p>Never use an article together with a possessive adjective.</p>
      </Section>

      <Section title="Common mistakes">
        <Mistakes
          items={[
            { wrong: 'the my book', right: 'my book', why: 'Do not use the with a possessive adjective.' },
            { wrong: 'Mary loves his husband.', right: 'Mary loves her husband.', why: 'The possessive agrees with the owner (Mary = she).' },
            { wrong: 'a friend of me', right: 'a friend of mine', why: 'After of, use the possessive pronoun.' },
            { wrong: 'I washed the hands.', right: 'I washed my hands.', why: 'Use a possessive with body parts.' },
          ]}
        />
      </Section>
    </>
  );
}
