import { Examples, FormTable, Key, Mistakes, Rule, Section } from '../helpers';

export default function Quantifiers() {
  return (
    <>
      <Rule>
        <p className="mb-0">
          Quantifiers say <em>how much</em> or <em>how many</em>. Choose them by the noun: <strong>many / a few / few</strong> with plural countable nouns,{' '}
          <strong>much / a little / little</strong> with uncountable nouns.
        </p>
      </Rule>

      <Section title="Overview">
        <FormTable
          caption="Quantifiers with countable and uncountable nouns"
          head={['', 'Countable plural', 'Uncountable']}
          rows={[
            ['A large amount', 'many, a lot of', 'much, a lot of'],
            ['Some', 'a few', 'a little'],
            ['Not enough', 'few', 'little'],
            ['Both', 'some, any, enough, no, plenty of', 'some, any, enough, no, plenty of'],
          ]}
        />
      </Section>

      <Section title="Some or any?">
        <p>
          Use <Key>some</Key> in positive sentences and in offers or requests. Use <Key>any</Key> in negative sentences and in most questions.
        </p>
        <Examples
          items={[
            <>
              I have <Key>some</Key> friends in London.
            </>,
            <>
              Would you like <Key>some</Key> tea?
            </>,
            <>
              We don't have <Key>any</Key> milk. Is there <Key>any</Key> bread?
            </>,
          ]}
        />
      </Section>

      <Section title="A few / a little or few / little?">
        <p>
          <strong>A few / a little</strong> = some (positive). <strong>Few / little</strong> = almost none (negative, a problem).
        </p>
        <Examples
          items={[
            <>
              I have <Key>a few</Key> friends here. (I'm not alone.)
            </>,
            <>
              I have <Key>few</Key> friends here. (I feel lonely.)
            </>,
            <>
              There is <Key>a little</Key> time left. / There is <Key>little</Key> time left.
            </>,
          ]}
        />
        <p className="small text-secondary">
          In positive sentences <em>much</em> sounds formal: say <em>a lot of</em> instead (<em>We have a lot of time</em>). <em>Much</em> and <em>many</em> are
          normal in negatives and questions.
        </p>
      </Section>

      <Section title="Common mistakes">
        <Mistakes
          items={[
            { wrong: "I don't have some money.", right: "I don't have any money.", why: 'Use any in negative sentences.' },
            { wrong: 'How many water do you drink?', right: 'How much water do you drink?', why: 'Water is uncountable: much.' },
            { wrong: 'I have a little friends.', right: 'I have a few friends.', why: 'Friends is countable: a few.' },
            { wrong: 'There were much people.', right: 'There were a lot of people. / many people.', why: 'People is plural: many or a lot of.' },
          ]}
        />
      </Section>
    </>
  );
}
