import { Button, Card, Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useInstall } from '../hooks/useInstall';

interface Tile {
  to: string;
  title: string;
  text: string;
}

/** WhatsApp "share a link" URL; the app address is the current page without the hash route. */
export function whatsappShareUrl(appUrl: string): string {
  return `https://wa.me/?text=${encodeURIComponent(`Practise English by CEFR level (A1–C2) with English Quiz: ${appUrl}`)}`;
}

export default function HomePage() {
  const { standalone, canPrompt, install } = useInstall();
  const tiles: Tile[] = [
    {
      to: '/quiz',
      title: 'Quiz',
      text: 'Pick a level from A1 to C2 and the topics you want, then answer 5 to 40 questions. Every mistake comes with an explanation and the rule behind it, and your results are kept in a history.',
    },
    {
      to: '/test',
      title: 'Level test',
      text: 'Not sure where to start? Answer 40 adaptive questions in 40 minutes and find out your CEFR level. The test gets harder or easier as you go.',
    },
    {
      to: '/about',
      title: 'About',
      text: 'Who made English Quiz, how it was built with generative AI and written specifications, and why you are free to use it.',
    },
    {
      to: '/install',
      title: 'Installation',
      text: standalone
        ? 'English Quiz is already installed on this device. See how installation works on other devices.'
        : 'Step-by-step instructions, with pictures, to install English Quiz on Windows, Mac, Android and iPhone or iPad.',
    },
  ];

  return (
    <div className="col-12 col-lg-8 mx-auto">
      <h1 className="h3">English Quiz</h1>
      <p>
        English Quiz helps you practise English with exercises for every CEFR level, from A1 (beginner) to C2 (proficiency). Each quiz mixes
        different kinds of questions, and when you make a mistake you see the correct answer, why yours was wrong and the grammar rule.
      </p>
      <p>
        It is free and works in your browser, but it can also be <strong>installed</strong> like a normal app on your computer or smartphone, and then it works
        offline.{' '}
        {!standalone && <Link to="/install">Learn how to install it</Link>}
      </p>
      {!standalone && canPrompt && (
        <p>
          <Button size="lg" onClick={install}>
            Install app
          </Button>
        </p>
      )}
      <p>
        <Button
          variant="success"
          href={whatsappShareUrl(window.location.href.split('#')[0])}
          target="_blank"
          rel="noopener noreferrer"
        >
          Share on WhatsApp
        </Button>
      </p>
      <Row xs={1} md={2} className="g-3 mt-2 mb-4">
        {tiles.map((t) => (
          <Col key={t.to}>
            <Card className="h-100 nav-tile">
              <Card.Body>
                <Card.Title as="h2" className="h5">
                  <Link to={t.to} className="stretched-link text-decoration-none">
                    {t.title}
                  </Link>
                </Card.Title>
                <Card.Text className="text-secondary">{t.text}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}
