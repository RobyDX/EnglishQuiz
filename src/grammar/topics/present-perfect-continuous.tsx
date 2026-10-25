import { Examples, FormTable, Key, Mistakes, Rule, Section } from '../helpers';

export default function PresentPerfectContinuous() {
  return (
    <>
      <Rule>
        <p className="mb-0">
          Use the present perfect continuous to stress the <strong>duration</strong> of an action that started in the past and is still going on, or that has just stopped and
          has a visible result. Form: <em>have / has been + verb-ing</em>.
        </p>
      </Rule>

      <Section title="Form">
        <FormTable
          caption="Present perfect continuous of wait"
          head={['', 'Example']}
          rows={[
            ['Positive', "I've been waiting. She's been waiting."],
            ['Negative', "I haven't been waiting. He hasn't been waiting."],
            ['Question', 'Have you been waiting? How long has she been waiting?'],
          ]}
        />
      </Section>

      <Section title="Use">
        <Examples
          items={[
            <>
              I <Key>have been waiting</Key> <Key>for</Key> an hour. (still waiting)
            </>,
            <>
              She <Key>has been learning</Key> English <Key>since</Key> January.
            </>,
            <>
              Your hands are dirty. <Key>Have you been</Key> <Key>working</Key> in the garden? (a recent action, result visible)
            </>,
          ]}
        />
        <h3 className="h6">Simple or continuous?</h3>
        <Examples
          items={[
            <>
              I <Key>have read</Key> three chapters. (result / how many: simple)
            </>,
            <>
              I <Key>have been reading</Key> all afternoon. (how long: continuous)
            </>,
          ]}
        />
        <p>
          State verbs (know, like, have, be) do not take the continuous: <em>I have known her for years.</em>
        </p>
      </Section>

      <Section title="Common mistakes">
        <Mistakes
          items={[
            { wrong: 'I am waiting for two hours.', right: 'I have been waiting for two hours.', why: 'With for / since and an action that continues, use the perfect.' },
            { wrong: 'How long are you living here?', right: 'How long have you been living here?', why: 'The present continuous cannot show duration up to now.' },
            { wrong: 'I have been working since three hours.', right: 'I have been working for three hours.', why: 'Use for with a period of time.' },
            { wrong: 'I have been knowing her for years.', right: 'I have known her for years.', why: 'Know is a state verb.' },
          ]}
        />
      </Section>
    </>
  );
}
