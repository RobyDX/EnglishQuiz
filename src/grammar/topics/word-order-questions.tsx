import { Examples, FormTable, Key, Mistakes, Rule, Section } from '../helpers';

export default function WordOrderQuestions() {
  return (
    <>
      <Rule>
        <p className="mb-0">
          A statement follows <strong>subject + verb + object + place + time</strong>. A question puts the <strong>auxiliary before the subject</strong>:{' '}
          (question word) + auxiliary + subject + verb.
        </p>
      </Rule>

      <Section title="Statements">
        <Examples
          items={[
            <>
              <Key>I</Key> <Key>eat</Key> <Key>pasta</Key> <Key>at home</Key> <Key>every day</Key>.
            </>,
            <>
              She <Key>always</Key> drinks tea. / She <Key>is always</Key> happy. (frequency adverbs: before the verb, after be)
            </>,
          ]}
        />
        <p>The object comes straight after the verb; do not put an adverb between them.</p>
      </Section>

      <Section title="Questions">
        <FormTable
          caption="Question patterns"
          head={['Type', 'Pattern', 'Example']}
          rows={[
            ['Yes / no', 'auxiliary + subject + verb', 'Do you like tea? Is she here? Can they swim?'],
            ['Question word', 'wh- + auxiliary + subject + verb', 'Where do you live? What are they doing?'],
            ['Subject question', 'wh- + verb (no auxiliary)', 'Who called you? What happened?'],
            ['Indirect question', 'polite phrase + statement order', 'Do you know where he lives? Can you tell me what time it is?'],
          ]}
        />
        <p>
          With <em>be</em> and modal verbs, swap the verb and the subject. With other verbs add <em>do / does / did</em> and use the base verb.
        </p>
      </Section>

      <Section title="Common mistakes">
        <Mistakes
          items={[
            { wrong: 'Where you are going?', right: 'Where are you going?', why: 'Put the auxiliary before the subject.' },
            { wrong: 'What means this word?', right: 'What does this word mean?', why: 'Use do / does in questions with ordinary verbs.' },
            { wrong: 'Can you tell me where is the station?', right: 'Can you tell me where the station is?', why: 'Indirect questions keep statement order.' },
            { wrong: 'I eat every day pasta.', right: 'I eat pasta every day.', why: 'Object first, then time.' },
            { wrong: 'Do you know what time is it?', right: 'Do you know what time it is?', why: 'Indirect question: subject before verb.' },
          ]}
        />
      </Section>
    </>
  );
}
