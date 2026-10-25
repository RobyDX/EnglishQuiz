import { Examples, FormTable, Key, Mistakes, Rule, Section } from '../helpers';

export default function PresentContinuous() {
  return (
    <>
      <Rule>
        <p className="mb-0">
          Use the present continuous for actions <strong>happening now</strong>, <strong>temporary</strong> situations and <strong>arranged plans</strong>.
          Form: <em>am / is / are + verb-ing</em>.
        </p>
      </Rule>

      <Section title="Form">
        <FormTable
          caption="Present continuous of work"
          head={['', 'Example']}
          rows={[
            ['Positive', "I'm working. She's working. They're working."],
            ['Negative', "I'm not working. He isn't working. We aren't working."],
            ['Question', 'Are you working? Is she working?'],
          ]}
        />
        <p>
          Spelling of <em>-ing</em>: drop the silent <em>-e</em> (make → making); double a final consonant after one vowel (run → running, sit → sitting);{' '}
          <em>-ie</em> becomes <em>-ying</em> (lie → lying).
        </p>
      </Section>

      <Section title="Use">
        <Examples
          items={[
            <>
              Please be quiet. The baby <Key>is sleeping</Key>. (now)
            </>,
            <>
              I <Key>am staying</Key> with friends this week. (temporary)
            </>,
            <>
              We <Key>are meeting</Key> Anna tomorrow at six. (arrangement)
            </>,
            <>
              Prices <Key>are rising</Key>. (a changing situation)
            </>,
          ]}
        />
        <p>
          Words that often go with it: <em>now, at the moment, today, this week, currently</em>. Do not use it with state verbs like <em>know, like, want</em> (see{' '}
          <em>Stative verbs</em>).
        </p>
      </Section>

      <Section title="Common mistakes">
        <Mistakes
          items={[
            { wrong: 'I am knowing the answer.', right: 'I know the answer.', why: 'Know is a state verb: present simple.' },
            { wrong: 'She is work now.', right: 'She is working now.', why: 'After am / is / are, add -ing.' },
            { wrong: 'I am go to the cinema tomorrow.', right: 'I am going to the cinema tomorrow.', why: 'Use the -ing form.' },
            { wrong: 'He is running to the park every day.', right: 'He runs to the park every day.', why: 'A regular habit needs the present simple.' },
          ]}
        />
      </Section>
    </>
  );
}
