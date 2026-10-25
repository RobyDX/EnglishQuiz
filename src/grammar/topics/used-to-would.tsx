import { Examples, FormTable, Key, Mistakes, Rule, Section } from '../helpers';

export default function UsedToWould() {
  return (
    <>
      <Rule>
        <p className="mb-0">
          Use <strong>used to + base verb</strong> for past habits and states that are no longer true. Use <strong>would</strong> only for repeated past actions, not for
          states.
        </p>
      </Rule>

      <Section title="Used to">
        <FormTable
          caption="Used to"
          head={['', 'Example']}
          rows={[
            ['Positive', 'I used to smoke. We used to live in Rome.'],
            ['Negative', "I didn't use to smoke."],
            ['Question', 'Did you use to play football?'],
          ]}
        />
        <Examples
          items={[
            <>
              I <Key>used to</Key> have long hair. (a past state)
            </>,
            <>
              She <Key>used to</Key> walk to school. (a past habit)
            </>,
          ]}
        />
        <p>In negatives and questions with <em>did</em>, the spelling is <em>use to</em> (no -d).</p>
      </Section>

      <Section title="Would">
        <p>
          <em>Would</em> describes repeated actions in the past, often in stories: <em>Every summer we would go to the sea.</em> It does not work with state verbs
          (be, have, know, like).
        </p>
      </Section>

      <Section title="Be used to / get used to + -ing">
        <p>
          This is different: <em>be used to</em> means "to be familiar with" and is followed by a noun or <strong>-ing</strong>.
        </p>
        <Examples
          items={[
            <>
              I <Key>am used to getting up</Key> early. (it is normal for me now)
            </>,
            <>
              She is <Key>getting used to</Key> the cold weather.
            </>,
          ]}
        />
      </Section>

      <Section title="Common mistakes">
        <Mistakes
          items={[
            { wrong: 'I used to living in London.', right: 'I used to live in London.', why: 'Used to is followed by the base verb.' },
            { wrong: "I didn't used to like fish.", right: "I didn't use to like fish.", why: 'After didn\'t, use the base form: use to.' },
            { wrong: 'I would have a dog when I was young.', right: 'I used to have a dog when I was young.', why: 'Have is a state verb: use used to.' },
            { wrong: "I'm used to get up early.", right: "I'm used to getting up early.", why: 'Be used to is followed by -ing.' },
          ]}
        />
      </Section>
    </>
  );
}
