import { FormTable, Mistakes, Rule, Section } from '../helpers';

export default function BritishAmerican() {
  return (
    <>
      <Rule>
        <p className="mb-0">
          British and American English differ in some spellings, words and small points of grammar. Both are correct. <strong>Choose one and be consistent</strong> in the same text.
        </p>
      </Rule>

      <Section title="Spelling">
        <FormTable
          caption="British and American spelling"
          head={['British', 'American']}
          rows={[
            ['colour, favourite, neighbour', 'color, favorite, neighbor'],
            ['centre, theatre', 'center, theater'],
            ['realise, organise', 'realize, organize'],
            ['travelled, cancelled', 'traveled, canceled'],
            ['defence, licence (noun)', 'defense, license'],
            ['programme (TV), grey', 'program, gray'],
          ]}
        />
      </Section>

      <Section title="Vocabulary">
        <FormTable
          caption="British and American words"
          head={['British', 'American']}
          rows={[
            ['flat', 'apartment'],
            ['lift', 'elevator'],
            ['lorry', 'truck'],
            ['holiday', 'vacation'],
            ['biscuit', 'cookie'],
            ['crisps', 'chips'],
            ['chips', 'fries'],
            ['petrol', 'gas (gasoline)'],
            ['pavement', 'sidewalk'],
            ['boot (of a car)', 'trunk'],
            ['autumn', 'fall'],
            ['film', 'movie'],
            ['rubbish', 'trash, garbage'],
            ['queue', 'line'],
            ['trousers', 'pants'],
            ['underground / tube', 'subway'],
            ['mobile phone', 'cell phone'],
          ]}
        />
      </Section>

      <Section title="Grammar and usage">
        <FormTable
          caption="Small grammar differences"
          head={['British', 'American']}
          rows={[
            ['I\'ve just seen him. (present perfect)', 'I just saw him. (past simple)'],
            ['Have you got a pen?', 'Do you have a pen?'],
            ['at the weekend', 'on the weekend'],
            ['The team are winning. (plural)', 'The team is winning. (singular)'],
            ['She has got much better. (past participle: got)', 'She has gotten much better. (past participle: gotten)'],
            ['Dates: 25/12 (day first)', 'Dates: 12/25 (month first)'],
          ]}
        />
      </Section>

      <Section title="Common mistakes">
        <Mistakes
          items={[
            { wrong: 'The color of the neighbourhood is nice.', right: 'The colour of the neighbourhood is nice. / The color of the neighborhood is nice.', why: 'Do not mix British and American spelling.' },
            { wrong: 'We took the lift to our apartment.', right: 'We took the lift to our flat. / We took the elevator to our apartment.', why: 'Keep the same variety of English in one text.' },
          ]}
        />
      </Section>
    </>
  );
}
