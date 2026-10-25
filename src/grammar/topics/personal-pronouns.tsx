import { Examples, FormTable, Key, Mistakes, Rule, Section } from '../helpers';

export default function PersonalPronouns() {
  return (
    <>
      <Rule>
        <p className="mb-0">
          Use <strong>subject pronouns</strong> (I, he, they…) before a verb and <strong>object pronouns</strong> (me, him, them…) after a verb or a preposition.
          An English sentence always needs a subject.
        </p>
      </Rule>

      <Section title="Overview">
        <FormTable
          caption="Subject, object, possessive and reflexive pronouns"
          head={['Subject', 'Object', 'Possessive adjective', 'Possessive pronoun', 'Reflexive']}
          rows={[
            ['I', 'me', 'my', 'mine', 'myself'],
            ['you', 'you', 'your', 'yours', 'yourself'],
            ['he', 'him', 'his', 'his', 'himself'],
            ['she', 'her', 'her', 'hers', 'herself'],
            ['it', 'it', 'its', '—', 'itself'],
            ['we', 'us', 'our', 'ours', 'ourselves'],
            ['they', 'them', 'their', 'theirs', 'themselves'],
          ]}
        />
      </Section>

      <Section title="Use">
        <Examples
          items={[
            <>
              <Key>She</Key> called <Key>me</Key> yesterday.
            </>,
            <>
              This gift is for <Key>you</Key> and <Key>him</Key>. (after a preposition)
            </>,
            <>
              <Key>It</Key> is raining. <Key>It</Key>'s a nice day. (no real subject: use it)
            </>,
            <>
              <Key>There</Key> is a problem. (to say that something exists)
            </>,
          ]}
        />
        <p>
          Put yourself last when you name others: <em>Tom and I went</em>, <em>between you and me</em>.
        </p>
      </Section>

      <Section title="Common mistakes">
        <Mistakes
          items={[
            { wrong: 'Is raining.', right: 'It is raining.', why: 'English always needs a subject.' },
            { wrong: 'Me and Tom went home.', right: 'Tom and I went home.', why: 'Use the subject form I, and put yourself last.' },
            { wrong: 'Give it to I.', right: 'Give it to me.', why: 'After a preposition, use the object form.' },
            { wrong: 'My sister and him are friends.', right: 'My sister and he are friends.', why: 'The pronoun is part of the subject.' },
          ]}
        />
      </Section>
    </>
  );
}
