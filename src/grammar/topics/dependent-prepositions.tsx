import { FormTable, Mistakes, Rule, Section } from '../helpers';

export default function DependentPrepositions() {
  return (
    <>
      <Rule>
        <p className="mb-0">
          Many verbs, adjectives and nouns need a <strong>particular preposition</strong>. Learn them together with the word. After the preposition, use a noun or an{' '}
          <strong>-ing</strong> form.
        </p>
      </Rule>

      <Section title="Adjective + preposition">
        <FormTable
          caption="Adjectives and their prepositions"
          head={['Preposition', 'Adjectives']}
          rows={[
            ['at', 'good at, bad at, surprised at'],
            ['in', 'interested in'],
            ['of', 'afraid of, proud of, tired of, fond of, capable of'],
            ['about', 'worried about, excited about, angry about (a thing)'],
            ['with', 'angry with (a person), pleased with, bored with'],
            ['to', 'married to, similar to, polite to'],
            ['for', 'responsible for, famous for, ready for'],
            ['from', 'different from (or to)'],
          ]}
        />
      </Section>

      <Section title="Verb + preposition">
        <FormTable
          caption="Verbs and their prepositions"
          head={['Verb', 'Preposition', 'Example']}
          rows={[
            ['listen', 'to', 'Listen to me.'],
            ['look', 'at', 'Look at this.'],
            ['wait', 'for', 'I am waiting for you.'],
            ['depend', 'on', 'It depends on the weather.'],
            ['belong', 'to', 'This book belongs to Anna.'],
            ['agree', 'with', 'I agree with you.'],
            ['ask', 'for', 'He asked for help.'],
            ['believe', 'in', 'I believe in him.'],
            ['laugh', 'at', 'Do not laugh at me.'],
            ['think', 'about / of', 'I am thinking about my job.'],
          ]}
        />
        <p>
          Some verbs take <strong>no preposition</strong>: <em>discuss</em> something, <em>enter</em> a room, <em>marry</em> someone, <em>answer</em> a question, <em>reach</em> a place,{' '}
          <em>attend</em> a meeting, <em>mention</em> something.
        </p>
      </Section>

      <Section title="Noun + preposition">
        <p>
          <em>a reason for, a cause of, an increase in, a problem with, an answer to, a solution to, a difference between, a need for, a key to</em>.
        </p>
      </Section>

      <Section title="Common mistakes">
        <Mistakes
          items={[
            { wrong: 'We discussed about the problem.', right: 'We discussed the problem.', why: 'Discuss takes a direct object.' },
            { wrong: 'It depends of the weather.', right: 'It depends on the weather.', why: 'Depend is followed by on.' },
            { wrong: 'She is married with a doctor.', right: 'She is married to a doctor.', why: 'Use married to.' },
            { wrong: 'I am interested on music.', right: 'I am interested in music.', why: 'Use interested in.' },
            { wrong: 'He is good in English.', right: 'He is good at English.', why: 'Use good at.' },
          ]}
        />
      </Section>
    </>
  );
}
