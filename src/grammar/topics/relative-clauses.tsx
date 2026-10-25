import { Examples, FormTable, Key, Mistakes, Rule, Section } from '../helpers';

export default function RelativeClauses() {
  return (
    <>
      <Rule>
        <p className="mb-0">
          A relative clause gives more information about a noun. It starts with <strong>who</strong> (people), <strong>which</strong> (things),{' '}
          <strong>that</strong> (people or things), <strong>whose</strong>, <strong>where</strong> or <strong>when</strong>.
        </p>
      </Rule>

      <Section title="Relative words">
        <FormTable
          caption="Relative pronouns and adverbs"
          head={['Word', 'Use', 'Example']}
          rows={[
            ['who', 'people', 'The man who lives next door is a doctor.'],
            ['which', 'things', 'The book which I read was long.'],
            ['that', 'people or things (defining clauses only)', 'The car that I bought is red.'],
            ['whose', 'possession', 'The girl whose bag was stolen called the police.'],
            ['where', 'places', 'This is the town where I grew up.'],
            ['when', 'times', 'I remember the day when we met.'],
          ]}
        />
      </Section>

      <Section title="Defining and non-defining">
        <p>
          A <strong>defining</strong> clause says which person or thing we mean. It has <strong>no commas</strong>, can use <em>that</em>, and the pronoun can be left out when it
          is the object. A <strong>non-defining</strong> clause adds extra information, goes <strong>between commas</strong>, cannot use <em>that</em>, and the pronoun cannot be left out.
        </p>
        <Examples
          items={[
            <>
              The book <Key>(that) I borrowed</Key> was good. (defining: which book?)
            </>,
            <>
              My sister<Key>, who lives in Rome,</Key> is a teacher. (non-defining: extra information)
            </>,
          ]}
        />
      </Section>

      <Section title="Common mistakes">
        <Mistakes
          items={[
            { wrong: 'The man who he lives next door is nice.', right: 'The man who lives next door is nice.', why: 'Do not repeat the subject after who.' },
            { wrong: 'The book what I read was long.', right: 'The book that I read was long.', why: 'What cannot introduce a relative clause.' },
            { wrong: 'My sister, that lives in Rome, is a teacher.', right: 'My sister, who lives in Rome, is a teacher.', why: 'Non-defining clauses cannot use that.' },
            { wrong: 'The woman which called you is my aunt.', right: 'The woman who called you is my aunt.', why: 'Use who for people.' },
            { wrong: 'This is the house where I live in it.', right: 'This is the house where I live. / the house which I live in.', why: 'Do not add a second place word.' },
          ]}
        />
      </Section>
    </>
  );
}
