import { FormTable, Mistakes, Rule, Section } from '../helpers';

export default function ConfusedWords() {
  return (
    <>
      <Rule>
        <p className="mb-0">
          Many English words sound the same or are used in similar situations, but they are different words. Learn them in pairs, with an example.
        </p>
      </Rule>

      <Section title="Words that sound alike">
        <FormTable
          caption="Words that sound alike"
          head={['Words', 'Meaning', 'Example']}
          rows={[
            ['their / there / they\'re', 'belonging to them / in that place / they are', "Their house is there. They're home."],
            ["its / it's", 'belonging to it / it is or it has', "The dog wagged its tail. It's late."],
            ["your / you're", 'belonging to you / you are', "Your bag is here. You're late."],
            ['to / too / two', 'direction / also or very / the number 2', 'I went to the shop too. It cost two pounds.'],
            ['whose / who\'s', 'of whom / who is', "Whose bag is this? Who's coming?"],
            ['weather / whether', 'rain, sun / if', "I don't know whether the weather will change."],
            ['lose / loose', 'not win; be unable to find / not tight', "Don't lose your keys. These shoes are loose."],
          ]}
        />
      </Section>

      <Section title="Words with similar meanings">
        <FormTable
          caption="Words with similar meanings"
          head={['Words', 'Difference']}
          rows={[
            ['affect / effect', 'affect = to change (verb); effect = result (noun): The rain affected us. It had a bad effect.'],
            ['then / than', 'then = at that time, next; than = in comparisons: bigger than me, and then we left'],
            ['accept / except', 'accept = receive; except = not including: Everyone came except Tom.'],
            ['borrow / lend', 'borrow = take for a time; lend = give for a time: Can I borrow your pen? Can you lend me your pen?'],
            ['bring / take', 'bring = to the speaker; take = away from the speaker'],
            ['rob / steal', 'rob a person or place; steal a thing: He robbed the bank. He stole money.'],
            ['hear / listen', 'hear = perceive sounds; listen (to) = pay attention'],
            ['see / look / watch', 'see = perceive; look (at) = direct the eyes; watch = look at something that moves'],
            ['fun / funny', 'fun = enjoyable; funny = makes you laugh'],
            ['principal / principle', 'principal = main (or head of a school); principle = a rule or belief'],
          ]}
        />
      </Section>

      <Section title="Common mistakes">
        <Mistakes
          items={[
            { wrong: 'Their going home.', right: "They're going home.", why: "They're = they are." },
            { wrong: 'Its raining.', right: "It's raining.", why: "It's = it is." },
            { wrong: 'She is taller then me.', right: 'She is taller than me.', why: 'Use than in comparisons.' },
            { wrong: 'Can I lend your pen?', right: 'Can I borrow your pen?', why: 'You borrow from someone, they lend to you.' },
            { wrong: "I'm loosing my patience.", right: "I'm losing my patience.", why: 'Lose has one o; loose is an adjective.' },
          ]}
        />
      </Section>
    </>
  );
}
