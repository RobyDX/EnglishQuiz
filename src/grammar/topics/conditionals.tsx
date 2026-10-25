import { Examples, FormTable, Key, Mistakes, Rule, Section } from '../helpers';

export default function Conditionals() {
  return (
    <>
      <Rule>
        <p className="mb-0">
          A conditional sentence has an <strong>if-clause</strong> (the condition) and a <strong>main clause</strong> (the result). The tenses show how real or
          unreal the situation is. Normally do not use <em>will</em> or <em>would</em> in the if-clause.
        </p>
      </Rule>

      <Section title="The types">
        <FormTable
          caption="Conditionals"
          head={['Type', 'If-clause', 'Main clause', 'Example']}
          rows={[
            ['Zero (always true)', 'present simple', 'present simple', 'If you heat ice, it melts.'],
            ['First (real future)', 'present simple', 'will + base verb', 'If it rains, we will stay home.'],
            ['Second (unreal present / future)', 'past simple', 'would + base verb', 'If I had a car, I would drive to work.'],
            ['Third (unreal past)', 'past perfect', 'would have + past participle', 'If I had known, I would have called.'],
            ['Mixed (past cause, present result)', 'past perfect', 'would + base verb', 'If I had studied, I would have a better job now.'],
          ]}
        />
      </Section>

      <Section title="Notes">
        <Examples
          items={[
            <>
              If I <Key>were</Key> you, I <Key>would</Key> accept. (in the second conditional, <em>were</em> is used with all persons)
            </>,
            <>
              <Key>Unless</Key> you hurry, you will miss the bus. (= if you don't hurry)
            </>,
            <>
              We will go out <Key>if</Key> the weather is good. (no comma when the if-clause is second)
            </>,
          ]}
        />
        <p>
          Other words that work like <em>if</em>: <em>as long as, provided that, suppose</em>.
        </p>
      </Section>

      <Section title="Common mistakes">
        <Mistakes
          items={[
            { wrong: 'If it will rain, we will stay home.', right: 'If it rains, we will stay home.', why: 'No will in the if-clause.' },
            { wrong: 'If I would have money, I would buy it.', right: 'If I had money, I would buy it.', why: 'Use the past simple after if, not would.' },
            { wrong: 'If I had known, I would told you.', right: 'If I had known, I would have told you.', why: 'Third conditional: would have + past participle.' },
            { wrong: 'If I will see him, I will tell him.', right: 'If I see him, I will tell him.', why: 'Use the present simple after if.' },
          ]}
        />
      </Section>
    </>
  );
}
