import { Examples, FormTable, Key, Mistakes, Rule, Section } from '../helpers';

export default function PhrasalVerbs() {
  return (
    <>
      <Rule>
        <p className="mb-0">
          A <strong>phrasal verb</strong> is a verb + a small word (up, off, out, in, on, away…) with a meaning that is often different from the verb alone. Learn each
          phrasal verb as a whole.
        </p>
      </Rule>

      <Section title="Types">
        <FormTable
          caption="Types of phrasal verbs"
          head={['Type', 'Example', 'Notes']}
          rows={[
            ['No object', 'The car broke down. Please sit down.', 'Nothing follows the particle.'],
            ['Object, separable', 'Turn off the light. / Turn the light off.', 'A pronoun must go in the middle: turn it off.'],
            ['Object, inseparable', 'I look after my sister. She looks after her.', 'The object always comes after the particle.'],
            ['Three words', 'look forward to, put up with, run out of', 'The object comes at the end.'],
          ]}
        />
      </Section>

      <Section title="Useful phrasal verbs">
        <FormTable
          caption="Common phrasal verbs"
          head={['Phrasal verb', 'Meaning', 'Example']}
          rows={[
            ['give up', 'stop trying / stop doing', "Don't give up!"],
            ['find out', 'discover', 'I found out the truth.'],
            ['look up', 'search in a book or online', 'Look up the word.'],
            ['turn on / turn off', 'start / stop a machine', 'Turn on the TV.'],
            ['get on with', 'have a good relationship with', 'I get on well with my boss.'],
            ['carry on', 'continue', 'Carry on working.'],
            ['set up', 'start or arrange', 'They set up a company.'],
            ['put off', 'delay', 'We put off the meeting.'],
            ['look forward to', 'wait with pleasure', 'I look forward to meeting you.'],
            ['run out of', 'have no more', 'We ran out of milk.'],
          ]}
        />
        <Examples
          items={[
            <>
              I <Key>picked up</Key> the keys. / I <Key>picked them up</Key>.
            </>,
          ]}
        />
      </Section>

      <Section title="Common mistakes">
        <Mistakes
          items={[
            { wrong: 'Turn off it.', right: 'Turn it off.', why: 'A pronoun goes between the verb and the particle.' },
            { wrong: "I'll pick up him at six.", right: "I'll pick him up at six.", why: 'Same rule: pronoun in the middle.' },
            { wrong: 'I look forward to hear from you.', right: 'I look forward to hearing from you.', why: 'To is a preposition here: use -ing.' },
            { wrong: 'We ran out the milk.', right: 'We ran out of milk.', why: 'The phrasal verb is run out of.' },
          ]}
        />
      </Section>
    </>
  );
}
