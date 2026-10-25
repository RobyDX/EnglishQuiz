import { FormTable, Mistakes, Rule, Section } from '../helpers';

export default function LookAlikeWords() {
  return (
    <>
      <Rule>
        <p className="mb-0">
          Some English words look like words in French, Spanish, Portuguese or Italian, but their meaning is <strong>different</strong>. These "false friends" are an easy
          source of mistakes.
        </p>
      </Rule>

      <Section title="What these English words really mean">
        <FormTable
          caption="False friends: what the English word means and what to say for the other idea"
          head={['English word', 'It means', 'To say something else']}
          rows={[
            ['actually', 'in fact, really', 'at the moment → currently, at present'],
            ['eventually', 'in the end, finally', 'maybe, if necessary → possibly, perhaps'],
            ['library', 'a place where you borrow books', 'a shop that sells books → bookshop'],
            ['sympathetic', 'understanding about other people’s problems', 'friendly, pleasant → friendly, nice'],
            ['parents', 'mother and father', 'family members in general → relatives'],
            ['educated', 'having had a good education', 'having good manners → polite, well-mannered'],
            ['sensible', 'having good judgement', 'easily hurt or touched → sensitive'],
            ['pretend', 'act as if something is true', 'ask for something firmly → demand, expect'],
            ['realise', 'understand, become aware', 'make a plan happen → achieve, carry out'],
            ['fabric', 'cloth, material', 'a place where goods are made → factory'],
            ['magazine', 'a regular publication with articles', 'a place to store goods → warehouse'],
            ['attend', 'be present at (a lesson, a meeting)', 'to wait → wait for'],
            ['resume', 'start again after a stop', 'to sum up → summarise'],
            ['assist', 'help', 'to be present at → attend'],
            ['camera', 'a device for taking photos', 'a room in a house → room'],
          ]}
        />
      </Section>

      <Section title="Common mistakes">
        <Mistakes
          items={[
            { wrong: 'Actually I am studying for an exam.', right: 'At the moment I am studying for an exam.', why: 'Actually means "in fact", not "now".' },
            { wrong: 'I bought a book at the library.', right: 'I bought a book at the bookshop.', why: 'A library lends books; a bookshop sells them.' },
            { wrong: 'I will invite all my parents to the party.', right: 'I will invite all my relatives to the party.', why: 'Parents are only mother and father.' },
            { wrong: 'She is very sensible and she cries easily.', right: 'She is very sensitive and she cries easily.', why: 'Sensible means "reasonable".' },
            { wrong: 'He is a very educated child.', right: 'He is a very polite child.', why: 'Educated means "having had a good education".' },
          ]}
        />
      </Section>
    </>
  );
}
