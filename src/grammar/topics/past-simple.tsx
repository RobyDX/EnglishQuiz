import { Examples, FormTable, Key, Mistakes, Rule, Section } from '../helpers';

export default function PastSimple() {
  return (
    <>
      <Rule>
        <p className="mb-0">
          Use the past simple for actions or states that <strong>finished in the past</strong>, usually with a time that is over (yesterday, last week, in 2019, two years ago).
        </p>
      </Rule>

      <Section title="Form">
        <FormTable
          caption="Past simple of work and go"
          head={['', 'Regular (work)', 'Irregular (go)']}
          rows={[
            ['Positive', 'I worked', 'I went'],
            ['Negative', "I didn't work", "I didn't go"],
            ['Question', 'Did you work?', 'Did you go?'],
            ['Short answers', "Yes, I did. / No, I didn't.", "Yes, I did. / No, I didn't."],
          ]}
        />
        <p>
          Regular verbs add <em>-ed</em> (worked); with a final <em>-e</em> add <em>-d</em> (liked); consonant + <em>y</em> becomes <em>-ied</em> (studied); one-syllable
          verbs with one vowel + consonant double it (stop → stopped). The past of <em>be</em> is <em>was / were</em>.
        </p>
        <p>
          After <em>did / didn't</em> the verb is in its <strong>base form</strong>.
        </p>
      </Section>

      <Section title="Use">
        <Examples
          items={[
            <>
              I <Key>visited</Key> my grandparents <Key>last Sunday</Key>.
            </>,
            <>
              She <Key>didn't call</Key> me <Key>yesterday</Key>.
            </>,
            <>
              <Key>Did</Key> you <Key>see</Key> the match <Key>on Saturday</Key>?
            </>,
            <>
              We <Key>lived</Key> in Paris <Key>for three years</Key>, but we moved. (it is over)
            </>,
          ]}
        />
      </Section>

      <Section title="Common mistakes">
        <Mistakes
          items={[
            { wrong: 'Did you went to the party?', right: 'Did you go to the party?', why: 'After did, use the base form.' },
            { wrong: "I didn't saw him.", right: "I didn't see him.", why: "After didn't, use the base form." },
            { wrong: 'I goed home.', right: 'I went home.', why: 'Go is irregular: went.' },
            { wrong: 'She was born in 1990 and she has studied there.', right: 'She was born in 1990 and she studied there.', why: 'Use the past simple for a finished past.' },
          ]}
        />
      </Section>
    </>
  );
}
