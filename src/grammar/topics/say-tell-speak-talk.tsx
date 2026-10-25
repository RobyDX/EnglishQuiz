import { Examples, FormTable, Key, Mistakes, Rule, Section } from '../helpers';

export default function SayTellSpeakTalk() {
  return (
    <>
      <Rule>
        <p className="mb-0">
          <strong>Say</strong> is followed by the words said; <strong>tell</strong> is followed by a person; <strong>speak</strong> is about languages and formal talking;{' '}
          <strong>talk</strong> is about conversation.
        </p>
      </Rule>

      <Section title="Overview">
        <FormTable
          caption="Say, tell, speak and talk"
          head={['Verb', 'Pattern', 'Example']}
          rows={[
            ['say', 'say + words / that-clause; say something to someone', 'She said "hello". He said that he was tired. I said goodbye to her.'],
            ['tell', 'tell + person + information', 'He told me the truth. She told us a story.'],
            ['speak', 'a language; formal or one-way talking', 'I speak English. The president spoke to the nation.'],
            ['talk', 'a conversation', 'We talked about the film. I was talking to Sam.'],
          ]}
        />
        <p>
          Fixed expressions with <em>tell</em>: <em>tell the truth, tell a lie, tell a joke, tell a story, tell the time, tell the difference</em>. With <em>say</em>:{' '}
          <em>say hello, say sorry, say a prayer</em>.
        </p>
      </Section>

      <Section title="Use">
        <Examples
          items={[
            <>
              He <Key>said</Key> that he was busy. / He <Key>told me</Key> that he was busy.
            </>,
            <>
              Can I <Key>speak to</Key> the manager? / Let's <Key>talk about</Key> it.
            </>,
          ]}
        />
      </Section>

      <Section title="Common mistakes">
        <Mistakes
          items={[
            { wrong: 'He said me the truth.', right: 'He told me the truth.', why: 'Tell needs a person directly after it.' },
            { wrong: 'She told that she was tired.', right: 'She said that she was tired.', why: 'Without a person, use say.' },
            { wrong: 'Say me the answer.', right: 'Tell me the answer.', why: 'Use tell + person.' },
            { wrong: 'We talked English with the tourists.', right: 'We spoke English with the tourists.', why: 'Use speak for a language.' },
          ]}
        />
      </Section>
    </>
  );
}
