import { Examples, FormTable, Key, Mistakes, Rule, Section } from '../helpers';

export default function CleftSentences() {
  return (
    <>
      <Rule>
        <p className="mb-0">
          A cleft sentence splits one idea into two parts to <strong>emphasise</strong> one of them. The two main patterns are{' '}
          <strong>It is/was … that/who</strong> and <strong>What … is/was …</strong>.
        </p>
      </Rule>

      <Section title="Patterns">
        <FormTable
          caption="Cleft sentences"
          head={['Pattern', 'Plain sentence', 'Cleft sentence']}
          rows={[
            ['It + be + focus + that / who', 'John broke the window. We met in Paris.', 'It was John who broke the window. It was in Paris that we met.'],
            ['What + clause + be + focus', 'I need a holiday. She wanted to see the sea.', 'What I need is a holiday. What she wanted was to see the sea.'],
            ['All / The thing / The reason', 'I only want some peace.', 'All I want is some peace. The reason I left is that I was bored.'],
            ['What happened was …', 'The car broke down.', 'What happened was that the car broke down.'],
          ]}
        />
      </Section>

      <Section title="Notes">
        <Examples
          items={[
            <>
              <Key>It was</Key> my brother <Key>who</Key> called. / <Key>It was</Key> yesterday <Key>that</Key> I saw her.
            </>,
            <>
              <Key>What annoys me is</Key> his attitude.
            </>,
          ]}
        />
        <p>
          Use <em>who</em> for people and <em>that</em> for things, times and places. Cleft sentences are common in speech and writing to correct or stress information.
        </p>
      </Section>

      <Section title="Common mistakes">
        <Mistakes
          items={[
            { wrong: 'It was Tom which broke it.', right: 'It was Tom who broke it.', why: 'Use who for people.' },
            { wrong: 'What I need it is a holiday.', right: 'What I need is a holiday.', why: 'Do not repeat the subject "it".' },
            { wrong: 'It was in Paris where we met.', right: 'It was in Paris that we met.', why: 'In the It-cleft use that, not where.' },
            { wrong: 'What I want is going home.', right: 'What I want is to go home.', why: 'After What … is, use to + verb (or a noun).' },
          ]}
        />
      </Section>
    </>
  );
}
