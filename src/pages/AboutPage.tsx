import { Link } from 'react-router-dom';

export default function AboutPage() {
  return (
    <div className="col-12 col-lg-8 mx-auto">
      <h1 className="h3">About</h1>
      <p>
        English Quiz helps you practise English at six CEFR levels (A1–C2). Each quiz mixes different kinds of exercises. When an answer is
        wrong, you see why and the rule behind it.
      </p>
      <h2 className="h5">How it was made</h2>
      <p>
        English Quiz was made by <strong>Roberto Nacchia</strong> using Generative AI, to help people practise their English.
      </p>
      <h2 className="h5">Use it offline</h2>
      <p>
        After the first visit the app works without an internet connection. You can install it on your device.
      </p>
      <p>
        <Link to="/install">How to install the app</Link>
      </p>
      <p className="text-secondary small mt-3">On iPhone or iPad: tap Share, then &ldquo;Add to Home Screen&rdquo;.</p>
      <p className="text-secondary small">Version {__APP_VERSION__}</p>
    </div>
  );
}
