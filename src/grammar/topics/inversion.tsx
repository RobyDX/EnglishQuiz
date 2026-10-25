import { Examples, FormTable, Key, Mistakes, Rule, Section } from '../helpers';

export default function Inversion() {
  return (
    <>
      <Rule>
        <p className="mb-0">
          In formal or emphatic English, a sentence can start with a negative or restrictive expression. Then the <strong>auxiliary comes before the subject</strong>,
          as in a question: <em>Never have I seen…</em>
        </p>
      </Rule>

      <Section title="Forms">
        <FormTable
          caption="Inversion after negative expressions"
          head={['Expression', 'Example']}
          rows={[
            ['Never, rarely, seldom, little', 'Never have I seen such a view. Rarely do we eat out.'],
            ['Hardly … when / No sooner … than', 'Hardly had I arrived when it started to rain. No sooner had he left than she called.'],
            ['Not only … but also', 'Not only did she win, but she also broke the record.'],
            ['Only after / only when / only then', 'Only after the show did I realise.'],
            ['Under no circumstances, on no account', 'Under no circumstances should you open it.'],
            ['So + adjective … that', 'So tired was she that she fell asleep.'],
          ]}
        />
        <p>
          If there is no auxiliary, add <em>do / does / did</em>: <em>Not only did she sing</em> (not "Not only sang she").
        </p>
      </Section>

      <Section title="Conditional inversion">
        <Examples
          items={[
            <>
              <Key>Had I known</Key>, I would have helped. (= If I had known)
            </>,
            <>
              <Key>Should you need</Key> help, call me. (= If you need)
            </>,
            <>
              <Key>Were I</Key> you, I would apologise. (= If I were you)
            </>,
          ]}
        />
      </Section>

      <Section title="Common mistakes">
        <Mistakes
          items={[
            { wrong: 'Never I have seen such a view.', right: 'Never have I seen such a view.', why: 'Put the auxiliary before the subject.' },
            { wrong: 'No sooner had he left when she called.', right: 'No sooner had he left than she called.', why: 'No sooner goes with than; hardly goes with when.' },
            { wrong: 'Not only she sang, but she also danced.', right: 'Not only did she sing, but she also danced.', why: 'Add did and use the base verb.' },
            { wrong: 'Rarely she goes out.', right: 'Rarely does she go out.', why: 'Add does and use the base verb.' },
          ]}
        />
      </Section>
    </>
  );
}
