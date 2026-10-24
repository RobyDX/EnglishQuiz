import { Button, Card, Col, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useInstall } from '../hooks/useInstall';

interface Platform {
  id: string;
  title: string;
  steps: string[];
}

const PLATFORMS: Platform[] = [
  {
    id: 'pc',
    title: 'Windows and Linux (Chrome, Edge)',
    steps: ['Click the install icon at the right end of the address bar, or open the browser menu and choose “Install English Quiz”.', 'Click Install.'],
  },
  {
    id: 'mac',
    title: 'Mac (Chrome, Edge, Safari)',
    steps: ['Chrome or Edge: click the install icon in the address bar, then Install.', 'Safari: open the File menu, choose “Add to Dock…”, then Add.'],
  },
  {
    id: 'android',
    title: 'Android (Chrome)',
    steps: ['Tap the menu (⋮) and choose “Install app”.', 'Tap Install.'],
  },
  {
    id: 'ios',
    title: 'iPhone and iPad (Safari)',
    steps: ['Tap the Share button.', 'Tap “Add to Home Screen”, then Add.'],
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
          <p className="mb-1">
            <Button size="lg" onClick={install} disabled={!canPrompt}>
              Install app
            </Button>
          </p>
          {!canPrompt && (
            <p className="text-secondary small">
              Your browser has not offered the one-click installation here. Follow the steps for your device below.
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
      <p className="text-secondary">Choose your device. The exact wording of the menus depends on your browser version.</p>
      <Row xs={1} md={2} className="g-3 mb-4">
        {PLATFORMS.map((p) => (
          <Col key={p.id}>
            <Card as="section" aria-labelledby={`install-${p.id}`}>
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
