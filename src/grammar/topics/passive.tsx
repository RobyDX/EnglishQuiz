import { Examples, FormTable, Key, Mistakes, Rule, Section } from '../helpers';

export default function Passive() {
  return (
    <>
      <Rule>
        <p className="mb-0">
          Use the passive when the <strong>action or the receiver</strong> matters more than who does it. Form: <em>be + past participle</em>. The tense is shown by{' '}
          <em>be</em>.
        </p>
      </Rule>

      <Section title="Form">
        <FormTable
          caption="Active and passive in different tenses"
          head={['Tense', 'Active', 'Passive']}
          rows={[
            ['Present simple', 'They make cars here.', 'Cars are made here.'],
            ['Present continuous', 'They are building a bridge.', 'A bridge is being built.'],
            ['Past simple', 'Someone stole my bike.', 'My bike was stolen.'],
            ['Past continuous', 'They were repairing the road.', 'The road was being repaired.'],
            ['Present perfect', 'They have cancelled the flight.', 'The flight has been cancelled.'],
            ['Past perfect', 'They had closed the shop.', 'The shop had been closed.'],
            ['Future (will)', 'They will finish it.', 'It will be finished.'],
            ['Modal', 'You can do it.', 'It can be done.'],
          ]}
        />
      </Section>

      <Section title="Use">
        <Examples
          items={[
            <>
              English <Key>is spoken</Key> all over the world. (who speaks is not important)
            </>,
            <>
              The Mona Lisa <Key>was painted</Key> <Key>by</Key> Leonardo da Vinci. (agent introduced by <em>by</em>)
            </>,
            <>
              My phone <Key>has been stolen</Key>! (we don't know who)
            </>,
          ]}
        />
        <p>
          Only verbs with an object (transitive verbs) can become passive. Verbs like <em>happen, arrive, die, sleep</em> have no passive.
        </p>
      </Section>

      <Section title="Common mistakes">
        <Mistakes
          items={[
            { wrong: 'The window broke by the boy.', right: 'The window was broken by the boy.', why: 'Use be + past participle.' },
            { wrong: 'It was happened yesterday.', right: 'It happened yesterday.', why: 'Happen has no passive.' },
            { wrong: 'English is speak here.', right: 'English is spoken here.', why: 'Use the past participle (spoken).' },
            { wrong: 'I am born in 1990.', right: 'I was born in 1990.', why: 'We say "was born" (past), even for a person who is alive.' },
          ]}
        />
      </Section>
    </>
  );
}
