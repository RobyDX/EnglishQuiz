import { Examples, FormTable, Key, Mistakes, Rule, Section } from '../helpers';

export default function ToBeHaveGot() {
  return (
    <>
      <Rule>
        <p className="mb-0">
          <strong>To be</strong> (am / is / are, was / were) describes who or what someone is, their age, feelings and the weather.{' '}
          <strong>Have got</strong> (or <em>have</em>) shows possession.
        </p>
      </Rule>

      <Section title="To be">
        <FormTable
          caption="The verb to be"
          head={['', 'Present', 'Past']}
          rows={[
            ['I', 'am (I\'m)', 'was'],
            ['you / we / they', "are (you're, we're, they're)", 'were'],
            ['he / she / it', "is (he's, she's, it's)", 'was'],
            ['Negative', "I'm not, you aren't, he isn't", "wasn't, weren't"],
            ['Question', 'Are you…? Is she…?', 'Were you…? Was he…?'],
          ]}
        />
        <p>
          In English you <strong>are</strong> your age, your feelings and the weather:
        </p>
        <Examples
          items={[
            <>
              I <Key>am</Key> twenty years old. (not "I have twenty years")
            </>,
            <>
              She <Key>is</Key> hungry / cold / afraid.
            </>,
            <>
              It <Key>is</Key> sunny today.
            </>,
          ]}
        />
      </Section>

      <Section title="Have got">
        <FormTable
          caption="Have got"
          head={['', 'Positive', 'Negative', 'Question']}
          rows={[
            ['I / you / we / they', "I've got a car", "I haven't got a car", 'Have you got a car?'],
            ['he / she / it', "She's got a car", "She hasn't got a car", 'Has she got a car?'],
          ]}
        />
        <p>
          <em>Have got</em> is common in British English for possession and relationships. You can also use plain <em>have</em> (<em>I have two brothers</em>;{' '}
          <em>Do you have a pen?</em>). For actions like eating, use <em>have</em>: <em>I have breakfast.</em>
        </p>
      </Section>

      <Section title="Common mistakes">
        <Mistakes
          items={[
            { wrong: 'I have 25 years.', right: 'I am 25 years old.', why: 'Use be for age.' },
            { wrong: 'I have hungry.', right: 'I am hungry.', why: 'Use be for feelings and physical states.' },
            { wrong: 'She have got a dog.', right: 'She has got a dog.', why: 'Use has with he / she / it.' },
            { wrong: 'I am agree with you.', right: 'I agree with you.', why: 'Agree is a verb: no be.' },
          ]}
        />
      </Section>
    </>
  );
}
