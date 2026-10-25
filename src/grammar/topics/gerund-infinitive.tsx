import { Examples, FormTable, Key, Mistakes, Rule, Section } from '../helpers';

export default function GerundInfinitive() {
  return (
    <>
      <Rule>
        <p className="mb-0">
          After some verbs you must use the <strong>-ing form</strong> (enjoy <em>doing</em>), after others the <strong>to-infinitive</strong> (want <em>to do</em>).
          After prepositions always use <strong>-ing</strong>.
        </p>
      </Rule>

      <Section title="Verb + -ing or verb + to?">
        <FormTable
          caption="Verbs followed by -ing or to + infinitive"
          head={['Followed by -ing', 'Followed by to + infinitive']}
          rows={[
            ['enjoy, finish, avoid, mind, suggest', 'want, hope, decide, plan, promise'],
            ['keep, practise, consider, deny, miss', 'agree, refuse, learn, manage, afford, expect, need'],
            ["can't help, give up, go on", 'choose, offer, seem, would like'],
          ]}
        />
        <Examples
          items={[
            <>
              I enjoy <Key>reading</Key>. / She finished <Key>working</Key>.
            </>,
            <>
              I want <Key>to travel</Key>. / They decided <Key>to stay</Key>.
            </>,
            <>
              She is good at <Key>cooking</Key>. / Thanks for <Key>helping</Key>. (after a preposition)
            </>,
          ]}
        />
      </Section>

      <Section title="Both, with the same or a different meaning">
        <p>
          <em>like, love, hate, start, begin</em> can take either with almost the same meaning. But some verbs change meaning:
        </p>
        <FormTable
          caption="Verbs whose meaning changes"
          head={['Verb', '+ -ing', '+ to']}
          rows={[
            ['stop', 'I stopped smoking. (I quit)', 'I stopped to smoke. (I paused in order to smoke)'],
            ['remember', 'I remember locking the door. (I recall the action)', 'Remember to lock the door. (don\'t forget)'],
            ['try', 'Try adding salt. (experiment)', 'I tried to open it. (attempt)'],
            ['forget', 'I\'ll never forget meeting her.', "Don't forget to call me."],
          ]}
        />
        <p>
          After modal verbs and after <em>make</em> / <em>let</em> use the base verb: <em>She made me laugh.</em>
        </p>
      </Section>

      <Section title="Common mistakes">
        <Mistakes
          items={[
            { wrong: 'I enjoy to read.', right: 'I enjoy reading.', why: 'Enjoy is followed by -ing.' },
            { wrong: 'I want going home.', right: 'I want to go home.', why: 'Want is followed by to + infinitive.' },
            { wrong: "I'm looking forward to see you.", right: "I'm looking forward to seeing you.", why: 'Here "to" is a preposition: use -ing.' },
            { wrong: 'She suggested to go out.', right: 'She suggested going out.', why: 'Suggest is followed by -ing.' },
          ]}
        />
      </Section>
    </>
  );
}
