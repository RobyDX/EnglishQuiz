import { Examples, FormTable, Key, Mistakes, Rule, Section } from '../helpers';

export default function Subjunctive() {
  return (
    <>
      <Rule>
        <p className="mb-0">
          In formal English, use the <strong>base form of the verb</strong> (no -s, no tense) after verbs and adjectives that express a demand, suggestion or necessity:
          <em> I suggest that he be present.</em>
        </p>
      </Rule>

      <Section title="After verbs and adjectives">
        <FormTable
          caption="Triggers of the subjunctive"
          head={['Type', 'Examples']}
          rows={[
            ['Verbs', 'insist, suggest, recommend, demand, propose, request, require, advise'],
            ['Adjectives', 'essential, important, vital, necessary, crucial, advisable'],
          ]}
        />
        <Examples
          items={[
            <>
              The doctor recommended that she <Key>rest</Key> for a week.
            </>,
            <>
              It is essential that every student <Key>be</Key> on time.
            </>,
            <>
              I insist that he <Key>not</Key> <Key>leave</Key> before the end. (negative: not + base verb)
            </>,
          ]}
        />
        <p className="small text-secondary">
          British English often uses <em>should</em> instead (<em>that she should rest</em>), and everyday speech often uses a normal tense (<em>that she rests</em>). The base
          form is typical of American and formal writing.
        </p>
      </Section>

      <Section title="Were subjunctive">
        <p>
          For unreal situations, <em>were</em> is used with all persons, especially in formal English:
        </p>
        <Examples
          items={[
            <>
              If I <Key>were</Key> you, I would wait.
            </>,
            <>
              He talks as if he <Key>were</Key> the boss.
            </>,
            <>
              I wish it <Key>were</Key> Friday.
            </>,
          ]}
        />
        <p>
          Some fixed phrases keep the subjunctive: <em>Long live the king! God bless you. Be that as it may. So be it.</em>
        </p>
      </Section>

      <Section title="Common mistakes">
        <p className="small text-secondary">
          In everyday speech some of these "mistakes" are often heard. The corrections show the formal style used in writing, exams and official texts.
        </p>
        <Mistakes
          items={[
            { wrong: 'The teacher insisted that he stays.', right: 'The teacher insisted that he stay.', why: 'In formal English use the base form, not -s.' },
            { wrong: "It is vital that he doesn't miss the meeting.", right: 'It is vital that he not miss the meeting.', why: 'In the subjunctive, use not + base verb.' },
            { wrong: 'If I was you, I would go.', right: 'If I were you, I would go.', why: 'Formal English prefers were.' },
            { wrong: 'I suggest that she is on time.', right: 'I suggest that she be on time.', why: 'Use the base form be.' },
          ]}
        />
      </Section>
    </>
  );
}
