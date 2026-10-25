import { Examples, FormTable, Key, Mistakes, Rule, Section } from '../helpers';

export default function PerfectModals() {
  return (
    <>
      <Rule>
        <p className="mb-0">
          Use <strong>modal + have + past participle</strong> to talk about the past: to guess what happened, or to say what was a good or bad idea.
        </p>
      </Rule>

      <Section title="Meanings">
        <FormTable
          caption="Perfect modals"
          head={['Form', 'Meaning', 'Example']}
          rows={[
            ['must have + pp', 'I am sure it happened', 'He must have left early.'],
            ["can't / couldn't have + pp", 'I am sure it did not happen', "She can't have seen us."],
            ['may / might / could have + pp', 'it is possible it happened', 'They might have missed the train.'],
            ['should have + pp', 'a past mistake or regret', 'You should have called me.'],
            ["shouldn't have + pp", 'it was a bad idea', "I shouldn't have eaten so much."],
            ['could have + pp', 'a past possibility that did not happen', 'I could have won, but I fell.'],
            ["needn't have + pp", 'it was not necessary (but I did it)', "You needn't have brought food."],
          ]}
        />
      </Section>

      <Section title="Examples">
        <Examples
          items={[
            <>
              The lights are off. They <Key>must have gone</Key> out.
            </>,
            <>
              He <Key>should have studied</Key> more. (he didn't study enough)
            </>,
            <>
              It <Key>can't have been</Key> Tom. He is in Spain.
            </>,
          ]}
        />
      </Section>

      <Section title="Common mistakes">
        <Mistakes
          items={[
            { wrong: 'I should have went home.', right: 'I should have gone home.', why: 'Use the past participle after have.' },
            { wrong: 'She must had gone.', right: 'She must have gone.', why: 'Use have, not had.' },
            { wrong: "He mustn't have seen it.", right: "He can't have seen it.", why: 'For a negative deduction, use can\'t have.' },
            { wrong: 'I could went to the party.', right: 'I could have gone to the party.', why: 'Use could + have + past participle.' },
          ]}
        />
      </Section>
    </>
  );
}
