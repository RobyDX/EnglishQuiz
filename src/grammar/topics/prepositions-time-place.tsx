import { Examples, FormTable, Key, Mistakes, Rule, Section } from '../helpers';

export default function PrepositionsTimePlace() {
  return (
    <>
      <Rule>
        <p className="mb-0">
          <strong>At</strong> is for a point, <strong>on</strong> for a surface or a day, <strong>in</strong> for a space or a longer period. The same idea works for time and for place.
        </p>
      </Rule>

      <Section title="Time">
        <FormTable
          caption="In, on and at for time"
          head={['Preposition', 'Use', 'Examples']}
          rows={[
            ['at', 'clock times, night, festivals, weekend (British)', 'at six o\'clock, at night, at Christmas, at the weekend'],
            ['on', 'days and dates', 'on Monday, on 5 May, on Friday morning, on my birthday'],
            ['in', 'months, years, seasons, centuries, parts of the day', 'in July, in 2024, in summer, in the morning'],
          ]}
        />
        <p>
          Also: <em>for</em> (how long: for two hours), <em>since</em> (starting point: since 2020), <em>during</em> (+ noun: during the film), <em>until</em> (up to a time),{' '}
          <em>by</em> (not later than: by Friday), <em>before / after</em>, <em>between … and …</em>. No preposition before <em>this, last, next, every</em>: <em>next week</em>.
        </p>
      </Section>

      <Section title="Place">
        <FormTable
          caption="In, on and at for place"
          head={['Preposition', 'Use', 'Examples']}
          rows={[
            ['at', 'a point or an address', 'at the bus stop, at work, at home, at the door'],
            ['on', 'a surface; some transport', 'on the table, on the wall, on the floor, on the bus / train / plane'],
            ['in', 'inside a space; towns and countries', 'in the room, in a car, in London, in Italy'],
          ]}
        />
        <Examples
          items={[
            <>
              I <Key>arrive in</Key> a city or country, <Key>arrive at</Key> a smaller place (the station).
            </>,
            <>
              I <Key>get to</Key> the office at nine. (no "arrive to")
            </>,
          ]}
        />
      </Section>

      <Section title="Common mistakes">
        <Mistakes
          items={[
            { wrong: 'See you in Monday.', right: 'See you on Monday.', why: 'Use on with days.' },
            { wrong: 'I work at the morning.', right: 'I work in the morning.', why: 'Use in with parts of the day (but at night).' },
            { wrong: 'We arrived to Rome at six.', right: 'We arrived in Rome at six.', why: 'Arrive takes in / at, never to.' },
            { wrong: 'She lives at London.', right: 'She lives in London.', why: 'Use in with towns and countries.' },
            { wrong: 'I have lived here since five years.', right: 'I have lived here for five years.', why: 'Use for with a length of time.' },
          ]}
        />
      </Section>
    </>
  );
}
