import { Link } from 'react-router-dom';

export default function AboutPage() {
  return (
    <div className="col-12 col-lg-8 mx-auto">
      <h1 className="h3">About</h1>
      <p>
        English Quiz helps you practise English at six CEFR levels (A1–C2). Each quiz mixes different kinds of exercises. When an answer is
        wrong, you see why and the rule behind it.
      </p>

      <h2 className="h5">The author</h2>
      <p>
        English Quiz was created by <strong>Roberto Nacchia</strong>, who designed the application and directed its development, to help people practise their English.
      </p>

      <h2 className="h5">How it was made</h2>
      <p>
        The app was built with <strong>generative AI</strong>, following a <strong>spec-driven</strong> approach. First the requirements, the question types, the data model, the screens
        and the offline behaviour were written down as specifications. Then an AI assistant wrote the code, the tests and the exercises
        following those specifications, and every change started by updating the specifications.
      </p>
      <p>
        It is a front-end only app (React and Bootstrap): there is no server and nothing you do is sent anywhere. Your progress stays in your browser.
      </p>

      <h2 className="h5">Free to use</h2>
      <p>
        You are free to use English Quiz, for yourself, in your classroom or with your friends. It is free, it has no ads and it does not need an account.
      </p>

      <h2 className="h5">Use it offline</h2>
      <p>
        After the first visit the app works without an internet connection. You can also install it on your device.
      </p>
      <p>
        <Link to="/install">How to install the app</Link>
      </p>
      <p className="text-secondary small">Version {__APP_VERSION__}</p>
    </div>
  );
}
