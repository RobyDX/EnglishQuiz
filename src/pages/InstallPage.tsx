import { Button, Card, Col, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useInstall } from '../hooks/useInstall';

interface Platform {
  id: string;
  title: string;
  image: string;
  alt: string;
  steps: string[];
}

const PLATFORMS: Platform[] = [
  {
    id: 'pc',
    title: 'Windows and Linux (Chrome, Edge)',
    image: 'install/pc.svg',
    alt: 'Illustration of a browser window with the install icon at the right end of the address bar and an Install confirmation box.',
    steps: [
      'Open English Quiz in Chrome or Edge.',
      'Click the install icon at the right end of the address bar (a small screen with a down arrow). If you do not see it, open the browser menu (⋮ or …) and choose “Install English Quiz” or “Apps → Install this site as an app”.',
      'Click Install. The app opens in its own window and appears in the Start menu or app list.',
    ],
  },
  {
    id: 'mac',
    title: 'Mac (Chrome, Edge, Safari)',
    image: 'install/mac.svg',
    alt: 'Illustration of a browser window on a Mac, with the install icon in the address bar and the File menu with the Add to Dock option.',
    steps: [
      'In Chrome or Edge: click the install icon in the address bar, then click Install. The app is added to your Applications folder and Launchpad.',
      'In Safari 17 or later: open the File menu and choose “Add to Dock…”, then click Add.',
      'Open the app from the Dock, Launchpad or Spotlight like any other Mac app.',
    ],
  },
  {
    id: 'android',
    title: 'Android (Chrome)',
    image: 'install/android.svg',
    alt: 'Illustration of a phone with the browser menu open and the Install app option highlighted, then the Install confirmation.',
    steps: [
      'Open English Quiz in Chrome.',
      'Tap the menu (⋮) at the top right and choose “Install app” (or “Add to Home screen”).',
      'Tap Install. The English Quiz icon appears on your home screen and in the app drawer.',
    ],
  },
  {
    id: 'ios',
    title: 'iPhone and iPad (Safari)',
    image: 'install/ios.svg',
    alt: 'Illustration of a phone with the Share button at the bottom and the Add to Home Screen option highlighted.',
    steps: [
      'Open English Quiz in Safari. Other iOS browsers can also do it from their Share menu.',
      'Tap the Share button (a square with an arrow pointing up).',
      'Scroll down and tap “Add to Home Screen”, then tap Add. The icon appears on your home screen.',
    ],
  },
];

export default function InstallPage() {
  const navigate = useNavigate();
  const { standalone, canPrompt, install } = useInstall();

  return (
    <div className="col-12 col-lg-8 mx-auto">
      <h1 className="h3">Install English Quiz</h1>
      {standalone ? (
        <p>English Quiz is already installed on this device.</p>
      ) : (
        <>
          <p>
            Install English Quiz and it opens like a normal app, in its own window on your computer or from the home screen of your smartphone. It also works without an internet connection.
          </p>
          {canPrompt && (
            <p>
              <Button size="lg" onClick={install}>
                Install app
              </Button>
            </p>
          )}
        </>
      )}

      <h2 className="h5 mt-4">What is a PWA installation?</h2>
      <p>
        English Quiz is a <strong>Progressive Web App</strong> (PWA): a website that your browser can install on your device. It is not downloaded from an app store, and it takes very little space.
      </p>
      <ul>
        <li>On your computer: a shortcut on the desktop or in the app list, and a window without browser tabs and address bar.</li>
        <li>On your smartphone: an icon on the home screen, full screen, no browser bars.</li>
        <li>Offline: after the first visit you can practise anywhere. Your results stay on your device.</li>
        <li>Updates: the app updates itself when you are online.</li>
      </ul>

      <h2 className="h5 mt-4">How to install it</h2>
      <p className="text-secondary">Choose your device. The pictures are simplified illustrations: the exact look of the menus depends on your browser version.</p>
      <Row xs={1} className="g-4 mb-4">
        {PLATFORMS.map((p) => (
          <Col key={p.id}>
            <Card as="section" aria-labelledby={`install-${p.id}`}>
              <Card.Img variant="top" src={p.image} alt={p.alt} loading="lazy" />
              <Card.Body>
                <Card.Title as="h3" id={`install-${p.id}`} className="h6">
                  {p.title}
                </Card.Title>
                <ol className="mb-0">
                  {p.steps.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ol>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Button variant="outline-secondary" onClick={() => navigate('/')}>
        Home
      </Button>
    </div>
  );
}
