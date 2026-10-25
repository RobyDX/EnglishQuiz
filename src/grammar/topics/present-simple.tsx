import { Examples, FormTable, Key, Mistakes, Rule, Section } from '../helpers';

export default function PresentSimple() {
  return (
    <>
      <Rule>
        <p className="mb-0">
          Use the present simple for <strong>habits, routines, facts</strong> and timetables. With he / she / it, add <strong>-s</strong> to the verb.
        </p>
      </Rule>

      <Section title="Form">
        <FormTable
          caption="Present simple of work"
          head={['', 'I / you / we / they', 'he / she / it']}
          rows={[
            ['Positive', 'I work', 'She works'],
            ['Negative', "I don't work", "She doesn't work"],
            ['Question', 'Do you work?', 'Does she work?'],
            ['Short answers', "Yes, I do. / No, I don't.", "Yes, she does. / No, she doesn't."],
          ]}
        />
        <p>
          Spelling of the <em>-s</em> form: most verbs add <em>-s</em> (works); verbs in <em>-s, -sh, -ch, -x, -o</em> add <em>-es</em> (watches, goes); consonant + <em>y</em>{' '}
          becomes <em>-ies</em> (studies). <em>Have</em> becomes <em>has</em>.
        </p>
        <p>
          After <em>does / doesn't</em> the verb has <strong>no -s</strong>.
        </p>
      </Section>

      <Section title="Use">
        <Examples
          items={[
            <>
              I <Key>get up</Key> at seven every day. (routine)
            </>,
            <>
              Water <Key>boils</Key> at 100 degrees. (fact)
            </>,
            <>
              The train <Key>leaves</Key> at nine. (timetable)
            </>,
            <>
              She <Key>always</Key> drinks coffee. / He is <Key>never</Key> late. (frequency adverbs)
            </>,
          ]}
        />
        <p>
          Frequency adverbs (always, usually, often, sometimes, never) go <strong>before</strong> the main verb and <strong>after</strong> <em>be</em>.
        </p>
      </Section>

      <Section title="Common mistakes">
        <Mistakes
          items={[
            { wrong: 'She work in a bank.', right: 'She works in a bank.', why: 'Add -s with he / she / it.' },
            { wrong: "He doesn't works here.", right: "He doesn't work here.", why: 'After doesn\'t the verb is in its base form.' },
            { wrong: 'Does she likes tea?', right: 'Does she like tea?', why: 'After does the verb has no -s.' },
            { wrong: 'I am go to school every day.', right: 'I go to school every day.', why: 'Do not mix be with the base verb.' },
            { wrong: 'I always am late.', right: 'I am always late.', why: 'Frequency adverbs go after be.' },
          ]}
        />
      </Section>
    </>
  );
}
