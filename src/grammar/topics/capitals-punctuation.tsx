import { Examples, FormTable, Key, Mistakes, Rule, Section } from '../helpers';

export default function CapitalsPunctuation() {
  return (
    <>
      <Rule>
        <p className="mb-0">
          Use capital letters for <strong>I</strong>, names, days, months, nationalities and languages. Use punctuation to show where ideas start and stop: full stops,
          commas, apostrophes and question marks.
        </p>
      </Rule>

      <Section title="Capital letters">
        <FormTable
          caption="When to use capital letters"
          head={['Use a capital for', 'Examples']}
          rows={[
            ['the word I', 'Yesterday I went home.'],
            ['names of people and places', 'Maria, London, the Atlantic'],
            ['days and months', 'Monday, June (but not seasons: summer)'],
            ['nationalities and languages', 'an Italian, English, a French film'],
            ['titles and the first word of a sentence', 'Doctor Smith. The film is great.'],
          ]}
        />
      </Section>

      <Section title="Punctuation">
        <FormTable
          caption="Main punctuation marks"
          head={['Mark', 'Use', 'Example']}
          rows={[
            ['. full stop', 'end of a statement', 'I like tea.'],
            ['? question mark', 'end of a question', 'Do you like tea?'],
            [', comma', 'lists; after an opening phrase; before and / but joining two clauses', 'I bought milk, eggs and bread. After lunch, we left.'],
            ["' apostrophe", 'contractions and possession', "It's late. Anna's bag."],
            ['; semicolon', 'joins two related sentences', 'It was late; we went home.'],
            [': colon', 'introduces a list or explanation', 'You need three things: time, money and patience.'],
            ['"…" quotation marks', 'exact words', 'She said, "I\'m ready."'],
          ]}
        />
        <Examples
          items={[
            <>
              Apostrophes do not make plurals: apple<Key>s</Key>, not apple's.
            </>,
            <>
              Do not put a comma between a verb and its object: <em>I think that she is right</em> (not "I think, that she is right").
            </>,
          ]}
        />
      </Section>

      <Section title="Common mistakes">
        <Mistakes
          items={[
            { wrong: 'i am happy.', right: 'I am happy.', why: 'Always write I as a capital.' },
            { wrong: 'I have class on monday.', right: 'I have class on Monday.', why: 'Days begin with a capital.' },
            { wrong: 'She speaks english.', right: 'She speaks English.', why: 'Languages begin with a capital.' },
            { wrong: "Apple's for sale.", right: 'Apples for sale.', why: 'Do not use an apostrophe for plurals.' },
            { wrong: 'I was tired, I went to bed.', right: 'I was tired, so I went to bed. / I was tired; I went to bed.', why: 'A comma alone cannot join two sentences.' },
          ]}
        />
      </Section>
    </>
  );
}
