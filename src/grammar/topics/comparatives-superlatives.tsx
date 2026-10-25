import { Examples, FormTable, Key, Mistakes, Rule, Section } from '../helpers';

export default function ComparativesSuperlatives() {
  return (
    <>
      <Rule>
        <p className="mb-0">
          Compare two things with the <strong>comparative</strong> + <em>than</em> (taller than). Say something is the top of a group with{' '}
          <em>the</em> + <strong>superlative</strong> (the tallest).
        </p>
      </Rule>

      <Section title="Forms">
        <FormTable
          caption="Comparative and superlative forms"
          head={['Adjective', 'Comparative', 'Superlative']}
          rows={[
            ['short (one syllable): tall', 'taller', 'the tallest'],
            ['ending in -e: nice', 'nicer', 'the nicest'],
            ['one vowel + consonant: big', 'bigger', 'the biggest'],
            ['consonant + -y: happy', 'happier', 'the happiest'],
            ['long (usually three or more syllables): expensive', 'more expensive', 'the most expensive'],
            ['irregular: good', 'better', 'the best'],
            ['irregular: bad', 'worse', 'the worst'],
            ['irregular: far', 'farther / further', 'the farthest / furthest'],
          ]}
        />
        <p className="small text-secondary">Two-syllable adjectives vary: clever → cleverer or more clever. Check a dictionary if you are not sure.</p>
      </Section>

      <Section title="Use">
        <Examples
          items={[
            <>
              My brother is <Key>taller than</Key> me.
            </>,
            <>
              This book is <Key>more interesting than</Key> the film.
            </>,
            <>
              She is <Key>the best</Key> student <Key>in</Key> the class.
            </>,
            <>
              It was <Key>the most beautiful</Key> place <Key>I have ever seen</Key>.
            </>,
            <>
              The weather is getting <Key>colder and colder</Key>. / <Key>The more</Key> you practise, <Key>the better</Key> you get.
            </>,
          ]}
        />
        <p>
          After a superlative use <em>in</em> with places and groups (<em>in the world, in the team</em>) and <em>of</em> with a number or plural (<em>of the three</em>).
        </p>
      </Section>

      <Section title="Common mistakes">
        <Mistakes
          items={[
            { wrong: 'She is more tall than me.', right: 'She is taller than me.', why: 'Short adjectives take -er, not more.' },
            { wrong: 'This is more better.', right: 'This is better.', why: 'Better is already a comparative.' },
            { wrong: 'He is the most tallest boy.', right: 'He is the tallest boy.', why: 'Use either -est or most, never both.' },
            { wrong: 'My car is faster of yours.', right: 'My car is faster than yours.', why: 'Use than after a comparative.' },
            { wrong: 'the biggest city of the world', right: 'the biggest city in the world', why: 'Use in with places.' },
          ]}
        />
      </Section>
    </>
  );
}
