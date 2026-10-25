import { Examples, FormTable, Key, Mistakes, Rule, Section } from '../helpers';

export default function PresentPerfect() {
  return (
    <>
      <Rule>
        <p className="mb-0">
          Use the present perfect for something that happened in the past but is <strong>connected to now</strong>: an experience, a recent
          event with a result today, or a situation that has not finished. We do not say <em>when</em> it happened.
        </p>
      </Rule>

      <Section title="Form">
        <p>
          <Key>have / has</Key> + <Key>past participle</Key> (worked, seen, gone…). Use <em>has</em> with he, she and it.
        </p>
        <FormTable
          caption="Present perfect of work and go"
          head={['', 'I / you / we / they', 'he / she / it']}
          rows={[
            ['Positive', 'I have worked', 'She has worked'],
            ['Negative', "We haven't worked", "He hasn't worked"],
            ['Question', 'Have you worked?', 'Has it worked?'],
            ['Short answers', "Yes, I have. / No, I haven't.", "Yes, she has. / No, she hasn't."],
          ]}
        />
        <p className="small text-secondary">
          Regular verbs add <em>-ed</em> (work → worked). Many common verbs are irregular: go → <em>gone</em>, see → <em>seen</em>, do → <em>done</em>,
          write → <em>written</em>.
        </p>
      </Section>

      <Section title="Use">
        <h3 className="h6">1. Life experiences (with ever, never)</h3>
        <Examples
          items={[
            <>
              I <Key>have visited</Key> Rome twice.
            </>,
            <>
              <Key>Have</Key> you <Key>ever eaten</Key> sushi?
            </>,
            <>
              She <Key>has never flown</Key> in a plane.
            </>,
          ]}
        />
        <h3 className="h6">2. Recent events with a result now (with just, already, yet)</h3>
        <Examples
          items={[
            <>
              I <Key>have lost</Key> my keys. (I cannot find them now.)
            </>,
            <>
              They <Key>have just arrived</Key>.
            </>,
            <>
              I <Key>haven't finished</Key> my homework <Key>yet</Key>.
            </>,
          ]}
        />
        <h3 className="h6">3. A time that is not finished (today, this week, this year)</h3>
        <Examples
          items={[
            <>
              He <Key>has called</Key> me three times today.
            </>,
            <>
              We <Key>have had</Key> a lot of rain this month.
            </>,
          ]}
        />
        <h3 className="h6">4. Situations that started in the past and continue now (with for, since)</h3>
        <Examples
          items={[
            <>
              I <Key>have lived</Key> here <Key>for</Key> five years. (a period of time)
            </>,
            <>
              She <Key>has worked</Key> here <Key>since</Key> 2020. (a starting point)
            </>,
          ]}
        />
      </Section>

      <Section title="Present perfect or past simple?">
        <p>
          Use the <strong>past simple</strong> when you say or ask <em>when</em> something happened and the time is finished (yesterday, last year, in
          2019, two days ago). Use the <strong>present perfect</strong> when the time is not mentioned or is not finished.
        </p>
        <Examples
          items={[
            <>
              I <Key>have seen</Key> that film. (time not mentioned)
            </>,
            <>
              I <Key>saw</Key> that film <Key>last week</Key>. (finished time)
            </>,
          ]}
        />
        <p>
          <em>Been</em> and <em>gone</em> are different: <em>She has been to Paris</em> means she visited and came back; <em>She has gone to Paris</em> means she
          is there now or on her way.
        </p>
      </Section>

      <Section title="Common mistakes">
        <Mistakes
          items={[
            {
              wrong: 'I have seen him yesterday.',
              right: 'I saw him yesterday.',
              why: 'With a finished time such as yesterday, use the past simple.',
            },
            {
              wrong: 'I am living here since 2020.',
              right: 'I have lived here since 2020.',
              why: 'With for and since, use the present perfect, not the present continuous.',
            },
            {
              wrong: 'I have lived here since five years.',
              right: 'I have lived here for five years.',
              why: 'Use for with a period of time and since with a starting point.',
            },
            {
              wrong: 'She has went home.',
              right: 'She has gone home.',
              why: 'After have / has, use the past participle (gone), not the past simple (went).',
            },
          ]}
        />
      </Section>
    </>
  );
}
