import { Examples, FormTable, Key, Mistakes, Rule, Section } from '../helpers';

export default function ReportedSpeech() {
  return (
    <>
      <Rule>
        <p className="mb-0">
          In reported speech we tell what someone said without using their exact words. When the reporting verb is in the past, the tense usually goes{' '}
          <strong>one step back</strong>, and pronouns and time words change.
        </p>
      </Rule>

      <Section title="Changes of tense">
        <FormTable
          caption="Tense changes in reported speech"
          head={['Direct speech', 'Reported speech']}
          rows={[
            ['"I work here."', 'He said he worked there.'],
            ['"I am working."', 'He said he was working.'],
            ['"I worked."', 'He said he had worked.'],
            ['"I have worked."', 'He said he had worked.'],
            ['"I will work."', 'He said he would work.'],
            ['"I can work."', 'He said he could work.'],
            ['"I must work."', 'He said he had to work.'],
          ]}
        />
        <p>
          Time and place words change too: <em>today → that day, tomorrow → the next day, yesterday → the day before, now → then, here → there, this → that, ago → before.</em>
        </p>
        <p className="small text-secondary">
          If the reporting verb is in the present (<em>He says…</em>) or the fact is still true (<em>She said that the Earth is round</em>), you do not need to change the tense.
        </p>
      </Section>

      <Section title="Questions and commands">
        <Examples
          items={[
            <>
              "Where do you live?" → She asked me <Key>where I lived</Key>. (statement order, no do)
            </>,
            <>
              "Do you like tea?" → He asked <Key>if / whether</Key> I liked tea.
            </>,
            <>
              "Close the door." → She told me <Key>to close</Key> the door. / "Don't touch it." → He told me <Key>not to touch</Key> it.
            </>,
          ]}
        />
        <p>
          <em>Say</em> has no person after it (<em>He said that…</em>). <em>Tell</em> needs a person (<em>He told me that…</em>).
        </p>
      </Section>

      <Section title="Common mistakes">
        <Mistakes
          items={[
            { wrong: 'She asked me where did I live.', right: 'She asked me where I lived.', why: 'In reported questions use statement order.' },
            { wrong: 'He said me that he was tired.', right: 'He told me that he was tired.', why: 'Use tell with a person.' },
            { wrong: 'She asked me do I like tea.', right: 'She asked me if I liked tea.', why: 'Use if / whether in yes / no questions.' },
            { wrong: "I told him don't come.", right: 'I told him not to come.', why: 'Reported commands use (not) to + verb.' },
          ]}
        />
      </Section>
    </>
  );
}
