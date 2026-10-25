import { Examples, FormTable, Key, Mistakes, Rule, Section } from '../helpers';

export default function FutureForms() {
  return (
    <>
      <Rule>
        <p className="mb-0">
          English has no single future tense. Choose the form by meaning: <strong>will</strong> for decisions made now, predictions and promises;{' '}
          <strong>going to</strong> for plans and for things you can see coming; the <strong>present continuous</strong> for arrangements.
        </p>
      </Rule>

      <Section title="Which form?">
        <FormTable
          caption="Ways to talk about the future"
          head={['Form', 'Use', 'Example']}
          rows={[
            ['will + base verb', 'a decision made now; a prediction; a promise or offer', "I'll help you. It will rain tomorrow."],
            ['be going to + base verb', 'a plan or intention; evidence now', "I'm going to study law. Look at the clouds: it's going to rain."],
            ['present continuous', 'a fixed arrangement (with a time)', "I'm meeting Anna at six."],
            ['present simple', 'timetables and schedules', 'The film starts at eight.'],
            ['will be + -ing', 'an action in progress at a future time', 'This time tomorrow I\'ll be flying to Rome.'],
            ['will have + past participle', 'finished before a future time', 'By 2030 I will have finished my degree.'],
          ]}
        />
      </Section>

      <Section title="Examples">
        <Examples
          items={[
            <>
              "The phone is ringing." "I<Key>'ll get</Key> it." (decision now)
            </>,
            <>
              <Key>I'm going to</Key> buy a new car next month. (plan)
            </>,
            <>
              We <Key>are flying</Key> to Madrid on Friday. (arranged)
            </>,
          ]}
        />
        <p>
          After <em>if, when, as soon as, before, after, until</em> use a present form for the future: <em>I will call you when I arrive.</em>
        </p>
      </Section>

      <Section title="Common mistakes">
        <Mistakes
          items={[
            { wrong: 'If it will rain, we will stay at home.', right: 'If it rains, we will stay at home.', why: 'After if, use the present simple.' },
            { wrong: 'When I will arrive, I will call you.', right: 'When I arrive, I will call you.', why: 'After when, use the present simple for the future.' },
            { wrong: 'I will to go.', right: 'I will go.', why: 'After will, use the base verb without to.' },
            { wrong: 'I go to the cinema tonight with Anna.', right: "I'm going to the cinema tonight with Anna.", why: 'A personal arrangement needs the present continuous.' },
          ]}
        />
      </Section>
    </>
  );
}
