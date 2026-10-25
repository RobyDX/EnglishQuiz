import { Examples, FormTable, Key, Mistakes, Rule, Section } from '../helpers';

export default function AsAsTooEnough() {
  return (
    <>
      <Rule>
        <p className="mb-0">
          Use <strong>as … as</strong> for things that are equal, <strong>too</strong> for "more than is good" and <strong>enough</strong> for "as much as
          needed".
        </p>
      </Rule>

      <Section title="as … as">
        <Examples
          items={[
            <>
              He is <Key>as tall as</Key> his father.
            </>,
            <>
              She doesn't speak <Key>as fast as</Key> I do. (= not so fast)
            </>,
            <>
              It is <Key>twice as</Key> expensive <Key>as</Key> the other one.
            </>,
            <>
              She has <Key>the same</Key> teacher <Key>as</Key> me.
            </>,
          ]}
        />
      </Section>

      <Section title="too and enough">
        <FormTable
          caption="too and enough"
          head={['Pattern', 'Meaning', 'Example']}
          rows={[
            ['too + adjective/adverb', 'more than is good (a problem)', 'The soup is too hot to eat.'],
            ['too much / too many + noun', 'more than is good', 'There is too much noise. Too many cars.'],
            ['adjective + enough', 'the right amount', 'He is old enough to drive.'],
            ['enough + noun', 'as much as needed', 'We have enough chairs.'],
            ['not + adjective + enough', 'less than needed', 'It is not warm enough to swim.'],
          ]}
        />
        <p>
          <strong>Too</strong> is negative. For a positive idea use <strong>very</strong>: <em>The soup is very hot</em> (just a fact) vs{' '}
          <em>The soup is too hot</em> (I can't eat it).
        </p>
      </Section>

      <Section title="Common mistakes">
        <Mistakes
          items={[
            { wrong: 'He is enough old.', right: 'He is old enough.', why: 'Enough goes after an adjective.' },
            { wrong: 'It is too much cold.', right: 'It is too cold.', why: 'Use too (not too much) before an adjective.' },
            { wrong: 'She is as tall like me.', right: 'She is as tall as me.', why: 'Use as … as, not like.' },
            { wrong: 'I am too happy to see you.', right: 'I am very happy to see you.', why: 'Too means a problem; use very for a good feeling.' },
          ]}
        />
      </Section>
    </>
  );
}
