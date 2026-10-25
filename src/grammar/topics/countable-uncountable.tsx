import { Examples, FormTable, Key, Mistakes, Rule, Section } from '../helpers';

export default function CountableUncountable() {
  return (
    <>
      <Rule>
        <p className="mb-0">
          <strong>Countable</strong> nouns can be counted (one apple, two apples) and have a plural. <strong>Uncountable</strong> nouns (water, advice,
          information) cannot be counted, have no plural and take a singular verb.
        </p>
      </Rule>

      <Section title="Which words go with which">
        <FormTable
          caption="Words used with countable and uncountable nouns"
          head={['', 'Countable (apple, book)', 'Uncountable (water, advice)']}
          rows={[
            ['a / an', 'a book', '— (never)'],
            ['Numbers', 'two books', '— (never)'],
            ['Many / much', 'How many books?', 'How much water?'],
            ['A few / a little', 'a few books', 'a little water'],
            ['Some, any, a lot of', 'some books', 'some water'],
          ]}
        />
      </Section>

      <Section title="Common uncountable nouns">
        <p>
          advice, information, news, furniture, luggage, homework, money, traffic, weather, bread, music, progress, rice, work (in general).
        </p>
        <p>To count them, use a unit word:</p>
        <Examples
          items={[
            <>
              a <Key>piece of</Key> advice / information / news
            </>,
            <>
              a <Key>glass of</Key> water, a <Key>slice of</Key> bread, a <Key>cup of</Key> coffee
            </>,
            <>
              The news <Key>is</Key> good. (singular verb)
            </>,
          ]}
        />
        <p className="small text-secondary">
          Some nouns are both, with a different meaning: <em>I like chicken</em> (the food) and <em>There are three chickens in the garden</em> (the animals).
        </p>
      </Section>

      <Section title="Common mistakes">
        <Mistakes
          items={[
            { wrong: 'I need some advices.', right: 'I need some advice.', why: 'Advice is uncountable: no plural -s.' },
            { wrong: 'The news are good.', right: 'The news is good.', why: 'News looks plural but takes a singular verb.' },
            { wrong: 'How many money do you have?', right: 'How much money do you have?', why: 'Use much with uncountable nouns.' },
            { wrong: 'She has a lot of luggages.', right: 'She has a lot of luggage.', why: 'Luggage is uncountable.' },
          ]}
        />
      </Section>
    </>
  );
}
