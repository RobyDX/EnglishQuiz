import { Examples, FormTable, Key, Mistakes, Rule, Section } from '../helpers';

export default function PossessiveS() {
  return (
    <>
      <Rule>
        <p className="mb-0">
          For people and animals, show possession with <strong>'s</strong> (<em>Tom's car</em>). For things, use <strong>of</strong> (<em>the door of the room</em>).
        </p>
      </Rule>

      <Section title="Forms">
        <FormTable
          caption="Possessive 's"
          head={['Noun', 'Rule', 'Example']}
          rows={[
            ['singular', "add 's", "the girl's bag, James's book"],
            ['regular plural (ends in -s)', "add ' only", "the students' room"],
            ['irregular plural', "add 's", "the children's toys, the women's team"],
            ['two owners, one thing', "add 's to the last name", "Mary and John's house"],
          ]}
        />
      </Section>

      <Section title="'s or of?">
        <Examples
          items={[
            <>
              <Key>My sister's</Key> husband is a pilot. (person)
            </>,
            <>
              the <Key>dog's</Key> bowl (animal)
            </>,
            <>
              the <Key>top of</Key> the page, the <Key>end of</Key> the film (thing)
            </>,
            <>
              <Key>today's</Key> news, <Key>last year's</Key> prices (time)
            </>,
          ]}
        />
        <p>
          You can leave out the noun after <em>'s</em> when it is clear: <em>This is not my pen, it's Anna's.</em> We also say{' '}
          <em>at the dentist's</em> and <em>at my aunt's</em> (the place).
        </p>
      </Section>

      <Section title="Common mistakes">
        <Mistakes
          items={[
            { wrong: 'the car of Tom', right: "Tom's car", why: "Use 's for people." },
            { wrong: "the childrens' toys", right: "the children's toys", why: "Children is already plural: add 's." },
            { wrong: "the students's room", right: "the students' room", why: "A plural ending in -s only takes '." },
            { wrong: 'the end of the film of Anna', right: "Anna's film", why: "Use 's for the owner, a person." },
          ]}
        />
      </Section>
    </>
  );
}
