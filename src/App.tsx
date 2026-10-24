import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import AboutPage from './pages/AboutPage';
import HomePage from './pages/HomePage';
import InstallPage from './pages/InstallPage';
import PlacementPage from './pages/PlacementPage';
import QuizPage from './pages/QuizPage';
import QuizSetupPage from './pages/QuizSetupPage';

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="quiz" element={<QuizSetupPage />} />
          <Route path="quiz/:level" element={<QuizPage />} />
          <Route path="test" element={<PlacementPage />} />
          <Route path="history" element={<Navigate to="/quiz" replace />} />
          <Route path="placement" element={<Navigate to="/test" replace />} />
          <Route path="install" element={<InstallPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="*" element={<HomePage />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
