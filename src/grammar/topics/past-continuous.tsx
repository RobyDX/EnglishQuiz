import { Examples, FormTable, Key, Mistakes, Rule, Section } from '../helpers';

export default function PastContinuous() {
  return (
    <>
      <Rule>
        <p className="mb-0">
          Use the past continuous for an action that was <strong>in progress</strong> at a moment in the past. It is often the background, interrupted by a shorter action in the
          past simple. Form: <em>was / were + verb-ing</em>.
        </p>
      </Rule>

      <Section title="Form">
        <FormTable
          caption="Past continuous of work"
          head={['', 'Example']}
          rows={[
            ['Positive', 'I was working. They were working.'],
            ['Negative', "She wasn't working. We weren't working."],
            ['Question', 'Were you working? Was he working?'],
          ]}
        />
      </Section>

      <Section title="Use">
        <Examples
          items={[
            <>
              At eight last night, I <Key>was watching</Key> TV. (in progress at a moment)
            </>,
            <>
              I <Key>was having</Key> breakfast when the phone <Key>rang</Key>. (long action + interruption)
            </>,
            <>
              While she <Key>was cooking</Key>, he <Key>was reading</Key>. (two actions at the same time)
            </>,
          ]}
        />
        <p>
          Use <em>when</em> + past simple for the short action, and <em>while</em> + past continuous for the long action. Do not use it for finished events in a list:{' '}
          <em>I got up, had a shower and left</em> (past simple).
        </p>
      </Section>

      <Section title="Common mistakes">
        <Mistakes
          items={[
            { wrong: 'At eight last night I watched TV.', right: 'At eight last night I was watching TV.', why: 'The action was in progress at that moment.' },
            { wrong: 'I was watched TV.', right: 'I was watching TV.', why: 'After was / were, use -ing.' },
            { wrong: 'I was having breakfast when the phone was ringing.', right: 'I was having breakfast when the phone rang.', why: 'The interrupting action is short: past simple.' },
            { wrong: 'What were you do at nine?', right: 'What were you doing at nine?', why: 'After was / were, use the -ing form.' },
          ]}
        />
      </Section>
    </>
  );
}
