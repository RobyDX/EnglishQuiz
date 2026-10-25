import { Examples, FormTable, Key, Mistakes, Rule, Section } from '../helpers';

export default function Causative() {
  return (
    <>
      <Rule>
        <p className="mb-0">
          Use <strong>have / get + object + past participle</strong> when someone else does something for you, or when something happens to you.
        </p>
      </Rule>

      <Section title="Form">
        <FormTable
          caption="Causative have and get"
          head={['Pattern', 'Example']}
          rows={[
            ['have + object + past participle', 'I had my hair cut. She is having her car repaired.'],
            ['get + object + past participle (informal)', 'We must get the windows cleaned.'],
            ['have + person + base verb', 'I had the mechanic check the brakes.'],
            ['get + person + to + verb', 'I got my brother to help me.'],
          ]}
        />
      </Section>

      <Section title="Use">
        <Examples
          items={[
            <>
              I <Key>have my car washed</Key> every month. (a service, someone else does it)
            </>,
            <>
              He <Key>had his wallet stolen</Key> on the train. (something bad happened to him)
            </>,
            <>
              Where do you <Key>get your hair done</Key>?
            </>,
          ]}
        />
        <p>
          Compare: <em>I had my hair cut</em> (someone cut it) and <em>I had cut my hair</em> (past perfect: I cut it before).
        </p>
      </Section>

      <Section title="Common mistakes">
        <Mistakes
          items={[
            { wrong: 'I cut my hair at the hairdresser every month.', right: 'I have my hair cut at the hairdresser every month.', why: 'Someone else does the action.' },
            { wrong: 'She has repaired her car at the garage.', right: 'She has had her car repaired at the garage.', why: 'Use have + object + past participle.' },
            { wrong: 'I had my house to paint.', right: 'I had my house painted.', why: 'Use the past participle, not to + verb.' },
            { wrong: 'I got him fix the sink.', right: 'I got him to fix the sink.', why: 'After get + person use to + verb.' },
          ]}
        />
      </Section>
    </>
  );
}
