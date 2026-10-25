import { Examples, FormTable, Key, Mistakes, Rule, Section } from '../helpers';

export default function LinkingWords() {
  return (
    <>
      <Rule>
        <p className="mb-0">
          Linking words join ideas and show their relationship: contrast, reason, result, purpose, addition and time. Check what comes <strong>after</strong> each
          one: a clause, a noun or an -ing form.
        </p>
      </Rule>

      <Section title="Overview">
        <FormTable
          caption="Linking words"
          head={['Idea', 'Linking words', 'Example']}
          rows={[
            ['Contrast', 'but, although / though / even though + clause', 'Although it was cold, we went out.'],
            ['Contrast + noun / -ing', 'despite / in spite of + noun or -ing', 'Despite the rain, we went out.'],
            ['Contrast (new sentence)', 'however, nevertheless', 'It was cold. However, we went out.'],
            ['Opposite', 'while, whereas', 'He is tall, whereas his brother is short.'],
            ['Reason', 'because + clause; because of + noun; as; since', 'We stayed in because it was raining. Because of the rain, we stayed in.'],
            ['Result', 'so, therefore, as a result', 'It rained, so we stayed in.'],
            ['Purpose', 'to, in order to, so that, so as not to', 'I went there to see him. I left early so that I would not be late.'],
            ['Addition', 'and, also, in addition, moreover', 'She is clever. Moreover, she works hard.'],
            ['Time', 'when, while, as soon as, until, before, after', 'Call me as soon as you arrive.'],
          ]}
        />
      </Section>

      <Section title="Notes">
        <Examples
          items={[
            <>
              <Key>Although</Key> / <Key>Despite</Key> are not used with <em>but</em> in the same sentence.
            </>,
            <>
              It was late<Key>; however,</Key> we kept working. (punctuation: full stop or semicolon before <em>however</em>, comma after)
            </>,
          ]}
        />
      </Section>

      <Section title="Common mistakes">
        <Mistakes
          items={[
            { wrong: 'Although it was cold, but we went out.', right: 'Although it was cold, we went out.', why: 'Do not use although and but together.' },
            { wrong: 'Despite of the rain, we went out.', right: 'Despite the rain, we went out.', why: 'Despite has no of (in spite of has of).' },
            { wrong: 'We stayed in because of it was raining.', right: 'We stayed in because it was raining.', why: 'Because + clause; because of + noun.' },
            { wrong: 'I called for to ask about the price.', right: 'I called to ask about the price.', why: 'Purpose: use to + verb.' },
            { wrong: 'It was cold, however we went out.', right: 'It was cold; however, we went out.', why: 'However needs a stronger break than a comma.' },
          ]}
        />
      </Section>
    </>
  );
}
