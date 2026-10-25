import { Examples, FormTable, Key, Mistakes, Rule, Section } from '../helpers';

export default function PastPerfect() {
  return (
    <>
      <Rule>
        <p className="mb-0">
          Use the past perfect for an action that happened <strong>before another action or time in the past</strong>. Form:{' '}
          <em>had + past participle</em>.
        </p>
      </Rule>

      <Section title="Form">
        <FormTable
          caption="Past perfect of finish"
          head={['', 'Example']}
          rows={[
            ['Positive', 'I had finished. She had finished.'],
            ['Negative', "We hadn't finished."],
            ['Question', 'Had they finished?'],
          ]}
        />
        <p>
          <em>Had</em> is the same for all subjects, and the short form is <em>'d</em> (<em>I'd finished</em>).
        </p>
      </Section>

      <Section title="Use">
        <Examples
          items={[
            <>
              When I arrived, the film <Key>had</Key> already <Key>started</Key>. (first the film started, then I arrived)
            </>,
            <>
              She was tired because she <Key>had worked</Key> all day.
            </>,
            <>
              I didn't recognise him. He <Key>had</Key> changed a lot.
            </>,
            <>
              By the time we got to the station, the train <Key>had left</Key>.
            </>,
          ]}
        />
        <p>
          Useful words: <em>already, just, before, by the time, after, until</em>. The past perfect also appears in reported speech and in the third conditional.
        </p>
      </Section>

      <Section title="Common mistakes">
        <Mistakes
          items={[
            { wrong: 'When I arrived, the film started.', right: 'When I arrived, the film had started.', why: 'The film started first: past perfect.' },
            { wrong: 'I had saw him before.', right: 'I had seen him before.', why: 'Use the past participle after had.' },
            { wrong: 'Yesterday I had gone to the shop.', right: 'Yesterday I went to the shop.', why: 'With one past action, use the past simple.' },
            { wrong: 'After she had finished, she has left.', right: 'After she had finished, she left.', why: 'The later action is in the past simple.' },
          ]}
        />
      </Section>
    </>
  );
}
