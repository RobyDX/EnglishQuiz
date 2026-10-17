import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useInstall } from '../hooks/useInstall';

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
          <ul>
            <li>On your computer: a shortcut on the desktop or in the app list.</li>
            <li>On your smartphone: an icon on the home screen, full screen, no browser bars.</li>
            <li>Offline: after the first visit you can practise anywhere.</li>
          </ul>
          {canPrompt ? (
            <Button size="lg" onClick={install}>
              Install app
            </Button>
          ) : (
            <p className="text-secondary">
              Your browser has not offered the installation yet. On iPhone or iPad: tap Share, then &ldquo;Add to Home Screen&rdquo;. On other browsers, look for &ldquo;Install app&rdquo; in the browser menu.
            </p>
          )}
        </>
      )}
      <div className="mt-3">
        <Button variant="outline-secondary" onClick={() => navigate('/')}>
          Home
        </Button>
      </div>
    </div>
  );
}
