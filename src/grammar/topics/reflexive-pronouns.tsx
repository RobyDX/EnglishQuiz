import { Examples, Key, Mistakes, Rule, Section } from '../helpers';

export default function ReflexivePronouns() {
  return (
    <>
      <Rule>
        <p className="mb-0">
          Use a <strong>reflexive pronoun</strong> (myself, yourself, himself…) when the subject and the object are the same person, or to add emphasis.
        </p>
      </Rule>

      <Section title="Forms">
        <p>
          myself · yourself · himself · herself · itself · ourselves · yourselves · themselves. Note: singular <em>-self</em>, plural <em>-selves</em>.
        </p>
      </Section>

      <Section title="Use">
        <Examples
          items={[
            <>
              I cut <Key>myself</Key> with a knife. (I = the object)
            </>,
            <>
              She taught <Key>herself</Key> to play the guitar.
            </>,
            <>
              I made the cake <Key>myself</Key>. (emphasis: nobody helped)
            </>,
            <>
              He lives <Key>by himself</Key>. (= alone)
            </>,
          ]}
        />
        <p>
          For two people doing something to each other, use <strong>each other</strong>: <em>They love each other.</em>
        </p>
        <p>
          With verbs like <em>wash, shave, dress, feel, relax, wake up</em>, English usually does <strong>not</strong> use a reflexive: <em>He shaved. I feel tired.</em>
        </p>
      </Section>

      <Section title="Common mistakes">
        <Mistakes
          items={[
            { wrong: 'I feel myself tired.', right: 'I feel tired.', why: 'No reflexive after feel.' },
            { wrong: 'They know themself well.', right: 'They know themselves well.', why: 'The plural form is themselves.' },
            { wrong: 'They help themselves each other.', right: 'They help each other.', why: 'Use each other for a mutual action.' },
            { wrong: 'She relaxed herself on the sofa.', right: 'She relaxed on the sofa.', why: 'No reflexive after relax.' },
          ]}
        />
      </Section>
    </>
  );
}
