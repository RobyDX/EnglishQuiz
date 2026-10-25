import { Examples, FormTable, Key, Mistakes, Rule, Section } from '../helpers';

export default function Articles() {
  return (
    <>
      <Rule>
        <p className="mb-0">
          Use <strong>a / an</strong> for one non-specific thing, <strong>the</strong> for something specific that the listener knows, and{' '}
          <strong>no article</strong> for general plural and uncountable nouns.
        </p>
      </Rule>

      <Section title="A or an?">
        <p>
          Choose by the <strong>sound</strong>, not the letter: <Key>an</Key> before a vowel sound, <Key>a</Key> before a consonant sound.
        </p>
        <Examples
          items={[
            <>
              <Key>an</Key> apple, <Key>an</Key> hour (the h is silent), <Key>an</Key> MP
            </>,
            <>
              <Key>a</Key> university (it starts with the sound "yoo"), <Key>a</Key> European city
            </>,
          ]}
        />
      </Section>

      <Section title="When to use each">
        <FormTable
          caption="Articles: a / an, the and no article"
          head={['Article', 'Use', 'Example']}
          rows={[
            ['a / an', 'first mention; a job; "one of many"', 'I saw a dog. She is a nurse.'],
            ['the', 'already mentioned; only one; superlatives', 'The dog was big. The sun. The best day.'],
            ['no article', 'general plural / uncountable nouns; most countries and cities; meals; languages', 'I like music. He lives in Spain. We have lunch at one.'],
          ]}
        />
        <p>
          Also use <em>the</em> with rivers, seas and mountain ranges (<em>the Thames, the Alps</em>), countries with "Republic", "Kingdom" or a plural name
          (<em>the United States, the Netherlands</em>), and with fixed phrases like <em>the cinema, the radio</em>.
        </p>
        <p>
          Without article: <em>go to school / bed / work / church</em> (the usual purpose), <em>at home</em>, <em>by car / bus</em>.
        </p>
      </Section>

      <Section title="Common mistakes">
        <Mistakes
          items={[
            { wrong: 'She is doctor.', right: 'She is a doctor.', why: 'Use a / an with jobs.' },
            { wrong: 'I have a breakfast at eight.', right: 'I have breakfast at eight.', why: 'No article with meals.' },
            { wrong: 'The life is beautiful.', right: 'Life is beautiful.', why: 'No article when you talk about something in general.' },
            { wrong: 'I am going to the home.', right: 'I am going home.', why: 'Home needs no article and no preposition after go.' },
            { wrong: 'He is an university student.', right: 'He is a university student.', why: 'University starts with a consonant sound.' },
          ]}
        />
      </Section>
    </>
  );
}
