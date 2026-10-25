import { FormTable, Key, Mistakes, Rule, Section, Examples } from '../helpers';

export default function Plurals() {
  return (
    <>
      <Rule>
        <p className="mb-0">
          Most nouns add <strong>-s</strong> in the plural. Some add <strong>-es</strong> or change their ending, and a few are irregular.
        </p>
      </Rule>

      <Section title="Regular plurals">
        <FormTable
          caption="How to make regular plurals"
          head={['Ending', 'Rule', 'Singular → plural']}
          rows={[
            ['Most nouns', 'add -s', 'book → books, day → days'],
            ['-s, -x, -ch, -sh, -z', 'add -es', 'bus → buses, box → boxes, watch → watches'],
            ['consonant + -y', 'change y to -ies', 'city → cities, baby → babies'],
            ['-f / -fe', 'usually change to -ves', 'leaf → leaves, knife → knives (but roof → roofs)'],
            ['consonant + -o', 'often add -es', 'potato → potatoes, tomato → tomatoes (but photo → photos)'],
          ]}
        />
      </Section>

      <Section title="Irregular plurals">
        <FormTable
          caption="Irregular plurals"
          head={['Singular', 'Plural']}
          rows={[
            ['man, woman', 'men, women'],
            ['child', 'children'],
            ['person', 'people'],
            ['foot, tooth', 'feet, teeth'],
            ['mouse', 'mice'],
            ['sheep, fish, series', 'sheep, fish, series (no change)'],
          ]}
        />
        <Examples
          items={[
            <>
              The <Key>children</Key> are in the garden.
            </>,
            <>
              Many <Key>people</Key> were waiting. (people is already plural)
            </>,
          ]}
        />
      </Section>

      <Section title="Common mistakes">
        <Mistakes
          items={[
            { wrong: 'Two childs are playing.', right: 'Two children are playing.', why: 'Child has an irregular plural.' },
            { wrong: 'Many peoples came.', right: 'Many people came.', why: 'People is already plural: no -s.' },
            { wrong: 'The people is happy.', right: 'The people are happy.', why: 'People takes a plural verb.' },
            { wrong: 'I have three sheeps.', right: 'I have three sheep.', why: 'Sheep does not change.' },
          ]}
        />
      </Section>
    </>
  );
}
