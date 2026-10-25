import { Examples, FormTable, Key, Mistakes, Rule, Section } from '../helpers';

export default function ModalVerbs() {
  return (
    <>
      <Rule>
        <p className="mb-0">
          Modal verbs (can, could, may, might, must, should, will, would) are followed by the <strong>base verb without to</strong>. They never take{' '}
          <em>-s</em> and they make questions and negatives by themselves, without <em>do</em>.
        </p>
      </Rule>

      <Section title="Meanings">
        <FormTable
          caption="Main meanings of modal verbs"
          head={['Meaning', 'Modals', 'Example']}
          rows={[
            ['Ability', 'can, could', 'I can swim. She could read at four.'],
            ['Permission', 'can, could, may', 'Can I sit here? May I come in?'],
            ['Possibility', 'may, might, could', 'It might rain. He could be at home.'],
            ['Obligation', 'must, have to', 'You must wear a seat belt. I have to work.'],
            ['No obligation', "don't have to, needn't", "You don't have to come."],
            ['Prohibition', "mustn't, can't", "You mustn't smoke here."],
            ['Advice', 'should, ought to', 'You should see a doctor.'],
            ['Request / offer', 'could, would, shall', 'Could you help me? Shall I open the window?'],
          ]}
        />
      </Section>

      <Section title="Notes">
        <Examples
          items={[
            <>
              She <Key>can</Key> speak three languages. / <Key>Can</Key> she speak French?
            </>,
            <>
              You <Key>mustn't</Key> park here. (forbidden) / You <Key>don't have to</Key> park here. (not necessary)
            </>,
            <>
              Yesterday I <Key>had to</Key> work late. (<em>must</em> has no past form)
            </>,
            <>
              I <Key>will be able to</Key> help you tomorrow. (<em>can</em> has no future form)
            </>,
          ]}
        />
        <p>
          <em>Must</em> usually expresses the speaker's own feeling (<em>I must call my mother</em>); <em>have to</em> expresses a rule or outside necessity.
        </p>
      </Section>

      <Section title="Common mistakes">
        <Mistakes
          items={[
            { wrong: 'She cans swim.', right: 'She can swim.', why: 'No -s after a modal.' },
            { wrong: 'I must to go.', right: 'I must go.', why: 'No to after a modal.' },
            { wrong: 'Do you can swim?', right: 'Can you swim?', why: 'Modals make questions without do.' },
            { wrong: "You mustn't come tomorrow, it's a holiday.", right: "You don't have to come tomorrow, it's a holiday.", why: "Mustn't means it is forbidden." },
            { wrong: 'I will can help you.', right: 'I will be able to help you.', why: 'Two modals cannot go together.' },
          ]}
        />
      </Section>
    </>
  );
}
