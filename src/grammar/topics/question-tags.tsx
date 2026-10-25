import { Examples, FormTable, Key, Mistakes, Rule, Section } from '../helpers';

export default function QuestionTags() {
  return (
    <>
      <Rule>
        <p className="mb-0">
          A question tag is a short question at the end of a sentence. A <strong>positive</strong> sentence gets a <strong>negative</strong> tag, and a{' '}
          <strong>negative</strong> sentence gets a <strong>positive</strong> tag. The tag repeats the auxiliary of the sentence.
        </p>
      </Rule>

      <Section title="Form">
        <FormTable
          caption="Question tags"
          head={['Sentence', 'Tag']}
          rows={[
            ['She is tired,', "isn't she?"],
            ['You like tea,', "don't you?"],
            ['They went home,', "didn't they?"],
            ["He can't swim,", 'can he?'],
            ["We haven't met,", 'have we?'],
            ['I am late,', "aren't I?"],
            ["Let's go,", 'shall we?'],
            ['Open the door,', 'will you?'],
          ]}
        />
        <p>
          If the sentence has no auxiliary, the tag uses <em>do / does / did</em>. The tag uses a pronoun, never a noun: <em>Tom is late, isn't <strong>he</strong>?</em>
        </p>
      </Section>

      <Section title="Meaning">
        <Examples
          items={[
            <>
              It's a nice day, <Key>isn't it</Key>? (voice goes down: you expect "yes")
            </>,
            <>
              You haven't seen my keys, <Key>have you</Key>? (voice goes up: a real question)
            </>,
          ]}
        />
        <p>
          Short answers: <em>Yes, it is. / No, it isn't.</em> A negative tag still gets the answer that is true: <em>You don't smoke, do you? — No, I don't.</em>
        </p>
      </Section>

      <Section title="Common mistakes">
        <Mistakes
          items={[
            { wrong: "You like pizza, isn't it?", right: "You like pizza, don't you?", why: 'Repeat the auxiliary (do) and the subject pronoun.' },
            { wrong: "She's tired, doesn't she?", right: "She's tired, isn't she?", why: "The tag matches the verb in the sentence: is → isn't." },
            { wrong: "He can swim, can't?", right: "He can swim, can't he?", why: 'The tag needs a pronoun.' },
            { wrong: "I am late, amn't I?", right: "I am late, aren't I?", why: "The tag for I am is aren't I." },
          ]}
        />
      </Section>
    </>
  );
}
