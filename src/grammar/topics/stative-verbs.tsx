import { Examples, FormTable, Key, Mistakes, Rule, Section } from '../helpers';

export default function StativeVerbs() {
  return (
    <>
      <Rule>
        <p className="mb-0">
          <strong>Stative (state) verbs</strong> describe thoughts, feelings, possession and senses, not actions. They are normally <strong>not</strong> used in
          continuous tenses: say <em>I know</em>, not <em>I am knowing</em>.
        </p>
      </Rule>

      <Section title="Common stative verbs">
        <FormTable
          caption="Stative verbs by group"
          head={['Group', 'Verbs']}
          rows={[
            ['Thinking', 'know, understand, believe, remember, forget, doubt'],
            ['Feelings', 'like, love, hate, prefer, want, need'],
            ['Possession', 'have (= own), own, belong, contain'],
            ['Being and seeming', 'be, seem, appear, mean, cost'],
            ['Senses', 'see, hear, smell, taste (state)'],
          ]}
        />
      </Section>

      <Section title="Verbs with two meanings">
        <p>Some verbs are stative with one meaning and active with another, and then the continuous is possible.</p>
        <FormTable
          caption="Verbs that can be stative or active"
          head={['Verb', 'State (simple)', 'Action (continuous)']}
          rows={[
            ['have', 'I have a car. (own)', "I'm having lunch. (eat)"],
            ['think', 'I think it is good. (opinion)', "I'm thinking about the trip. (consider)"],
            ['see', 'I see what you mean. (understand)', "I'm seeing the doctor today. (meet)"],
            ['be', 'He is silly. (his character)', "He is being silly. (behaving now)"],
            ['taste', 'The soup tastes good.', "She is tasting the soup."],
          ]}
        />
        <Examples
          items={[
            <>
              I <Key>want</Key> a coffee. (not "I am wanting")
            </>,
            <>
              She <Key>understands</Key> the problem.
            </>,
          ]}
        />
      </Section>

      <Section title="Common mistakes">
        <Mistakes
          items={[
            { wrong: 'I am wanting a coffee.', right: 'I want a coffee.', why: 'Want is a state verb.' },
            { wrong: 'I am understanding now.', right: 'I understand now.', why: 'Understand is a state verb.' },
            { wrong: 'He is having two brothers.', right: 'He has two brothers.', why: 'Have for possession is stative.' },
            { wrong: 'This soup is tasting delicious.', right: 'This soup tastes delicious.', why: 'Taste describing a quality is stative.' },
          ]}
        />
      </Section>
    </>
  );
}
