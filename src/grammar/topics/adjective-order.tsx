import { Examples, FormTable, Key, Mistakes, Rule, Section } from '../helpers';

export default function AdjectiveOrder() {
  return (
    <>
      <Rule>
        <p className="mb-0">
          Adjectives go <strong>before the noun</strong>, never change for the plural, and follow a natural order when there are several:{' '}
          opinion → size → age → shape → colour → origin → material → purpose.
        </p>
      </Rule>

      <Section title="The order">
        <FormTable
          caption="Order of adjectives before a noun"
          head={['Category', 'Examples']}
          rows={[
            ['1. Opinion', 'lovely, nice, ugly'],
            ['2. Size', 'big, small, tiny'],
            ['3. Age', 'old, new, young'],
            ['4. Shape', 'round, square'],
            ['5. Colour', 'red, blue, green'],
            ['6. Origin', 'Italian, British'],
            ['7. Material', 'wooden, cotton, silver'],
            ['8. Purpose', 'sleeping (bag), running (shoes)'],
          ]}
        />
        <Examples
          items={[
            <>
              a <Key>lovely old</Key> house
            </>,
            <>
              a <Key>small round wooden</Key> table
            </>,
            <>
              two <Key>big black Italian</Key> cars
            </>,
          ]}
        />
        <p className="small text-secondary">
          Using more than three adjectives sounds heavy; use two or three. After <em>be, look, seem, feel</em> the adjectives follow the verb: <em>The house is old and quiet.</em>
        </p>
      </Section>

      <Section title="Common mistakes">
        <Mistakes
          items={[
            { wrong: 'a car red', right: 'a red car', why: 'The adjective goes before the noun.' },
            { wrong: 'two expensives cars', right: 'two expensive cars', why: 'Adjectives never take a plural -s.' },
            { wrong: 'a wooden small box', right: 'a small wooden box', why: 'Size comes before material.' },
            { wrong: 'a French old film', right: 'an old French film', why: 'Age comes before origin.' },
          ]}
        />
      </Section>
    </>
  );
}
