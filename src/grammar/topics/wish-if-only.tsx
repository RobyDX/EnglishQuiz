import { Examples, FormTable, Key, Mistakes, Rule, Section } from '../helpers';

export default function WishIfOnly() {
  return (
    <>
      <Rule>
        <p className="mb-0">
          Use <strong>wish</strong> (or <strong>if only</strong>, which is stronger) to talk about things you would like to be different. The verb goes{' '}
          <strong>one tense back</strong>.
        </p>
      </Rule>

      <Section title="Forms">
        <FormTable
          caption="Wish and if only"
          head={['Situation', 'Form', 'Example']}
          rows={[
            ['Present or future regret', 'wish + past simple', 'I wish I had more time. If only I were taller.'],
            ['Past regret', 'wish + past perfect', 'I wish I had studied harder. If only I had listened.'],
            ['Annoyance, or a change you want in someone else', 'wish + would', 'I wish he would stop talking.'],
            ['Ability', 'wish + could', 'I wish I could play the piano.'],
          ]}
        />
        <p>
          With <em>wish</em> and <em>if only</em>, <em>were</em> can be used with all persons: <em>I wish I were rich.</em>
        </p>
      </Section>

      <Section title="Wish or hope?">
        <Examples
          items={[
            <>
              I <Key>hope</Key> you pass the exam. (it is possible: use the present / will)
            </>,
            <>
              I <Key>wish</Key> I could pass it. (it is not possible, or unlikely)
            </>,
          ]}
        />
        <p>
          <em>Wish</em> + <em>would</em> is for other people's behaviour or things outside your control; not for your own actions.
        </p>
      </Section>

      <Section title="Common mistakes">
        <Mistakes
          items={[
            { wrong: 'I wish I have a car.', right: 'I wish I had a car.', why: 'Use the past simple for a present wish.' },
            { wrong: 'I wish I would be taller.', right: 'I wish I were taller.', why: 'Use would only for other people\'s behaviour, not for yourself.' },
            { wrong: 'If only I knew yesterday.', right: 'If only I had known yesterday.', why: 'For the past, use the past perfect.' },
            { wrong: 'I wish you will come.', right: 'I hope you will come.', why: 'Use hope for something that is possible.' },
          ]}
        />
      </Section>
    </>
  );
}
