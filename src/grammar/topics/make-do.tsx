import { FormTable, Mistakes, Rule, Section } from '../helpers';

export default function MakeDo() {
  return (
    <>
      <Rule>
        <p className="mb-0">
          <strong>Do</strong> is for activities, jobs and tasks. <strong>Make</strong> is for creating or producing something. Many expressions are fixed, so
          learn them as pairs.
        </p>
      </Rule>

      <Section title="Do or make?">
        <FormTable
          caption="Common expressions with do and make"
          head={['do', 'make']}
          rows={[
            ['do homework', 'make a mistake'],
            ['do the housework / the dishes / the shopping', 'make a decision'],
            ['do a job / some work', 'make money'],
            ['do your best', 'make an effort'],
            ['do someone a favour', 'make a phone call'],
            ['do exercise', 'make a cake / a meal / coffee'],
            ['do business', 'make a plan / an appointment'],
            ['do research', 'make progress'],
            ['do the cooking, the cleaning, the washing', 'make the bed'],
            ['do a course', 'make friends / make noise'],
          ]}
        />
        <p>
          <em>Do</em> is also used when the activity is unclear: <em>What are you doing? I'm doing nothing. Do something!</em>
        </p>
      </Section>

      <Section title="Common mistakes">
        <Mistakes
          items={[
            { wrong: 'I made a mistake in my homework, so I have to make it again.', right: 'I made a mistake in my homework, so I have to do it again.', why: 'Homework is done, mistakes are made.' },
            { wrong: 'She did a mistake.', right: 'She made a mistake.', why: 'The fixed expression is make a mistake.' },
            { wrong: 'I have to do a decision.', right: 'I have to make a decision.', why: 'The fixed expression is make a decision.' },
            { wrong: 'Can you make me a favour?', right: 'Can you do me a favour?', why: 'The fixed expression is do a favour.' },
          ]}
        />
      </Section>
    </>
  );
}
