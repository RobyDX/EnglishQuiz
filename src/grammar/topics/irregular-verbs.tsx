import { FormTable, Key, Mistakes, Rule, Section, Examples } from '../helpers';

export default function IrregularVerbs() {
  return (
    <>
      <Rule>
        <p className="mb-0">
          Irregular verbs do not add <em>-ed</em>. Learn three forms: <strong>base form</strong>, <strong>past simple</strong> and{' '}
          <strong>past participle</strong>. The past simple is used alone; the past participle is used after <em>have</em> and in the passive.
        </p>
      </Rule>

      <Section title="Common irregular verbs">
        <FormTable
          caption="Common irregular verbs"
          head={['Base form', 'Past simple', 'Past participle']}
          rows={[
            ['be', 'was / were', 'been'],
            ['begin', 'began', 'begun'],
            ['break', 'broke', 'broken'],
            ['bring', 'brought', 'brought'],
            ['buy', 'bought', 'bought'],
            ['choose', 'chose', 'chosen'],
            ['come', 'came', 'come'],
            ['do', 'did', 'done'],
            ['drink', 'drank', 'drunk'],
            ['drive', 'drove', 'driven'],
            ['eat', 'ate', 'eaten'],
            ['fall', 'fell', 'fallen'],
            ['find', 'found', 'found'],
            ['fly', 'flew', 'flown'],
            ['forget', 'forgot', 'forgotten'],
            ['get', 'got', 'got'],
            ['give', 'gave', 'given'],
            ['go', 'went', 'gone'],
            ['have', 'had', 'had'],
            ['know', 'knew', 'known'],
            ['leave', 'left', 'left'],
            ['make', 'made', 'made'],
            ['meet', 'met', 'met'],
            ['pay', 'paid', 'paid'],
            ['read', 'read (sounds like "red")', 'read'],
            ['run', 'ran', 'run'],
            ['say', 'said', 'said'],
            ['see', 'saw', 'seen'],
            ['sell', 'sold', 'sold'],
            ['sing', 'sang', 'sung'],
            ['speak', 'spoke', 'spoken'],
            ['swim', 'swam', 'swum'],
            ['take', 'took', 'taken'],
            ['teach', 'taught', 'taught'],
            ['tell', 'told', 'told'],
            ['think', 'thought', 'thought'],
            ['understand', 'understood', 'understood'],
            ['wear', 'wore', 'worn'],
            ['win', 'won', 'won'],
            ['write', 'wrote', 'written'],
          ]}
        />
        <p>
          Three forms are the same in <em>cut, hit, put, set, shut</em>: <em>I put it there. I have put it there.</em>
        </p>
      </Section>

      <Section title="Use">
        <Examples
          items={[
            <>
              She <Key>wrote</Key> a letter yesterday. (past simple)
            </>,
            <>
              She has <Key>written</Key> three letters. (past participle after have)
            </>,
            <>
              The window was <Key>broken</Key> by a ball. (past participle in the passive)
            </>,
          ]}
        />
      </Section>

      <Section title="Common mistakes">
        <Mistakes
          items={[
            { wrong: 'I have went to Paris.', right: 'I have gone to Paris.', why: 'After have use the past participle (gone).' },
            { wrong: 'She teached me.', right: 'She taught me.', why: 'Teach is irregular.' },
            { wrong: 'He has drove all night.', right: 'He has driven all night.', why: 'The past participle of drive is driven.' },
            { wrong: 'I buyed a new phone.', right: 'I bought a new phone.', why: 'Buy is irregular.' },
          ]}
        />
      </Section>
    </>
  );
}
